MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	noteElement = null,


	init = function(){
		console.log("pattern model");

	},

	setCurrentNoteName = function(noteName) {

	},

	setCurrentAccidential = function(accidential) {

	},

	setCurrentNoteDuration = function(noteValue) {

	},

	setCurrentClef = function(clef) {

	},

	setCurrentNoteRythSpecial = function(val) {

	},

	addNoteElement = function() {
		console.log("add note");
	},

	removeLastNoteElement = function() {
	    console.log("remove last note");
	},

	getAllNoteElements = function() {

	};

	
	
	that.init = init;
	that.setCurrentNoteName = setCurrentNoteName;
	that.setCurrentAccidential = setCurrentAccidential;
	that.setCurrentNoteDuration = setCurrentNoteDuration;
	that.setCurrentClef = setCurrentClef;
	that.setCurrentNoteRythSpecial = setCurrentNoteRythSpecial;
	that.addNoteElement = addNoteElement;
	that.removeLastNoteElement = removeLastNoteElement;
	that.getAllNoteElements = getAllNoteElements;

	return that;
}