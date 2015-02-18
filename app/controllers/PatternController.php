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

}
