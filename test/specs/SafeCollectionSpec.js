describe("Backbone Safe", function () {
	
	var SafeCollection;
	var items = mockData.result;
	// instance
	var col;

	describe("Collection Suite", function(){
		// ensure the safe is created for the first time
		localStorage.removeItem("safe-col-tester");

		beforeEach(function() {
			SafeCollection = Backbone.Collection.extend({
				safe: "safe-col-tester"
			});
			col = new SafeCollection();
		});

		it("should have a safe attribute", function(){

			expect( col.safe ).toBeDefined();
		});
		
		it("should have a safe attribute which is defined as a collection", function(){
			expect( col.safe.isCollection ).toBeDefined();
			expect( col.safe.isCollection ).toBeTruthy();
		});
			
		it("should have a uid attribute", function(){
			expect( col.safe.uid ).toBeDefined();
		});

	});

	describe("Collection Suite with json", function(){
		localStorage.removeItem("safe-col-with-data");
		beforeEach(function(){
			SafeCollection = Backbone.Collection.extend({
				safe: "safe-col-with-data"
			});
		});

		it("should create a collection with a safe from data", function(){
			col = new SafeCollection(items);
			expect( col ).toBeDefined();
			expect( col.safe ).toBeDefined();
		});

		it("should save data to storage and retreive it", function(){
			col = new SafeCollection();
			col.safe.destroy();
			col.safe.create();
			col.set(items);
			expect( col.toJSON() ).toEqual( col.safe.getData() );
		});

		it("should create a new collection and load the relevant data from local-storage", function(){
			col = new SafeCollection();
			expect( col.toJSON() ).toEqual( col.safe.getData() );
		});

		it("should fetch data from local-storage using 'fetch'", function(){
			col = new SafeCollection();
			col.remove(col.models, { silent: true });
			col.fetch({ from: 'safe' });
			expect( col.toJSON() ).toEqual( col.safe.getData() );
		});

		it("should fetch data from a given url using 'fetch' and ignore safe", function(){

			// create a spy for a custom 'fetch'
			spyOn($, 'ajax').andCallFake(function(options) {
				options.success(mockData.result);
			});
				col = new SafeCollection();
				col.url = "src/mockData.json";
				col.fetch({
					success: function(col){
						// expect( col.get('id') ).toBeDefined();
						expect( col.toJSON() ).toEqual( col.safe.getData() );
					}
				});
		});

		// it("should clear the localStorage when 'destroy' is called", function() {
			
		// 	// create a spy for a custom 'destroy'
		// 	spyOn(Backbone.Model.prototype, 'destroy').andCallFake(function(options){
		// 		this.clear();
		// 		this.trigger('destroy');
		// 	});

		// 	model = new SafeCollection();
		// 	model.set(mockData);

		// 	expect( model.get('id') ).toBeDefined();
		// 	model.destroy();
		// 	expect( model.id ).toBeUndefined();
		// 	expect( model.safe.getData() ).toBeNull();
		// });

		it("should return the JSON from the 'toJSON' method", function(){

			col = new SafeCollection();
			col.set(mockData.result);
			expect( col.toJSON() ).toEqual( mockData.result );
		});

/*
		it("should save to storage when the collection changes", function(){
			var randomId = Math.round(Math.random()*1000) + 10;
			model = new SafeCollection();
			model.set(mockData);
			model.set('id', randomId);
			expect( model.get('id') ).not.toBe( mockData.id );
			expect( model.get('id') ).toEqual( randomId );
			expect( model.get('id') ).toEqual( model.safe.getData().id );
		});


		it("should use constructor's 'initialize' method if config doesn't have", function(){
			var newId = 555;
			var AnotherSafeCollection = Backbone.Model.extend({
				safe: "another-safe-tester-2",
				initialize: function() {
					this.set('id', newId);
				}
			});
			model = new AnotherSafeCollection();
			
			expect( model.attributes.id ).toBeDefined();
			expect( model.get('id') ).toEqual( newId );
		});

		it("should use constructor's 'initialize' when extending another Model", function(){
			var newId = 555;
			var AnotherSafeCollection = Backbone.Model.extend({
				safe: "another-safe-tester",
				initialize: function() {
					this.set('id', newId);
				}
			});
			var ExtendedModel = AnotherSafeCollection.extend({});
			model = new ExtendedModel();
			
			expect( model.attributes.id ).toBeDefined();
			expect( model.get('id') ).toEqual( newId );
		});
*/
	});
});