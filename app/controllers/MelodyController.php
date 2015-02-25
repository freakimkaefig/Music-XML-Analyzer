<?php

class MelodyController {

	static $result;
	static $results;
	static $patternArray;
	static $xmlArray;
	static $xmlPositionArray;
	static $once;
	static $restDuration;

	function __construct() {
	

	}

	public function search($pattern) {
// dummy melody pattern:
// melody: [
// 	{
// 		type: "note",
//		pitch :
//			{
//				step: "C",
//				type: "half",
//				alter: 0,
//				octave: 3
//			}
// 	},
// 	{ 
// 		type: "rest",
// 		duration: "16th"
// 	}
// ]
	
		$p = $pattern->melody;

		self::$patternArray = array();
		self::$results = array();

		//get note intervals of pattern
		foreach ($p as $note) {
			if($note->type == "note"){
				$interval = PatternController::getInterval($note);
				array_push(self::$patternArray, $interval);
			}else{
				array_push(self::$patternArray, $note->duration);
			}
		}

		//get user uploads & file_id's & file_url
		$user = User::find(Cookie::get('user_id'));
		$user->uploads->each(function($upload) {
			$xml = simplexml_load_file($upload->url);
			$file_id = $upload->id;
			$file_url = $upload->url;

			self::$once = true;
			self::$xmlArray = array(); 
			self::$xmlPositionArray = array();
			self::$result = new stdClass();
			self::$result->occurences = array();

			$parts = $xml->xpath("//part");


			foreach($parts as $part){
				for($i = 0; $i < count($part->measure) - 1; $i++){
					
					if($i == 0){
						//get division for calculation of rest duration once
						$partDivision = $part->measure[$i]->attributes->divisions;
						//get beat-type for calculation of rest duration once
						$partBeatType = $part->measure[$i]->attributes->time->{'beat-type'};
					}

					//get beat-type changes within measures
					if($i>0){ //no changes within first round
						// if changes occure
						if(isset($part->measure[$i]->attributes->time->{'beat-type'})){
							// get changes
							$partBeatType = $part->measure[$i]->attributes->time->{'beat-type'};
						}
					}

					$n = $part->measure[$i]->note;

					if(self::$once){
						self::$once = false;
						$lastVoice = $part->measure[$i]->note->voice;
					}

					if((int)$n->voice == (int)$lastVoice){
						$pitch = new stdClass();
						$pitch->step = $n->pitch->step;
						$pitch->alter = $n->pitch->alter;
						$pitch->octave = $n->pitch->octave;

						$note = new stdClass();
						$note->pitch = $pitch;
						$note->voice = $n->voice;
						$note->position = $i;

						// if note
						if(!$n->rest){

							array_push(self::$xmlArray, PatternController::getInterval($note));
							array_push(self::$xmlPositionArray, $note->position + 1);

							
						}
						// else if rest
						else{
							// calculate rest duration
							try{
								$restDurationFloat = (float)((int)$n->duration / (int)$partDivision / (int)$partBeatType);
							} catch (Exception $e) {
							    Debugbar::info($n->duration);
							    Debugbar::info($partDivision);
							    Debugbar::info($partBeatType);
							    echo 'Exception abgefangen: ',  $e->getMessage(), "\n";
							}

// rest durations: "whole" "half" "quarter" "eighth" "16th" "32nd" "64th"
							// determine 'type'
							if($restDurationFloat == 1){
								self::$restDuration = "whole";
							}elseif($restDurationFloat == 0.5){
								self::$restDuration = "half";
							}elseif($restDurationFloat == 0.25){
								self::$restDuration = "quarter";
							}elseif($restDurationFloat == 0.125){
								self::$restDuration = "eighth";
							}elseif($restDurationFloat == 0.0625){
								self::$restDuration = "16th";
							}elseif($restDurationFloat == 0.03125){
								self::$restDuration = "32nd";
							}elseif($restDurationFloat == 0.015625){
								self::$restDuration = "64th";
							}else{
								Debugbar::info($restDurationFloat);
							}
							array_push(self::$xmlArray, self::$restDuration);
							array_push(self::$xmlPositionArray, $note->position + 1);

						}

						//check if Array-length equals Pattern-length already
						if(count(self::$xmlArray) == count(self::$patternArray)){
							
							// compare arrays
							if(array_values(self::$xmlArray) == array_values(self::$patternArray)){
								// create result
								self::$result->file_id = $file_id;
								self::$result->file_url = $file_url;

								//fill with occurences
								$occ = new stdClass();
								$occ->start = reset(self::$xmlPositionArray);
								$occ->end = end(self::$xmlPositionArray);
								$occ->voice = (int)$note->voice;
								$occ->part_id = (string)$part['id'];

								array_push(self::$result->occurences, $occ);

								//reset arrays
								self::$xmlArray = array();
								self::$xmlPositionArray = array();

							}else{

								self::$xmlArray = array_splice(self::$xmlArray, 0, 0);

								self::$xmlPositionArray = array_splice(self::$xmlPositionArray, 0, 0);

								self::$xmlArray = array_values(self::$xmlArray);

								self::$xmlPositionArray = array_values(self::$xmlPositionArray);

							}

							} //if array lengths aren't equal yet, continue	

					}
					else{ //different voice incoming next; unset array; begin from scratch

							self::$xmlArray = array(); 
							self::$xmlPositionArray = array();
						}

				}
			}//end of foreach(parts as part)

			// check if result->occ is empty
			if(!empty(self::$result->occurences)){
				//push result
				array_push(self::$results, self::$result);
			}

		});


return self::$results;

// echo "<br>";
// var_dump(self::$results);
// 		if(empty(self::$results)){

// 		echo "<br>result is empty!";
// 		}
// echo "<hr>";

// bla();

	}
}
