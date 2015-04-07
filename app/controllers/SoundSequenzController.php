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

	function __construct() {

	}

	public function search($pattern) {
		// Debugbar::info($pattern);
		$p = $pattern[0]->notes;
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
// echo"<br><br>patternIntervalArray: ";
// var_dump(self::$patternIntervalArray);

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
// var_dump($part);

// echo "<hr><br>";
				self::$once = true;
				self::$noteCounter = 0;

// echo"<br><hr>part: ";
				//traverse §notes[]
				// $countPartMeasure = count($part->measure);
				// for ($i = 0; $i < $countPartMeasure; $i++)
				foreach($part->measure as $measure){	// war vorher "$i < count($part->measure)-1" Unsinn?
					self::$counter = 0;
// echo"<br><hr>NOTE: ";
// var_dump($part->measure[$i]);
					$countPartMeasureNote = count($measure->note);
					for($j = 0; $j < $countPartMeasureNote; $j++) {
						self::$noteCounter++;
						self::$counter++;
						$n = $measure->note[$j];
// echo"<br><hr>COUNTER: ";
// var_dump(self::$noteCounter);
						//set lastVoice at beginning of xml file
						if(self::$once){
// echo"<br><br>LASTVOICE SET ";
							self::$once = false;
							$lastVoice = $measure->note[$j]->voice;
						}

						if(!isset($n->rest) && !isset($n->chord)){ //exclude rests & chords (only looking for note patterns)
// echo"<hr><br>CHORD?: <br>";
// var_dump(isset($n->chord));
// echo "<br><br>";
// var_dump($n);
							$pitch = new stdClass();
							$pitch->step = $n->pitch->step;
							$pitch->alter = $n->pitch->alter;
							$pitch->octave = $n->pitch->octave;

							$note = new stdClass();
							$note->pitch = $pitch;
							$note->voice = $n->voice;
							$note->position = self::$noteCounter;
							$note->counter = self::$counter;
// var_dump($note);
// echo "<hr><br>";
// echo"<br><br>LASTVOICE: ";
// var_dump((int)$lastVoice);
// echo"<br><br>current note: ";
// var_dump($n);
							// if voice stays the same
							if((int)$n->voice == (int)$lastVoice){
								// push current interval to xmlIntervalArray

								$res = new stdClass();
								$res->part = $part['id'];
								$res->pos = self::$noteCounter;

								array_push(self::$xmlIntervalArray, PatternController::getInterval($note));
								array_push(self::$xmlPositionArray, $res);
								array_push(self::$xmlCounterArray, $note->counter);
// echo"<br><br>xmlIntervalArray: ";
// var_dump(self::$xmlIntervalArray);
								//check if Array-length equals Pattern-length already
								if(count(self::$xmlIntervalArray) == count(self::$patternIntervalArray)){


									// compare arrays
									if(array_values(self::$xmlIntervalArray) == array_values(self::$patternIntervalArray)){
										// create result
// echo"<br><br><hr>RESULT FOUND<br>intervalArray: <br>";
// var_dump(array_values(self::$xmlIntervalArray));
// echo"<br><br>patternArray: <br>";
// var_dump(array_values(self::$patternIntervalArray));
// echo"<br><br>xmlPositionArray:";
// var_dump(self::$xmlPositionArray);
// echo "<br>PART_ID:";
// var_dump((string)$part['id']);
// echo"<br><br>";
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
// var_dump($occ);
										array_push(self::$result->occurences, $occ);

										//reset arrays
										self::$xmlIntervalArray = array();
										self::$xmlPositionArray = array();
										self::$xmlCounterArray = array();
// echo"<br><br>MATCH FOUND xmlIntervalArray RESET: ";
// var_dump(self::$xmlIntervalArray);

									}else{

// echo"<br><br>xmlIntervalArray BEFORE splice: ";
// var_dump(self::$xmlIntervalArray);
										self::$xmlIntervalArray = array_splice(self::$xmlIntervalArray, 1);

// echo"<br><br>xmlIntervalArray AFTER splice: ";
// var_dump(self::$xmlIntervalArray);
										self::$xmlPositionArray = array_splice(self::$xmlPositionArray, 1);
										self::$xmlCounterArray = array_splice(self::$xmlCounterArray, 1);
										self::$xmlIntervalArray = array_values(self::$xmlIntervalArray);

										self::$xmlPositionArray = array_values(self::$xmlPositionArray);
										self::$xmlCounterArray = array_values(self::$xmlCounterArray);

										// self::$result = new stdClass();
										// self::$result->occurences = array();

									}

								} //if array lengths aren't equal yet, continue

								// save current voice for comparison with next note
								$lastVoice = $n->voice;
							}
							else{ //different voice incoming next; unset array; begin from scratch

// echo"<br><br>LASTVOICE: ";
// var_dump($lastVoice);
// echo"<br><br>NEXT VOICE: ";
// var_dump($part->measure[$i]->note[$j]->voice);
								$lastVoice = $measure->note[$j]->voice;
								$j--;
								self::$noteCounter--;
								self::$counter--;
								self::$xmlIntervalArray = array();
								self::$xmlPositionArray = array();
								self::$xmlCounterArray = array();
// echo"<br><br>xmlIntervalArray AFTER VOICE CHANGED: ";
// var_dump(self::$xmlIntervalArray);
							}
						}
					} //end of foreach(notes as note){blabla}
				}

				// reset arrays
				self::$xmlArray = array();
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
// bla();
	}

}
