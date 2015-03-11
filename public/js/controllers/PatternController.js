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
		$(patternModel).on('patternChange', onPatternChange);
		$(patternModel).on('updateNotationView', onNotationViewUpdate);
		$(patternModel).on('changeSelectedNoteNameByClick', onNoteNameSelectionChange);
		$(patternModel).on('changeSelectedOctaveByClick', onOctaveSelectionChange);
		$(patternModel).on('tripletComplete', onTripletComplete);

	},

	onTripletComplete = function(event, currentVexflowArrayLength) {
		notationView.addBeamAndTuplet(currentVexflowArrayLength);
	}

	onNotationViewUpdate = function(event, vexflowNotes) {
		notationView.renderNotes(vexflowNotes);
	},

	onNoteNameSelectionChange = function(event, selectedNoteNameByClick) {
		patternView.setNoteNameActive(selectedNoteNameByClick);
	},

	onOctaveSelectionChange = function(event, selectedOctaveByClick) {
		patternView.setOctaveActive(selectedOctaveByClick);
	},

	changeMode = function(val) {
		patternModel.setCurrentMode(val);
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

	changeOctave = function(val) {
		patternModel.setCurrentOctave(val);
	},

	addNote = function() {
		patternModel.addNoteElement();
	},

	addNoteByCanvasClick = function(note) {
		patternModel.addNoteElementByCanvasClick(note);
	},

	removeLastNote = function() {
		patternModel.removeLastNoteElement();
	},

	onPatternChange = function(event, pattern) {
		// console.log("Trigger patternChange: ",pattern);
		patternView.setPatternValue(JSON.stringify(pattern));
	},

	dispose = function() {
		that = {};
	};


	that.init = init;
	that.changeMode = changeMode;
	that.changeNote = changeNote;
	that.changeAccidential = changeAccidential;
	that.changeDuration = changeDuration;
	that.changeClef = changeClef;
	that.changeSpecialRyth = changeSpecialRyth;
	that.changeOctave = changeOctave;
	that.addNote = addNote;
	that.addNoteByCanvasClick = addNoteByCanvasClick;
	that.removeLastNote = removeLastNote;
	that.dispose = dispose;

	return that;
}