<?php

class SoundSequenzController {

	static $patternIntervalArray;
	static $xmlIntervalArray; 
	static $xmlPositionArray;
	static $results;

	function __construct() {
	
	}

	public function search($pattern) {
		$p = $pattern->notes;
		// $patternLength = count($p);
		self::$patternIntervalArray = array();
		self::$results = array();
		// var_dump($patternLength);
		foreach ($p as $note) {
			
			//get note intervals of pattern
			$interval = PatternController::getInterval($note);
			array_push(self::$patternIntervalArray, $interval);
		}

		//get user uploads & file_id's & file_url
		$user = User::find(Cookie::get('user_id'));
		$user->uploads->each(function($upload) {
			$xml = simplexml_load_file($upload->url);
			$file_id = $upload->id;
			$file_url = $upload->url;

			self::$xmlIntervalArray = array(); 
			self::$xmlPositionArray = array();
			//get notes of xml file
			$notes = $xml->xpath("//note");

			//traverse §notes[]
			for ($i = 0; $i < count($notes); $i++) {
				$rest = $notes[$i]->rest;
				if(!$rest){
					// dirty example of a pattern:
					// {pitch : {step : "A", alter : 1, octave : 2}}
					$pitch = new stdClass();
					$pitch->step = $notes[$i]->pitch->step;
					$pitch->alter = $notes[$i]->pitch->alter;
					$pitch->octave = $notes[$i]->pitch->octave;

					$note = new stdClass();
					$note->pitch = $pitch;
					$note->voice = $notes[$i]->voice;
					$note->position = $i;

					// if voice stays the same
					if((int)$notes[$i]->voice == (int)$notes[$i+1]->voice){
						// push current interval to xmlIntervalArray
						array_push(self::$xmlIntervalArray, PatternController::getInterval($note));
						array_push(self::$xmlPositionArray, $note->position + 1);
						//check if Array-length equals Pattern-length already
						if(count(self::$xmlIntervalArray) == count(self::$patternIntervalArray)){
							// compare arrays
							if(array_values(self::$xmlIntervalArray) == array_values(self::$patternIntervalArray)){
								// create result
								$result = new stdClass();
								$result->file_id = $file_id;
								$result->file_url = $file_url;
								$result->occurences = array();


								//fill with occurences
								for ($j = 0; $j < count(self::$xmlPositionArray); $j++) {
									array_push($result->occurences, self::$xmlPositionArray[$j]);
								}
								//push result
								array_push(self::$results, $result);

								//reset arrays
								self::$xmlIntervalArray = array();
								self::$xmlPositionArray = array();

							}else{
								// echo "<br><hr>";
								// echo "######## array values dont match ######### <br>";
								// unset(self::$xmlIntervalArray[0]);
								// $z = self::$xmlIntervalArray[0];
								// self::$xmlIntervalArray = array_merge(array_diff(self::$xmlIntervalArray, array($z)));
								self::$xmlIntervalArray = array_splice(self::$xmlIntervalArray, 0, 0);
								// unset(self::$xmlPositionArray[0]);
								// $zz = self::$xmlPositionArray[0];
								// self::$xmlPositionArray = array_merge(array_diff(self::$xmlPositionArray, array($zz)));
								self::$xmlPositionArray = array_splice(self::$xmlPositionArray, 0, 0);
								
								// echo "xmlIntervalArray[0] unset: <br>";
								// var_dump(self::$xmlIntervalArray);
								// echo "<br><br>length of xmlPositionArray: ".count(self::$xmlPositionArray)."<br>";
								// echo "xmlPositionArray[0] unset: <br>";
								// var_dump(self::$xmlPositionArray);
								
								// reindex xmlIntervalArray
								// self::$xmlIntervalArray = array_values(array_filter(self::$xmlIntervalArray));
								self::$xmlIntervalArray = array_values(self::$xmlIntervalArray);
								// self::$xmlPositionArray = array_values(array_filter(self::$xmlPositionArray));
								self::$xmlPositionArray = array_values(self::$xmlPositionArray);
								
								// echo "<br><br><br>xmlIntervalArray positions sorted:<br>";
								// var_dump(self::$xmlIntervalArray);
								// echo "<br";
								// echo "<br><br><br>xmlPositionArray positions sorted:<br>";
								// var_dump(self::$xmlPositionArray);
								// echo "<br><hr>";
							}

						} //if array lengths aren't equal yet, continue	

					}else{ //different voice incoming next; unset array; begin from scratch
						// unset(self::$xmlIntervalArray);
						// unset(self::$xmlPositionArray);
						self::$xmlIntervalArray = array(); 
						self::$xmlPositionArray = array();
					}
				}
			} //end of foreach(notes as note){blabla}

		});
		return self::$results;
// echo "<br>";
// 		var_dump(self::$results);
// echo "<hr>";
// 		bla;
	}

}
