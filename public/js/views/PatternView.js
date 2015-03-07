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
		// $patternValue.val(JSON.stringify(
		// 	{
		// 		type: 0,
		// 		notes: [
		// 			{
		// 				pitch: {
		// 					step: "B",
		// 					alter: 0,
		// 					octave: 5
		// 				}
		// 			},
		// 			{
		// 				pitch: {
		// 					step: "B",
		// 					alter: 0,
		// 					octave: 5
		// 				}
		// 			}
		// 		]
		// 	}
		// ));


		// melody pattern:
		// $patternValue.val(JSON.stringify(
		// 	{
		// 		type: 2,
		// 		notes: [
		// 			{
		// 				type: "note",
		// 				pitch: {
		// 					step: "B",
		// 					type: "whole",
		// 					alter: 0,
		// 					octave: 5
		// 				}
		// 			},
		// 			{
		// 				type: "rest",
		// 				duration: "whole"
		// 			}
		// 		]
		// 	}
		// )); 


		// rhythm pattern: Triole
		// $patternValue.val(JSON.stringify(
		// 	{
		// 		type: 1,
		// 		notes: [
		// 			{
		// 				type: "note",
		// 				pitch: {
		// 					step: "E",
		// 					type: "eighth",
		// 					alter: -1,
		// 					octave: 5,
		// 				beam: "begin"//,
		// 				// ****<Eventuell miteinbeziehen>****
		// 				// timeModification:{
		// 				// 	actualNotes: 3,
		// 				// 	normalNotes: 2,
		// 				// 	normalType: "eight"
		// 				// }
		// 				// *****</Eventuell miteinbeziehen>****
		// 				}
		// 			},
		// 			{
		// 				type: "note",
		// 				pitch: {
		// 					step: "D",
		// 					type: "eighth",
		// 					alter: 0,
		// 					octave: 5,
		// 				beam: "continue"//,
		// 				// ****<Eventuell miteinbeziehen>****
		// 				// timeModification:{
		// 				// 	actualNotes: 3,
		// 				// 	normalNotes: 2,
		// 				// 	normalType: "eight"
		// 				// }
		// 				// *****</Eventuell miteinbeziehen>****
		// 				}
		// 			},
		// 			{
		// 				type: "note",
		// 				pitch: {
		// 					step: "C",
		// 					type: "eighth",
		// 					alter: 0,
		// 					octave: 5,
		// 					beam: "end"//,
		// 				// ****<Eventuell miteinbeziehen>****
		// 				// timeModification:{
		// 				// 	actualNotes: 3,
		// 				// 	normalNotes: 2,
		// 				// 	normalType: "eight"
		// 				// }
		// 				// *****</Eventuell miteinbeziehen>****
		// 				}
		// 			}//,
		// 			// {
		// 			// 	type: "rest",
		// 			// 	duration: "whole"
		// 			// }
		// 		]
		// 	}
		// )); 


		// rhythm pattern #2: Punktierte Noten
		// $patternValue.val(JSON.stringify(
		// 	{
		// 		type: 1,
		// 		notes: [
		// 			{
		// 				type: "note",
		// 				pitch: {
		// 					step: "F",
		// 					type: "half",
		// 					alter: 0,
		// 					octave: 1,
		// 					dot: true 
		// 				}
		// 			},
		// 			{
		// 				type: "note",
		// 				pitch: {
		// 					step: "F",
		// 					type: "half",
		// 					alter: 0,
		// 					octave: 2,
		// 					dot: true 
		// 				}
		// 			}//,
		// // 			{
		// // 				type: "rest",
		// // 				duration: "whole"
		// // 			} 
		// 		]
		// 	}
		// )); 
	},

	onModeButtonClick = function(event) {
		var modeButtonId = event.target.id;
		// slice -1 gets the last char of the mode id
		patternController.changeMode(modeButtonId.slice(-1));
	},

	onNoteButtonClick = function(event) {
		patternController.changeNote(event.target.id);
	},

	onAccidentialButtonClick = function(event) {
		// console.log($(event.target).text());
		patternController.changeAccidential(event.target.id);
	},

	onDurationButtonClick = function(event) {
		// console.log($(event.target).text());
		patternController.changeDuration(event.target.id);
	},

	onClefButtonClick = function(event) {
		// console.log($(event.target).text());
		patternController.changeClef(event.target.id);
	},

	onSpecialRythButtonClick = function(event) {
		// console.log($(event.target).text());
		patternController.changeSpecialRyth(event.target.id);
	},

	onOctaveButtonClick = function(event) {
		patternController.changeOctave(event.target.id);
	},

	onAddButtonClick = function(event) {
		// console.log("add btn");
		patternController.addNote();
	},

	setPatternValue = function(pattern) {
		$patternValue.val(pattern);
		console.log("pattern changed to: ",$patternValue.val());
	},

	setNoteNameActive = function(noteName) {
		console.log("setNoteNameActive");
		$(".btn-note.active").removeClass("active");
		//$('btn-group-names label.active').removeClass('active');
		$("#" + noteName + "").addClass("active");
	},

	setOctaveActive = function(octave) {
		$(".btn-octave.active").removeClass("active");
		$('btn-group-names label.active').removeClass('active');
		$("#" + octave + "").addClass("active");
	},

	onRemoveButtonClick = function(event) {
		// console.log("remove btn");
		patternController.removeLastNote();
	};

	that.init = init;
	that.setPatternValue = setPatternValue;
	that.setNoteNameActive = setNoteNameActive;
	that.setOctaveActive = setOctaveActive;

	return that;
}