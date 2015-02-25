MusicXMLAnalyzer.ResultView = function(){

	var that = {},

	$patternValue = null,
	$vexflowNotesValue = null,
	$durationValue = null,

	patternCanvas = null,
	renderer = null,
	context = null,
	stave = null,

	init = function(){
		console.info('MusicXMLAnalyzer.ResultView.init');

		if ($('#patternCanvas').length) {
			$patternValue = $('#patternValue');
			$vexflowNotesValue = $('#vexflowNotesValue');
			$durationValue = $('#durationValue');
			initPatternCanvas(generateVexflowNotes(JSON.parse($patternValue.val())), JSON.parse($durationValue.val()));
		}
	},

	initPatternCanvas = function(vexflowNotes, duration) {
		// console.info('MusicXMLAnalyzer.ResultView.initPatternCanvas');
		patternCanvas = document.getElementById('patternCanvas');
		
		renderer = new Vex.Flow.Renderer(patternCanvas, Vex.Flow.Renderer.Backends.CANVAS);
		context = renderer.getContext();
		stave = new Vex.Flow.Stave(10, 0, 700);
		stave.addClef("treble").setContext(context).draw();
		
		renderNotes(vexflowNotes, duration);
	},

	renderNotes = function(vexflowNotes, duration) {
		// console.info('MusicXMLAnalyzer.ResultView.renderNotes', canvas);
		// console.info('MusicXMLAnalyzer.ResultView.renderNotes', context);
		// console.info('MusicXMLAnalyzer.ResultView.renderNotes', stave);
		console.info('MusicXMLAnalyzer.ResultView.renderNotes', vexflowNotes);
		// console.info('MusicXMLAnalyzer.ResultView.renderNotes', duration);

		// delete canvas
		context.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
		
		stave.setContext(context).draw();

		var voice = new Vex.Flow.Voice({
		    num_beats: duration,
		    beat_value: 64,
		    resolution: Vex.Flow.RESOLUTION
		});

		// Add notes to voice
		voice.addTickables(vexflowNotes);

		// Format and justify the notes to 700 pixels
		var formatter = new Vex.Flow.Formatter().
		    joinVoices([voice]).format([voice], 700);

		// Render voice
		voice.draw(context, stave);
		
	},

	getVexflowDuration = function(duration, rest) {
		switch (duration) {
			case "whole":
				if (rest) {
					return "wr";
				} else {
					return "w";
				}
				break;
			case "half":
				if (rest) {
					return "hr";
				} else {
					return "h";
				}
				break;
			case "quarter":
				if (rest) {
					return "qr";
				} else {
					return "q";
				}
				break;
			case "eighth":
				if (rest) {
					return "8r";
				} else {
					return "8";
				}
				break;
			case "16th":
				if (rest) {
					return "16r";
				} else {
					return "16";
				}
				break;
			case "32nd":
				if (rest) {
					return "32r";
				} else {
					return "32";
				}
				break;
			case "64th":
				if (rest) {
					return "64r";
				} else {
					return "64";
				}
				break;
			default:
				return false;
				break;
		}
	},

	generateVexflowNotes = function(pattern) {
		var notes = [];

		switch (pattern.type) {
			case 0:
				// sound sequence
				for (var i = 0; i < pattern.notes.length; i++) {
					notes.push(new Vex.Flow.StaveNote({
						keys: [pattern.notes[i].pitch.step.toLowerCase() + "/" + pattern.notes[i].pitch.octave],
						duration: "q",
						auto_stem: true
					}));
				}
				break;

			case 1:
				//
				break;

			case 2:
				// melody
				for (var i = 0; i < pattern.notes.length; i++) {
					if (pattern.notes[i].type == "note") {
						notes.push(new Vex.Flow.StaveNote({
							keys: [pattern.notes[i].pitch.step.toLowerCase() + "/" + pattern.notes[i].pitch.octave],
							duration: getVexflowDuration(pattern.notes[i].pitch.type, false),
							auto_stem: true
						}));
					} else if (pattern.notes[i].type == "rest") {
						notes.push(new Vex.Flow.StaveNote({
							keys: ["b/4"],
							duration: getVexflowDuration(pattern.notes[i].duration, true),
							auto_stem: true
						}));
					}
				}
				break;
		}
		
		return notes;
	};

	that.init = init;

	return that;
}