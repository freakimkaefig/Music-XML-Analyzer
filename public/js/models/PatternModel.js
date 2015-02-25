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
	breakSign = "";


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
		var completeDurationIn64th = 0;

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

			if (curName == "break") {
				console.log("brake here");
				curName = "b";
				breakSign = "r";
			}

			//console.log("complete dur: " + completeDurationIn64th);
			
			//adapt values for vexflow an put them into an array
			noteElements4VexFlow.push(new Vex.Flow.StaveNote({ keys: [curName + "/" + curOctave],
		    						 duration: getDuration4Vexflow(curDuration) + breakSign,
		    						 auto_stem: true }));

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