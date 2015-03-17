<?php

class ResultController extends BaseController {

	public function getSearchResults() {
		$time = 60*24;

		if (!Cache::has('pattern')) {
			Debugbar::error('No pattern in cache!');
			return Redirect::route('pattern');
		}

		if (!Cache::has('results')) {
			Debugbar::error('No results in cache!');
			return Redirect::route('pattern');
		}

		return View::make('results.list');
	}


	public function getResultDetail($id) {

		if (Cache::has('results') && Cache::has('pattern')) {

			$results = Cache::get('results');
			// Debugbar::info($results);
			foreach ($results as $item) {
				if ($item->file_id == $id) {
					$result = $item;
				}
			}

			$pattern = Cache::get('pattern')[0];
			$upload = Upload::find($id);

			// initializing xpath wrapper
			$doc = new DOMDocument();
			$doc->load($upload->url);
			$xPath = new DOMXPath($doc);

			// getting extracts with start, end and measures between
			$resultNotes = array();
			for ($i = 0; $i < count($result->occurences); $i++) {

				// setting up result object for current occurence
				$resultObject = new stdClass();
				$resultObject->type = 2;
				$resultObject->file_id = $result->file_id;
				$resultNotes[$i] = $resultObject;

				// setting variables from search results
				$start = $result->occurences[$i]->start - 1;	// make start zero-based
				$end = $result->occurences[$i]->end - 1;	// make end zero-based
				$voice = $result->occurences[$i]->voice;
				$part_id = $result->occurences[$i]->part_id;
				$part_name = $xPath->query('//score-part[@id="' . $part_id . '"]/part-name')->item(0)->nodeValue;


				$resultObject->voice = $voice;
				$resultObject->part_id = $part_id;
				$resultObject->part_name = $part_name;

				// calculating measure number, where the first and last note is in
				$startMeasureNumber = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('note')->item($start)->parentNode->getAttribute('number');
				$endMeasureNumber = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('note')->item($end)->parentNode->getAttribute('number');
				
				$noteCounter = 0;
				$startExtract = $startMeasureNumber;
				if ($startMeasureNumber > 1) {
					// Check if measure before can be included in extract
					$startExtract -= 1;
				}

				$endExtract = $endMeasureNumber;
				if ($endMeasureNumber < $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('measure')->length) {
					// Check if measure after can be included in extract
					$endExtract += 1;
				}

				$resultObject->startExtract = $startExtract;
				$resultObject->endExtract = $endExtract;

				$measureCounter = 0;

				// save beat type from part
				$partBeats = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('beats')->item(0)->nodeValue;
				$curBeats = $partBeats;
				$partBeatType = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('beat-type')->item(0)->nodeValue;
				$curBeatType = $partBeatType;

				// loop over measures included in result extract
				for ($j = 1; $j <= $endExtract; $j++) {
					$measure = $xPath->query('//part[@id="' . $part_id . '"]/measure[@number="' . $j . '"]')->item(0);
					$measureNotes = $xPath->query('//part[@id="' . $part_id . '"]/measure[@number="' . $j . '"]/note[voice="' . $voice . '"]');

					if ($j < $startExtract) {
						// add count of notes before extract starts to counter
						$noteCounter += $measureNotes->length;
					} else {
						$measureObject = new stdClass();
						$time_signature = false;	// no change in time signature

						// set time signature on first measure
						if ($measureCounter == 0) {
							$time_signature = $curBeats . "/" . $curBeatType;
						}

						// decide if time signature changes
						$beats = $measure->getElementsByTagName('beats');
						$beat_type = $measure->getElementsByTagName('beat-type');
						if (($beats->length && $beat_type->length)) {
							$curBeats = $beats->item(0)->nodeValue;
							$curBeatType = $beat_type->item(0)->nodeValue;
							$time_signature = $curBeats . "/" . $curBeatType;
						}

						// set time signature in note object
						$measureObject->time_signature = $time_signature;

						// append measure object to results
						$resultNotes[$i]->measures[$measureCounter] = $measureObject;
						
						// loop over each note in measure
						foreach ($measureNotes as $note) {
							// create note object
							$noteObject = new stdClass();

							// set color
							$currentColor = "#000000";
							if ($noteCounter >= $start && $noteCounter <= $end) {
								// set color to red if note is between start and end of result
								$currentColor = "#FF0000";
								// Debugbar::info("Counter: " . $noteCounter . " | " . $start . " | " . $end . " Part ID: " . $part_id);
							}
							$noteObject->color = $currentColor;

							// decide if current element is a note or a rest (only notes have a pitch child)
							$pitch = $note->getElementsByTagName('pitch');
							if ($pitch->length) {
								// it's a note
								$noteObject->type = "note";
								$noteObject->pitch = new stdClass();

								// determine step
								$step = $pitch->item(0)->getElementsByTagName('step');
								if ($step->length) {
									$noteObject->pitch->step = $step->item(0)->nodeValue;
								}

								// determine alter value
								$alter = $pitch->item(0)->getElementsByTagName('alter');
								if ($alter->length) {
									$noteObject->pitch->alter = $alter->item(0)->nodeValue;
								} else {
									$noteObject->pitch->alter = 0;
								}

								// determine octave
								$octave = $pitch->item(0)->getElementsByTagName('octave');
								if ($octave->length) {
									$noteObject->pitch->octave = $octave->item(0)->nodeValue;
								}

								// determine type / length
								$type = $note->getElementsByTagName('type');
								if ($type->length) {
									$noteObject->pitch->type = $type->item(0)->nodeValue;
								}

								// determine beam type
								$beam = $note->getElementsByTagName('beam');
								if ($beam->length) {
									$noteObject->pitch->beam = $beam->item(0)->nodeValue;
								} else {
									$noteObject->pitch->beam = false;
								}

								// determine dot
								$dot = $note->getElementsByTagName('dot');
								if ($dot->length) {
									$noteObject->pitch->dot = true;
								} else {
									$noteObject->pitch->dot = false;
								}

								// determine ties
								$ties = $note->getElementsByTagName('tie');
								if ($ties->length) {
									foreach ($ties as $tie) {
										$noteObject->pitch->ties[] = $tie->getAttribute('type');
									}
								} else {
									$noteObject->pitch->ties[] = false;
								}

								// determine chords
								$chord = $note->getElementsByTagName('chord');
								if ($chord->length) {
									$noteObject->pitch->chord = true;
								} else {
									$noteObject->pitch->chord = false;
								}
								$noteObject->counter = $noteCounter;

								$timeModification = $note->getElementsByTagName('time-modification');
								if ($timeModification->length) {
									$actualNotes = $timeModification->item(0)->getElementsByTagName('actual-notes');
									if ($actualNotes->length) {
										$noteObject->pitch->tuplet = $actualNotes->item(0)->nodeValue;
									}
								} else {
									$noteObject->pitch->tuplet = false;
								}
								
							} else {
								// it's a rest
								$noteObject->type = "rest";
								$curDuration = $note->getElementsByTagName('duration')->item(0)->nodeValue;
								$partDivision = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('divisions')->item(0)->nodeValue;
								$restDurationFloat = (float)((int)$curDuration / (int)$partDivision / (int)$curBeatType);
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
								}
								$noteObject->duration = $restDuration;
							} // END: if ($pitch->length)

							// set color in note object
							$noteObject->color = $currentColor;

							// append note to results
							$resultNotes[$i]->measures[$measureCounter]->notes[] = $noteObject;

							$noteCounter++;
						} /* END: foreach ($measureNotes as $note) */
						$measureCounter++;
					} /* END: if ($j < $startExtract) */
				}
			}

			return View::make('results.detail',
				array(
					'result' => $result,
					'resultNotes' => $resultNotes
				));
		} else {
			Redirect::route('pattern');
		}
	}


	public static function _getArtist($id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$artist = $xml->xpath("//credit[credit-type='composer']");
		if ($artist) {
			return $artist[0]->{'credit-words'}->{0};
		} else {
			return "Unknown Artist";
		}
	}
	public static function _getTitle($id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$title = $xml->xpath("//credit[credit-type='title']");
		// Debugbar::info($title[0]->{'credit-words'});
		if ($title) {
			return $title[0]->{'credit-words'}->{0};
		} else {
			return "Unknown Title";
		}
	}

	public static function _getKey($id){
		$xml = simplexml_load_file(Upload::find($id)->url);
		$keys = $xml->xpath("//key");
		$key = $keys[0];

		$fifths = $key->fifths;
		$mode = (string)$key->mode;
		
		if($fifths != null && $mode === "major"){
			switch($fifths) {
				case "0": return "C major"; break;
				case "1": return "G major"; break;
				case "2": return "D major"; break;
				case "3": return "A major"; break;
				case "4": return "E major"; break;
				case "5": return "H major"; break;
				case "6": return "F sharp major"; break;
				case "7": return "C sharp major"; break;
				case "-1": return "F major"; break;
				case "-2": return "B major"; break;
				case "-3": return "E flat major"; break;
				case "-4": return "A flat major"; break;
				case "-5": return "D flat major"; break;
				case "-6": return "G flat major"; break;
				case "-7": return "C flat major"; break;
			}
		} elseif($fifths != null && $mode === "minor") {
			switch($fifths) {
				case "0": return "A minor"; break;
				case "1": return "E minor"; break;
				case "2": return "H minor"; break;
				case "3": return "F sharp minor"; break;
				case "4": return "C sharp minor"; break;
				case "5": return "G sharp minor"; break;
				case "6": return "D sharp minor"; break;
				case "7": return "A sharp minor"; break;
				case "-1": return "D minor"; break;
				case "-2": return "G minor"; break;
				case "-3": return "C minor"; break;
				case "-4": return "F minor"; break;
				case "-5": return "B minor"; break;
				case "-6": return "E flat minor"; break;
				case "-7": return "A flat minor"; break;
			}
		}
	}
}