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
	$searchPatternButton = $("#searchPatternButton"),

	$patternValue = $('#patternValue'),

	$breakButton = $("#break"),
	$rhythmBreakButton = $("#rhythmBreak"),

	$rhythmNoteOrBreak = $('#rhythmNoteOrBreak'),
	$noteOrBreak = $('#noteOrBreak'),
	$rhythmNote = $('#rhythmNote'),

	$logMessages = null,
	resultMessageCounter = null,


	init = function() {
		console.info('MusicXMLAnalyzer.PatternView.init');

		patternController = MusicXMLAnalyzer.PatternController();

		$modeButtonClass.on("click", onModeButtonClick);

		$noteButtonClass.on("click", onNoteButtonClick);
		$accidentialButtonClass.on("click", onAccidentialButtonClick);
		$durationButtonClass.on("click", onDurationButtonClick);
		$specialRythButtonClass.on("click", onSpecialRythButtonClick);
		$octaveButtonClass.on("click", onOctaveButtonClick);
		$addNoteButton.on("click", onAddButtonClick);
		$removeNoteButton.on("click", onRemoveButtonClick);
		$breakButton.on('click', onBreakButtonClick);
		$rhythmNoteOrBreak.on('click',onRhythmNoteOrBreakClick);
		$noteOrBreak.on('click', onNoteOrBreakClick);

		$noteOrBreak.show();
		$rhythmNoteOrBreak.hide();

		$searchPatternButton.on('click', onSubmitButtonClick);
		$logMessages = $('#searchMessages');
		resultMessageCounter = 0;

	},

	onNoteOrBreakClick = function(event){
		if(patternController.getCurrentMode() === 2){
// console.log("CURRENT MODE = 2! event.target.id: ",event.target.id );
			if(event.target.id === 'break'){
				$octaveButtonClass.addClass('disabled');
			}else{
				$octaveButtonClass.removeClass('disabled');
			}
		}
	},

	onBreakButtonClick = function(){
		patternController.changeAccidential("none");
		setAccidentialActive("none");
		$accidentialButtonClass.addClass('disabled');
	},

	onModeButtonClick = function(event) {
		var modeButtonId = event.target.id;
		// slice -1 gets the last char of the mode id
		patternController.changeMode(parseInt(modeButtonId.slice(-1)));
	},

	onNoteButtonClick = function(event) {
		console.log("event.target.id: ",event.target.id);
		patternController.changeNote(event.target.id);
		$accidentialButtonClass.removeClass('disabled');
	},

	onRhythmNoteOrBreakClick = function(event){
		console.log("event.target.id: ",event.target.id);
		if(event.target.id === 'rhythmBreak'){

			if($rhythmNote.hasClass('active')){
				console.log("note WAS active");
				patternController.changeNote('break');
			}
		}
		else if(event.target.id === 'rhythmNote'){

			if($rhythmBreakButton.hasClass('active')){
				console.log("break WAS active");
				patternController.changeNote('c');
			}
		}
		
	},

	onAccidentialButtonClick = function(event) {
		var acc = event.target.id;
		acc = acc.substring(acc.indexOf("-") + 1, acc.length);
		patternController.changeAccidential(acc);
	},

	onDurationButtonClick = function(event) {
		patternController.changeDuration(event.target.id);
	},

	onSpecialRythButtonClick = function(event) {
		//get the and of the specRyth String after the -
		var specRyth = event.target.id;
		specRyth = specRyth.substring(specRyth.indexOf("-") + 1, specRyth.length);
		//prevent adding break triplets by disabling the break button
		if(specRyth === "triplet") {
			// check if break button was active
			// if true then set selected note to c
			if($breakButton.hasClass("active") === true) {
				patternController.changeNote("c");
				setNoteNameActive("c");
			}
			$breakButton.addClass("disabled");
		} else {
			$breakButton.removeClass("disabled");
		}
		patternController.changeSpecialRyth(specRyth);
	},

	onOctaveButtonClick = function(event) {
		patternController.changeOctave(event.target.id);
	},

	onAddButtonClick = function() {
		patternController.addNote();
	},

	setPatternValue = function(pattern) {
		$patternValue.val(pattern);
		// console.log("pattern changed to: ",$patternValue.val());
	},

	setNoteNameActive = function(noteName) {
		console.log("setNoteNameActive ", noteName);
		if(patternController.getCurrentMode() != 1){
			$(".btn-note.active").removeClass("active");
			$("#" + noteName + "").addClass("active");
		}

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
		// disable search button
		// (will get enabled after two notes are created)
		$searchPatternButton.prop('disabled', true);

		$noteOrBreak.show();
		$rhythmNoteOrBreak.hide();
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
		// disable search button
		// (will get enabled after two notes are created)
		$searchPatternButton.prop('disabled', true);

		$noteOrBreak.show();
		$rhythmNoteOrBreak.hide();
	},

	setToRhythmMode = function() {
		console.log("pattern view set rhythm");
		$noteButtonClass.addClass('disabled');
		$rhythmBreakButton.removeClass('disabled');
		$rhythmBreakButton.removeClass('active');
		$rhythmNote.removeClass('disabled');
		$rhythmNote.addClass('active');
		$octaveButtonClass.addClass('disabled');
		$accidentialButtonClass.addClass('disabled');

		$durationButtonClass.removeClass('disabled');
		$specialRythButtonClass.removeClass('disabled');
		// disable search button
		// (will get enabled after two notes are created)
		$searchPatternButton.prop('disabled', true);
		patternController.changeOctave(4);
		$noteOrBreak.hide();
		$rhythmNoteOrBreak.show();
	},

	startTripletEnterMode = function() {
		//disable search and remove btn
		$searchPatternButton.addClass('disabled');
		$removeNoteButton.addClass('disabled');
		//disable spec ryth
		$specialRythButtonClass.addClass('disabled');
		//diable duration
		$durationButtonClass.addClass('disabled');
	},

	endTripletEnterMode = function() {
		//enable search and remove btn
		$searchPatternButton.removeClass('disabled');
		$removeNoteButton.removeClass('disabled');
		//enable spec ryth
		$specialRythButtonClass.removeClass('disabled');
		//enable duration
		$durationButtonClass.removeClass('disabled');
	},

	onRemoveButtonClick = function() {
		patternController.removeLastNote();
	},

	onSubmitButtonClick = function() {
		initLogMessages();
		$('body').scrollTop($('body').height());
		addLogMessage("Let's start searching the pattern.");
		window.setTimeout(function() {
			addLogMessage("We're working.");
			window.setTimeout(function() {
				addLogMessage("Please be patient.");
				window.setTimeout(function() {
					addLogMessage("Don't worry we didn't forget you.");
					window.setTimeout(function() {
						addLogMessage("Okay. We're ready soon. We promise.");
						window.setTimeout(function() {
							addLogMessage("Maybe a little coffee?");
						}, 3000);
					}, 3000);
				}, 3000);
			}, 3000);
		}, 3000);
	},

	initLogMessages = function() {
		resultMessageCounter = 0;
		$logMessages.show();
		$logMessages.animate({
			height: 100
		}, 500);
	},

	disposeLogMessages = function() {
		window.setTimeout(function() {
			$logMessages.animate({
				height: 0
			},
			700,
			function() {
				$logMessages.hide();
				$logMessages.empty();
			});
		}, 100);
	},

	addLogMessage = function(msg) {
		$('#log' + (resultMessageCounter - 3)).animate({
			"marginTop": "-30px"
		}, 200);
		$logMessages.append('<div id="log' + resultMessageCounter + '"></div>');
		$('#log' + resultMessageCounter).typed({
			strings: ['<p>' + msg + '</p>'],
			backDelay: 100000000000000,
			typeSpeed: 0,
			backSpeed: 0,
			loop: true,
		});
		resultMessageCounter++;
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
	that.startTripletEnterMode = startTripletEnterMode;
	that.endTripletEnterMode = endTripletEnterMode;

	return that;
};