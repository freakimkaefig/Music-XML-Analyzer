MusicXMLAnalyzer.ResultView = function(){

	var that = {},

	$patternValue = null,

	patternCanvas = null,

	$carousel = null,

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
		});
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

		for (var i = 0; i < measures.length; i++) {
			// calculate x & y coordinates and width of the current measure
			var x, y, width;
			width = 340;
			height = 80;
			padding = 10;
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

			// creating beams between notes
			var start = null;
			var end = null;
			var beams = [];
			for (var j = 0; j < measures[i].notes.length; j++) {
				if (measures[i].beams[j] == "begin") {
					start = j;
				}
				if (measures[i].beams[j] == "end") {
					end = j;
				}
				if (start != null && end != null) {
					var beamNotes = measures[i].notes.slice(start, end+1);
					var beam = new Vex.Flow.Beam(beamNotes, true);
					beams.push(beam);
					start = null;
					end = null;
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
	},

	generateVexflowNotes = function(pattern) {
		console.log("MusicXMLAnalyzer.ResultView.generateVexflowNotes" , "pattern", pattern);
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
					var beams = [];
					var time_signature = pattern.measures[i].time_signature;
					for (var j = 0; j < pattern.measures[i].notes.length; j++) {
						var color = "#000000";
						if ("color" in pattern.measures[i].notes[j]) {
							color = pattern.measures[i].notes[j].color;
						}
						var note;
						if (pattern.measures[i].notes[j].type == "note") {
							var step = pattern.measures[i].notes[j].pitch.step;
							var octave = pattern.measures[i].notes[j].pitch.octave;
							var alter = pattern.measures[i].notes[j].pitch.alter;
							var type = pattern.measures[i].notes[j].pitch.type;
							var keys = [getVexflowKey(step, octave, alter )];
							var durationType = 0;
							if (pattern.measures[i].notes[j].pitch.dot) {
								durationType = 2;
							}
							var noteDuration = getVexflowDuration(type, durationType);
							var noteBeam = pattern.measures[i].notes[j].pitch.beam;

							note = new Vex.Flow.StaveNote({ keys: keys, duration: noteDuration, auto_stem: true });
							note.color = color;
							if (alter == -1) {
								note.addAccidental(0, new Vex.Flow.Accidental("b")).addDotToAll();
							} else if (alter == 1) {
								note.addAccidental(0, new Vex.Flow.Accidental("#")).addDotToAll();
							}

							if (pattern.measures[i].notes[j].pitch.dot) {
								note.addDotToAll();
							}
						} else if (pattern.measures[i].notes[j].type == "rest") {
							var durationType = 1; // rests type is 1
							var restDuration = getVexflowDuration(pattern.measures[i].notes[j].duration, durationType);

							note = new Vex.Flow.StaveNote({ keys: ["b/4"], duration: restDuration })
							duration += getDurationIn64th(pattern.measures[i].notes[j].duration);
						}
						notes.push(note);
						beams[j] = noteBeam;
					}
					measures.push({ notes: notes, duration: duration, beams: beams, time_signature: time_signature });
				}
				break;
		}
		
		// console.log(measures);
		return measures;
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