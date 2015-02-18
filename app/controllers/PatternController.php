<?php
require 'SoundSequenzController.php';

class PatternController extends BaseController {

	$tonika = array("C" => 0,
						"D" => 2,
						"E" => 4,
						"F" => 5,
						"G" => 7,
						"A" => 9,
						"B" => 11);

	public function getCreatePattern() {
		return View::make('createPattern');

		// TESTING
		// $pattern = '[{"name":"c","accidential":"none","duration":"1/1","rythSpecial":"None","octave":"2"}]';
		// return Redirect::route('patternSearch', array('pattern' => $pattern));
	}

	public function postPatternSearch() {
		// pattern = pattern
		// type = tonfolge ? thythmus ? melodie?

		//if type = tonfolge
		$ssConntroller = new SoundSequenzController();
		return ($ssConntroller->search(Input::get('pattern')));

		// elseif type = rhythmus
		// $rConntroller = new RhythmController();

		// elseif type = melodie
		// $mConntroller = new MelodyController();
	}

	public function getIntervall($n){
		$note = $n;
		$rest = $note->rest;
			if(!$rest){
				// echo "rest is null<br/>";
				$noteStep = $note->pitch->step;
				$noteAlter = $note->pitch->alter;
				$noteOctave = $note->pitch->octave;

				if($noteStep && $noteOctave){
					$noteValue = $tonika[(string)$noteStep];
					if($noteAlter){
						$noteValue = (int)$noteValue + (int)$noteAlter;
					}
					$noteValue = (int)$noteOctave * 12 + (int)$noteValue;
					// array befüllen
					// array_push($notesArray, $noteValue);
				}
			}
			if($noteValue){
				return $noteValue;
			}else{
				return 0;
			}
	}

}
