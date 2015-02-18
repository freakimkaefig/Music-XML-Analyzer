<?php
require 'SoundSequenzController.php';

class PatternController extends BaseController {
	public function getCreatePattern() {
		return View::make('createPattern');
	}

	public function postPatternSearch() {
		// pattern = pattern
		// type = tonfolge ? thythmus ? melodie?

		//if type = tonfolge
		$ssConntroller = new SoundSequenzController();
		$ssConntroller->search();

		// elseif type = rhythmus
		// $rConntroller = new RhythmController();

		// elseif type = melodie
		// $mConntroller = new MelodyController();
		
	}

}
