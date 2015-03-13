MusicXMLAnalyzer.ResultView = function(){

	var that = {},

	$patternValue = null,

	patternCanvas = null,

	$carousel = null,
	once = true,
	once2 = true,
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

	notesToBePlayed = [],
	keyToNote = "",

	init = function(){
		console.info('MusicXMLAnalyzer.ResultView.init');

		if ($('#patternCanvas').length) {
			$patternValue = $('#patternValue');
			initPatternCanvas(JSON.parse($patternValue.val()));
		}

		if ($('#extract-carousel').length) {
			$carousel = $('#extract-carousel');
			initCanvasResults();
		}


	},

	initCanvasResults = function() {
		console.info('MusicXMLAnalyzer.ResultView.initCanvasResults');
		$carousel.find('.item').each(function(index, element) {
			var measures = generateVexflowNotes(JSON.parse($(element).find('input.notes').val()));
			var canvas = document.getElementById('canvas' + index);
			var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
			var context = renderer.getContext();
			var stave = new Vex.Flow.Stave(10, 0, 700);
			stave.addClef("treble").setContext(context).draw();

			// console.log(index, notes);
			renderNotes(measures, canvas, renderer, context, stave);

			// TESTING
			// start playing extract of first shown result
			// TODO: call again when sliding through caroussel
		});

		// TODO
		// call playtune on user-interaction
		if(once){
			once=false;
			playResult();
		}
	},

	playResult = function(){
		// console.log("playResult keyToNote: ",MIDI.keyToNote['A0']); //<-- returns key for var note
		// console.log("playResult keytonote: ",MIDI.noteToKey); // 21 => A0

		// TODO: 
		// [DONE] get results according to current caroussel position
		// [DONE] eg. no hardcoded '#notes0', but '#notes'+carousselPosition (0-based)

		// TODO:
		// set duration correctly if dotted note

		// TODO:
		// determine velocity

		//get notes of current extract:
		var currentResultNotes = JSON.parse($('#extract-carousel').find('div.carousel-inner').find('div.item.active').find('.notes')[0].value);
		// console.log("currentResultNotes: ",currentResultNotes);

		//determine MIDI values for currentResultNotes
		for(var i = 0; i < currentResultNotes.measures.length; i++){
			// check if rest
			if(currentResultNotes.measures[i].notes[0].type == 'rest'){
				// console.log("current note number is ",i,"; type is rest");
				// console.log("rest: ",rest);
				var rest = currentResultNotes.measures[i].notes[0];

				// setTimeout according to rest duration?

			}else if(currentResultNotes.measures[i].notes[0].type == 'note'){
				// console.log("current note number is ",i,"; type is note");
				var note = currentResultNotes.measures[i].notes[0];
				// console.log("note: ",note);

				var noteStep = note.pitch.step;
				var noteOctave = note.pitch.octave;
				var noteAlter = note.pitch.alter;
				var noteDuration = getDuration(note.pitch.type);

				if(noteAlter != 0){
					keyToNote = noteStep.concat(noteOctave, noteAlter);
				}else{
					keyToNote = noteStep.concat(noteOctave);
				}
				// console.log("megaKeyToNoteObject{keyToNote}: ",megaKeyToNoteObject[keyToNote]);
				notesToBePlayed.push({'note': megaKeyToNoteObject[keyToNote], 'noteDuration': noteDuration});
			}

		}


		// Trying to play result:
		MIDI.loadPlugin({
			soundfontUrl: "../../libs/midijs/soundfont/",
			instrument: "acoustic_grand_piano",
			callback: function() {					
				var i = 0;
				playTune = function(){

					if(i < notesToBePlayed.length){						
						// console.log("notesToBePlayed: ",notesToBePlayed[i]);
						var delay = notesToBePlayed[i].noteDuration;
						var note = notesToBePlayed[i].note;
						var noteDuration = notesToBePlayed[i].noteDuration;
						var velocity = 127; // how hard the note hits
						// play the note
						MIDI.setVolume(0, 127);
						// delay --> https://stackoverflow.com/questions/21296450/midi-js-note-duration-does-not-change
						MIDI.noteOn(0, note, velocity, delay + i + 1);
						MIDI.noteOff(0, note, delay + i + 1 + noteDuration);
						MIDI.Player.stop();
						i++;
						// recursively call playTune()
						playTune();
					} 
				}
				if(once2){ 
					once2 = false;
					playTune();
				 }
			}
		});
	},

	getDuration = function(type){
		var duration;

		if (type == "whole"){
			duration = 0.75;
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

	initPatternCanvas = function(pattern) {
		// console.info('MusicXMLAnalyzer.ResultView.initPatternCanvas');
		patternCanvas = document.getElementById('patternCanvas');
		
		var vexflowNotes = generateVexflowNotes({ measures: [{ notes: pattern.notes }], type: pattern.type });
		var renderer = new Vex.Flow.Renderer(patternCanvas, Vex.Flow.Renderer.Backends.CANVAS);
		var context = renderer.getContext();
		var stave = new Vex.Flow.Stave(10, 0, 700);
		stave.addClef("treble").setContext(context).draw();
		
		renderNotes(vexflowNotes, patternCanvas, renderer, context, stave);
	},

	renderNotes = function(measures, canvas, renderer, context, stave) {
		// delete canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		// stave.setContext(context).draw();

		var voice = new Vex.Flow.Voice({
		    num_beats: 4,
		    beat_value: 4,
		    resolution: Vex.Flow.RESOLUTION
		});

		// disable strict timing
		voice.setStrict(false);

		var tieStart = null;
		var tieStop = null;
		var ties = [];
		for (var i = 0; i < measures.length; i++) {
			// calculate x & y coordinates and width of the current measure
			var x, y, width;
			width = 480;
			height = 90;
			padding = 5;
			if (i%2 == 0) {
				x = padding;
				y = i * (height / 2);
			} else {
				x = padding + width;
				y = (i - 1) * (height / 2);
			}

			staveBar = new Vex.Flow.Stave(x, y, width);	// generate new stave for measure

			if (i%2 == 0) {
				staveBar.addClef("treble");	// add clef to every measure starting in a new line
			}
			if (measures[i].time_signature) {
				staveBar.addTimeSignature(measures[i].time_signature);	// add time signature if changed
			}
			if (i > 0 && i < measures.length-1) {
				staveBar.setBegBarType(Vex.Flow.Barline.type.SINGLE);	// set measure bar line
			}
			if (i == measures.length-1) {
				staveBar.setEndBarType(Vex.Flow.Barline.type.END);	// set double measure bar line at last measure
			}

			// creating ties and beams between notes
			var beamBegin = null;
			var beamEnd = null;
			var beams = [];
			for (var j = 0; j < measures[i].notes.length; j++) {
				// beams
				if (measures[i].beams) {
					if (measures[i].beams[j] == "begin") {
						beamBegin = j;
					}
					if (measures[i].beams[j] == "end") {
						beamEnd = j;
					}
					if (beamBegin != null && beamEnd != null) {
						var beamNotes = measures[i].notes.slice(beamBegin, beamEnd+1);
						var beam = new Vex.Flow.Beam(beamNotes, true);
						beams.push(beam);
						beamBegin = null;
						beamEnd = null;
					}
				}

				// ties
				if (measures[i].ties) {
					if (measures[i].ties[j].indexOf("stop") > -1) {
						tieStop = measures[i].notes[j];
						if (tieStart != null) {
							var tie = new Vex.Flow.StaveTie({ first_note: tieStart, last_note: tieStop, first_indices: [0], last_indices: [0] });
							ties.push(tie);
							tieStart = null;
							tieStop = null;
						}
					}
					if (measures[i].ties[j].indexOf("start") > -1) {
						tieStart = measures[i].notes[j];
					}
				}
			}

			// draw measure bar line
			staveBar.setContext(context).draw();
			
			// draw measure with notes
			Vex.Flow.Formatter.FormatAndDraw(context, staveBar, measures[i].notes);

			// draw beams
			for ( var b = 0; b < beams.length; b++) {
				beams[b].setContext(context).draw();
			}
		}

		for (var t = 0; t < ties.length; t++) {
			ties[t].setContext(context).draw();
		}

	},

	generateVexflowNotes = function(pattern) {
		// console.log("MusicXMLAnalyzer.ResultView.generateVexflowNotes" , "pattern", pattern);
		var measures = [];

		switch (pattern.type) {
			case 0:
				// sound sequence
				for (var i = 0; i < pattern.measures.length; i++) {	// iterate over measures in result
					var notes = [];	//creating notes array for notes in current measure
					var duration = 0;	// resetting duration to 0
					var time_signature = pattern.measures[i].time_signature;
					for (var j = 0; j < pattern.measures[i].notes.length; j++) {	// iterate over all notes in current measure
						var step = pattern.measures[i].notes[j].pitch.step;	// determine the step
						var octave = pattern.measures[i].notes[j].pitch.octave;	// determine the octave
						var alter = pattern.measures[i].notes[j].pitch.alter;	// determine the alter
						var keys = [getVexflowKey(step, octave, alter )];	// generating key in vexflow format

						var note = new Vex.Flow.StaveNote({ keys: keys, duration: "q", auto_stem: true });

						if (alter == -1) {	// if accidental should be "b"
							note.addAccidental(0, new Vex.Flow.Accidental("b"));	// add "b"
						} else if (alter == 1) {	// if accidental should be "#"
							note.addAccidental(0, new Vex.Flow.Accidental("#"));	// add "#"
						}

						notes.push(note);
						duration += 16;	// add 16 to duration; quarter = 16/64
					}
					measures.push({ notes: notes, duration: duration, time_signature: time_signature });	// push note to array
				}
				break;

			case 1:
				//
				break;

			case 2:
				// melody
				for (var i = 0; i < pattern.measures.length; i++) {
					var notes = [];
					var duration = 0;
					var ties = [];
					var beams = [];
					var time_signature = pattern.measures[i].time_signature;
					for (var j = 0; j < pattern.measures[i].notes.length; j++) {

						// set color of current note
						var color = pattern.measures[i].notes[j].color;

						var note;
						if (pattern.measures[i].notes[j].type == "note") {
							if (!pattern.measures[i].notes[j].pitch.chord) {
								// determine note variables
								var step = pattern.measures[i].notes[j].pitch.step;
								var octave = pattern.measures[i].notes[j].pitch.octave;
								var alter = pattern.measures[i].notes[j].pitch.alter;
								var keys = [getVexflowKey(step, octave, alter )];
								// keys = checkNotesResult.keys;
								// color = checkNotesResult.color;
								var noteTies = pattern.measures[i].notes[j].pitch.ties;
								var type = pattern.measures[i].notes[j].pitch.type;
								var durationType = 0;
								if (pattern.measures[i].notes[j].pitch.dot) {
									durationType = 2;
								}
								var noteDuration = getVexflowDuration(type, durationType);
								var noteBeam = pattern.measures[i].notes[j].pitch.beam;

								note = new Vex.Flow.StaveNote({ keys: keys, duration: noteDuration, auto_stem: true });
								note.color = color;
								note = checkNextNotes(pattern, note, i, j);
								switch (alter) {
									case "-2": note.addAccidental(0, new Vex.Flow.Accidental("bb")); break;
									case "-1": note.addAccidental(0, new Vex.Flow.Accidental("b")); break;
									case "1": note.addAccidental(0, new Vex.Flow.Accidental("#")); break;
									case "2": note.addAccidental(0, new Vex.Flow.Accidental("#")); break;		
								}

								if (pattern.measures[i].notes[j].pitch.dot) {
									note.addDotToAll();
								}
								beams[j] = noteBeam;
								ties[j] = noteTies;
								notes.push(note);
							}
						} else if (pattern.measures[i].notes[j].type == "rest") {
							var durationType = 1; // rests type is 1
							var duration = getVexflowDuration(pattern.measures[i].notes[j].duration, durationType);

							note = new Vex.Flow.StaveNote({ keys: ["b/4"], duration: duration });
							note.color = color;
							duration += getDurationIn64th(pattern.measures[i].notes[j].duration);
							ties[j] = [false];
							notes.push(note);
						}
					}
					measures.push({ notes: notes, duration: duration, beams: beams, ties: ties, time_signature: time_signature });
				}
				break;
		}
		
		// console.log(measures);
		return measures;
	},

	checkNextNotes = function(pattern, note, i, j) {
		// console.log(pattern);
		j++;
		var newNote = note;
		var newKeys = note.keys;
		if (pattern.measures[i].notes[j]) {
			if (pattern.measures[i].notes[j].pitch) {
				if (pattern.measures[i].notes[j].pitch.chord) {
					var step = pattern.measures[i].notes[j].pitch.step;
					var octave = pattern.measures[i].notes[j].pitch.octave;
					var alter = pattern.measures[i].notes[j].pitch.alter;
					newKeys.push(getVexflowKey(step, octave, alter));
					newNote = new Vex.Flow.StaveNote({ keys: newKeys, duration: note.duration, auto_stem: true });
					note = checkNextNotes(pattern, note, i, j);
				}
			}

			// console.log(note.color);
			if (pattern.measures[i].notes[j].color == "#FF0000" || note.color == "#FF0000") {
				// console.log("red", i, j);
				newNote.color = "#FF0000";
			} else {
				newNote.color = note.color;
			}		
		}
		return newNote;
	},


	/* HELPER FUNCTIONS */
	getDurationIn64th = function(duration) {
		switch (duration) {
			case "whole":
				return 64; break;
			case "half":
				return 32; break;
			case "quarter":
				return 16; break;
			case "eighth":
				return 8; break;
			case "16th":
				return 4; break;
			case "32nd":
				return 2; break;
			case "64th":
				return 1; break;
			default:
				return 0; break;
		}
	},

	getVexflowDuration = function(duration, type) {
		switch (duration) {
			case "whole":
				switch (type) {
					case 0: return "w"; break;
					case 1: return "wr"; break;
					case 2: return "wd"; break;

				}
				break;
			case "half":
				switch (type) {
					case 0: return "h"; break;
					case 1: return "hr"; break;
					case 2: return "hd"; break;

				}
				break;
			case "quarter":
				switch (type) {
					case 0: return "q"; break;
					case 1: return "qr"; break;
					case 2: return "qd"; break;

				}
				break;
			case "eighth":
				switch (type) {
					case 0: return "8"; break;
					case 1: return "8r"; break;
					case 2: return "8d"; break;

				}
				break;
			case "16th":
				switch (type) {
					case 0: return "16"; break;
					case 1: return "16r"; break;
					case 2: return "16d"; break;

				}
				break;
			case "32nd":
				switch (type) {
					case 0: return "32"; break;
					case 1: return "32r"; break;
					case 2: return "32d"; break;

				}
				break;
			case "64th":
				switch (type) {
					case 0: return "64"; break;
					case 1: return "64r"; break;
					case 2: return "64d"; break;

				}
				break;
			default:
				return false; break;
		}
	},

	getVexflowKey = function(step, octave, alter) {
		key = step.toLowerCase();
		switch (alter) {
			case -2:
				key += "bb"; break;
			case -1:
				key += "b"; break;
			case 1:
				key += "#"; break;
			case 2:
				key += "##"; break;
			default:
				break;
		}
		key += "/";
		key += octave;
		return key;
	};

	that.init = init;

	return that;
}