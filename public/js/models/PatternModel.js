MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	noteElements4VexFlow = [],
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

			//adapt values for vexflow an put them into an array
			
			noteElements4VexFlow.push({
				name: curName,
				accidential: curAccidential,
				duration: getDuration4Vexflow(curDuration),
				durationIn64th: getDurationIn64thNotes (curDuration),
				rythSpecial: curRythSpec,
				octave: curOctave
			});
		}
		$(that).trigger('patternChange', [noteElements]);
		$(that).trigger('updateNotationView', [getAllVexFlowNoteElements()]);
	},

	getDuration4Vexflow = function(duration) {
		var duration4Vexflow = "q";

			if ( curDuration == "whole") {
				duration4Vexflow = "w";
			} else if ( curDuration == "half") {
				duration4Vexflow = "h";
			} else if ( curDuration == "eighth") {
				duration4Vexflow = "8";
			} else if ( curDuration == "16th") {
				duration4Vexflow = "16";
			} else if ( curDuration == "32nd") {
				duration4Vexflow = "32";
			} else if ( curDuration == "64th") {
				duration4Vexflow = "64";
			}

		return duration4Vexflow;
	},

	getDurationIn64thNotes = function(noteName) {
		//when 64th note
		var durationIn64th = 1;

			if ( curDuration == "whole") {
				durationIn64th = 64;
			} else if ( curDuration == "half") {
				durationIn64th = 32;
			} else if ( curDuration == "quarter") {
				durationIn64th = 16;
			} else if ( curDuration == "eighth") {
				durationIn64th = 8;
			} else if ( curDuration == "16th") {
				durationIn64th = 4;
			} else if ( curDuration == "32nd") {
				durationIn64th = 2;
			}

		return durationIn64th;
	},

	addNoteElementByCanvasClick = function(note) {
		console.log("model add note by canavs click : " + note);
		//split string at "/" to get noteName and ovtave
		var noteContainer = note.split("/");
		console.log("part1: " + noteContainer[0]);
		console.log("part2: " + noteContainer[1]);
	},

	removeLastNoteElement = function() {
	    console.log("model: remove last note button; function missing");
	},

	getCurrentMode = function() {
		return curMode;
	},

	getAllNoteElements = function() {
		return noteElements;
	},

	getAllVexFlowNoteElements = function() {
		return noteElements4VexFlow;
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