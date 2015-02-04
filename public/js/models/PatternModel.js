MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	noteElement = null,

	curNoteName = null,
	curAccidential = null,
	curNoteDuration = null,
	curClef = null,
	curRythSpec = null,


	init = function(){
		console.log("pattern model");
	},

	setCurrentNoteName = function(noteName) {
		console.log(noteName);
		curNoteName = noteName;
	},

	setCurrentAccidential = function(accidential) {
		console.log(accidential);
		curAccidential = accidential;
	},

	setCurrentNoteDuration = function(noteDuration) {
		console.log(noteDuration);
		curNoteDuration = noteDuration;
	},

	setCurrentClef = function(clef) {
		console.log(clefVal);
		curClef = clef;
	},

	setCurrentNoteRythSpecial = function(rythSpec) {
		console.log(rythSpec);
		this.rythSpec = rythSpec;
	},

	addNoteElement = function() {
		if (!curNoteName) {
			console.log("noteName missing");
		} else {
			console.log("note added");
		}
	},

	removeLastNoteElement = function() {
	    console.log("remove last note button");
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