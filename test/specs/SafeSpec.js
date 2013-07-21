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
	});

});