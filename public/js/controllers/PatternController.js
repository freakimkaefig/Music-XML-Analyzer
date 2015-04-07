MusicXMLAnalyzer.PatternController = function() {
	var that = {},

	once = true,
	once2 = true,
	stop = false,
	tonika = { 'C':0, 'D':2, 'E':4, 'F':5, 'G':7, 'A':9, 'B':11 },

	init = function() {
		console.info('MusicXMLAnalyzer.PatternController.init');

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
		$(patternModel).on('changeSelectedSpecRyth', onSpecRythSelectionChange);

		$(patternModel).on('startTripletEnterMode', onTripletEnterModeStart);
		$(patternModel).on('endTripletEnterMode', onTripletEnterModeEnd);

		$(patternModel).on('changeViewToCurrentMode', onViewChangedToCurrentMode);
		$(patternModel).on('testtest', test);

		$(patternModel).on('clearCanvas', onCanvasClear);

		//init MIDI
		MIDI.loadPlugin({
			soundfontUrl: "../../libs/midijs/soundfont/",
			instrument: "acoustic_grand_piano",
			callback: function() {
			}
		});

		$searchPatternButton = $('#searchPatternButton');
		$searchPatternButton.prop('disabled', true);
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

	test = function(event, x) {
		console.log("in test function");
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


	getMidiValue = function(step, octave, alter) {
		return (parseInt(octave) * 12) + (tonika[step] + parseInt(alter));
	},

	playPattern = function() {
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



		// push empty note at end of pattern for noteOff of last pattern-note
		// Todo: ONCE!
		// currentPatternNotes[0].notes.push({'type':'note', 'pitch': { 'type': undefined, 'step': undefined }});
		console.log("currentPatternNotes: ",currentPatternNotes);

		MIDI.setVolume(0, 127);

		//determine MIDI values for currentPatternNotes
		for(var i = 0; i < currentPatternNotes.length; i++){
			for(var j = 0; j < currentPatternNotes[i].notes.length; j++){
				// check if rest
				if(currentPatternNotes[i].notes[j].type == 'rest'){
					var rest = currentPatternNotes[i].notes[j];
					var restDuration = getDuration(currentPatternNotes[i].notes[j].duration);
					notesToBePlayed.push({'note': 0, 'noteDuration': restDuration});

				} else if(currentPatternNotes[i].notes[j].type == 'note'){
					var note = currentPatternNotes[i].notes[j];
					var noteDuration = (getDuration(note.pitch.type) != undefined ? getDuration(note.pitch.type) : 0.25);
					var noteStep = (note.pitch.step != undefined ? note.pitch.step : 'C');
					var noteOctave = (note.pitch.octave != undefined ? note.pitch.octave : 4);
					var noteAlter = (note.pitch.alter != undefined ? note.pitch.alter : 0);
					var noteBeam = (note.pitch.beam != undefined ? note.pitch.beam : false);

					if (note.pitch.dot) {
						noteDuration += 0.5 * noteDuration;
					}

					var midiNote = getMidiValue(noteStep, noteOctave, noteAlter);
					console.log(noteStep, noteOctave, noteAlter, noteDuration, "midiNote: ", midiNote);
					notesToBePlayed.push({'note': midiNote, 'noteDuration': noteDuration, 'noteBeam' : noteBeam});
				}
			}
		}

		var i = 0;
		playTune = function() {

			if(i < notesToBePlayed.length){
				var note = notesToBePlayed[i].note;
				// var noteDuration = notesToBePlayed[i].noteDuration;
				// how hard the note gets hit
				var velocity = 100;
				// delay is set to fix value
				var delay = 0;
				var timeout = 0;
				if(!once){

					timeout = /*(( ) + noteDuration)*/notesToBePlayed[i-1].noteDuration*2000;
					if(notesToBePlayed[i-1].noteBeam == "begin" || notesToBePlayed[i-1].noteBeam == "continue" ||
						notesToBePlayed[i-1].noteBeam == "end") {
						timeout = (timeout * 2) / 3;
					}
				}
				once = false;

				setTimeout(function(){
					if(stop){
						i = notesToBePlayed.length;
					}else{
						if(i == notesToBePlayed.length -1){
								MIDI.noteOn(0, note, velocity, delay);
								MIDI.noteOff(0, note, delay + 0.75);
						}else{
							MIDI.noteOn(0, note, velocity, delay);
							MIDI.noteOff(0, note, delay + 0.75);
						}

						i++;
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

	onSpecRythSelectionChange = function(event, selectedSpecRyth) {
		patternView.setSpecRythActive(selectedSpecRyth);
	},

	changeMode = function(val) {
		patternModel.setCurrentMode(val);
		$(that).trigger('changed_mode', [val]);
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

	changeSpecialRyth = function(val) {
		patternModel.setCurrentNoteRythSpecial(val);
	},

	changeOctave = function(val) {
		patternModel.setCurrentOctave(val);
	},

	addNote = function() {
		if(patternModel.getPatternLength() < 12){
			// console.log("getPatternLength: ",patternModel.getPatternLength());
			patternModel.addNoteElement();
		}
	},

	addNoteByCanvasClick = function(note) {
		if(patternModel.getPatternLength() < 12){
			// console.log("getPatternLength: ",patternModel.getPatternLength());
			patternModel.addNoteElementByCanvasClick(note);
		}
	},

	onCanvasClear = function() {
		notationView.clearCanvas();
	},

	removeLastNote = function() {
		patternModel.removeLastNoteElement();
	},

	onTripletEnterModeStart = function() {
		patternView.startTripletEnterMode();
	},

	onTripletEnterModeEnd = function() {
		patternView.endTripletEnterMode();
	},

	getCurrentMode = function(){
		return patternModel.getCurrentMode();
	},

	onPatternChange = function(event, pattern) {
		console.log("Trigger pattern: ",pattern);
		patternView.setPatternValue(JSON.stringify(pattern));
		if(pattern.length != 0){
			if(pattern[0].notes.length >= 12){
				// enable search button
				$searchPatternButton.prop('disabled', false);

			}else if(pattern[0].notes.length >= 2 && pattern[0].notes.length < 12){
				// enable search button
				$searchPatternButton.prop('disabled', false);

			}else if(pattern[0].notes.length < 2){
				// disable search button
				$searchPatternButton.prop('disabled', true);
			}
		}
	},

	onViewChangedToCurrentMode = function(event, mode) {
		console.log("onViewChangedToCurrentMode");
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
	that.changeSpecialRyth = changeSpecialRyth;
	that.changeOctave = changeOctave;
	that.addNote = addNote;
	that.addNoteByCanvasClick = addNoteByCanvasClick;
	that.removeLastNote = removeLastNote;
	that.dispose = dispose;
	that.getCurrentMode = getCurrentMode;

	return that;
}