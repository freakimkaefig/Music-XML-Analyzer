<?php

class SoundSequenzController {

	function __construct() {
	
		echo "<br><br><br>CREATED NEW SoundSequenzController!";
	}

	public function search($pattern) {
		// var_dump($pattern);

		$results = "Test";

		return Redirect::route('searchResults')
			->with('pattern', $pattern)
			->with('results', "Test");
	}

}
