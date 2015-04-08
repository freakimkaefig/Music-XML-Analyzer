MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	noteElements4VexFlow = [],

	curMode = 2,
	curName = "c",
	curAccidential = "none",
	curDuration = "quarter",
	curRythSpec = "none",
	curOctave = "4",
	VEXFLOW_REST_SIGN = "r",
	first = true,

	tripletCurrentAmount = 0,
	tripletEndPositions = [],
	tupletArray = [],
	beamArray = [],

	tripletEnterMode = false;

	// val for noteElements: -1,0,1
	noteElementAccidential = 0,
	isDot = false,
	// val for beam: false, begin, continue, end
	beamVal = false,


	init = function() {

	},

	setCurrentMode = function(mode) {
		if (curMode != mode) {
			emptyNoteArrays();
			$(that).trigger('clearCanvas');
		}

		curMode = mode;

		//set variables to default vals when there is mode 1 or 0
		switch(curMode) {
			//sound sequence
			case 0:
				setDefaultValsForSoundSequenceMode();
				break;
			//rhythm
			case 1:
				setDefaultValsForRhythmMode();
				break;
			//meldoy
			case 2:
				setDefaultValsForMelodyMode();
				break;
		}
		//pattern update view
		$(that).trigger('changeViewToCurrentMode', curMode);

	},

	/*
	This method empties the notes arrays and sets the val
	first to true.
	*/
	emptyNoteArrays = function() {
		noteElements = [];
		noteElements4VexFlow = [];
		first = true;
	}

	getCurrentMode = function() {
		return curMode;
	},

	setCurrentNoteName = function(noteName) {
		console.log("patternModel setCurrentNoteName notename: ",noteName);
		if(getCurrentMode() === 1 && noteName !== 'break'){

			curOctave = 4;
			curName = 'b';
		}else{

			curName = noteName;
		}
		console.log("model " + noteName, " curOctave: ",curOctave);
	},

	getCurrentNoteName = function() {
		return curName;
	},

	setCurrentAccidential = function(accidential) {
		curAccidential = accidential;
	},

	getCurrentAccidential = function() {
		return curAccidential;
	},

	setCurrentNoteDuration = function(noteDuration) {
		curDuration = noteDuration;
	},

	//duration like written on button
	getCurrentNoteDuration = function() {
		return curDuration;
	},

	setCurrentNoteRythSpecial = function(rythSpec) {
		curRythSpec = rythSpec;
	},

	getCurrentNoteRythSpecial = function() {
		return curRythSpec;
	},

	setCurrentOctave = function(octave) {
		curOctave = octave;
	},

	getCurrentOctave = function() {
		return curOctave;
	},

	/*
	This method sets vals for accidentials, dots and beams
	for noteElements-Array
	*/
	setValuesForNoteElement = function() {

		//accidential
		if (curAccidential == "#") {
			noteElementAccidential = 1;
		} else if (curAccidential == "b") {
			noteElementAccidential = -1;
		} else {
			noteElementAccidential = 0;
		}

		//dot
		if(curRythSpec == "dotted") {
			isDot = true;
		} else {
			isDot = false;
		}

		//beam
		if(curRythSpec == "triplet") {
				tripletCurrentAmount++;
		}

		switch(tripletCurrentAmount) {
		    case 1:
		        beamVal = "begin";
		        break;
	        case 2:
		        beamVal = "continue";
		        break;
		    case 3:
		        beamVal = "end";
		        break;
		    default:
		        beamVal = false;
		}
	},

	addNoteElement = function() {

		setValuesForNoteElement();

		if (curMode == 2) {
			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push(
					{
					type: curMode,
						notes:
						[
							{
								type: "note",
								pitch: {
									step: curName.toUpperCase(),
									alter: noteElementAccidential,
									type: curDuration,
									octave: curOctave,
									dot: isDot,
									beam: beamVal
								}
							}
						]
					});
				} else {
					//break
					noteElements.push(
					{
						type: curMode,
						notes:
						[
							{
							type: "rest",
							dot: isDot,
							duration: curDuration
							}
						]
					});
				}
			} else {
				if (curName != "break") {
					noteElements[0].notes.push(
					{
								type: "note",
								pitch: {
									step: curName.toUpperCase(),
									alter: noteElementAccidential,
									type: curDuration,
									octave: curOctave,
									dot: isDot,
									beam: beamVal
								}
					});
				} else {
					//break
					noteElements[0].notes.push(
					{
						type: "rest",
						dot: isDot,
						duration: curDuration
					});
				}
			}
		} else if (curMode == 1) {
		// rhythm mode
			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push(
					{
					type: curMode,
						notes:
						[
							{
								type: "note",
								pitch: {
									type: curDuration,
									dot: isDot,
									beam: beamVal
								}
							}
						]
					});
				} else {
					//break
					noteElements.push(
					{
						type: curMode,
						notes:
						[
							{
								type: "rest",
								dot: isDot,
								duration: curDuration
							}
						]
					});
				}
			} else {
				if (curName != "break") {
					noteElements[0].notes.push(
					{

						type: "note",
						pitch: {
							type: curDuration,
							dot: isDot,
							beam: beamVal
						}

					});
				} else {
					//break
					noteElements[0].notes.push(
					{
						type: "rest",
						dot: isDot,
						duration: curDuration
					});
				}
			}
		} else if (curMode == 0) {
			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push(
					{
					type: curMode,
						notes:
						[
							{
								type: "note",
								pitch: {
									step: curName.toUpperCase(),
									alter: noteElementAccidential,
									octave: curOctave
								}
							}
						]
					});
				}
			} else {
				if (curName != "break") {
					noteElements[0].notes.push(
					{
						type: "note",
						pitch: {
							step: curName.toUpperCase(),
							alter: noteElementAccidential,
							octave: curOctave
						}
					});
				}
			}
		}

		//check if break or normal note or note with accidential
		//then adapt values for vexflow an put them into an array
		// console.log("curName: ",curName," curOctave: ",curOctave);
		var note;
		if(getCurrentMode() === 1 && curName !== 'break'){
			curName = 'b';
		}
		var keyContent = getKeyContent4Vexflow(curName);
		var durationContent = getDuration4Vexflow(curDuration);

		//check if break or normal note or note with accidential
		//then adapt values for vexflow an put them into an array
		if (curName == "break") {
			note = new Vex.Flow.StaveNote({ keys: ["b/4"],
	    						duration: durationContent + VEXFLOW_REST_SIGN,
	    						auto_stem: true });
		} else {
			var keys = keyContent + "/" + curOctave;
			if (getCurrentMode() == 1) {
				if (durationContent === "w" || durationContent === "h" || durationContent === "wd" || durationContent === "hd") {
					keys += '/d0';
				} else {
					keys += '/d2';
				}
			}
			note = new Vex.Flow.StaveNote({ keys: [keys],
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

		//check if triplet
		if (curRythSpec == "triplet") {
				if (tripletCurrentAmount == 3) {
					$(that).trigger('endTripletEnterMode');
					tripletEnterMode = false;
					tripletCurrentAmount = 0;
					//store all end positions of the triplets
					tripletEndPositions.push(noteElements4VexFlow.length);
					//create tuplet and beam and push it into corresponding array
					var tuplet = new Vex.Flow.Tuplet(noteElements4VexFlow.slice(noteElements4VexFlow.length-3, noteElements4VexFlow.length))
					var beam = new Vex.Flow.Tuplet(noteElements4VexFlow.slice(noteElements4VexFlow.length-3, noteElements4VexFlow.length))
					tupletArray.push(tuplet);
					beamArray.push(beam);
				} else if (tripletCurrentAmount == 1) {
					 tripletEnterMode = true;
					 $(that).trigger('startTripletEnterMode');
				}
		}

		if(noteElements.length == 0) {
			first = true;
			noteElements = [];
		}

		$(that).trigger('patternChange', [noteElements]);
		// send vexflow note elements to controller and then back to view
		$(that).trigger('updateNotationView', [getAllVexFlowNoteElements()]);

	},

	getPatternLength = function(){
		if(noteElements.length > 0){
			return noteElements[0].notes.length;
		} else {
			return 0;
		}
	}

	setDefaultValsForSoundSequenceMode = function() {
		curName = "c";
		curOctave = "4";
		curAccidential = "none";

		// lastDurationForTriplet = curDuration;
		tripletCurrentAmount = 0;
		tripletEndPositions = [],
		tupletArray = [],
		beamArray = [],
		beamVal = false;
		isDot = false;

		$(that).trigger('changeSelectedNoteName', curName);
		$(that).trigger('changeSelectedOctave', curOctave);
		$(that).trigger('changeSelectedAccidential', curAccidential);
	},

	setDefaultValsForRhythmMode = function() {
		curDuration = "quarter";
		curRythSpec = "none";
		curOctave = "5";

		tripletCurrentAmount = 0;
		tripletEndPositions = [],
		tupletArray = [],
		beamArray = [],
		beamVal = false;
		isDot = false;

		$(that).trigger('changeSelectedDuration', curDuration);
		$(that).trigger('changeSelectedSpecRyth', curRythSpec);
	},

	setDefaultValsForMelodyMode = function() {
		curMode = 2;
		curName = "c";
		curOctave = "4";
		curAccidential = "none";
		curDuration = "quarter";
		curRythSpec = "none";

		tripletCurrentAmount = 0;
		tripletEndPositions = [],
		tupletArray = [],
		beamArray = [],
		beamVal = false;
		isDot = false;

		$(that).trigger('changeSelectedNoteName', curName);
		$(that).trigger('changeSelectedOctave', curOctave);
		$(that).trigger('changeSelectedAccidential', curAccidential);
		$(that).trigger('changeSelectedDuration', curDuration);
		$(that).trigger('changeSelectedSpecRyth', curRythSpec);
	},

	getTripletEndPositions = function() {
		return tripletEndPositions;
	},

	getTupletArray = function() {
		return tupletArray;
	},

	getBeamArray = function() {
		return beamArray;
	},

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

		//current vals are being updated after note adding with click
		curName = noteContainer[0];
		curOctave = noteContainer[1];

		// updates selected btns for note name and view in pattern view
		$(that).trigger('changeSelectedNoteName', [curName]);
		$(that).trigger('changeSelectedOctave', [curOctave]);

		addNoteElement();

	},

	removeLastNoteElement = function() {
		if(noteElements.length == 0) {
	    	first = true;
	    	noteElements = [];
	    }else if(noteElements[0].notes.length != 0) {
			//check if element you want to delete is triplet
			//and check if there are triplets before
		    if(noteElements[0].notes[noteElements4VexFlow.length-1].pitch && noteElements[0].notes[noteElements4VexFlow.length-1].pitch.beam != false) {
		    	noteElements[0].notes.pop();
		    	noteElements[0].notes.pop();
		    	noteElements[0].notes.pop();
		    	noteElements4VexFlow.pop();
		    	noteElements4VexFlow.pop();
		    	noteElements4VexFlow.pop();
		    	beamArray.pop();
				tupletArray.pop();
		    } else {
		    	noteElements[0].notes.pop();
		    	noteElements4VexFlow.pop();
		    }
		}



	    $(that).trigger('patternChange', [noteElements]);
		// send vexflow note elements to controller and then back to view
		$(that).trigger('updateNotationView', [getAllVexFlowNoteElements()]);
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
	that.getCurrentNoteRythSpecial = getCurrentNoteRythSpecial;
	that.getCurrentOctave = getCurrentOctave;
	that.setCurrentMode = setCurrentMode;
	that.setCurrentNoteName = setCurrentNoteName;
	that.setCurrentAccidential = setCurrentAccidential;
	that.setCurrentNoteDuration = setCurrentNoteDuration;
	that.setCurrentNoteRythSpecial = setCurrentNoteRythSpecial;
	that.setCurrentOctave = setCurrentOctave;
	that.addNoteElement = addNoteElement;
	that.addNoteElementByCanvasClick = addNoteElementByCanvasClick;
	that.removeLastNoteElement = removeLastNoteElement;
	that.getCurrentMode = getCurrentMode;
	that.getAllNoteElements = getAllNoteElements;
	that.getAllVexFlowNoteElements = getAllVexFlowNoteElements;
	that.getDuration4Vexflow = getDuration4Vexflow;
	that.getTupletArray = getTupletArray;
	that.getBeamArray = getBeamArray;
	that.getPatternLength = getPatternLength;

	return that;
}
