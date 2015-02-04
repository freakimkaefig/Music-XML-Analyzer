MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	//noteElement = null,

	curName = null,
	curAccidential = null,
	curDuration = null,
	curClef = null,
	curRythSpec = null,


	init = function(){
		console.log("pattern model");
	},

	setCurrentNoteName = function(noteName) {
		console.log("model " + noteName);
		curName = noteName;
	},

	setCurrentAccidential = function(accidential) {
		console.log("model " + accidential);
		curAccidential = accidential;
	},

	setCurrentNoteDuration = function(noteDuration) {
		console.log("model " + noteDuration);
		curDuration = noteDuration;
	},

	setCurrentClef = function(clef) {
		console.log("model " + clef);
		curClef = clef;
	},

	setCurrentNoteRythSpecial = function(rythSpec) {
		console.log("model " + rythSpec);
		curRythSpec = rythSpec;
	},

	addNoteElement = function() {
		if (!curName) {
			alert("name missing");
		} else if (!curAccidential) {
			alert("accidential missing");
		} else if (!curDuration) {
			alert("duration missing");
		} else if (!curClef) {
			alert("clef missing");
		} else if (!curRythSpec) {
			alert("ryth spec missing");
		}
		else {
			console.log("note added");

			noteElements.push({
				name: curName,
				accidential: curAccidential,
				duration: curDuration,
				rythSpecial: curRythSpec
			});
		}
		console.log(noteElements)
	},

	removeLastNoteElement = function() {
	    console.log("remove last note button");
	},

	getAllNoteElements = function() {
		return noteElements;
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