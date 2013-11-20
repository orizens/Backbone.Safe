/**
 * Safe - support for storing Backbone.Model to localstorage
 * 		  using the 'set' method of Model
 *
 * @constructor - use the key 'safe' to define unique storage key for backbone safe
 *
 * 				examples:
 *
 *				// simple defintion for safe
 *			 	Backbone.Model.extend({ key: 'my-unique-key' });
 *
 * 					// advanced defintion for safe with options
 *	  			Backbone.Model.extend({
 *	  			
 *		 				safe: {
 *		 					key: 'my-unique-key',
 *		 					options: {
 *		 						reload: true
 *		 					}
 *		 				}	
 * 
 *	  			})
 * 
 * @requires Backbone.js, Underscore.js
 * @param {string} uniqueID - the name of the storage you'de like to use
 * @param {object} context  - the Backbone.Model instance reference
 * @param {object} options - (optional) configuration for setting up various features
 *						 - {boolean} reload - true to reload (before initialize) data from local sotrage if exists
 *
 * @author Oren Farhi, http://orizens.com
 *
 * @version 0.3
 *
 */
(function(){

	var _ = this._;
	var Backbone = this.Backbone;
	
	// if Underscore or Backbone have not been loaded
	// exit to prevent js errors
	if (!_ || !Backbone || !JSON) {
		return;
	}

	// factory for creating extend replacement for Backbone Objects
	function BackboneExtender(bbObject, plugins) {
		var thisExtender = this;
		this.plugins = plugins;
		bbObject["extend"] = _.wrap(bbObject["extend"], function(sourceExtend, config){
			config = config || {}
			// thisExtender.config = config;
			var _sourceFn = config.initialize || this.prototype.initialize || function(){};
			config.initialize = function(){
				var args = [].slice.call(arguments);
				thisExtender.config = config;
				thisExtender.applyPlugins(this, args);
				_sourceFn.apply(this, args);
			};
			return sourceExtend.call(this, config);
		});
	};

	BackboneExtender.prototype.applyPlugins = function(instance, args) {
		var config = this.config,
			plugins = this.plugins,
			args = args || [];
		// run the plugins on this
		_.each(plugins, function(plugFn){
			plugFn.call(instance, config, args);
		});
	};

	BackboneExtender.prototype.addPlug = function(plugFn) {
		this.plugins.push(plugFn);
	};

	var SafePlug = function (config, args) {
		var storageKey;
			
		// create safe if exist as key
		if (config && config.safe) {
			
			// handle key, value safe
			storageKey = config.safe.key ? config.safe.key : config.safe;
			
			Backbone.Safe.create(storageKey, this, config.safe.options || { reload: true });
		}
	}
	// extend Model & Collection constructor to handle safe initialization
	// Backbone.Model.extend = _.wrap(Backbone.Model.extend, BackboneExtender)
	var modelSafePlugin = new BackboneExtender(Backbone.Model, [ SafePlug ]);
	var collectionSafePlugin = new BackboneExtender(Backbone.Collection, [ SafePlug ]);


	Backbone.Safe = function(uniqueID, context, options) {

		// parsing options settings
		this._reload = options && options.reload && options.reload === true;

		this.uid = uniqueID;
		this.context = context;
		this.isCollection = !context.set && context.models && context.add;

		// mixins for collection and model
		var collection = {
			
			// events that Safe is listening in order to
			// trigger save to local storage
			events: 'add reset change sort',

			// the value to be used when cleaning the safe
			emptyValue: '[]',

			reload: function() {
				context.add(this.getData());
			},

			fetch: function() {
				var fetchFromSafe = options && options.from;
				if (fetchFromSafe && fetchFromSafe === "safe") {
					this.safe.reload();
				} else {
					Backbone.Collection.prototype.fetch.apply(this, arguments);
				}
			},

			toJSON: function(collection) {
				return collection.toJSON();
			}
		};

		var model = {

			events: 'change',

			emptyValue: '{}',

			reload: function() {
				context.set(this.getData());
			},

			// options = { from: "safe" }
			fetch: function (options) {
				var fetchFromSafe = options && options.from;
				if (fetchFromSafe && fetchFromSafe === "safe") {
					this.safe.reload();
				} else {
					Backbone.Model.prototype.fetch.apply(this, arguments);
				}
			},

			toJSON: function(model) {
				return model.toJSON();
			}
		};

		// attach relevant object to Safe prototype
		_.extend( this, this.isCollection ? collection : model );

		// if the uid doesn't exist, create it
		this.ensureUID();

		// These are the lines that are responsible for
		// loading the saved data from the local storage to the model
		//
		// the data is loaded before the Safe binds to change events
		// storage exist ? -> save to model
		// if it's a collection - use add
		if (this._reload) {
			this.reload();
		}

		// attach Backbone custom methods
		_.extend(context, _.pick(this, ['fetch']));
		// listen to any change event and cache it
		context.on(this.events, this.store, this);
		// adding destroy handler
		context.on('destroy', this.destroy, this);
	};

	Backbone.Safe.prototype = {
		
		/**
		 * creates a local storage item with the provided
		 * UID if not exist
		 */
		ensureUID: function() {
			if (_.isNull(this.getData())){
				this.create();
			}
		},

		create: function() {
			this.storage().setItem(this.uid, this.emptyValue);
		},

		/*
		 * @bbDataObj {collection/model}
		 */
		store: function(bbDataObj) {
			this.storage()
				.setItem(this.uid, JSON.stringify( this.toJSON( bbDataObj )));
		},

		storage: function() {
			return localStorage;
		},

		/**
		 * returns json object of the local saved data
		 * @return {json}
		 */
		getData: function() {
			// JSON.parse can't be run with an empty string
			this._current = this.storage().getItem(this.uid);
			return this._current ? JSON.parse(this._current) : this._current;
		},

		// set the local storage key to the empty value
		reset: function() {
			this.create();
		},

		// removes the key from the localstorage
		destroy: function() {
			this.storage().removeItem( this.uid );
		}
	};

	// factory method
	Backbone.Safe.create = function( uniqueID, context, options) {
		if (uniqueID && context) {
			context.safe = new Backbone.Safe(uniqueID, context, options);
		}
	};

})();