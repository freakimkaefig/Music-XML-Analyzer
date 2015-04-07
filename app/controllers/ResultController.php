<?php

class ResultController extends BaseController {

	/**
	 * Function handling get route 'searchResults' ('/results')
	 *
	 */
	public function getSearchResults() {
		if (!Cache::has('pattern')) {
			Log::error('No pattern in cache!');
			return Redirect::route('pattern');
		}

		if (!Cache::has('results')) {
			Log::error('No results in cache!');
			return Redirect::route('pattern');
		}

		Debugbar::info(Cache::get('results'));
		return View::make('results.list');
	}


	/**
	 * Function handling get route 'resultDetail' ('/results/detail/{file}')
	 *
	 * @param 	int 	The upload id
	 *
	 * @return 	\Illuminate\View\View, \Illuminate\Support\Facades\Redirect 	A laravel view, when successful, or a redirect if fails
	 *
	 */
	public function getResultDetail($id, $page) {
		if (Cache::has('results') && Cache::has('pattern')) {
			$results = Cache::get('results');
			foreach ($results as $item) {
				if ($item->file_id == $id) {
					$result = $item;
				}
			}

			$pattern = Cache::get('pattern')[0];

			$itemsPerPage = 10;
			$numResults = count($result->occurences);
			$numPages = intval(ceil(count($result->occurences) / $itemsPerPage));
			$startItem = $page * $itemsPerPage;
			$endItem = $startItem + $itemsPerPage - 1;
			$result->occurences = array_slice($result->occurences, $startItem, $itemsPerPage);

			// Log::info("Passing results", array('startItem' => $startItem, 'endItem' => $endItem, 'result' => $result));

			return View::make('results.detail', array('result' => $result, 'itemsPerPage' => $itemsPerPage, 'numPages' => $numPages, 'page' => $page, 'numResults' => $numResults, 'startItem' => $startItem, 'endItem' => $endItem));
		} else {
			return Redirect::route('pattern');
		}
	}


	/**
	 * Function handling post route 'resultExtract' ('/result/extract')
	 *
	 * @return 	string 	JSON string with the generated extract
	 */
	public function postResultExtract() {
		$file_id = Input::get('file_id');
		$file_url = Input::get('file_url');
		$part_id = Input::get('part_id');
		$voice = Input::get('voice');
		$startMeasure = Input::get('startMeasure');
		$start = Input::get('start') - 1;
		$endMeasure = Input::get('endMeasure');
		$end = Input::get('end') - 1;

		$resultExtract = $this->generateResultExtract($file_id, $part_id, $voice, $startMeasure, $start, $endMeasure, $end);

		return json_encode($resultExtract);
	}


