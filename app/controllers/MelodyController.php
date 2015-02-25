<?php

class MelodyController {

	function __construct() {
	

	}

	public function search($pattern) {
// dummy melody pattern:
// {type: 2, melody: [{note : {step : "C", type : "half", alter : 0, octave : 3}}, rest : { rest : { duration : 10}}]}));
	
		$p = $pattern->melody;

echo "<br>";
var_dump($p);
echo "<hr>";

		bla

	}
}
