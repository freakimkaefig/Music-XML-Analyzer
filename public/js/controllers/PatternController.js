MusicXMLAnalyzer.PatternController = function() {
	var that = {},

	once = true,
	once2 = true,
	stop = false,	
	//combine Key as 'step'+'octave'+'alter' - where alters '#' = 1 & 'b' = 2;
	// no alter (if alter = 0) results in 'step'+'octave'
	megaKeyToNoteObject = {'A0': 21, 'B02': 22, 'B0': 23, 'C1': 24, 'D12': 25, 'C12': 25, 'A1': 33, 'A2': 45, 'A3': 57,
						  'A4': 69, 'A5': 81, 'A6': 93, 'A7': 105, 'A12': 32, 'G11': 32, 'A22': 44, 'G21': 44, 'A32': 56, 'G31': 56,
						  'A42': 68, 'G41': 68, 'A52': 80, 'G51': 32, 'A62': 80, 'G61': 92, 'A72': 92, 'G71': 104, 'B0': 104,
						  'B1': 35, 'B2': 47, 'B3': 59, 'B4': 71, 'B5': 83, 'B6': 95, 'B7': 107, 'B12': 34, 'A11': 34, 'B22': 46, 'A21': 46,
						  'B32': 58, 'A31': 58, 'B42': 70, 'A41': 70, 'B52': 82, 'A51': 82, 'B62': 94, 'A61': 94, 'B72': 106, 'A71': 106,
						  'C1': 24, 'C2': 36, 'C3': 48, 'C4': 60, 'C5': 72, 'C6': 84, 'C7': 96, 'C8': 108, 'D1': 26, 'D2': 38, 'D3': 50,
						  'D4': 62, 'D5': 74, 'D6': 86, 'D7': 98, 'C11': 25, 'D22': 37, 'C21': 37, 'D32': 49, 'C31': 49,
						  'D42': 61, 'C41': 61, 'D52': 73, 'C51': 73, 'D62': 85, 'C61': 85, 'D72': 97, 'C71': 97, 'E1': 28, 'E2': 40,
						  'E3': 52, 'E4': 64, 'E5': 76, 'E6': 88, 'E7': 100, 'E12': 27, 'D11': 27, 'E22': 39, 'D21': 39, 'E32': 51,
						  'D31': 51, 'E42': 63, 'D41': 63, 'E52': 75, 'D51': 75, 'E62': 87, 'D61': 87, 'E72': 99, 'F1': 29, 'F2': 41, 
						  'F3': 53, 'F4': 65, 'F5': 77, 'F6': 89, 'F7': 101, 'G1': 31, 'G2': 43, 'G3': 55, 'G4': 67, 'G5': 79, 'G6': 91,
						  'G7': 103, 'G12': 30, 'F11': 30, 'G22': 42, 'F21':42, 'G32': 54, 'F31': 54, 'G42': 66, 'F41': 66, 'G52': 78,
						  'F51': 78, 'G62': 90, 'F61': 90, 'G72': 102, 'F71': 102},

	init = function() {
		console.log('MusicXMLAnalyzer.PatternController.init');
		
		patternView = MusicXMLAnalyzer.PatternView();
		patternView.init();

		notationView = MusicXMLAnalyzer.NotationView();
		notationView.init();

		patternModel = MusicXMLAnalyzer.PatternModel();
		patternModel.init();
		$(patternModel).on('patternChange', onPatternChange);
		$(patternModel).on('updateNotationView', onNotationViewUpdate);

		$(patternModel).on('changeSelectedNoteName', onNoteNameSelectionChange);
		$(patternModel).on('changeSelectedOctave', onOctaveSelectionChange);
		$(patternModel).on('changeSelectedAccidential', onAccidentialSelectionChange);
		$(patternModel).on('changeSelectedDuration', onDurationSelectionChange);
		$(patternModel).on('changeSelectedClef', onClefSelectionChange);
		$(patternModel).on('changeSelectedSpecRyth', onSpecRythSelectionChange);

		$(patternModel).on('changeViewToCurrentMode', onViewChangedToCurrentMode);

		//init MIDI
		MIDI.loadPlugin({
			soundfontUrl: "../../libs/midijs/soundfont/",
			instrument: "acoustic_grand_piano",
			callback: function() {
			}
		});


		$playPattern = $('#playPattern');
		$stopPattern = $('#stopPattern');

		// disable stop button
		$stopPattern.prop('disabled', true);


		$playPattern.click(function(){
			stop = false;
			once2 = true;
			once = true;
			playPattern();
			$playPattern.prop('disabled', true);
			$stopPattern.prop('disabled', false);
		});

		$stopPattern.click(function(){
			stop = true;
			$playPattern.prop('disabled', false);
			$stopPattern.prop('disabled', true);

		});

	},

	getDuration = function(type){
		var duration;

		if (type == "whole"){
			duration = 1;
		} else if (type == "half") {
			duration = 0.5;
		} else if (type == "quarter") {
			duration = 0.25;
		} else if (type == "eighth") {
			duration = 0.125;
		} else if (type == "16th") {
			duration = 0.0625;
		} else if (type == "32nd") {
			duration = 0.03125;
		} else if (type == "64th") {
			duration = 0.015625;
		}

		return duration;
	},

	playPattern = function(){
		// console.log("MIDI: ",MIDI);
		var notesToBePlayed = [];
		// console.log("playPattern keyToNote: ",MIDI.keyToNote['A0']); //<-- returns key for var note
		// console.log("playPattern keytonote: ",MIDI.noteToKey); // 21 => A0

		// TODO:
		// # set duration correctly if dotted note
		// # determine velocity
		// # anschlags pausen bei notenlängen wechsel entfernen!

		//get notes of current extract:
		var currentPatternNotes = patternModel.getAllNoteElements();
		// console.log("currentPatternNotes: ",currentPatternNotes, currentPatternNotes[0].notes);

		//determine MIDI values for currentPatternNotes
		for(var i = 0; i < currentPatternNotes.length; i++){
			for(var j = 0; j < currentPatternNotes[i].notes.length; j++){
				// check if rest
				if(currentPatternNotes[i].notes[j].type == 'rest'){
					var rest = currentPatternNotes[i].notes[j];
					var restDuration = getDuration(currentPatternNotes[i].notes[j].duration);
					notesToBePlayed.push({'note': 0, 'noteDuration': restDuration});

				}else if(currentPatternNotes[i].notes[j].type == 'note'){
					var note = currentPatternNotes[i].notes[j];
					var noteDuration = getDuration(note.pitch.type);
					if(typeof noteDuration === 'undefined'){
						// console.log("noteduration is undefined");
						noteDuration = 0.25;
					}

					var noteStep = note.pitch.step;
					if(typeof noteStep === 'undefined'){
						// console.log("noteStep is undefined");
						noteStep = 0.25;
						keyToNote = 'C4';
					}else{
						if(note.pitch.dot){
							noteDuration += 0.5*noteDuration;
						}
						var noteOctave = note.pitch.octave;
						var noteAlter = note.pitch.alter;

						if(noteAlter != 0){
							if(noteAlter == -1){
								noteAlter = 2;
							}
							keyToNote = noteStep.concat(noteOctave, noteAlter);
						}else{
							keyToNote = noteStep.concat(noteOctave);
						}
					}
					console.log("keyToNote: ", keyToNote, " - megaKeyToNoteObject{keyToNote}: ",megaKeyToNoteObject[keyToNote]);
					notesToBePlayed.push({'note': megaKeyToNoteObject[keyToNote], 'noteDuration': noteDuration});
				}
			}
		}
		
		var i = 0;
		playTune = function(){


			if(i < notesToBePlayed.length){						
				console.log("notesToBePlayed: ",notesToBePlayed[i]);
				// console.log("pause: ", pause);
				var note = notesToBePlayed[i].note;
				var noteDuration = notesToBePlayed[i].noteDuration;
				var velocity = 127; // how hard the note hits
				var delay = notesToBePlayed[i].noteDuration  /*+ i*/ + 1;
				var timeout = 0;
				if(!once){
					// timeout needs adjustment
					// currently trial&error values
					timeout = ((delay *2) /*+ noteDuration*/)*300;
				}
				once = false;
				console.log("delay till note is played: ",timeout);

				setTimeout(function(){ 
					if(stop){
						console.log("STOP: ",stop);
						MIDI.setVolume(0, 0);
						i = notesToBePlayed.length;
					}else{
						console.log("STOP: ",stop);
						MIDI.setVolume(0, 127);
						// delay --> https://stackoverflow.com/questions/21296450/midi-js-note-duration-does-not-change

						MIDI.noteOn(0, note, velocity, delay);
						MIDI.noteOff(0, note, delay + noteDuration);
						i++;
						MIDI.Player.stop();
					}
					// recursively call playTune()
					playTune();
				 }, timeout);
			}
			// else when finished - reset play&stop buttons after 1.5 sec
			else{
				setTimeout(function(){
					$playPattern.prop('disabled', false);
					$stopPattern.prop('disabled', true);
				}, 1500);
			}
		}	
		if(once2){ 
			once2 = false;
			playTune();
		 }
	},

	onNotationViewUpdate = function(event, vexflowNotes) {
		notationView.renderNotes(vexflowNotes);
	},

	onNoteNameSelectionChange = function(event, selectedNoteName) {
		patternView.setNoteNameActive(selectedNoteName);
	},

	onOctaveSelectionChange = function(event, selectedOctave) {
		patternView.setOctaveActive(selectedOctave);
	},

	onAccidentialSelectionChange = function(event, selectedAcc) {
		patternView.setAccidentialActive(selectedAcc);
	},

	onDurationSelectionChange = function(event, selectedDur) {
		patternView.setDurationActive(selectedDur);
	},

	onClefSelectionChange = function(event, selectedClef) {
		patternView.setClefActive(selectedClef);
	},

	onSpecRythSelectionChange = function(event, selectedSpecRyth) {
		patternView.setSpecRythActive(selectedSpecRyth);
	},	

	changeMode = function(val) {
		patternModel.setCurrentMode(val);
	},

	changeNote = function(val) {
		patternModel.setCurrentNoteName(val);
	},

	changeAccidential = function(val) {
		patternModel.setCurrentAccidential(val);
	},

	changeDuration = function(val) {
		patternModel.setCurrentNoteDuration(val);
	},

	changeClef = function(val) {
		patternModel.setCurrentClef(val);
	},

	changeSpecialRyth = function(val) {
		patternModel.setCurrentNoteRythSpecial(val);
	},

	changeOctave = function(val) {
		patternModel.setCurrentOctave(val);
	},

	addNote = function() {
		patternModel.addNoteElement();
	},

	addNoteByCanvasClick = function(note) {
		patternModel.addNoteElementByCanvasClick(note);
	},

	removeLastNote = function() {
		patternModel.removeLastNoteElement();
	},

	onPatternChange = function(event, pattern) {
		// console.log("Trigger patternChange: ",pattern);
		patternView.setPatternValue(JSON.stringify(pattern));
	},

	onViewChangedToCurrentMode = function(event, mode) {
		switch(mode) {
		    //sound sequence
		    case 0:
		    patternView.setToSoundSequenceMode();
		        break;
	        //rhythm
	        case 1:
	        patternView.setToRhythmMode();
		        break;
		    //melody
		    case 2:
		    patternView.setToMelodyMode();
		    	break;
		}
	},

	dispose = function() {
		that = {};
	};


	that.init = init;
	that.changeMode = changeMode;
	that.changeNote = changeNote;
	that.changeAccidential = changeAccidential;
	that.changeDuration = changeDuration;
	that.changeClef = changeClef;
	that.changeSpecialRyth = changeSpecialRyth;
	that.changeOctave = changeOctave;
	that.addNote = addNote;
	that.addNoteByCanvasClick = addNoteByCanvasClick;
	that.removeLastNote = removeLastNote;
	that.dispose = dispose;

	return that;
}