	/**
	 * Function to generate result extracts
	 *
	 * @param 	int 		The uploads id
	 * @param 	string 		The part id
	 * @param 	int 		The start note inside given part
	 * @param 	int 		The end note inside given part
	 *
	 * @return 	\stdClass 	A \stdClass object containing information to render staves with vexflow
	 *
	 */
	private function generateResultExtract($upload_id, $part_id, $voice, $startMeasure, $start, $endMeasure, $end) {
		set_time_limit(300);
		Log::info("Upload: " . $upload_id . ", Part: " . $part_id . ", Voice: " . $voice . ", StartMeasure: " . $startMeasure . ", Start: " . $start . ", EndMeasure: " . $endMeasure . ", End: ". $end);
		$upload = Upload::find($upload_id);

		$doc = new DOMDocument();
		$doc->load($upload->url);
		$xPath = new DOMXPath($doc);

		$part = $xPath->query('//part[@id="' . $part_id . '"]')->item(0);

		$resultObject = new stdClass();
		$resultObject->type = 2;
		$resultObject->part_id = $part_id;
		// $resultObject->start_extract = $this->calculateStartExtract($part, $start);
		// $resultObject->end_extract = $this->calculateEndExtract($part, $end);
		$start_extract = $startMeasure;
		if ($startMeasure > 1) {
			$start_extract--;
		}
		$end_extract = $endMeasure;
		if ($part->getElementsByTagName('measure')->length > $endMeasure) {
			$end_extract++;
		}

		$resultObject->start_extract = $start_extract;
		$resultObject->end_extract = $end_extract;
		$resultObject->measures = array();

		// calculate beat type
		$partBeats = $part->getElementsByTagName('beats')->item(0)->nodeValue;
		$curBeats = $partBeats;
		$partBeatType = $part->getElementsByTagName('beat-type')->item(0)->nodeValue;
		$curBeatType = $partBeatType;

		$measureCounter = 0;

		$part_measures = $part->getElementsByTagName('measure');
		// foreach ($part_measures as $measure) {
		for ($j = $start_extract; $j <= $end_extract; $j++) {
			$noteCounter = 0;
			$measure = $xPath->query('//part[@id="' . $part_id . '"]/measure[@number="' . $j . '"]')->item(0);
			$measureNotes = $measure->getElementsByTagName('note');

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
			$resultObject->measures[$measureCounter] = $measureObject;

			// loop over each note in measure
			foreach ($measureNotes as $note) {
				// $noteCounter++;
				$noteVoice = $note->getElementsByTagName('voice')->item(0)->nodeValue;
				if ($noteVoice == $voice) {
					// create note object
					$noteObject = new stdClass();

					// set color
					$currentColor = "#000000";
					if ($startMeasure == $endMeasure) {
						if (($noteCounter >= $start && $noteCounter <= $end) && ($j == $startMeasure || $j == $endMeasure)) {
							// set color to red if note is between start and end of result
							$currentColor = "#b71c1c";
						}
					} else {
						if (($j == $startMeasure && $noteCounter >= $start) || ($j == $endMeasure && $noteCounter <= $end)) {
							// set color to red if note is between start and end of result
							$currentColor = "#b71c1c";
						}
					}
					$noteObject->color = $currentColor;
					Log::info("Measure: " . $j . ", NoteCounter: " . $noteCounter . ", Start: " . $start . ", End: " . $end . ", Color: " . $currentColor);

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
							$noteObject->pitch->alter = intval($alter->item(0)->nodeValue);
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
						$rest = $note->getElementsByTagName('rest');
						$unpitched = $note->getElementsByTagName('unpitched');
						if ($rest->length) {
							// it's a rest
							$noteObject->type = "rest";
							$curDuration = $note->getElementsByTagName('duration')->item(0)->nodeValue;
							$partDivision = $part->getElementsByTagName('divisions')->item(0)->nodeValue;
							$restDurationFloat = (float)((int)$curDuration / (int)$partDivision / 4);//(int)$curBeatType);
							$restDuration = $this->getDurationType($restDurationFloat);
							$noteObject->duration = $restDuration;
						} elseif ($unpitched->length) {
							$noteObject->type = "unpitched";
							$curDuration = $note->getElementsByTagName('duration')->item(0)->nodeValue;
							$partDivision = $part->getElementsByTagName('divisions')->item(0)->nodeValue;
							$noteDurationFloat = (float)((int)$curDuration / (int)$partDivision / (int)$curBeatType);
							$noteDuration = $this->getDurationType($noteDurationFloat);
							$noteObject->pitch = new stdClass();
							$noteObject->pitch->type = $noteDuration;
							$noteObject->pitch->step = $unpitched->item(0)->getElementsByTagName('display-step')->item(0)->nodeValue;
							$noteObject->pitch->octave = $unpitched->item(0)->getElementsByTagName('display-octave')->item(0)->nodeValue;
							$noteObject->pitch->alter = 0;

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
						}
					} // END: if ($pitch->length)

					// set color in note object
					$noteObject->color = $currentColor;

					// append note to results
					$resultObject->measures[$measureCounter]->notes[] = $noteObject;
				} // END if ($noteVoice == $voice) {
				$noteCounter++;
			} // END: foreach ($measureNotes as $note)
			$measureCounter++;
		}

