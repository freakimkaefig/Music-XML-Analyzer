MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	noteElements4VexFlow = [],

	curMode = 2,
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

	// val for noteElements: -1,0,1
	noteElementAccidential = 0,
	// val for dot: true, false
	isDot = false,
	// val for beam: false, begin, continue, end
	beamVal = false,


	init = function() {

	},

	setCurrentMode = function(mode) {
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
			case 2:
				setDefaultValsForMelodyMode();
				break;
		}
		//update view
		$(that).trigger('changeViewToCurrentMode', [curMode]);
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
		beamVal = false;
	},

	addNoteElement = function() {		

		setValuesForNoteElement();

		if (curMode == 2) {
			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push({
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
							type: "rest",	
							duration: curDuration
					});
				}
			} else {
				if (curName != "break") {
					noteElements.push(
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
					noteElements.push(
					{
							type: "rest",	
							duration: curDuration
					});
				}
			}
		} else if (curMode == 1) {
		// rhythm mode

			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push({
					type: curMode,
						notes: [
						{
							type: "note",
							ptich: {
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
							type: "rest",
							duration: curDuration
					});
				}
			} else {
				if (curName != "break") {
					noteElements.push(
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
					noteElements.push(
					{
							type: "rest",	
							duration: curDuration
					});
				}
			}
		} else if (curMode == 0) {
			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push({
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
					noteElements.push(
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
			
		console.log("noteELements: ", noteElements);

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

		//check if triplet
		if (curRythSpec == "triplet") {
			console.log("tripletCurrentAmount: " + tripletCurrentAmount);
			if (tripletCurrentAmount == 3) {
				tripletCurrentAmount = 0;
				//store all end positions of the triplets
				tripletEndPositions.push(noteElements4VexFlow.length);
				//create tuplet and beam and push it into corresponding array
				var tuplet = new Vex.Flow.Tuplet(noteElements4VexFlow.slice(noteElements4VexFlow.length-3, noteElements4VexFlow.length))
				var beam = new Vex.Flow.Tuplet(noteElements4VexFlow.slice(noteElements4VexFlow.length-3, noteElements4VexFlow.length))
				tupletArray.push(tuplet);
				beamArray.push(beam);
				console.log("tripletEndPositions: ",tripletEndPositions)
			}
		} else {
			//when user changes from triplet into different rythSpec
			//when there are already 1 or 2 triplets, they will be deleted and removed from the note and vexflow array
			if (tripletCurrentAmount > 0) {
				//splice -> (position in array, number of elements to be removed)
				noteElements4VexFlow.splice(
					// +1 because of array pos begins with 0
					noteElements4VexFlow.length - (tripletCurrentAmount + 1), tripletCurrentAmount);
				noteElements.slice(
					noteElements.length - (tripletCurrentAmount + 1), tripletCurrentAmount);
				tripletCurrentAmount = 0;
			}
		}

		$(that).trigger('patternChange', [noteElements]);
		// send vexflow note elements to controller and then back to view
		$(that).trigger('updateNotationView', [getAllVexFlowNoteElements()]);
	
	},

	setDefaultValsForSoundSequenceMode = function() {
		curDuration = "quarter";
		curRythSpec = "none";
	},

	setDefaultValsForRhythmMode = function() {
		curName = "b";
		curOctave = "4";
		curAccidential = "none";
		curClef = "G";
	},

	setDefaultValsForMelodyMode = function() {
		curMode = 2;
		curName = "c";
		curOctave = "4";
		curAccidential = "none";
		curDuration = "quarter";
		curClef = "G";
		curRythSpec = "none";
		

		//TODO 
		//update view to this default vals
		$(that).trigger('changeSelectedNoteName', "c");
		$(that).trigger('changeSelectedOctave', "4");
		$(that).trigger('changeSelectedAccidential', "none");
		$(that).trigger('changeSelectedDuration', "quarter");
		$(that).trigger('changeSelectedClef', "G");
		$(that).trigger('changeSelectedSpecRyth', "none");
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
		
		curName = noteContainer[0];
		curOctave = noteContainer[1];

		// updates selected btns for note name and view in pattern view
		$(that).trigger('changeSelectedNoteName', [curName]);
		$(that).trigger('changeSelectedOctave', [curOctave]);
		
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
	that.getTupletArray = getTupletArray;
	that.getBeamArray = getBeamArray;

	return that;
}
