/** @constructor */
MusicXMLAnalyzer.ScoreView = function(){

	var that = {},

	$scoreValue = null,
	$partSelectorContainer = null,

	init = function() {
		console.info("MusicXMLAnalyzer.ScoreView.init");

		$scoreValue = $('#scoreValue');

		scoreData = JSON.parse($scoreValue.val());
		console.log("scoreData: ",scoreData.measures);
		// initialize canvas
		var canvas = document.createElement('canvas');
		canvas.id = "canvas";
		canvas.className = "canvas";
		canvas.width = 970;
		canvas.height = Math.ceil(scoreData.measures.length / 2) * 180;
		var canvasContainer = document.getElementById('canvasContainer');
		canvasContainer.innerHTML = "";
		canvasContainer.appendChild(canvas);

		var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
		var context = renderer.getContext();
		var stave = new Vex.Flow.Stave(10, 0, 700);
		stave.addClef("treble").setContext(context).draw();

		var vexflowMeasures = generateVexflowNotes(scoreData, true);
		renderNotes(vexflowMeasures, canvas, renderer, context, stave, false);

		$partSelector = $('#partSelector');
		$partSelector.on('change', onPartSelectorChange);
	},

	onPartSelectorChange = function(event) {
		var url = $partSelector.val();
		window.location.href = url;
	},

	/**
	 * Method renders result extract
	 * @function
     * @private
	 *
	 * @param {array}    		measures    array containing the measures of result extract
	 * @param {object}     		canvas      the canvas proportions
	 * @param {canvas}     		context     the canvas context
	 * @param {object}     		score     the user score
	 */
	renderNotes = function(measures, canvas, renderer, context, stave, score) {

		// clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.fillStyle = '#EEEEEE';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = '#000000';

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
			height = 180;
			padding = 5;
			if (i%2 === 0) {
				x = padding;
				y = i * (height / 2);
			} else {
				x = padding + width;
				y = (i - 1) * (height / 2);
			}

			if (score) {
				width = 690;
				height = 120;
			}
			// Add offset from top to center vertical
			y += 25;

			staveBar = new Vex.Flow.Stave(x, y, width);	// generate new stave for measure

			if (i%2 === 0) {
				staveBar.addClef("treble");	// add clef to every measure starting in a new line
			}
			if (measures[i].time_signature) {
				staveBar.addTimeSignature(measures[i].time_signature);	// add time signature if changed
			}
			if (i > 0 && i < measures.length-1) {
				staveBar.setBegBarType(Vex.Flow.Barline.type.SINGLE);	// set measure bar line
			}
			if (i === measures.length-1) {
				staveBar.setEndBarType(Vex.Flow.Barline.type.END);	// set double measure bar line at last measure
			}

			// creating ties between notes
			for (var j = 0; j < measures[i].notes.length; j++) {

				// ties
				if (measures[i].ties) {
					if (measures[i].ties[j] !== false && measures[i].ties[j] !== undefined) {
						if (measures[i].ties[j].indexOf("stop") > -1) {
							tieStop = measures[i].notes[j];
							if (tieStart !== null) {
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
			}

			// tuplets
			var tuplets = [];
			for (var j = 0; j < measures[i].notes.length; j++) {
				if (measures[i].tuplets && measures[i].tuplets[j]) {
					if (measures[i].tuplets[j].toString() !== 'false' && measures[i].tuplets[j].toString() !== 'undefined') {
						var tupletNotes = measures[i].notes.slice(j, (j + parseInt(measures[i].tuplets[j])));
						var tupletLocation = tupletNotes[0].stem.stem_direction;
						var tuplet = new Vex.Flow.Tuplet(tupletNotes);
						tuplet.setTupletLocation(tupletLocation);
						tuplets.push(tuplet);
						j = (j + parseInt(measures[i].tuplets[j])-1);
					}
				}
			}

			// draw measure bar line
			staveBar.setContext(context).draw();

			// draw measure with notes
			var beams = Vex.Flow.Beam.generateBeams(measures[i].notes);
			Vex.Flow.Formatter.FormatAndDraw(context, staveBar, measures[i].notes);
			beams.forEach(function(beam) {
				beam.setContext(context).draw();
			});

			// draw tuplets
			for (var t = 0; t < tuplets.length; t++) {
				tuplets[t].setContext(context).draw();
			}
		}

		for (var t2 = 0; t2 < ties.length; t2++) {
			ties[t2].setContext(context).draw();
		}
	},

	/**
	 * Method generates vexflow notes
	 * @function
     * @private
	 *
	 * @param {object}     		score     the user score
	 * @param {object}     		result      search result
	 */
	generateVexflowNotes = function(score, result) {
		var measures = [];

		for (var i = 0; i < score.measures.length; i++) {
			for (var j = 0; j < score.measures[i].notes.length; j++) {
				if (score.measures[i].notes[j].pitch && score.measures[i].notes[j].pitch.beam) {
					score.measures[i].notes[j].pitch.tuplet = "3";
				} else if(score.measures[i].notes[j].pitch) {
					score.measures[i].notes[j].pitch.tuplet = false;
				}
			}

			var notes = [];
			noteCounter = 0;
			// var beams = [];
			var ties = [];
			var tuplets = [];
			var time_signature = score.measures[i].time_signature;
			if (score.measures[i].notes) {
				for (var j = 0; j < score.measures[i].notes.length; j++) {

					var note;
					if (score.measures[i].notes[j].type === "note") {
						if (!score.measures[i].notes[j].pitch.chord) {
							// determine note variables
							var step = score.measures[i].notes[j].pitch.step;
							var octave = score.measures[i].notes[j].pitch.octave;
							var alter = score.measures[i].notes[j].pitch.alter;
							var keys = [getVexflowKey(step, octave, alter )];

							var noteTies = [false];
							if (score.measures[i].notes[j].pitch.ties) {
								noteTies = score.measures[i].notes[j].pitch.ties;
							}

							var tuplet = false;
							if (score.measures[i].notes[j].pitch.tuplet) {
								tuplet = score.measures[i].notes[j].pitch.tuplet;
							}

							var type = score.measures[i].notes[j].pitch.type;
							var durationType = 0;
							if (score.measures[i].notes[j].pitch.dot) {
								durationType = 2;
							}
							var noteDuration = getVexflowDuration(type, durationType);

							note = new Vex.Flow.StaveNote({ keys: keys, duration: noteDuration, auto_stem: true });
							switch (alter) {
								case -2: note.addAccidental(0, new Vex.Flow.Accidental("bb")); break;
								case -1: note.addAccidental(0, new Vex.Flow.Accidental("b")); break;
								case 1: note.addAccidental(0, new Vex.Flow.Accidental("#")); break;
								case 2: note.addAccidental(0, new Vex.Flow.Accidental("#")); break;
							}

							if (score.measures[i].notes[j].pitch.dot) {
								note.addDotToAll();
							}

							ties[noteCounter] = noteTies;
							tuplets[noteCounter] = tuplet;
							notes.push(note);
							noteCounter++;
						}
					} else if (score.measures[i].notes[j].type === "rest") {
						var durationType = 1; // rests type is 1
						var noteDuration = getVexflowDuration(score.measures[i].notes[j].duration, durationType);

						note = new Vex.Flow.StaveNote({ keys: ["b/4"], duration: noteDuration });

						if (score.measures[i].notes[j].dot) {
							note.addDotToAll();
						}

						ties[noteCounter] = [false];
						notes.push(note);
						noteCounter++;
					} else if (score.measures[i].notes[j].type === "unpitched") {
						var step = score.measures[i].notes[j].pitch.step;
						var octave = score.measures[i].notes[j].pitch.octave;
						var alter = score.measures[i].notes[j].pitch.alter;
						var keys = [getVexflowKey(step, octave, alter ) + "/d2"];

						var noteTies = [false];
						if (score.measures[i].notes[j].pitch.ties) {
							noteTies = score.measures[i].notes[j].pitch.ties;
						}

						var type = score.measures[i].notes[j].pitch.type;
						var durationType = 0;
						if (score.measures[i].notes[j].pitch.dot) {
							durationType = 2;
						}
						var noteDuration = getVexflowDuration(type, durationType);
						note = new Vex.Flow.StaveNote({ keys: keys, duration: noteDuration, auto_stem: true});

						if (score.measures[i].notes[j].pitch.dot) {
							note.addDotToAll();
						}

						ties[noteCounter] = noteTies;
						notes.push(note);
						noteCounter++;
					}
				}
			}
			measures.push({ notes: notes, ties: ties, tuplets: tuplets, time_signature: time_signature, score: score });
		}

		return measures;
	},

	/**
	 * Method converts duration from string to number values as 1/64
	 * @function
     * @private
	 *
	 * @param {string}    	duration    string of note duration
	 *
	 * @return {number}     duration value as number
	 *
	 */
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

	/**
	 * Method returns the note duration in vexflow style
	 * @function
     * @private
	 *
	 * @param {string}    		duration    duration of note
	 * @param {number}     		type      	type of note (0 = note, 1 = rest, 2 = dotted note)
	 *
	 * @return {string}         duration for vexflow
	 */
	getVexflowDuration = function(duration, type) {
		switch (duration) {
			case "whole":
				switch (type) {
					case 0: return "w"; break;		// 0 is normal note
					case 1: return "wr"; break;		// 1 is a rest
					case 2: return "wd"; break;		// 2 is a dotted note
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
				switch (type) {
					case 0: return "128"; break;
					case 1: return "128r"; break;
					case 2: return "128d"; break;
				}
				break;
		}
	},

	/**
	 * Method returns key description for vexflow
	 * @function
     * @private
	 *
	 * @param {string}    step    	note name
	 * @param {string}    octave    octave number
	 * @param {string}    alter     accidential of the note
	 *
	 * @return {string}   key description for vexflow
	 */
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