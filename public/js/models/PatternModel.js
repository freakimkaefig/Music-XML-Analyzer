MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	noteElement = null,


	init = function(){
		console.log("pattern model");

	},

	setCurrentNoteName = function(noteName) {

	},

	setCurrentNoteDuration = function(noteValue) {

	},

	setCurrentNoteRythSpecial = function(val) {

	},

	addNoteElement = function(name, duration) {

	},

	getAllNoteElements = function() {

	};

	
	
	that.init = init;
	that.setCurrentNoteName = setCurrentNoteName;
	that.setCurrentNoteDuration = setCurrentNoteDuration;
	that.setCurrentNoteRythSpecial = setCurrentNoteRythSpecial;
	that.addNoteElement = addNoteElement;
	that.getAllNoteElements = getAllNoteElements;

	return that;
}