MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	noteElements4VexFlow = [],

	curMode = "2",
	curName = "c",
	curAccidential = "none",
	curDuration = "quarter",
	curClef = "G",
	curRythSpec = "none",
	curOctave = "4",
	VEXFLOW_REST_SIGN = "r",
	// completeDurationIn64th = 0,
	first = true,

	// in this app a triplet must consist of 3 notes
	tripletCurrentAmount = 0,
	tripletEndPositions = [],
	tupletArray = [],
	beamArray = [],

	noteElementAccidential = 0,

	init = function(){

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

	//duration like written on button
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

	
	setValuesForNoteElement = function() {

		//accidential
		if (curAccidential == "#") {
			noteElementAccidential = 1;
		} else if (curAccidential == "b") {
			noteElementAccidential = -1;
		} else {
			noteElementAccidential = 0;
		}
	},

	addNoteElement = function() {
		// completeDurationIn64th = 0;

		// soundSequence pattern:
		// $patternValue.val(JSON.stringify(
		// 	{
		// 		type: 0,
		// 		notes: [
		// 			{
		// 				pitch: {
		// 					step: "B",
		// 					alter: 0,
		// 					octave: 5
		// 				}
		// 			},
		// 			{
		// 				pitch: {
		// 					step: "B",
		// 					alter: 0,
		// 					octave: 5
		// 				}
		// 			}
		// 		]
		// 	}
		// ));

		setValuesForNoteElement();


		// 
		// Adding Notes (doesn't work on rest or anything else)
		// ToDo: differentiation between other ElementTypes (e.g. rests, or dotted notes, or triplets, ...)
		// ToDo: needs more specific var's according to ElementType [see patterns!]
		// 
			if(first){
				first = false;
				noteElements.push({
					//TODO 
					//Mode für Dave im moment hart gecoded
					type: 0,
					notes:[{
						pitch: {
							step: curName.toUpperCase(),
							alter: noteElementAccidential,
							type: curDuration,
							rythSpecial: curRythSpec, //ToDo: change according to dummy pattern in patternView.js
							octave: curOctave
						}
					}
					]
				});
			}else{
				noteElements[0].notes.push({
					
						pitch: {
							step: curName.toUpperCase(),
							alter: noteElementAccidential,
							type: curDuration,
							rythSpecial: curRythSpec, //ToDo: change according to dummy pattern in patternView.js
							octave: curOctave
						}
					
					
				});
			}
			
			/*
			for (var i = 0; i < noteElements.length; i++) {
				//console.log("d64 of " + i + " " + getDurationIn64thNotes(noteElements[i].duration));
				completeDurationIn64th += getDurationIn64thNotes(noteElements[i].duration);
			}
			*/

			//check if break or normal note or note with accidential
			//then adapt values for vexflow an put them into an array
			var note;
			var keyContent = getKeyContent4Vexflow(curName);
			var durationContent = getDuration4Vexflow(curDuration);
			//check if break or normal note or note with accidential
			//then adapt values for vexflow an put them into an array
			if (curName == "break") {
				note = new Vex.Flow.StaveNote({ keys: ["b/4"],
		    						duration: durationContent + VEXFLOW_REST_SIGN,
		    						auto_stem: true });
			} else {
				note = new Vex.Flow.StaveNote({ keys: [keyContent + "/" + curOctave],
		    						duration: durationContent,
		    						auto_stem: true });	
			}

			if (curAccidential == "#" || curAccidential == "b") {
				note.addAccidental(0, new Vex.Flow.Accidental(curAccidential));
			}

			if (curRythSpec == "dotted") {
				note.addDotToAll();	
			}

			noteElements4VexFlow.push(note);

			if (curRythSpec == "triplet") {
				tripletCurrentAmount++;
				if (tripletCurrentAmount == 3) {
					tripletCurrentAmount = 0;
					tripletEndPositions.push(noteElements4VexFlow.length);
					var tuplet = new Vex.Flow.Tuplet(vexflowNotes.slice(noteElements4VexFlow.length-3, noteElements4VexFlow.length))
					var beam = new Vex.Flow.Tuplet(vexflowNotes.slice(noteElements4VexFlow.length-3, noteElements4VexFlow.length))
					tupletArray.push()
					beamArray.push()
					console.log("tep: ",tripletEndPositions)
				}
			} else {
				tripletCurrentAmount = 0;
			}	

		$(that).trigger('patternChange', [noteElements]);
		// send vexflow note elements to controller and then back to view
		$(that).trigger('updateNotationView', [getAllVexFlowNoteElements()]);
	
	},

	getTripletEndPositions = function() {
		return tripletEndPositions;
	}

	getKeyContent4Vexflow = function(noteName) {
		var keyContent = noteName;
		switch (curAccidential) {
			case "#":
				keyContent += "#";
				break;
			case "b":
				keyContent += "b";
				break;
			default:
				//...
		}
		return keyContent;
	},

	getDuration4Vexflow = function(duration) {
		var duration4Vexflow = null;

			if ( duration == "whole") {
				duration4Vexflow = "w";
			} else if ( duration == "half") {
				duration4Vexflow = "h";
			} else if ( duration == "quarter") {
				duration4Vexflow = "q";
			} else if ( duration == "eighth") {
				duration4Vexflow = "8";
			} else if ( duration == "16th") {
				duration4Vexflow = "16";
			} else if ( duration == "32nd") {
				duration4Vexflow = "32";
			} else if ( duration == "64th") {
				duration4Vexflow = "64";
			}

			if (curRythSpec == "dotted") {
				duration4Vexflow += "d";
			}

		return duration4Vexflow;
	},

	/*
	This method gets called when your click on the canvas
	to add a note element.
	The paramter note looks like "c/4".
	It updates the model values curName and curOctave and calls addNoteElement
	*/
	addNoteElementByCanvasClick = function(note) {
		//split string at "/" to get noteName and ovtave
		//and saves it into array noteContainer
		var noteContainer = note.split("/");
		
		curName = noteContainer[0];
		curOctave = noteContainer[1];

		// updates selected btns for note name and view in pattern view
		$(that).trigger('changeSelectedNoteNameByClick', [curName]);
		$(that).trigger('changeSelectedOctaveByClick', [curOctave]);
		
		addNoteElement();

	},

	removeLastNoteElement = function() {
		//ToDo: do "first = true;"" if LastNoteElement equals first note element
		//and remove this element
	    console.log("model: remove last note button; function missing");
	    console.log(noteElements4VexFlow);
	},


	getAllNoteElements = function() {
		return noteElements;
	},

	getAllVexFlowNoteElements = function() {
		return noteElements4VexFlow;
	};

	that.init = init;
	that.getKeyContent4Vexflow = getKeyContent4Vexflow;
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
	that.getDuration4Vexflow = getDuration4Vexflow;

	return that;
}
