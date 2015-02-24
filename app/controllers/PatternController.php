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
				// $results = $ssConntroller->search($pattern);
				break;
			case 2:
				// Type == Melodie
				$rConntroller = new MelodyController();
				// $results = $ssConntroller->search($pattern);
				break;
		}

		$results = array(
			(object)array(
				"file_id" => 21,
				"file_url" => "http://music-xml-analyzer.local/uploads/133/ActorPreludeSample.xml",
				"occurences" => array(
					(object)array('start' => 7, 'end' => 8, 'voice' => 1, 'part_id' => "P1"),
					(object)array('start' => 7, 'end' => 9, 'voice' => 1, 'part_id' => "P2")
				)
			)
		);
		Cache::put('pattern', $pattern, 60*24);
		Cache::put('results', $results, 60*24);

		return Redirect::route('searchResults')
			->with('pattern', $pattern)
			->with('results', $results);
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
