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
		$xmlPositionArray = array();
		$results = array();
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
			for ($i = 0; $i < count($notes); $i++) {
				$rest = $notes[$i]->rest;
				if(!$rest){
					// 
					// {pitch : {step : "A", alter : 1, octave : 2}}
					$pitch = new stdClass();
					$pitch->step = $notes[$i]->pitch->step;
					$pitch->alter = $notes[$i]->pitch->alter;
					$pitch->octave = $notes[$i]->pitch->octave;

					$note = new stdClass();
					$note->pitch = $pitch;
					$note->voice = $notes[$i]->voice;
					$note->number = $i;
					
					// if voice stays the same
					if($notes[$i]->voice == $notes[$i+1]->voice){
						// push current interval to xmlIntervalArray
						array_push($xmlIntervalArray, PatternController::getInterval($note));
						array_push($xmlPositionArray, $note->number);
						//check if Array-length equals Pattern-length already
						if(count($xmlIntervalArray) == count($patternIntervalArray)){

							// compare arrays
							if(array_values($xmlIntervalArray) == array_values($patternIntervalArray)){
								// create result...
								// var_dump($xmlIntervalArray);
								// var_dump($patternIntervalArray);
								$result = new stdClass();
								$result->file_id = $file_id;
								$result->file_url = $file_url;
								$result->occurences = array();

								//fill occurences
								for ($j = 0; $j < count($xmlPositionArray); $j++) {
									array_push($result->occurences, j);
								}
								//push result
								array_push($results, $result);
							}else{
								unset($xmlIntervalArray[0]);
								unset($xmlPositionArray[0]);
								// reindex xmlIntervalArray
								$xmlIntervalArray = array_values(array_filter($xmlIntervalArray));
								$xmlPositionArray = array_values(array_filter($xmlPositionArray));
							}

						} //if array lengths aren't equal yet, continue	

				}else{ //different voice incoming, unset array, begin from scratch
					unset($xmlIntervalArray);
					unset($xmlPositionArray);
				}
			}
		}

		});

		return Redirect::route('searchResults')
			->with('pattern', $pattern)
			->with('results', $results);

	}

}
