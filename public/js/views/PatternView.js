MusicXMLAnalyzer.PatternView = function(){

	var that = {},
	$modeButtonClass = $(".btn-mode"),

	$noteButtonClass = $(".btn-note"),
	$accidentialButtonClass = $(".btn-accidential"),
	$durationButtonClass = $(".btn-duration"),
	$clefButtonClass = $(".btn-clef"),
	$specialRythButtonClass = $(".btn-special-ryth"),
	$selectOctave = $("#select-octave"),

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

		$selectOctave.on("change", onOctaveChanged);

		$addNoteButton.on("click", onAddButtonClick);
		$removeNoteButton.on("click", onRemoveButtonClick);

		// soundSequence pattern:
		$patternValue.val(JSON.stringify(
			{
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
			}
		));
		// melody pattern:
		// $patternValue.val(JSON.stringify(
		// 	{
		// 		type: 2,
		// 		notes: [
		// 			{
		// 				type: "note",
		// 				pitch: {
		// 					step: "C",
		// 					type: "half",
		// 					alter: 0,
		// 					octave: 3
		// 				}
		// 			},
		// 			{
		// 				type: "rest",
		// 				duration: "whole"
		// 			}
		// 		]
		// 	}
		// ));
	},

	onModeButtonClick = function(event) {
		//console.log($(event.target).text());
		patternController.changeMode($(event.target).text());
	},

	onNoteButtonClick = function(event) {
		//console.log($(event.target).text());
		patternController.changeNote($(event.target).text());
	},

	onAccidentialButtonClick = function(event) {
		// console.log($(event.target).text());
		patternController.changeAccidential($(event.target).text());
	},

	onDurationButtonClick = function(event) {
		// console.log($(event.target).text());
		patternController.changeDuration($(event.target).text());
	},

	onClefButtonClick = function(event) {
		// console.log($(event.target).text());
		patternController.changeClef($(event.target).text());
	},

	onSpecialRythButtonClick = function(event) {
		// console.log($(event.target).text());
		patternController.changeSpecialRyth($(event.target).text());
	},

	onOctaveChanged = function(event) {
		//console.log($(event.target).val());
		patternController.changeOctave($(event.target).val());
	},

	onAddButtonClick = function(event) {
		// console.log("add btn");
		patternController.addNote();
	},

	setPatternValue = function(pattern) {
		$patternValue.val(pattern);
	},

	onRemoveButtonClick = function(event) {
		// console.log("remove btn");
		patternController.removeLastNote();
	};

	that.init = init;
	that.setPatternValue = setPatternValue;

	return that;
}