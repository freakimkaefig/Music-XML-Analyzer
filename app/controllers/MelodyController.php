<?php

/**
 * Controller to search melody patterns
 *
 * @package 	Controllers
 */
class MelodyController {

	static $result;
	static $results;
	static $patternArray;
	static $xmlArray;
	static $xmlPositionArray;
	static $xmlCounterArray;
	static $once;
	static $once2 = true;
	static $noteCounter;
	static $counter;

	/**
	 * Search function to compare melody pattern to xml files
	 *
	 * @param   object 	$pattern 	The user generated melody pattern
	 *
	 * @return  array 	Containing objects of \stdClass with file_id, file_url as well as start and end positions where pattern matches any given xml file
	 *
	 */
	public function search($pattern) {

		$p = $pattern[0]->notes;
		self::$patternArray = array();
		self::$results = array();

		//get note intervals of pattern
		foreach ($p as $note) {
			if($note->type == "note"){
				$interval = PatternController::getInterval($note);
				$obj = new stdClass();
				$obj->interval = $interval;
				$obj->type = $note->pitch->type;
				if(isset($note->pitch->beam)){
					if($note->pitch->beam != false){
						$obj->beam = (string)$note->pitch->beam;
					}
				}
				// else if dotted note
				if(isset($note->pitch->dot)){
					if($note->pitch->dot == true){
						$obj->dot = "1";
					}
				}
				array_push(self::$patternArray, $obj);
			}else{
				$obj = new stdClass();
				$obj->duration = $note->duration;
				$obj->dot = $note->dot;

				array_push(self::$patternArray, $obj);
			}
		}

		//get user uploads & file_id's & file_url
		$user = User::find(Cookie::get('user_id'));
		$user->uploads->each(function($upload) {

			$xml = simplexml_load_string($upload->content);
			$file_id = $upload->id;
			$file_url = $upload->url;

			$doc = new DOMDocument();
			$doc->loadXML($upload->content);
			$xPath = new DOMXPath($doc);

			self::$once = true;
			self::$xmlArray = array();
			self::$xmlPositionArray = array();
			self::$xmlCounterArray = array();
			self::$result = new stdClass();
			self::$result->occurences = array();

			$parts = $xml->xpath("//part");

			foreach($parts as $part){

				self::$noteCounter = 0;
				self::$once = true;
				self::$once2 = true;

				foreach($part->measure as $measure){
					self::$counter = 0;

					if(self::$once2){
						self::$once2 = false;
						//get division for calculation of rest duration once
						$partDivision = $measure->attributes->divisions;
						//get beat-type for calculation of rest duration once
						$partBeatType = $measure->attributes->time->{'beat-type'};
					}

					//get beat-type changes within measures
					if(!self::$once2){ //no changes within first round
						// if changes occure
						if(isset($measure->attributes->time->{'beat-type'})){
							// get changes
							$partBeatType = $measure->attributes->time->{'beat-type'};
						}
					}
					$countPartMeasureNote = count($measure->note);
					for($j = 0; $j < $countPartMeasureNote; $j++){
						self::$noteCounter++;
						self::$counter++;
						$n = $measure->note[$j];

						if(self::$once){
							self::$once = false;
							$lastVoice = $measure->note[$j]->voice;
						}

						if((int)$n->voice == (int)$lastVoice){
							$pitch = new stdClass();
							$pitch->step = $n->pitch->step;
							$pitch->alter = $n->pitch->alter;
							$pitch->octave = $n->pitch->octave;


							$note = new stdClass();
							$note->pitch = $pitch;
							$note->voice = $n->voice;
							// $note->type = $n->type;
							$note->position = self::$noteCounter;
							$note->counter = self::$counter;

							// if note
							if(!$n->rest && !isset($n->chord)){

								$obj = new stdClass();
								$obj->interval = PatternController::getInterval($note);
								$obj->type = (string)$n->type;

								if(isset($n->{'time-modification'})){
									$obj->beam = (string)$n->beam[0];
								}
								// else if dotted note
								elseif($n->dot){
									$obj->dot = "1";
								}

								$res = new stdClass();
								$res->part = $part['id'];
								$res->pos = self::$noteCounter;

								array_push(self::$xmlArray, $obj);
								array_push(self::$xmlPositionArray, $res);
								array_push(self::$xmlCounterArray, $note->counter);

							}
							// else if rest
							else if(isset($n->rest)){
								// calculate rest duration
								try{
									$restDurationFloat = (float)((int)$n->duration / (int)$partDivision / 4);
								} catch (Exception $e) {
								    Log::error('Exception abgefangen: ',  array('error' => $e->getMessage()));
								}

								// determine 'type'
								if ($restDurationFloat == 1){
									$restDuration = "whole";
								} elseif ($restDurationFloat == 1.5) {
									$restDuration = "whole";
								} elseif ($restDurationFloat == 0.75) {
									$restDuration = "half";
								} elseif ($restDurationFloat == 0.5) {
									$restDuration = "half";
								} elseif ($restDurationFloat == 0.375) {
									$restDuration = "quarter";
								} elseif ($restDurationFloat == 0.25) {
									$restDuration = "quarter";
								} elseif ($restDurationFloat == 0.1875) {
									$restDuration = "eighth";
								} elseif ($restDurationFloat == 0.125) {
									$restDuration = "eighth";
								} elseif ($restDurationFloat == 0.09375) {
									$restDuration = "16th";
								} elseif ($restDurationFloat == 0.0625) {
									$restDuration = "16th";
								} elseif ($restDurationFloat == 0.046875) {
									$restDuration = "32nd";
								} elseif ($restDurationFloat == 0.03125) {
									$restDuration = "32nd";
								} elseif ($restDurationFloat == 0.0234375) {
									$restDuration = "64th";
								} elseif ($restDurationFloat == 0.015625) {
									$restDuration = "64th";
								} elseif ($restDurationFloat == 0.01171875) {
									$restDuration = "64th";
								} else {
									// catch strange values (FALLBACK)
									$restDuration = "64th";	// set to lowest possible value
								}
								$res = new stdClass();
								$res->part = $part['id'];
								$res->pos = self::$noteCounter;

								$obj = new stdClass();
								$obj->duration = $restDuration;
								if($n->dot){

									$obj->dot = true;
								}else{

									$obj->dot = false;
								}

								array_push(self::$xmlArray, $obj);
								array_push(self::$xmlPositionArray, $res);
								array_push(self::$xmlCounterArray, $note->counter);

							}

							//check if Array-length equals Pattern-length already
							if(count(self::$xmlArray) == count(self::$patternArray)){

								// compare arrays
								if(array_values(self::$xmlArray) == array_values(self::$patternArray)){
									// create result
									self::$result->file_id = $file_id;
									self::$result->file_url = $file_url;

									$docPart = $xPath->query('//part[@id="' . (string)reset(self::$xmlPositionArray)->part . '"]')->item(0);
									$startNote = $docPart->getElementsByTagName('note')->item(((string)reset(self::$xmlPositionArray)->pos - 1));
									$startMeasureNumber = $startNote->parentNode->getAttribute('number');

									$endNote = $docPart->getElementsByTagName('note')->item(((string)end(self::$xmlPositionArray)->pos - 1));
									$endMeasureNumber = $endNote->parentNode->getAttribute('number');

									//fill with occurences
									$occ = new stdClass();
									$occ->start = reset(self::$xmlCounterArray);
									$occ->startMeasure = $startMeasureNumber;
									$occ->end = end(self::$xmlCounterArray);
									$occ->endMeasure = $endMeasureNumber;
									$occ->voice = (int)$note->voice;
									$occ->part_id = (string)$part['id'];

									array_push(self::$result->occurences, $occ);

									//reset arrays
									self::$xmlArray = array();
									self::$xmlPositionArray = array();
									self::$xmlCounterArray = array();

								}else{

									self::$xmlArray = array_splice(self::$xmlArray, 1);
									self::$xmlCounterArray = array_splice(self::$xmlCounterArray, 1);
									self::$xmlPositionArray = array_splice(self::$xmlPositionArray, 1);

									self::$xmlArray = array_values(self::$xmlArray);
									self::$xmlCounterArray = array_values(self::$xmlCounterArray);
									self::$xmlPositionArray = array_values(self::$xmlPositionArray);

								}

								} //if array lengths aren't equal yet, continue

						}
						else{ //different voice incoming next; unset array; begin from scratch
								$lastVoice = $measure->note[$j]->voice;
								$j--;
								self::$noteCounter--;
								self::$counter--;
								self::$xmlArray = array();
								self::$xmlPositionArray = array();
								self::$xmlCounterArray = array();
							}
					}
				}

				// reset arrays
				self::$xmlArray = array();
				self::$xmlPositionArray = array();
				self::$xmlCounterArray = array();
			}//end of foreach(parts as part)

			// check if result->occ is empty
			if(!empty(self::$result->occurences)){
				//push result
				array_push(self::$results, self::$result);
			}

		});

		return self::$results;
	}
}
