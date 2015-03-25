MusicXMLAnalyzer.PatternView = function(){

	var that = {},
	$modeButtonClass = $(".btn-mode"),

	$noteButtonClass = $(".btn-note"),
	$accidentialButtonClass = $(".btn-accidential"),
	$durationButtonClass = $(".btn-duration"),
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
						pitch: {
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
							step: "F",
							type: "half",
							alter: 0,
							octave: 1,
							dot: true,	// punktierte Note
							beam: false
						}
					},
					{
						type: "note",
						pitch: {
							step: "F",
							type: "half",
							alter: 0,
							octave: 2,
							dot: true,	// punktierte Note
							beam: false
						}
					}
					// ,
					// {
					// 	type: "rest",	// Pause
					// 	duration: "whole"
					// }
					
				]
			}]
		));*/
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
		var acc = event.target.id;
		acc = acc.substring(acc.indexOf("-") + 1, acc.length)
		patternController.changeAccidential(acc);
	},

	onDurationButtonClick = function(event) {
		patternController.changeDuration(event.target.id);
	},

	onSpecialRythButtonClick = function(event) {
		//get the and of the specRyth String after the -
		var specRyth = event.target.id;
		specRyth = specRyth.substring(specRyth.indexOf("-") + 1, specRyth.length)
		//prevent adding break triplets by disabling the break button
		if(specRyth == "triplet") {
			// check if break button was active
			// if true then set selected note to c
			if($("#break").hasClass("active") == true) {
				patternController.changeNote("c");
				setNoteNameActive("c");	
			}
			$("#break").addClass("disabled");
		} else {
			$("#break").removeClass("disabled");
		}
		patternController.changeSpecialRyth(specRyth);
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

	setAccidentialActive = function(acc) {
		$(".btn-accidential.active").removeClass("active");
		$("#accidential-" + acc + "").addClass("active");
	},

	setDurationActive = function(duration) {
		$(".btn-duration.active").removeClass("active");
		$("#" + duration + "").addClass("active");
	},

	setSpecRythActive = function(specRyth) {
		$(".btn-special-ryth.active").removeClass("active");
		$("#spec-" + specRyth + "").addClass("active");
	},

	setToMelodyMode = function() {
		console.log("pattern view set melody");
		
		$noteButtonClass.removeClass("disabled");
		$accidentialButtonClass.removeClass("disabled");
		$durationButtonClass.removeClass("disabled");
		$specialRythButtonClass.removeClass("disabled");
		$octaveButtonClass.removeClass("disabled");
	},

	setToSoundSequenceMode = function() {
		console.log("pattern view set Sound sequence");
		$durationButtonClass.addClass('disabled');
		$specialRythButtonClass.addClass('disabled');

		$noteButtonClass.removeClass('disabled');
		//disable only break button from notes class
		$("#break").addClass('disabled');
		
		$octaveButtonClass.removeClass('disabled');
		$accidentialButtonClass.removeClass('disabled');
	},

	setToRhythmMode = function() {
		console.log("pattern view set rhythm");
		$noteButtonClass.addClass('disabled');
		$octaveButtonClass.addClass('disabled');
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
	that.setSpecRythActive = setSpecRythActive;
	that.setToSoundSequenceMode = setToSoundSequenceMode;
	that.setToRhythmMode = setToRhythmMode;
	that.setToMelodyMode = setToMelodyMode;

	return that;
}