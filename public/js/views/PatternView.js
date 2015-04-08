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

	/**
	 * Init function
	 */
	init = function() {
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

	/**
	 * Method handles the mouseclick event on note- or break button to disable or enable octaves according to mode
	 *
	 * @param {event}    event    click event
	 */
	onNoteOrBreakClick = function(event){
		if(patternController.getCurrentMode() === 2){
			if(event.target.id === 'break'){
				$octaveButtonClass.addClass('disabled');
			}else{
				$octaveButtonClass.removeClass('disabled');
			}
		}
	},

	/**
	 * Method handles the mouseclick event on break button
	 */
	onBreakButtonClick = function(){
		patternController.changeAccidential("none");
		setAccidentialActive("none");
		$accidentialButtonClass.addClass('disabled');
	},

	/**
	 * Method handles the mouseclick event on mode button
	 *
	 * @param {event}    event    click event
	 */
	onModeButtonClick = function(event) {
		var modeButtonId = event.target.id;
		// slice -1 gets the last char of the mode id
		patternController.changeMode(parseInt(modeButtonId.slice(-1)));
	},

	/**
	 * Method handles the mouseclick event on note button
	 *
	 * @param {event}    event    click event
	 */
	onNoteButtonClick = function(event) {
		patternController.changeNote(event.target.id);
		$accidentialButtonClass.removeClass('disabled');
	},

	/**
	 * Method handles the mouseclick event on note or break in rhythm mode to highlight user selection and change the note accordingly
	 *
	 * @param {event}    event    click event
	 */
	onRhythmNoteOrBreakClick = function(event){
		if(event.target.id === 'rhythmBreak'){

			if($rhythmNote.hasClass('active')){
				patternController.changeNote('break');
			}
		}
		else if(event.target.id === 'rhythmNote'){

			if($rhythmBreakButton.hasClass('active')){
				patternController.changeNote('c');
			}
		}
		
	},

	/**
	 * Method handles the mouseclick event on accidentals
	 *
	 * @param {event}    event    click event
	 */
	onAccidentialButtonClick = function(event) {
		var acc = event.target.id;
		acc = acc.substring(acc.indexOf("-") + 1, acc.length);
		patternController.changeAccidential(acc);
	},

	/**
	 * Method handles the mouseclick event on durations
	 *
	 * @param {event}    event    click event
	 */
	onDurationButtonClick = function(event) {
		patternController.changeDuration(event.target.id);
	},

	/**
	 * Method handles the mouseclick event on special rhythm
	 *
	 * @param {event}    event    click event
	 */
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

	/**
	 * Method handles the mouseclick event on ocatave button
	 *
	 * @param {event}    event    click event
	 */
	onOctaveButtonClick = function(event) {
		patternController.changeOctave(event.target.id);
	},

	/**
	 * Method handles the mouseclick event on add button
	 *
	 * @param {event}    event    click event
	 */
	onAddButtonClick = function() {
		patternController.addNote();
	},

	/**
	 * Method sets the pattern values
	 *
	 * @param {object}    pattern    pattern values
	 */
	setPatternValue = function(pattern) {
		$patternValue.val(pattern);
	},

	/**
	 * Method sets the active note
	 *
	 * @param {string}    noteName    name of the note
	 */
	setNoteNameActive = function(noteName) {
		if(patternController.getCurrentMode() != 1){
			$(".btn-note.active").removeClass("active");
			$("#" + noteName + "").addClass("active");
		}

	},

	/**
	 * Method sets the active octave
	 *
	 * @param {string}    octave    name of the octave
	 */
	setOctaveActive = function(octave) {
		$(".btn-octave.active").removeClass("active");
		$("#" + octave + "").addClass("active");
	},

	/**
	 * Method sets the active accidental
	 *
	 * @param {string}    acc    name of the accidental
	 */
	setAccidentialActive = function(acc) {
		$(".btn-accidential.active").removeClass("active");
		$("#accidential-" + acc + "").addClass("active");
	},

	/**
	 * Method sets the active duration
	 *
	 * @param {string}    duration    name of the duration
	 */
	setDurationActive = function(duration) {
		$(".btn-duration.active").removeClass("active");
		$("#" + duration + "").addClass("active");
	},

	/**
	 * Method sets the active special rhythm element
	 *
	 * @param {string}    specRyth    name of the special rhythm element
	 */
	setSpecRythActive = function(specRyth) {
		$(".btn-special-ryth.active").removeClass("active");
		$("#spec-" + specRyth + "").addClass("active");
	},

	/**
	 * Method changes layout according to melody mode
	 */
	setToMelodyMode = function() {
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

	/**
	 * Method changes layout according to sound sequence mode
	 */
	setToSoundSequenceMode = function() {
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

	/**
	 * Method changes layout according to rhythm mode
	 */
	setToRhythmMode = function() {
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

	/**
	 * Method enters triplet creation mode
	 */
	startTripletEnterMode = function() {
		//disable search and remove btn
		$searchPatternButton.addClass('disabled');
		$removeNoteButton.addClass('disabled');
		//disable spec ryth
		$specialRythButtonClass.addClass('disabled');
		//diable duration
		$durationButtonClass.addClass('disabled');
	},

	/**
	 * Method ends triplet creation mode
	 */
	endTripletEnterMode = function() {
		//enable search and remove btn
		$searchPatternButton.removeClass('disabled');
		$removeNoteButton.removeClass('disabled');
		//enable spec ryth
		$specialRythButtonClass.removeClass('disabled');
		//enable duration
		$durationButtonClass.removeClass('disabled');
	},

	/**
	 * Method handles mouse click on remove button
	 */
	onRemoveButtonClick = function() {
		patternController.removeLastNote();
	},

	/**
	 * Method handles mouse click on search button, including a log message box to overcome waiting time
	 */
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

	/**
	 * Method to initiate log messages
	 */
	initLogMessages = function() {
		resultMessageCounter = 0;
		$logMessages.show();
		$logMessages.animate({
			height: 100
		}, 500);
	},

	/**
	 * Method to animate the log message box
	 */
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

	/**
	 * Method to add a log message
	 *
	 * @param {string}    msg    message to be added
	 */
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