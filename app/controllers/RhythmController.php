<?php

class RhythmController {

	static $result;
	static $results;
	static $patternArray;
	static $xmlArray;
	static $xmlPositionArray;
	static $xmlCounterArray;
	static $once;
	static $once2 = true;
	// static $restDuration;
	static $noteCounter;
	static $counter;

	function __construct() {


	}

public function search($pattern) {

	$p = $pattern[0]->notes;
	self::$patternArray = array();
	self::$results = array();

	//get note intervals of pattern & fill patternArray
	foreach ($p as $note) {
		if($note->type == "note"){
			// $interval = PatternController::getInterval($note);
			$obj = new stdClass();
			// $obj->interval = $interval;
			$obj->type = $note->pitch->type;
			// if triplet
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
			array_push(self::$patternArray, $note->duration);
		}
	}
// echo"<br><br>patternArray:<br> ";
// var_dump(self::$patternArray);

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
		self::$xmlArray = array();
		self::$xmlPositionArray = array();
		self::$xmlCounterArray = array();
		self::$result = new stdClass();
		self::$result->occurences = array();

		$parts = $xml->xpath("//part");

// echo"<br><br>file: : ";
// var_dump($file_url);

		foreach($parts as $part){

// echo"<br><br>part ID: <br>";
// var_dump($part['id']);

			self::$noteCounter = 0;
			self::$once = true;
			self::$once2 = true;
			// $countPartMeasure = count($part->measure);
			// for($i = 0; $i < $countPartMeasure; $i++)
			foreach($part->measure as $measure){
				self::$counter = 0;
// echo"<br><hr>part->measure[$i] : ";
// var_dump($part->measure[$i]);

				if(self::$once2){
					self::$once2 = false;
					//get division for calculation of rest duration once
					$partDivision = $measure->attributes->divisions;
					//get beat-type for calculation of rest duration once
					$partBeatType = $measure->attributes->time->{'beat-type'};
				}
				//get beat-type changes within measures
				else{ //no changes within first round
					// if changes occure
					if(isset($measure->attributes->time->{'beat-type'})){
						// get changes
						$partBeatType = $measure->attributes->time->{'beat-type'};
					}
				}

// echo"<br><hr>partDivision: <br> ";
// var_dump($partDivision);
// echo"<br>partBeatType: <br> ";
// var_dump($partBeatType);
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
						// $pitch = new stdClass();
						// $pitch->step = $n->pitch->step;
						// $pitch->alter = $n->pitch->alter;
						// $pitch->octave = $n->pitch->octave;


						// $note = new stdClass();
						// $note->pitch = $pitch;
						// $note->voice = $n->voice;
						// $note->type = $n->type;
						// $note->position = self::$noteCounter;

						// if note
						if(!isset($n->rest) && !isset($n->chord)){
// echo"<br><hr>n: <br>";
// var_dump($n);
							// get note intervals of xml file & fill xmlArray
							$obj = new stdClass();
							// $obj->interval = PatternController::getInterval($note);
							$obj->type = (string)$n->type;
// echo"<br><hr>n->type: ";
// var_dump($n->type);
							// if triplet
							if(isset($n->{'time-modification'})){
								$obj->beam = (string)$n->beam[0];
							}
							// else if dotted note
							elseif($n->dot){
// echo"<br><hr>n: ";
// var_dump($n);
								$obj->dot = "1";
							}
// echo"<br><hr>OBJ: <br>";
// var_dump($obj);
							$res = new stdClass();
							$res->part = $part['id'];
							$res->pos = self::$noteCounter;

							array_push(self::$xmlArray, $obj);
							array_push(self::$xmlPositionArray, $res);
							array_push(self::$xmlCounterArray, self::$counter/*$note->position*/);
// echo"<br><hr>xmlArray: ";
// var_dump(self::$xmlArray);

						}
						// else if rest
						else if(isset($n->rest)){
// echo"<br><br>REST added!";
							// calculate rest duration
							try{
								$restDurationFloat = (float)((int)$n->duration / (int)$partDivision / 4); // (int)$partBeatType);
							} catch (Exception $e) {
// echo"<br><hr>n->duration: <br>";
// var_dump($n->duration);
// echo"<br>partDivision: <br>";
// var_dump($partDivision);
// echo"<br>partBeatType: <br>";
// var_dump($partBeatType);
							    Log::info('Exception abgefangen: ', array('error' => $e->getMessage()));
							}

							// rest durations: "whole" "half" "quarter" "eighth" "16th" "32nd" "64th"
							// determine 'type'
							if ($restDurationFloat == 1){
								$restDuration = "whole";
							} elseif ($restDurationFloat == 0.75) {
								$restDuration = "whole";
							} elseif ($restDurationFloat == 0.5) {
								$restDuration = "half";
							} elseif ($restDurationFloat == 0.375) {
								$restDuration = "half";
							} elseif ($restDurationFloat == 0.25) {
								$restDuration = "quarter";
							} elseif ($restDurationFloat == 0.1875) {
								$restDuration = "quarter";
							} elseif ($restDurationFloat == 0.125) {
								$restDuration = "eighth";
							} elseif ($restDurationFloat == 0.09375) {
								$restDuration = "eighth";
							} elseif ($restDurationFloat == 0.0625) {
								$restDuration = "16th";
							} elseif ($restDurationFloat == 0.046875) {
								$restDuration = "16th";
							} elseif ($restDurationFloat == 0.03125) {
								$restDuration = "32nd";
							} elseif ($restDurationFloat == 0.0234375) {
								$restDuration = "32nd";
							} elseif ($restDurationFloat == 0.015625) {
								$restDuration = "64th";
							} elseif ($restDurationFloat == 0.01171875) {
								$restDuration = "64th";
							} else {
								// catch strange values (FALLBACK)
								$restDuration = "64th";	// set to lowest possible value
//
// Debugbar::info($restDurationFloat);
// echo 'Rest duration unclear: ',  $restDurationFloat, "<br>";
// echo $restDurationFloat, $n->duration, $partDivision, $partBeatType, "<br>";
							}

							$res = new stdClass();
							$res->part = $part['id'];
							$res->pos = self::$noteCounter;

							array_push(self::$xmlArray, $restDuration);
							array_push(self::$xmlPositionArray, $res);
							array_push(self::$xmlCounterArray, self::$counter/*$note->position*/);

						} //end else if rest

// echo"<br><br><hr>restDurationFloat: <br>";
// var_dump($restDurationFloat);
// echo"<br><br><hr>restDuration: <br>";
// // var_dump($restDuration);
// echo"<br><br>xmlArray: <br>";
// var_dump(self::$xmlArray);
// echo"<br>patternArray: <br>";
// var_dump(self::$patternArray);
// // echo"<br><br>xmlPositionArray:";
// var_dump(self::$xmlPositionArray);
// echo"<br><br>";
// echo"<br><br>noteCounter: <br>";
// var_dump(self::$noteCounter);
						//check if Array-length equals Pattern-length already
						if(count(self::$xmlArray) == count(self::$patternArray)){
// echo"<br><hr>same length xmlArray:<br> ";
// var_dump(self::$xmlArray);
// echo"<br><br>xmlPositionArray:";
// var_dump(self::$xmlPositionArray);
							// compare arrays
							if(array_values(self::$xmlArray) == array_values(self::$patternArray)){
								// create result
								self::$result->file_id = $file_id;
								self::$result->file_url = $file_url;

								$docPart = $xPath->query('//part[@id="' . (string)reset(self::$xmlPositionArray)->part . '"]')->item(0);
// echo"<br><br>xmlPositionArray--pos: <br>";
// var_dump((string)reset(self::$xmlPositionArray)->pos);
// echo"<br><br>docPart->getElementsByTagName('note'): <br>";
// var_dump($docPart->getElementsByTagName('note'));
// echo"<br><br>noteCounter INSIDE MATCH: <br>";
// var_dump(self::$noteCounter);
// Debugbar::info($part['id']);
// // Debugbar::info($docPart);
// Debugbar::info(reset(self::$xmlPositionArray) - 1);
// Debugbar::info($docPart->getElementsByTagName('note'));

// echo"<br><br>docPart->getElementsByTagName('note')->item´COUNT:<br>";
// var_dump($docPart->getElementsByTagName('note')->item(0));
// echo"<br><br>xmlPositionArray:<br>";
// var_dump(self::$xmlPositionArray);
// echo"<br><br>reset(array) - 1:<br>";
// var_dump((reset(self::$xmlPositionArray) - 1));
// echo"<br><br>reset(array):<br>";
// var_dump(reset(self::$xmlPositionArray));
								$startNote = $docPart->getElementsByTagName('note')->item(((string)reset(self::$xmlPositionArray)->pos - 1));
								$startMeasureNumber = $startNote->parentNode->getAttribute('number');

								$endNote = $docPart->getElementsByTagName('note')->item(((string)end(self::$xmlPositionArray)->pos - 1));
								$endMeasureNumber = $endNote->parentNode->getAttribute('number');

								//fill with occurences
								Debugbar::info(self::$xmlPositionArray);
								$occ = new stdClass();
								$occ->start = reset(self::$xmlCounterArray);
								$occ->startMeasure = $startMeasureNumber;
								$occ->end = end(self::$xmlCounterArray);
								$occ->endMeasure = $endMeasureNumber;
								$occ->voice = (int)$n->voice/*$note->voice*/;
								$occ->part_id = (string)$part['id'];
// echo"<br><br><hr>RESULT FOUND<br>";
// var_dump(array_values(self::$xmlArray));
// echo"<br><br>startMeasureNumber: <br>";
// var_dump($startMeasureNumber);
// echo"<br><br>endMeasureNumber: <br>";
// var_dump($endMeasureNumber);
// echo"<br><br>xmlPositionArray:";
// var_dump(self::$xmlPositionArray);
// echo "<br>PART_ID:";
// var_dump((string)$part['id']);
// echo"<br><br>";

								array_push(self::$result->occurences, $occ);
// echo"<br><br>MATCH result: ";
// var_dump(self::$result);

								//reset arrays
								self::$xmlArray = array();
								self::$xmlPositionArray = array();
								self::$xmlCounterArray = array();

							}else{
// echo"<br><br>no match patternArray: ";
// var_dump(self::$patternArray);

// echo"<br><br>xmlArray BEFORE splice: ";
// var_dump(self::$xmlArray);
								self::$xmlArray = array_splice(self::$xmlArray, 1);
								self::$xmlPositionArray = array_splice(self::$xmlPositionArray, 1);
								self::$xmlCounterArray = array_splice(self::$xmlCounterArray, 1);

								self::$xmlArray = array_values(self::$xmlArray);
								self::$xmlPositionArray = array_values(self::$xmlPositionArray);
								self::$xmlCounterArray = array_values(self::$xmlCounterArray);
// echo"<br><br>xmlArray AFTER splice: ";
// var_dump(self::$xmlArray);


							}

						} //if array lengths aren't equal yet, continue

					}	// end if same voice
					else{ //different voice incoming next; unset array; begin from scratch
// echo"<br><br>VOICES DONT MATCH -> : ";
// var_dump(self::$xmlPositionArray);
							$lastVoice = $measure->note[$j]->voice;
							$j--;
							self::$noteCounter--;
							self::$counter--;
							self::$xmlArray = array();
							self::$xmlPositionArray = array();
							self::$xmlCounterArray = array();
						}

// echo"<br><hr>foreach(part->measure[$i]->note as n : ";
// var_dump($n);
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


// Debugbar::info("results");
// Debugbar::info(self::$results);
return self::$results;
// bla();

	}
}
