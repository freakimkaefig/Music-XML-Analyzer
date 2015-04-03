<?php
require 'SoundSequenzController.php';

class PatternController extends BaseController {

	public function getCreatePattern() {
		Cache::forget('pattern');
		Cache::forget('results');
		Cache::forget('duration');
		return View::make('createPattern');

		// TESTING
		// $pattern = '[{"name":"c","accidential":"none","duration":"1/1","rythSpecial":"None","octave":"2"}]';
		// return Redirect::route('patternSearch', array('pattern' => $pattern));
	}

	public function postPatternSearch() {
		$time = 60*24;

		$pattern = Input::get('pattern');
		$pattern = json_decode($pattern);

		Debugbar::info($pattern);

		switch ($pattern[0]->type) {
			case 0:
				// Type == Tonfolge
				$ssConntroller = new SoundSequenzController();
				$results = $ssConntroller->search($pattern);
				break;
			case 1:
				// Type == Rhythmus
				$rConntroller = new RhythmController();
				$results = $rConntroller->search($pattern);
				break;
			case 2:
				// Type == Melodie
				$mConntroller = new MelodyController();
				$results = $mConntroller->search($pattern);
				break;
		}
		

		Cache::put('pattern', $pattern, $time);
		Cache::put('results', $results, $time);

		$duration = Input::get('duration');
		$duration = json_decode($duration);
		Debugbar::info($duration);
		Cache::put('duration', $duration, $time);

		return Redirect::route('searchResults');
	}

	public static function getInterval($n){
		$tonika = array("C" => 0,
						"D" => 2,
						"E" => 4,
						"F" => 5,
						"G" => 7,
						"A" => 9,
						"B" => 11);
		$note = $n;
		$obj_arr = (array)$note;
// echo "<br><hr><br> GET-INTERVAL note:<br>";
// var_dump($obj_arr);
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
// echo "<br><br>calc. INTERVAL: <br>";
// var_dump($noteValue);
				return $noteValue;
			}
			else{
				
				return null;
			}
		}else{
				return null;
		}

	}

}
