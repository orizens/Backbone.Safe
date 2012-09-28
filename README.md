# Backbone.Safe - local storage plugin
Backbone.Safe is a plugin for Backbone.js which stores a model's or a collection's json data to the local storage on set operations, regardless server side existance.

## Usage

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

console.log( myPlaylist.storage );
```

### Restrictions
1. Currently supports only one level of models/collections.
2. For Model, listens to a 'change' events and stores the data.
3. For Collection, listens to 'add', 'reset' events and stores data.