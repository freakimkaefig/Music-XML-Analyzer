<?php

class SoundSequenzController {

	static $patternIntervalArray;
	static $result;
	static $xmlIntervalArray; 
	static $xmlPositionArray;
	static $results;
	static $exactMatch;
	static $once;
	static $noteCounter;

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

			self::$once = true;
			self::$xmlIntervalArray = array(); 
			self::$xmlPositionArray = array();
			self::$result = new stdClass();
			self::$result->occurences = array();

			$parts = $xml->xpath("//part");
			// $parts = preg_replace("/[^a-zA-Z0-9_ %\[\]\.\(\)%&-]/s", '', $parts);
			// var_dump($parts);

			// echo "<hr><br>";

			foreach($parts as $part){
				self::$noteCounter = 0;

				//traverse §notes[]
				for ($i = 0; $i < count($part->measure)-1; $i++) {
					for($j = 0; $j < count($part->measure[$i]->note); $j++){
						$n = $part->measure[$i]->note[$j];
						
						//set lastVoice at beginning of xml file
						if(self::$once){
							self::$once = false;
							$lastVoice = $part->measure[$i]->note[$j]->voice;
						}
						
						if(!isset($n->rest)){

							$pitch = new stdClass();
							$pitch->step = $n->pitch->step;
							$pitch->alter = $n->pitch->alter;
							$pitch->octave = $n->pitch->octave;

							$note = new stdClass();
							$note->pitch = $pitch;
							$note->voice = $n->voice;
							$note->position = 	self::$noteCounter = 0;;
						// var_dump($note);
						// echo "<hr><br>";

							// if voice stays the same
							if((int)$n->voice == (int)$lastVoice){
								// push current interval to xmlIntervalArray
								array_push(self::$xmlIntervalArray, PatternController::getInterval($note));
								array_push(self::$xmlPositionArray, $note->position);
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
										$occ->part_id = (string)$part['id'];
										// var_dump($occ);
										array_push(self::$result->occurences, $occ);

										//reset arrays
										self::$xmlIntervalArray = array();
										self::$xmlPositionArray = array();

									}else{

										self::$xmlIntervalArray = array_splice(self::$xmlIntervalArray, 1);

										self::$xmlPositionArray = array_splice(self::$xmlPositionArray, 1);

										self::$xmlIntervalArray = array_values(self::$xmlIntervalArray);

										self::$xmlPositionArray = array_values(self::$xmlPositionArray);

										// self::$result = new stdClass();
										// self::$result->occurences = array();

									}

								} //if array lengths aren't equal yet, continue	

								// save current voice for comparison with next note
								$lastVoice = $n->voice;
							}
							else{ //different voice incoming next; unset array; begin from scratch
								$lastVoice = $part->measure[$i]->note[$j]->voice;
								$j--;
								self::$xmlIntervalArray = array(); 
								self::$xmlPositionArray = array();
							}
						}
					} //end of foreach(notes as note){blabla}
				}
			} //end of foreach(parts as part)

			// check if result->occ is empty
			if(!empty(self::$result->occurences)){
				//push result
				array_push(self::$results, self::$result);
			}

		});
		return self::$results;
// echo "<br>";
// 		var_dump(self::$results);
// 		if(empty(self::$results)){

// 		echo "result is empty!";
// 		}
// echo "<hr>";
		// bla;
	}

}
