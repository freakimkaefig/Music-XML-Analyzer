<?php
require 'SoundSequenzController.php';

class PatternController extends BaseController {

	

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

	public static function getInterval($n){
		$tonika = array("C" => 0,"D" => 2,"E" => 4,"F" => 5,"G" => 7,"A" => 9,"B" => 11);
		$note = $n;
		// $note = str_replace("[", "", $n);
		// $note = str_replace("]", "", $note);
		// $note = str_replace("\\", "", $note);
		// var_dump($note);
		$obj_arr = (array)$note;
		if(!isset($obj_arr["rest"])){


			$noteStep = $note->pitch->step;
			$noteAlter = $note->pitch->alter;
			$noteOctave = $note->pitch->octave;

			if($noteStep && $noteOctave){
				$noteValue = $tonika[(string)$noteStep];
				if($noteAlter == 1 || $noteAlter == -1){
					$noteValue = (int)$noteValue + (int)$noteAlter;
				}
				$noteValue = (int)$noteOctave * 12 + (int)$noteValue;
			}
			if($noteValue){
				return $noteValue;
			}else{
				return 0;
			}
		}

	}

}
