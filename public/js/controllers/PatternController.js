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

	},

	changeNote = function(val) {
		patternModel.setCurrentNoteName(val);
	},

	changeAccidential = function(val) {
		patternModel.setCurrentAccidential(val);
	},

	changeDuration = function(val) {
		patternModel.setCurrentNoteDuration(val);
	},

	changeClef = function(val) {
		patternModel.setCurrentClef(val);
	},

	changeSpecialRyth = function(val) {
		patternModel.setCurrentNoteRythSpecial(val);
	},

	addNote = function() {
		patternModel.addNoteElement();
	},

	removeLastNote = function() {
		patternModel.removeLastNoteElement();
	},

	dispose = function() {
		that = {};
	};


	that.init = init;
	that.changeNote = changeNote;
	that.changeAccidential = changeAccidential;
	that.changeDuration = changeDuration;
	that.changeClef = changeClef;
	that.changeSpecialRyth = changeSpecialRyth;
	that.addNote = addNote;
	that.removeLastNote = removeLastNote;
	that.dispose = dispose;

	return that;
}