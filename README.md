# Backbone.Safe - local storage plugin
Backbone.Safe is a plugin for Backbone.js which stores a model's or a collection's json data to the local storage on set operations, regardless server side existance.
The concept for Backbone.Safe has been created while the developing the [Echoes Player project](https://github.com/orizens/echoes).
## Install

Using Bower:
```
bower install backbone.safe
```

## Usage
The latest update to Backbone.Safe allows one to define safe with a non distructive definition using a key as such:
```javascript
var UserProfile = Backbone.Model.extend({
	safe: {
		key: 'myAppUserSafe',
		reload: false
	},
 
	initialize: function() {
		// some statements;
		this.safe.reload()
	},
 
	fetchRoles: function() {
		// some statements;
	}
});
var user = new UserProfile();
 
console.log( user.safe );
```
With this method, when Safe is not present, the model/collection still functions as expected.

On the other hand, Safe can defined using a factory method as such:
```javascript
var HistoryPlaylist = Backbone.Collection.extend({
	model: someModel,

	initialize: function() {
		Backbone.Safe.create('historyPlaylist', this);
	},

	queue: function(youtubeJSON) {
		this.add(youtubeJSON);
	}
});
var myPlaylist = new HistoryPlaylist();

console.log( myPlaylist.safe );
```

### Useful Information
1. Currently supports only one level of models/collections.
2. For Model: listens to a 'change' events and stores the data.
3. For Collection: listens to 'add', 'reset' events and stores data.
4. The 'create' function creates a new instance of Backbone.Safe in the 'safe' property
