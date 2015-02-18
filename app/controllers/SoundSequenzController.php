<?php

class SoundSequenzController {

	function __construct() {
	
		echo "<br><br><br>CREATED NEW SoundSequenzController!";
	}

	public function search() {
		$pattern = array(
			0 => (object)array("step" => 'A', 'accidental' => 'sharp', 'octave' => 2)
		);

		$results = array(
			0 => (object)array("Test" => true)
		);

		return Redirect::route('search_results', array('pattern' => $pattern, 'results' => $results));
	}

}
