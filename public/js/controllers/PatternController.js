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
		  console.log("clicked note: " + $(event.target).text());
		  patternModel.setCurrentNoteName($(event.target).text());
		});
		//accidential button clicked
		$(".btn-accidential").click(function() {
		  console.log("clicked accidential: " + $(event.target).text());
		  patternModel.setCurrentAccidential($(event.target).text());
		});
		//duration button clicked
		$(".btn-duration").click(function() {
		  console.log("clicked duration: " + $(event.target).text());
		  patternModel.setCurrentNoteDuration($(event.target).text());
		});
		//clef button clicked
		$(".btn-clef").click(function() {
		  console.log("clicked clef: " + $(event.target).text());
		  patternModel.setCurrentClef($(event.target).text());
		});
		//special ryth button clicked
		$(".btn-special-ryth").click(function() {
		  console.log("clicked special ryth: " + $(event.target).text());
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