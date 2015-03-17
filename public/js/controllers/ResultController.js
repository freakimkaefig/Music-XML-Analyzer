MusicXMLAnalyzer.ResultController = function(){

	var that = {},

	model = null,
	view = null,
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
	keyToNote = "",
	once = true,
	once2 = true,
	stop = false,

	init = function(){
		console.info('MusicXMLAnalyzer.ResultController.init');

		model = MusicXMLAnalyzer.ResultModel();
		model.init();
		view = MusicXMLAnalyzer.ResultView();
		view.init();

		//init MIDI
		MIDI.loadPlugin({
			soundfontUrl: "../../libs/midijs/soundfont/",
			instrument: "acoustic_grand_piano",
			callback: function() {
			}
		});


		$playResult = $('#playResult');
		$stopResult = $('#stopResult');

		// disable stop button
		$stopResult.prop('disabled', true);


		$playResult.click(function(){
			stop = false;
			once2 = true;
			once = true;
			playResult();
			$playResult.prop('disabled', true);
			$stopResult.prop('disabled', false);
		});

		$stopResult.click(function(){
			stop = true;
			$playResult.prop('disabled', false);
			$stopResult.prop('disabled', true);

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

	playResult = function(){
		// console.log("MIDI: ",MIDI);
		var notesToBePlayed = [];
		// console.log("playResult keyToNote: ",MIDI.keyToNote['A0']); //<-- returns key for var note
		// console.log("playResult keytonote: ",MIDI.noteToKey); // 21 => A0

		// TODO:
		// # set duration correctly if dotted note
		// # determine velocity


		//get notes of current extract:
		var currentResultNotes = JSON.parse($('#extract-carousel').find('div.carousel-inner').find('div.item.active').find('.notes')[0].value);
		console.log("currentResultNotes: ",currentResultNotes);

		//determine MIDI values for currentResultNotes
		for(var i = 0; i < currentResultNotes.measures.length; i++){
			for(var j = 0; j < currentResultNotes.measures[i].notes.length; j++){
				// check if rest
				if(currentResultNotes.measures[i].notes[j].type == 'rest'){
					var rest = currentResultNotes.measures[i].notes[j];
					var restDuration = getDuration(currentResultNotes.measures[i].notes[j].duration);
					notesToBePlayed.push({'note': 0, 'noteDuration': restDuration});

				}else if(currentResultNotes.measures[i].notes[j].type == 'note'){
					var note = currentResultNotes.measures[i].notes[j];
					var noteStep = note.pitch.step;
					var noteOctave = note.pitch.octave;
					var noteAlter = note.pitch.alter;
					var noteDuration = getDuration(note.pitch.type);
					var chord = note.pitch.chord;

					if(noteAlter != 0){
						if(noteAlter == -1){
							noteAlter = 2;
						}
						keyToNote = noteStep.concat(noteOctave, noteAlter);
					}else{
						keyToNote = noteStep.concat(noteOctave);
					}
					// console.log("keyToNote: ", keyToNote, " - megaKeyToNoteObject{keyToNote}: ",megaKeyToNoteObject[keyToNote]);
					notesToBePlayed.push({'note': megaKeyToNoteObject[keyToNote], 'noteDuration': noteDuration, 'chord': chord});
				}
			}
		}
		
		var i = 0;
		playTune = function(){

			var chorsToBePlayed = [];

			if(i < notesToBePlayed.length){						
				console.log("notesToBePlayed: ",notesToBePlayed[i]);
				// console.log("pause: ", pause);
				var note = notesToBePlayed[i].note;
				var noteDuration = notesToBePlayed[i].noteDuration;
				var velocity = 127; // how hard the note hits
				var delay = notesToBePlayed[i].noteDuration  /*+ i*/ + 1;
				// var chord = notesToBePlayed[i].chord;
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

						if(notesToBePlayed[i].chord == false && notesToBePlayed[i + 1].chord == true){
							// var kCounter = 0;
							do{
								chorsToBePlayed.push(notesToBePlayed[i].note);
								i++;

							}while(notesToBePlayed[i].chord == true && i < notesToBePlayed[i].length)
							console.log("chorsToBePlayed :",chorsToBePlayed);
							MIDI.chordOn(0, chorsToBePlayed, velocity, delay);
							MIDI.chordOff(0, chorsToBePlayed, delay);
							// TODO:
							// adjust timeout for chords?
						}
						// else:
						else{
							MIDI.noteOn(0, note, velocity, delay);
							MIDI.noteOff(0, note, delay + noteDuration);
							i++;
						}
						MIDI.Player.stop();
					}
					// recursively call playTune()
					playTune();
				 }, timeout);
			}
			// else when finished - reset play&stop buttons after 1.5 sec
			else{
				setTimeout(function(){
					$playResult.prop('disabled', false);
					$stopResult.prop('disabled', true);
				}, 1500);
			}
		}	
		if(once2){ 
			once2 = false;
			playTune();
		 }
	};

	that.init = init;

	return that;
}