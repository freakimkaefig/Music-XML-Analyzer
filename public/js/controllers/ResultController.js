/** @constructor */
MusicXMLAnalyzer.ResultController = function(){

	var that = {},

	model = null,
	view = null,
	once = true,
	once2 = true,
	stop = false,
	tooLong = false,
	tonika = { 'C':0, 'D':2, 'E':4, 'F':5, 'G':7, 'A':9, 'B':11 },

	/**
	 * Init method of ResultController
	 * @function
     * @public
	 */
	init = function(){
		model = MusicXMLAnalyzer.ResultModel();
		$(model).on('resultExtractReceived', onResultExtractReceived);
		model.init();

		view = MusicXMLAnalyzer.ResultView();
		$(view).on('addResultItem', onAddResultItem);
		view.init();

		//init MIDI
		MIDI.loadPlugin({
			soundfontUrl: "../../../libs/midijs/soundfont/",
			instrument: "acoustic_grand_piano",
			callback: function() {
			}
		});

		$playResult = $('.playResult');
		$stopResult = $('.stopResult');

		$stopResult.prop('disabled', true);

		$playResult.click(function(){
			stop = false;
			once2 = true;
			once = true;
			playResult();
			$playResult.prop('disabled', true);
			$stopResult.prop('disabled', false);
		});

		$stopResult.click(function(){
			stop = true;
			$playResult.prop('disabled', false);
			$stopResult.prop('disabled', true);
		});

		$(document).ajaxStop(onModelReady);
	},

	/**
	 * Method to add results to model
	 * @function
     * @private
	 *
	 * @param {event}    event 		the triggered event
	 * @param {int}      numItems   number of items
	 * @param {object}   result     contains results
	 */
	onAddResultItem = function(event, numItems, result) {
		model.setNumItems(numItems);
		model.addResultItem(result);
	},

	/**
	 * Method to pass result to view
	 * @function
     * @private
	 *
	 * @param {event}	event 	the triggered event
	 * @param {int}    	index 	the result index
	 * @param {object}	data 	the result data
	 */
	onResultExtractReceived = function(event, index, data) {
		view.renderResultExtract(index, data);
	},

	/**
	 * Callback when model has loaded results
	 * @function
     * @private
	 *
	 * @param 	{Event} 	event 	The triggered event
	 */
	onModelReady = function(event) {
		view.setModelReady();
	},

	/**
	 * Function to get note durations
	 * @function
     * @private
	 *
	 * @param 	{string} 	type 	The note type
	 */
	getDuration = function(type){
		var duration;

		if (type == "whole"){
			duration = 1;
		} else if (type == "half") {
			duration = 0.5;
		} else if (type == "quarter") {
			duration = 0.25;
		} else if (type == "eighth") {
			duration = 0.125;
		} else if (type == "16th") {
			duration = 0.0625;
		} else if (type == "32nd") {
			duration = 0.03125;
		} else if (type == "64th") {
			duration = 0.015625;
		}

		return duration;
	},

	/**
	 * Function to get MIDI values
	 * @function
     * @private
	 *
	 * @param {int}    step 	the notes step
	 * @param {int}    octave 	the notes octave
	 * @param {int}    alter 	the notes accidential (as alter)
	 *
	 * @return {int}    the MIDI value
	 */
	getMidiValue = function(step, octave, alter) {
		return (parseInt(octave) * 12) + (tonika[step] + parseInt(alter));
	},

	/**
	 * Function to play the found Pattern
	 * @function
     * @private
	 */
	playResult = function(){
		var notesToBePlayed = [];

		//get notes of current extract:
		var currentResultNotes = JSON.parse($('#extract-carousel').find('div.carousel-inner').find('div.item.active').find('.resultExtract').val());

		MIDI.setVolume(0, 127);

		//determine MIDI values for currentResultNotes
		for(var i = 0; i < currentResultNotes.measures.length; i++){
			if (currentResultNotes.measures[i].notes) {
				for(var j = 0; j < currentResultNotes.measures[i].notes.length; j++){
					// check if rest
					if(currentResultNotes.measures[i].notes[j].type == 'rest'){
						var rest = currentResultNotes.measures[i].notes[j];
						var restDuration = getDuration(currentResultNotes.measures[i].notes[j].duration);
						notesToBePlayed.push({'note': 0, 'noteDuration': restDuration});

					}else if(currentResultNotes.measures[i].notes[j].type == 'note'){
						var note = currentResultNotes.measures[i].notes[j];
						var noteStep = note.pitch.step;
						var noteOctave = note.pitch.octave;
						var noteAlter = note.pitch.alter;
						var noteDuration = getDuration(note.pitch.type);
						var noteTuplet = note.pitch.tuplet;
						if(typeof noteDuration === 'undefined'){
							noteDuration = 0.25;
						}
						if(note.pitch.dot){
							noteDuration += 0.5*noteDuration;
						}
						if(typeof noteTuplet === 'undefined'){
							console.log("beam is undefined");
							noteTuplet = false;
						}
						var chord = note.pitch.chord;

						var midiNote = getMidiValue(noteStep, noteOctave, noteAlter);

						notesToBePlayed.push({'note': midiNote, 'noteDuration': noteDuration, 'chord': chord, 'noteTuplet' : noteTuplet});
					}
				}
			}
		}
		var i = 0;
		playTune = function(){

			var chordsToBePlayed = [];

			if(i < notesToBePlayed.length) {
				var note = notesToBePlayed[i].note;
				var noteDuration = notesToBePlayed[i].noteDuration;
				var velocity = 127; // how hard the note hits
				var delay = 0;
				var timeout = 0;
				if(!once){
					timeout = notesToBePlayed[i-1].noteDuration*2000;
					if(notesToBePlayed[i-1].noteTuplet == 3) {
						timeout = (timeout * 2) / 3;
					}
				}
				once = false;

				setTimeout(function() {
					if(stop){
						i = notesToBePlayed.length;
					}else{

						if(i + 1 < notesToBePlayed.length) {
							tooLong = false;
						}else{
							tooLong = true;
						}

						if(!tooLong && notesToBePlayed[i].chord == false && notesToBePlayed[i + 1].chord == true) {
							do{
								chordsToBePlayed.push(notesToBePlayed[i].note);
								i++;
							}while(notesToBePlayed[i] && notesToBePlayed[i].chord == true && i < notesToBePlayed.length)
							MIDI.chordOn(0, chordsToBePlayed, velocity, delay);
							MIDI.chordOff(0, chordsToBePlayed, delay + 0.75);
						}
						else{
							MIDI.noteOn(0, note, velocity, delay);
							MIDI.noteOff(0, note, delay + 0.75);
							i++;
						}
						MIDI.Player.stop();
					}
					// recursively call playTune()
					playTune();
				 }, timeout);
			}
			// else when finished - reset play&stop buttons after 1.5 sec
			else{
				setTimeout(function(){
					$playResult.prop('disabled', false);
					$stopResult.prop('disabled', true);
				}, 1500);
			}
		}
		if(once2){
			once2 = false;
			playTune();
		}
	};

	that.init = init;

	return that;
}