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
		
		stave.setContext(context).draw();

		var voice = new Vex.Flow.Voice({
		    num_beats: 4,
		    beat_value: 4,
		    resolution: Vex.Flow.RESOLUTION
		});

		// disable strict timing
		voice.setStrict(false);

		for (var i = 0; i < measures.length; i++) {
			
			// Add measures to voice
			voice.addTickables(measures[i].notes);

			// Format and justify the measures to 700 pixels
			var formatter = new Vex.Flow.Formatter().
			    joinVoices([voice]).format([voice], 700);

			// Render voice
			voice.draw(context, stave);
			
		}


		
	},

	generateVexflowNotes = function(pattern) {
		var measures = [];

		switch (pattern.type) {
			case 0:
				// sound sequence
				for (var i = 0; i < pattern.measures.length; i++) {
					var notes = [];
					var duration = 0;
					for (var j = 0; j < pattern.measures[i].notes.length; j++) {
						var step = pattern.measures[i].notes[j].pitch.step;
						var octave = pattern.measures[i].notes[j].pitch.octave;
						var alter = pattern.measures[i].notes[j].pitch.alter;
						var keys = [getVexflowKey(step, octave, alter )];
						if (alter == -1) {
							notes.push(
								new Vex.Flow.StaveNote(
									{
										keys: keys,
										duration: "q",
										auto_stem: true
									}
								).addAccidental(0, new Vex.Flow.Accidental("b"))
							);
						} else if (alter == 1) {
							notes.push(
								new Vex.Flow.StaveNote(
									{
										keys: keys,
										duration: "q",
										auto_stem: true
									}
								).addAccidental(0, new Vex.Flow.Accidental("#"))
							);
						} else {
							notes.push(
								new Vex.Flow.StaveNote(
									{
										keys: keys,
										duration: "q",
										auto_stem: true
									}
								)
							);
						}
						duration += 16;
					}
					measures.push({ notes: notes, duration: duration });
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
					for (var j = 0; j < pattern.measures[i].notes.length; j++) {
						if (pattern.measures[i].notes[j].type == "note") {
							var step = pattern.measures[i].notes[j].pitch.step;
							var octave = pattern.measures[i].notes[j].pitch.octave;
							var alter = pattern.measures[i].notes[j].pitch.alter;
							var type = pattern.measures[i].notes[j].pitch.type;
							var keys = [getVexflowKey(step, octave, alter )];
							var noteDuration = getVexflowDuration(type, false)
							if (alter == -1) {
								notes.push(
									new Vex.Flow.StaveNote(
										{
											keys: keys,
											duration: noteDuration,
											auto_stem: true
										}
									).addAccidental(0, new Vex.Flow.Accidental("b"))
								);
							} else if (alter == 1) {
								notes.push(
									new Vex.Flow.StaveNote(
										{
											keys: keys,
											duration: noteDuration,
											auto_stem: true
										}
									).addAccidental(0, new Vex.Flow.Accidental("#"))
								);
							} else {
								notes.push(
									new Vex.Flow.StaveNote(
										{
											keys: keys,
											duration: noteDuration,
											auto_stem: true
										}
									)
								);
							}
							duration += getDurationIn64th(type);
						} else if (pattern.measures[i].notes[j].type == "rest") {
							var noteDuration = getVexflowDuration(pattern.measures[i].notes[j].duration, true);
							notes.push(
								new Vex.Flow.StaveNote(
									{
										keys: ["c/1"],
										duration: duration,
										auto_stem: true
									}
								)
							);
							duration += getDurationIn64th(pattern.measures[i].notes[j].duration);
						}
					}
					measures.push({ notes: notes, duration: duration });
				}
				break;
		}
		
		console.log(measures);
		return measures;
		// return { notes: notes, duration: duration };
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

	getVexflowDuration = function(duration, rest) {
		switch (duration) {
			case "whole":
				if (rest) { return "wr"; } else { return "w"; } break;
			case "half":
				if (rest) { return "hr"; } else { return "h"; } break;
			case "quarter":
				if (rest) { return "qr"; } else { return "q"; } break;
			case "eighth":
				if (rest) { return "8r"; } else { return "8"; } break;
			case "16th":
				if (rest) { return "16r"; } else { return "16"; } break;
			case "32nd":
				if (rest) { return "32r"; } else { return "32"; } break;
			case "64th":
				if (rest) { return "64r"; } else { return "64"; } break;
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