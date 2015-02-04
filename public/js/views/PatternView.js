MusicXMLAnalyzer.PatternView = function(){

	var that = {},
	$noteButtonClass = $(".btn-note");
	$accidentialButtonClass = $(".btn-accidential");
	$durationButtonClass = $(".btn-duration");
	$clefButtonClass = $(".btn-clef");
	$specialRythButtonClass = $(".btn-special-ryth");

	$addNoteButton = $("#btn-add-note");
	$removeNoteButton = $("#btn-remove-note");


	init = function() {
		console.log("pattern view");

		patternController = MusicXMLAnalyzer.PatternController();

		$noteButtonClass.on("click", onNoteButtonClick);
		$accidentialButtonClass.on("click", onAccidentialButtonClick);
		$durationButtonClass.on("click", onDurationButtonClick);
		$clefButtonClass.on("click", onClefButtonClick);
		$specialRythButtonClass.on("click", onSpecialRythButtonClick)

		$addNoteButton.on("click", onAddButtonClick);
		$removeNoteButton.on("click", onRemoveButtonClick);
		

	},

	onNoteButtonClick = function(event) {
		console.log($(event.target).text());
		patternController.changeNote($(event.target).text());
	},

	onAccidentialButtonClick = function(event) {
		console.log($(event.target).text());
		patternController.changeAccidential($(event.target).text());
	},

	onDurationButtonClick = function(event) {
		console.log($(event.target).text());
		patternController.changeDuration($(event.target).text());
	},

	onClefButtonClick = function(event) {
		console.log($(event.target).text());
		patternController.changeClef($(event.target).text());
	},

	onSpecialRythButtonClick = function(event) {
		console.log($(event.target).text());
		patternController.changeSpecialRyth($(event.target).text());
	},

	onAddButtonClick = function(event) {
		console.log("add btn");
		patternController.addNote();
	},

	onRemoveButtonClick = function(event) {
		console.log("remove btn");
		patternController.removeLastNote();
	};

	that.init = init;

	return that;
}