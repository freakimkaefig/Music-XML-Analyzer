<?php

class SoundSequenzController {

	static $patternIntervalArray;
	static $xmlIntervalArray; 
	static $xmlPositionArray;
	static $results;
	static $exactMatch;
	static $result;

	function __construct() {
	
	}

	public function search($pattern) {
		$p = $pattern->notes;
		// $exactMatch = $pattern->exact;
		// 
		// NICE TO HAVE: 
		// if !exactMatch: 
		// #intervall differenzen aus pattern berechnen
		// #differenzen vergleichen mit 
		// 

		self::$patternIntervalArray = array();
		self::$results = array();

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
			self::$result = new stdClass();
			self::$result->occurences = array();
			//get notes of xml file
			$notes = $xml->xpath("//note");

			//traverse §notes[]
			for ($i = 0; $i < count($notes); $i++) {
				$rest = $notes[$i]->rest;
				if(!$rest){

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
								self::$result->file_id = $file_id;
								self::$result->file_url = $file_url;

		// Dummy results
		// $results = array(
		// 	(object)array(
		// 		"file_id" => 4,
		// 		"file_url" => "http://music-xml-analyzer.local/uploads/90/ActorPreludeSample.xml",
		// 		"occurences" => array(
		// 			(object)array('start' => 2, 'end' => 3, 'voice' => 1),
		// 			(object)array('start' => 7, 'end' => 12, 'voice' => 2)
		// 		)
		// 	)
		// );
								//fill with occurences
								$occ = new stdClass();
								$occ->start = reset(self::$xmlPositionArray);
								$occ->end = end(self::$xmlPositionArray);
								$occ->voice = (int)$note->voice;

								array_push(self::$result->occurences, $occ);

								//reset arrays
								self::$xmlIntervalArray = array();
								self::$xmlPositionArray = array();

							}else{

								self::$xmlIntervalArray = array_splice(self::$xmlIntervalArray, 0, 0);

								self::$xmlPositionArray = array_splice(self::$xmlPositionArray, 0, 0);

								self::$xmlIntervalArray = array_values(self::$xmlIntervalArray);

								self::$xmlPositionArray = array_values(self::$xmlPositionArray);

							}

						} //if array lengths aren't equal yet, continue	

					}
					else{ //different voice incoming next; unset array; begin from scratch

						self::$xmlIntervalArray = array(); 
						self::$xmlPositionArray = array();
					}
				}
			} //end of foreach(notes as note){blabla}
			
			//push result
			array_push(self::$results, self::$result);

		});
		return self::$results;
// echo "<br>";
// 		var_dump(self::$results);
// echo "<hr>";
// 		bla;
	}

}
