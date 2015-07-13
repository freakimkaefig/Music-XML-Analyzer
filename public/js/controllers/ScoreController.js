/** @constructor */
MusicXMLAnalyzer.ScoreController = function(){

	var that = {},

	view = null,
	once = true,
	once2 = true,
	stop = false,
	tonika = { 'C':0, 'D':2, 'E':4, 'F':5, 'G':7, 'A':9, 'B':11 },
	$scoreValue = null,
	scoreData = null,

	/**
	 * Init method of ScoreController
	 * @function
     * @public
	 */
	init = function() {
		console.info("MusicXMLAnalyzer.ScoreController.init");
		view = MusicXMLAnalyzer.ScoreView();
		view.init();

		$scoreValue = $('#scoreValue');

		MIDI.loadPlugin({
			soundfontUrl: "../../libs/midijs/soundfont/",
			instrument: "acoustic_grand_piano",
			callback: function() {
			}
		});

		$playScore = $('#playScore');
		$stopScore = $('#stopScore');	

		$stopScore.prop('disabled', true);

		$playScore.click(function(){
			stop = false;
			once2 = true;
			once = true;
			playScore();
			$playScore.prop('disabled', true);
			$stopScore.prop('disabled', false);
		});

		$stopScore.click(function(){
			stop = true;
			$playScore.prop('disabled', false);
			$stopScore.prop('disabled', true);
		});

	}, //end init

	/**
	 * Function to get Duration of Notes
	 * @function
     * @public
	 *
	 * @param 	{string} 	type 	The note type
	 *
	 * @retrun 	{float} 	The duration of the note as float
	 */
	getDuration = function(type){
		var duration;

		if (type == "whole"){
			duration = 1;
		} else if (type === "half") {
			duration = 0.5;
		} else if (type === "quarter") {
			duration = 0.25;
		} else if (type === "eighth") {
			duration = 0.125;
		} else if (type === "16th") {
			duration = 0.0625;
		} else if (type === "32nd") {
			duration = 0.03125;
		} else if (type === "64th") {
			duration = 0.015625;
		}

		return duration;
	},

		/**
	 * Method to get MIDI-Values
	 * @function
     * @public
	 *
	 * @param 	{string} 	step 	The note step
	 * @param 	{string} 	octave 	The notes octave
	 * @param 	{string} 	alter 	The alter value
	 *
	 * @return 	{number} 	The MIDI value
	 */
	getMidiValue = function(step, octave, alter) {
		return (parseInt(octave) * 12) + (tonika[step] + parseInt(alter));
	},

	/**
	* Method to play the created Pattern
	 * @function
     * @public
	*/
	playScore = function() {
		var notesToBePlayed = [];

		//get notes of current score part:
		// var currentPatternNotes = patternModel.getAllNoteElements();
		scoreData = JSON.parse($scoreValue.val());

		MIDI.setVolume(0, 127);

		//determine MIDI values for scoreData
		for(var i = 0; i < scoreData.measures.length; i++){
			for(var j = 0; j < scoreData.measures[i].notes.length; j++){
				// check if rest
				if(scoreData.measures[i].notes[j].type === 'rest'){
					var rest = scoreData.measures[i].notes[j];
					var restDuration = getDuration(scoreData.measures[i].notes[j].duration);
					notesToBePlayed.push({'note': 0, 'noteDuration': restDuration});
				}
				else if(scoreData.measures[i].notes[j].type === 'note'){
					var note = scoreData.measures[i].notes[j];
					var noteDuration = (getDuration(note.pitch.type) !== undefined ? getDuration(note.pitch.type) : 0.25);
					var noteStep = (note.pitch.step !== undefined ? note.pitch.step : 'C');
					var noteOctave = (note.pitch.octave !== undefined ? note.pitch.octave : 4);
					var noteAlter = (note.pitch.alter !== undefined ? note.pitch.alter : 0);
					var noteBeam = (note.pitch.beam !== undefined ? note.pitch.beam : false);

					if (note.pitch.dot) {
						noteDuration += 0.5 * noteDuration;
					}

					var midiNote = getMidiValue(noteStep, noteOctave, noteAlter);
					notesToBePlayed.push({'note': midiNote, 'noteDuration': noteDuration, 'noteBeam' : noteBeam});
				}
			}
		}

		i = 0;
		var playTune = function() {

			if(i < notesToBePlayed.length){
				var note = notesToBePlayed[i].note;
				// how hard the note gets hit
				var velocity = 100;
				// delay is set to fix value
				var delay = 0;
				var timeout = 0;
				if(!once){
					timeout = notesToBePlayed[i-1].noteDuration*2000;
					if(notesToBePlayed[i-1].noteBeam === "begin" || notesToBePlayed[i-1].noteBeam === "continue" ||
						notesToBePlayed[i-1].noteBeam === "end") {
						timeout = (timeout * 2) / 3;
					}
				}
				once = false;

				setTimeout(function(){
					if(stop){
						i = notesToBePlayed.length;
					}
					else{
						if(i === notesToBePlayed.length -1){
								MIDI.noteOn(0, note, velocity, delay);
								MIDI.noteOff(0, note, delay + 0.75);
						}
						else{
							MIDI.noteOn(0, note, velocity, delay);
							MIDI.noteOff(0, note, delay + 0.75);
						}
						i++;
					}
					// recursively call playTune()
					playTune();
				 }, timeout);
			}
			// else when finished - reset play&stop buttons after 1.5 sec
			else{
				setTimeout(function(){

					$playScore.prop('disabled', false);
					$stopScore.prop('disabled', true);
				}, 1500);
			}
		};
		if(once2){
			once2 = false;
			playTune();
		}
	};

	that.init = init;

	return that;
}