		unset($doc);
		return $resultObject;
	}


	/**
	 * Helper function to calculate the duration from float to type
	 *
	 * @param 	float 	  	The duration as float
	 *
	 * @return 	string 		The duration as string type
	 *
	 */
	private function getDurationType($durationFloat) {
		if ($durationFloat == 1){
			return "whole";
		} elseif ($durationFloat == 0.75) {
			return "whole";
		} elseif ($durationFloat == 0.5) {
			return "half";
		} elseif ($durationFloat == 0.375) {
			return "half";
		} elseif ($durationFloat == 0.25) {
			return "quarter";
		} elseif ($durationFloat == 0.1875) {
			return "quarter";
		} elseif ($durationFloat == 0.125) {
			return "eighth";
		} elseif ($durationFloat == 0.09375) {
			return "eighth";
		} elseif ($durationFloat == 0.0625) {
			return "16th";
		} elseif ($durationFloat == 0.046875) {
			return "16th";
		} elseif ($durationFloat == 0.03125) {
			return "32nd";
		} elseif ($durationFloat == 0.0234375) {
			return "32nd";
		} elseif ($durationFloat == 0.015625) {
			return "64th";
		} elseif ($durationFloat == 0.01171875) {
			return "64th";
		} else {
			// catch strange values (FALLBACK)
			return "64th";	// set to lowest possible value
		}
	}


	/**
	 * Helper function to calculate the starting measures number
	 *
	 * @param 	\DOMNode 	The \DOMNode element for the music xml part
	 * @param 	int 	  	The start notes number (inside the part)
	 *
	 * @return 	int 		Number of the measure where the extract should start
	 *
	 */
	private function calculateStartExtract($part, $start) {
		$notes = $part->getElementsByTagName('note');
		if ($notes) {
			$note = $notes->item($start);
			if ($note) {
				$startMeasureNumber = $note->parentNode->getAttribute('number');
				$startExtract = $startMeasureNumber;
				if ($startMeasureNumber > 1) {
					// Check if measure before can be included in extract
					$startExtract -= 1;
				}
				return $startExtract;
			} else {
				Log::error("ResultController.php:326 | Empty note!", array('notes' => $notes->length, 'start' => $start));
			}
		} else {
			Log::error("ResultController.php:329 | Empty notes", array('part' => $part));
		}
	}


	/**
	 * Helper function to calculate the ending measures number
	 *
	 * @param 	\DOMNode 	The \DOMNode element for the music xml part
	 * @param 	int 		The end notes number (inside the part)
	 *
	 * @return 	int 		Number of the measure where the extract should end
	 *
	 */
	private function calculateEndExtract($part, $end) {
		$notes = $part->getElementsByTagName('note');
		if ($notes) {
			$note = $notes->item($end);
			if ($note) {
				$endMeasureNumber = $note->parentNode->getAttribute('number');
				$endExtract = $endMeasureNumber;
				if ($endMeasureNumber < $part->getElementsByTagName('measure')->length) {
					// Check if measure after can be included in extract
					$endExtract += 1;
				}
				return $endExtract;
			} else {
			Log::error("ResultController.php:356 | Empty note!", array('notes' => $notes->length, 'end' => $end));
			}
		} else {
			Log::error("ResultController.php:359 | Empty notes", array('part' => $part));
		}
	}


	/**
	 * Static helper function |  to retrieve the artist for a given upload id
	 *
	 * @param 	int 	the uploads id
	 *
	 * @return 	string 	The artist for given upload id
	 *
	 */
	public static function _getArtist($id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$artist = $xml->xpath("//credit[credit-type='composer']");
		if ($artist) {
			return $artist[0]->{'credit-words'}->{0};
		} else {
			return "Unknown Artist";
		}
	}


	/**
	 * Static helper function to retrieve the title for a given upload id
	 *
	 * @param 	int 	the uploads id
	 *
	 * @return 	string 	The title for given upload id
	 *
	 */
	public static function _getTitle($id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$title = $xml->xpath("//credit[credit-type='title']");
		if ($title) {
			return $title[0]->{'credit-words'}->{0};
		} else {
			return "Unknown Title";
		}
	}


	/**
	 * Static helper function to retrieve the filename for a given upload id
	 *
	 * @param 	int 	the uploads id
	 *
	 * @return 	string 	The title for given upload id
	 *
	 */
	public static function _getFilename($id) {
		$upload =  Upload::find($id);
		return $upload->name();
	}

	/**
	 * Static helper function to retrieve the part name for a given upload id and part_id
	 *
	 * @param 	int 	the uploads id
	 * @param 	int 	the part id
	 *
	 * @return 	string 	The title for given upload id
	 *
	 */
	public static function _getInstrument($id, $part_id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$part = $xml->xpath('//score-part[@id="' . $part_id . '"]');
		if ($part) {
			return $part[0]->{'part-name'}->{0};
		} else {
			return "Unknown Instrument";
		}
	}


	/**
	 * Static helper function to retrieve the key for a given upload id
	 *
	 * @param 	int 	the uploads id
	 *
	 * @return 	string 	The key for given upload id
	 *
	 */
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