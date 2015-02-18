<?php

class SoundSequenzController {

	function __construct() {
	
		// echo "<br><br><br>CREATED NEW SoundSequenzController!";
	}

	public function search($pattern) {
		$p = json_decode($pattern);
		// $patternLength = count($p);
		$patternIntervalArray = array();
		$xmlIntervalArray = array();
		// var_dump($patternLength);
		foreach ($p as $note) {
			
			//get note intervals of pattern
			$interval = PatternController::getInterval($note);
			array_push($patternIntervalArray, $interval);
		}

		//get user uploads & file_id's & file_url
		$user = User::find(Cookie::get('user_id'));
		$user->uploads->each(function($upload) {
			$xml = simplexml_load_file($upload->url);
			$file_id = $upload->id;
			$file_url = $upload->url;

			//get notes of xml file
			$notes = $xml->xpath("//note");

			//traverse §notes[]
			for ($i = 0; $i <= count($notes); $i++) {
				$rest = $notes[$i]->rest;
				if(!$rest){
					// 
					// {pitch : {step : "A", alter : 1, octave : 2}}
					$pitch = new stdClass();
					$pitch->step = $notes[$i]->pitch->step;
					$pitch->alter = $notes[$i]->pitch->alter;
					$pitch->octave = $notes[$i]->pitch->octave;

					// 
					// $pitch->voice = $notes[$i]-->voice;
					// STIMME ABGLEICHEN? (siehe unten)
					// 

					// var_dump($pitch);
					array_push($xmlIntervalArray, PatternController::getInterval($note));

					// check if first XMLinterval equals first patternInterval
					if($xmlIntervalArray[0] == $patternIntervalArray[0]){
						// cool? SINN?
						// STIMME ABGLEICHEN?
						// 
					}
					else{ 
						// delete this interval from xmlIntervalArray
						// DA NICHT BENÖTIGT!
						unset($xmlIntervalArray[0]);
					}

					// 
					// HIER WIEDER ANSETZEN?
					// 
					// //check if Array-length equals Pattern-length
					// if(count($xmlIntervalArray) == count($patternIntervalArray)){
					// 	//if so, compare intervals
					// 	for ($i = 0; $i <= count($xmlIntervalArray); $i++) {
					// 		if($xmlIntervalArray[$i] == $patternIntervalArray[$i]){

					// 		}
					// 	}
					// }



				}
			}



		});

		//Dummy result
		// $results = array(
		// 	(object)array(
		// 		"file_id" => 4,
		// 		"file_url" => "http://music-xml-analyzer.local/uploads/90/ActorPreludeSample.xml",
		// 		"occurences" => array(2, 7)
		// 	)
		// );
		//return $results;
	}

}
