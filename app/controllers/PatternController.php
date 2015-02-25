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

		// var_dump($pattern);

		switch ($pattern->type) {
			case 0:
				// Type == Tonfolge
				$ssConntroller = new SoundSequenzController();
				$results = $ssConntroller->search($pattern);
				break;
			case 1:
				// Type == Rhythmus
				$rConntroller = new RhythmController();
				// $results = $rConntroller->search($pattern);
				break;
			case 2:
				// Type == Melodie
				$mConntroller = new MelodyController();
				$results = $mConntroller->search($pattern);
				break;
		}

		// $results = array(
		// 	(object)array(
		// 		"file_id" => 21,
		// 		"file_url" => "http://music-xml-analyzer.local/uploads/133/ActorPreludeSample.xml",
		// 		"occurences" => array(
		// 			(object)array('start' => 7, 'end' => 8, 'voice' => 1, 'part_id' => "P1"),
		// 			(object)array('start' => 7, 'end' => 9, 'voice' => 1, 'part_id' => "P2")
		// 		)
		// 	)
		// );
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

				return $noteValue;
			}
			// if($noteValue){
			// }
			else{
				return null;
			}
		}

	}

}
