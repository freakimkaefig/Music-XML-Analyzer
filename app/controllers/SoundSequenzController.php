<?php

class SoundSequenzController {

	function __construct() {
	
		echo "<br><br><br>CREATED NEW SoundSequenzController!";
	}

	public function search($pattern) {
		var_dump($pattern);

		$results = array(
			0 => (object)array("Test" => true)
		);
	}

}
