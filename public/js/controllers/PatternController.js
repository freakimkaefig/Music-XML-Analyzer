MusicXMLAnalyzer.PatternController = function() {
	var that = {},

	init = function() {
		console.log('MusicXMLAnalyzer.PatternController.init');
		patternView = MusicXMLAnalyzer.PatternView();
		patternView.init();

		notationView = MusicXMLAnalyzer.NotationView();
		notationView.init();

		referenceButtonListeners();
	},

	referenceButtonListeners = function() {
		$(".btn-note").click(function() {
		  console.log("clicked: " + $(event.target).text());
		});
	}



	dispose = function() {
		that = {};
	};


	that.init = init;
	that.dispose = dispose;

	return that;
}