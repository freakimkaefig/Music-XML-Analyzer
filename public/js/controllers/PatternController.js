MusicXMLAnalyzer.PatternController = function() {
	var that = {},

	init = function() {
		console.log('MusicXMLAnalyzer.PatternController.init');
		patternView = MusicXMLAnalyzer.PatternView();
		patternView.init();

		notationView = MusicXMLAnalyzer.NotationView();
		notationView.init();

		patternModel = MusicXMLAnalyzer.PatternModel();
		patternModel.init();

		registerButtonListeners();
	},

	registerButtonListeners = function() {
		//note button clicked
		$(".btn-note").click(function() {
		  patternModel.setCurrentNoteName($(event.target).text());
		});
		//accidential button clicked
		$(".btn-accidential").click(function() {
		  patternModel.setCurrentAccidential($(event.target).text());
		});
		//duration button clicked
		$(".btn-duration").click(function() {
		  patternModel.setCurrentNoteDuration($(event.target).text());
		});
		//clef button clicked
		$(".btn-clef").click(function() {
		  patternModel.setCurrentClef($(event.target).text());
		});
		//special ryth button clicked
		$(".btn-special-ryth").click(function() {
		  patternModel.setCurrentNoteRythSpecial($(event.target).text());
		});

		//add note button
		$("#btn-add-note").click(function() {
		  patternModel.addNoteElement();
		});
		//remove last note button
		$("#btn-remove-note").click(function() {
		  patternModel.removeLastNoteElement();
		});
	},



	dispose = function() {
		that = {};
	};


	that.init = init;
	that.dispose = dispose;

	return that;
}