describe("Backbone Safe", function () {
	
	var SafeModel;
	// instance
	var model;

	describe("Model Suite", function(){

		beforeEach(function() {
			SafeModel = Backbone.Model.extend({
				safe: "safe-tester"
			});
			model = new SafeModel();
		});

		it("should have a safe attribute", function(){

			expect( model.safe ).toBeDefined();
		});
			
		it("should have a uid attribute", function(){
			expect( model.safe.uid ).toBeDefined();
		});

	});

	describe("Model Suite with json", function(){
		beforeEach(function(){
			SafeModel = Backbone.Model.extend({
				safe: "safe-with-data"
			});
		});

		it("should create a model with a safe from data", function(){
			model = new SafeModel(mockData);
			expect( model ).toBeDefined();
			expect( model.safe ).toBeDefined();
		});

		it("should save data to storage and retreive it", function(){
			model = new SafeModel();
			model.set(mockData);
			expect( model.toJSON() ).toEqual( model.safe.getData() );
		});

		it("should create a new model and load the relevant data from local-storage", function(){
			model = new SafeModel();
			expect( model.toJSON() ).toEqual( model.safe.getData() );
		});

		it("should fetch data from local-storage using 'fetch'", function(){
			model = new SafeModel();
			model.clear();
			model.fetch({ from: 'safe' });
			expect( model.toJSON() ).toEqual( model.safe.getData() );
		});

		it("should fetch data from a given url using 'fetch' and ignore safe", function(){

			// create a spy for a custom 'fetch'
			spyOn($, 'ajax').andCallFake(function(options) {
				options.success(mockData);
			});
				model = new SafeModel();
				model.url = "src/mockData.json";
				model.clear();
				model.fetch({
					success: function(model){
						expect( model.get('id') ).toBeDefined();
						expect( model.toJSON() ).toEqual( model.safe.getData() );
					}
				});
		});

		it("should clear the localStorage when 'destroy' is called", function() {
			
			// create a spy for a custom 'destroy'
			spyOn(Backbone.Model.prototype, 'destroy').andCallFake(function(options){
				this.clear();
				this.trigger('destroy');
			});

			model = new SafeModel();
			model.set(mockData);

			expect( model.get('id') ).toBeDefined();
			model.destroy();
			expect( model.id ).toBeUndefined();
			expect( model.safe.getData() ).toBeNull();
		});

		it("should return the JSON from the 'toJSON' method", function(){

			model = new SafeModel();
			model.set(mockData);
			expect( model.toJSON() ).toEqual( mockData );
		});

		it("should save to storage when the model changes", function(){
			var randomId = Math.round(Math.random()*1000) + 10;
			model = new SafeModel();
			model.set(mockData);
			model.set('id', randomId);
			expect( model.get('id') ).not.toBe( mockData.id );
			expect( model.get('id') ).toEqual( randomId );
			expect( model.get('id') ).toEqual( model.safe.getData().id );
		});


		it("should use constructor's 'initialize' method if config doesn't have", function(){
			var newId = 555;
			var AnotherSafeModel = Backbone.Model.extend({
				safe: "another-safe-tester-2",
				initialize: function() {
					this.set('id', newId);
				}
			});
			model = new AnotherSafeModel();
			
			expect( model.attributes.id ).toBeDefined();
			expect( model.get('id') ).toEqual( newId );
		});

		it("should use constructor's 'initialize' when extending another Model", function(){
			var newId = 555;
			var AnotherSafeModel = Backbone.Model.extend({
				safe: "another-safe-tester",
				initialize: function() {
					this.set('id', newId);
				}
			});
			var ExtendedModel = AnotherSafeModel.extend({});
			model = new ExtendedModel();
			
			expect( model.attributes.id ).toBeDefined();
			expect( model.get('id') ).toEqual( newId );
		});
	});
});