MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	//noteElement = null,

	curMode = null,
	curName = null,
	curAccidential = null,
	curDuration = null,
	curClef = null,
	curRythSpec = null,
	curOctave = null,


	init = function(){
		console.log("pattern model");
	},

	setCurrentMode = function(mode) {
		curMode = mode;
		console.log("mode set to: " + curMode + " fkt missing");
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

	setCurrentOctave = function(octave) {
		console.log("model " + octave);
		curOctave = octave;
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
		} else if (!curOctave) {
			alert("octave missing");
		}
		else {
			console.log("note added");

			noteElements.push({
				name: curName,
				accidential: curAccidential,
				duration: curDuration,
				rythSpecial: curRythSpec,
				octave: curOctave
			});
		}
		$(that).trigger('patternChange', [noteElements]);
		console.log(noteElements)
	},

	addNoteElementByCanvasClick = function(noteName) {
		console.log("model add note by canavs click : " + noteName);
	},

	removeLastNoteElement = function() {
	    console.log("model: remove last note button; function missing");
	},

	getCurrentMode = function() {
		return curMode;
	},

	getAllNoteElements = function() {
		return noteElements;
	};

	
	
	that.init = init;
	that.setCurrentMode = setCurrentMode;
	that.setCurrentNoteName = setCurrentNoteName;
	that.setCurrentAccidential = setCurrentAccidential;
	that.setCurrentNoteDuration = setCurrentNoteDuration;
	that.setCurrentClef = setCurrentClef;
	that.setCurrentNoteRythSpecial = setCurrentNoteRythSpecial;
	that.setCurrentOctave = setCurrentOctave;
	that.addNoteElement = addNoteElement;
	that.addNoteElementByCanvasClick = addNoteElementByCanvasClick;
	that.removeLastNoteElement = removeLastNoteElement;
	that.getCurrentMode = getCurrentMode;
	that.getAllNoteElements = getAllNoteElements;

	return that;
}