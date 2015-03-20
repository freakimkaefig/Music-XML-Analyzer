MusicXMLAnalyzer.PatternView = function(){

	var that = {},
	$modeButtonClass = $(".btn-mode"),

	$noteButtonClass = $(".btn-note"),
	$accidentialButtonClass = $(".btn-accidential"),
	$durationButtonClass = $(".btn-duration"),
	$clefButtonClass = $(".btn-clef"),
	$specialRythButtonClass = $(".btn-special-ryth"),
	$octaveButtonClass = $(".btn-octave"),

	$addNoteButton = $("#btn-add-note"),
	$removeNoteButton = $("#btn-remove-note"),

	$patternValue = $('#patternValue'),


	init = function() {
		console.log("pattern view");

		patternController = MusicXMLAnalyzer.PatternController();

		$modeButtonClass.on("click", onModeButtonClick);

		$noteButtonClass.on("click", onNoteButtonClick);
		$accidentialButtonClass.on("click", onAccidentialButtonClick);
		$durationButtonClass.on("click", onDurationButtonClick);
		$clefButtonClass.on("click", onClefButtonClick);
		$specialRythButtonClass.on("click", onSpecialRythButtonClick);
		$octaveButtonClass.on("click", onOctaveButtonClick);
		$addNoteButton.on("click", onAddButtonClick);
		$removeNoteButton.on("click", onRemoveButtonClick);


		// soundSequence pattern:
		/*$('#patternValue').val(JSON.stringify(
			[{
				type: 0,
				notes: [
					{
						pitch: {
							step: "B",
							alter: 0,
							octave: 5
						}
					},
					{
						pitch: {
							step: "B",
							alter: 0,
							octave: 5
						}
					}
				]
			}]
		));*/


		// rhythm pattern:
		/*$('#patternValue').val(JSON.stringify(
			[{
				type: 1,
				notes: [
					{
						type: "note",
						ptich: {
							type: "half",
							dot: true,
							beam: false
						}
					},
					{
						type: "rest",
						duration: "whole"
					}
				]
			}]
		));*/


		// melody pattern:
		/*$('#patternValue').val(JSON.stringify(
			[{
				type: 2,
				notes: [
					{
						type: "note",
						pitch: {
							step: "E",
							type: "eighth",
							alter: -1,
							octave: 5,
							dot: false,
							beam: "begin"	// Triole (1)
						}
					},
					{
						type: "note",
						pitch: {
							step: "D",
							type: "eighth",
							alter: 0,
							octave: 5,
							dot: false,
							beam: "continue"	// Triole (2)
						}
					},
					{
						type: "note",
						pitch: {
							step: "C",
							type: "eighth",
							alter: 0,
							octave: 5,
							dot: false,
							beam: "end"	// Triole (3)
						}
					},
					{
						type: "note",
						pitch: {
							step: "C",
							type: "eighth",
							alter: 0,
							octave: 5,
							dot: true,	// punktierte Note
							beam: false
						}
					}
					{
						type: "rest",	// Pause
						duration: "whole"
					}
				]
			}]
		)); */
	},

	onModeButtonClick = function(event) {
		var modeButtonId = event.target.id;
		// slice -1 gets the last char of the mode id
		patternController.changeMode(parseInt(modeButtonId.slice(-1)));
	},

	onNoteButtonClick = function(event) {
		patternController.changeNote(event.target.id);
	},

	onAccidentialButtonClick = function(event) {
		patternController.changeAccidential(event.target.id);
	},

	onDurationButtonClick = function(event) {
		patternController.changeDuration(event.target.id);
	},

	onClefButtonClick = function(event) {
		patternController.changeClef(event.target.id);
	},

	onSpecialRythButtonClick = function(event) {
		patternController.changeSpecialRyth(event.target.id);
	},

	onOctaveButtonClick = function(event) {
		patternController.changeOctave(event.target.id);
	},

	onAddButtonClick = function(event) {
		patternController.addNote();
	},

	setPatternValue = function(pattern) {
		$patternValue.val(pattern);
		//console.log("pattern changed to: ",$patternValue.val());
	},

	setNoteNameActive = function(noteName) {
		$(".btn-note.active").removeClass("active");
		$("#" + noteName + "").addClass("active");
	},

	setOctaveActive = function(octave) {
		$(".btn-octave.active").removeClass("active");
		// $('btn-group-names label.active').removeClass('active');
		$("#" + octave + "").addClass("active");
	},

	setAccidentialActive = function(accidential) {
		$(".btn-accidential.active").removeClass("active");
		$("#" + accidential + "").addClass("active");
	},

	setDurationActive = function(duration) {
		$(".btn-duration.active").removeClass("active");
		$("#" + duration + "").addClass("active");
	},

	setClefActive = function(clef) {
		$(".btn-clef.active").removeClass("active");
		$("#" + clef + "").addClass("active");
	},

	setSpecRythActive = function(specRyth) {
		$(".btn-special-ryth.active").removeClass("active");
		$("#" + specRyth + "").addClass("active");
	},

	setToMelodyMode = function() {
		console.log("pattern view set melody");
		$noteButtonClass.removeClass("disabled");
		$accidentialButtonClass.removeClass("disabled");
		$durationButtonClass.removeClass("disabled");
		$clefButtonClass.removeClass("disabled");
		$specialRythButtonClass.removeClass("disabled");
		$octaveButtonClass.removeClass("disabled");
	},

	setToSoundSequenceMode = function() {
		console.log("pattern view set Sound sequence");
		$durationButtonClass.addClass('disabled');
		$specialRythButtonClass.addClass('disabled');

		$noteButtonClass.removeClass('disabled');
		$octaveButtonClass.removeClass('disabled');
		$clefButtonClass.removeClass('disabled');
		$accidentialButtonClass.removeClass('disabled');
	},

	setToRhythmMode = function() {
		console.log("pattern view set rhythm");
		$noteButtonClass.addClass('disabled');
		$octaveButtonClass.addClass('disabled');
		$clefButtonClass.addClass('disabled');
		$accidentialButtonClass.addClass('disabled');

		$durationButtonClass.removeClass('disabled');
		$specialRythButtonClass.removeClass('disabled');
	},

	onRemoveButtonClick = function(event) {
		patternController.removeLastNote();
	};

	that.init = init;
	that.setPatternValue = setPatternValue;
	that.setNoteNameActive = setNoteNameActive;
	that.setOctaveActive = setOctaveActive;
	that.setAccidentialActive = setAccidentialActive;
	that.setDurationActive = setDurationActive;
	that.setClefActive = setClefActive;
	that.setSpecRythActive = setSpecRythActive;
	that.setToSoundSequenceMode = setToSoundSequenceMode;
	that.setToRhythmMode = setToRhythmMode;
	that.setToMelodyMode = setToMelodyMode;

	return that;
}