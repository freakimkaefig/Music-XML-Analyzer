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
	VEXFLOW_REST_SIGN = "r",
	completeDurationIn64th = 0,

	init = function(){
		console.log("pattern model");
	},

	setCurrentMode = function(mode) {
		curMode = mode;
		console.log("mode set to: " + curMode + " fkt missing");
	},

	getCurrentMode = function() {
		return curMode;
	},

	setCurrentNoteName = function(noteName) {
		console.log("model " + noteName);
		curName = noteName;
	},

	getCurrentNoteName = function() {
		return curName;
	},

	setCurrentAccidential = function(accidential) {
		console.log("model " + accidential);
		curAccidential = accidential;
	},

	getCurrentAccidential = function() {
		return curAccidential;
	},

	setCurrentNoteDuration = function(noteDuration) {
		console.log("model " + noteDuration);
		curDuration = noteDuration;
	},

	getCurrentNoteDuration = function() {
		return curDuration;
	},

	setCurrentClef = function(clef) {
		console.log("model " + clef);
		curClef = clef;
	},

	getCurrentClef = function() {
		return curClef;
	},

	setCurrentNoteRythSpecial = function(rythSpec) {
		console.log("model " + rythSpec);
		curRythSpec = rythSpec;
	},

	getCurrentNoteRythSpecial = function() {
		return curRythSpec;
	},

	setCurrentOctave = function(octave) {
		console.log("model " + octave);
		curOctave = octave;
	},

	getCurrentOctave = function() {
		return curOctave;
	},

	addNoteElement = function() {
		completeDurationIn64th = 0;

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

			noteElements.push({
				name: curName,
				accidential: curAccidential,
				duration: curDuration,
				rythSpecial: curRythSpec,
				octave: curOctave
			});

			console.log("noteElements: ", noteElements);
			

			for (var i = 0; i < noteElements.length; i++) {
				//console.log("d64 of " + i + " " + getDurationIn64thNotes(noteElements[i].duration));
				completeDurationIn64th += getDurationIn64thNotes(noteElements[i].duration);
			}

			//check if break or normal note
			//then adapt values for vexflow an put them into an array
			if (curName == "break") {
				noteElements4VexFlow.push(new Vex.Flow.StaveNote({ keys: ["b/4"],
		    						 duration: getDuration4Vexflow(curDuration) + VEXFLOW_REST_SIGN,
		    						 auto_stem: true }));
			} else {
				noteElements4VexFlow.push(new Vex.Flow.StaveNote({ keys: [curName + "/" + curOctave],
		    						 duration: getDuration4Vexflow(curDuration),
		    						 auto_stem: true }));
			}			

		}
		$(that).trigger('patternChange', [noteElements]);
		// send vexflow note elements and complete duration in 64th to controller and then back to view
		$(that).trigger('updateNotationView', [getAllVexFlowNoteElements(), completeDurationIn64th]);
	},

	getDuration4Vexflow = function(duration) {
		var duration4Vexflow = "q";

			if ( duration == "whole") {
				duration4Vexflow = "w";
			} else if ( duration == "half") {
				duration4Vexflow = "h";
			} else if ( duration == "eighth") {
				duration4Vexflow = "8";
			} else if ( duration == "16th") {
				duration4Vexflow = "16";
			} else if ( duration == "32nd") {
				duration4Vexflow = "32";
			} else if ( duration == "64th") {
				duration4Vexflow = "64";
			}

		return duration4Vexflow;
	},

	getDurationIn64thNotes = function(noteDuration) {
		//when 64th note
		var durationIn64th = 1;

			if ( noteDuration == "whole") {
				durationIn64th = 64;
			} else if ( noteDuration == "half") {
				durationIn64th = 32;
			} else if ( noteDuration == "quarter") {
				durationIn64th = 16;
			} else if ( noteDuration == "eighth") {
				durationIn64th = 8;
			} else if ( noteDuration == "16th") {
				durationIn64th = 4;
			} else if ( noteDuration == "32nd") {
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
	    console.log(noteElements4VexFlow);
	},

	getCompleteDurationIn64th = function() {
		return completeDurationIn64th;
	},

	getAllNoteElements = function() {
		return noteElements;
	},

	getAllVexFlowNoteElements = function() {
		return noteElements4VexFlow;
	};

	that.init = init;
	that.getCurrentNoteName = getCurrentNoteName;
	that.getCurrentAccidential = getCurrentAccidential;
	that.getCurrentNoteDuration = getCurrentNoteDuration;
	that.getCurrentClef = getCurrentClef;
	that.getCurrentNoteRythSpecial = getCurrentNoteRythSpecial;
	that.getCurrentOctave = getCurrentOctave;
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
	that.getAllVexFlowNoteElements = getAllVexFlowNoteElements;
	that.getCompleteDurationIn64th = getCompleteDurationIn64th;

	return that;
}