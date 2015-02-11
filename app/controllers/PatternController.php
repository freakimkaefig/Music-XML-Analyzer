<?php
require 'SoundSequenzController.php';

class PatternController extends BaseController {
	public function getCreatePattern() {
		// pattern = pattern
		// type = tonfolge ? thythmus ? melodie?

		//if type = tonfolge
		$ssConntroller = new SoundSequenzController();

		// elseif type = rhythmus
		$rConntroller = new RhythmController();

		// elseif type = melodie
		$mConntroller = new MelodyController();


		return View::make('createPattern');	
	}

}
