<?php

class SoundSequenzController {

	static $patternIntervalArray;
	static $result;
	static $xmlIntervalArray;
	static $xmlPositionArray;
	static $xmlCounterArray;
	static $results;
	static $exactMatch;
	static $once;
	static $noteCounter;
	static $counter;

	/**
	 * Search function to compare sound sequence pattern to xml files
	 *
	 * @param   object      The user generated melody pattern
	 *
	 * @return  array      	Array containing objects of \stdClass with file_id, file_url as well as start and end positions where pattern matches any given xml file
	 *
	 */
	public function search($pattern) {

		$p = $pattern[0]->notes;

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

			$doc = new DOMDocument();
			$doc->load($file_url);
			$xPath = new DOMXPath($doc);

			self::$once = true;
			self::$xmlIntervalArray = array();
			self::$xmlPositionArray = array();
			self::$xmlCounterArray = array();
			self::$result = new stdClass();
			self::$result->occurences = array();

			$parts = $xml->xpath("//part");

			foreach($parts as $part){
				self::$once = true;
				self::$noteCounter = 0;

				foreach($part->measure as $measure){
					self::$counter = 0;
					$countPartMeasureNote = count($measure->note);

					for($j = 0; $j < $countPartMeasureNote; $j++) {
						self::$noteCounter++;
						self::$counter++;
						$n = $measure->note[$j];

						//set lastVoice at beginning of xml file
						if(self::$once){
							self::$once = false;
							$lastVoice = $measure->note[$j]->voice;
						}

						if(!isset($n->rest) && !isset($n->chord)){ //exclude rests & chords (only looking for note patterns)
							$pitch = new stdClass();
							$pitch->step = $n->pitch->step;
							$pitch->alter = $n->pitch->alter;
							$pitch->octave = $n->pitch->octave;

							$note = new stdClass();
							$note->pitch = $pitch;
							$note->voice = $n->voice;
							$note->position = self::$noteCounter;
							$note->counter = self::$counter;
							// if voice stays the same
							if((int)$n->voice == (int)$lastVoice){
								// push current interval to xmlIntervalArray

								$res = new stdClass();
								$res->part = $part['id'];
								$res->pos = self::$noteCounter;

								array_push(self::$xmlIntervalArray, PatternController::getInterval($note));
								array_push(self::$xmlPositionArray, $res);
								array_push(self::$xmlCounterArray, $note->counter);

								//check if Array-length equals Pattern-length already
								if(count(self::$xmlIntervalArray) == count(self::$patternIntervalArray)){

									// compare arrays
									if(array_values(self::$xmlIntervalArray) == array_values(self::$patternIntervalArray)){
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
										self::$xmlIntervalArray = array();
										self::$xmlPositionArray = array();
										self::$xmlCounterArray = array();

									}else{

										self::$xmlIntervalArray = array_splice(self::$xmlIntervalArray, 1);

										self::$xmlPositionArray = array_splice(self::$xmlPositionArray, 1);
										self::$xmlCounterArray = array_splice(self::$xmlCounterArray, 1);
										self::$xmlIntervalArray = array_values(self::$xmlIntervalArray);

										self::$xmlPositionArray = array_values(self::$xmlPositionArray);
										self::$xmlCounterArray = array_values(self::$xmlCounterArray);
									}

								} //if array lengths aren't equal yet, continue

								// save current voice for comparison with next note
								$lastVoice = $n->voice;
							}
							else{ //different voice incoming next; unset array; begin from scratch

								$lastVoice = $measure->note[$j]->voice;
								$j--;
								self::$noteCounter--;
								self::$counter--;
								self::$xmlIntervalArray = array();
								self::$xmlPositionArray = array();
								self::$xmlCounterArray = array();
							}
						}
					} //end of foreach(notes as note){blabla}
				}

				// reset arrays
				self::$xmlIntervalArray = array();
				self::$xmlPositionArray = array();
				self::$xmlCounterArray = array();
			} //end of foreach(parts as part)

			// check if result->occ is empty
			if(!empty(self::$result->occurences)){
				//push result
				array_push(self::$results, self::$result);
			}

		});
		return self::$results;
	}
}
