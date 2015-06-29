<?php

class ScoreController
{
	private $upload;

	public function getPartsList($uploadId, $partId) {
		$upload = Upload::find($uploadId);
		if ($upload) {
			$doc = new DOMDocument();
			$doc->load($upload->url);
			$xPath = new DOMXPath($doc);

			$partsList = array();
			$parts = $xPath->query('//part');
			foreach ($parts as $part) {
				$partObject = new stdClass();
				$partObject->part_id = $part->getAttribute('id');
				$partObject->part_name = $this->_getInstrument($uploadId, $partObject->part_id);
				if ($partObject->part_id == $partId) {
					$partObject->selected = true;
				} else {
					$partObject->selected = false;
				}
				$partsList[] = $partObject;
			}

			return $partsList;
		} else {
			throw new Exception('No upload specified.');
		}
	}

	public function generateScore($uploadId, $partId) {
		$upload = Upload::find($uploadId);
		if ($upload) {
			$doc = new DOMDocument();
			$doc->load($upload->url);
			$xPath = new DOMXPath($doc);

			if ($partId === null) {
				$part = $xPath->query('//part')->item(0);
				$partId = $part->getAttribute('id');
				Debugbar::info($partId);
			} else {
				$part = $xPath->query('//part[@id="' . $partId . '"]')->item(0);
			}

			$resultObject = new stdClass();
			$resultObject->file_id = $upload->id;
			$resultObject->part_id = $partId;
			$resultObject->measures = array();


			// calculate beat type
			$beats = $part->getElementsByTagName('beats');
			if ($beats->length) {
				$partBeats = $beats->item(0)->nodeValue;
				$curBeats = $partBeats;
			} else {
				$curBeats = "4";
			}
			$beat_type = $part->getElementsByTagName('beat-type');
			if ($beat_type->length) {
				$partBeatType = $beat_type->item(0)->nodeValue;
				$curBeatType = $partBeatType;
			} else {
				$curBeatType = "4";
			}

			$measures = $part->getElementsByTagName('measure');
			$measureCounter = 0;
			foreach ($measures as $measure) {
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

				$measureObject->notes = array();
				$notes = $measure->getElementsByTagName('note');
				$noteCounter = 0;
				foreach ($notes as $note) {
					// create note object
					$noteObject = new stdClass();

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

							// determine dot
							$dot = $note->getElementsByTagName('dot');
							if ($dot->length) {
								$noteObject->dot = true;
								$curDuration = $curDuration - ($curDuration / 4);
							} else {
								$noteObject->dot = false;
							}

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

					// append note to results
					$measureObject->notes[] = $noteObject;
					$noteCounter++;
				}
				$resultObject->measures[] = $measureObject;
				$measureCounter++;
			}

			return $resultObject;
		} else {
			throw new Exception('No upload specified.');
		}
	}

	/**
	 * Helper function to calculate the duration from float to type
	 *
	 * @param 	float 	$durationFloat 	  	The duration as float
	 *
	 * @return 	string 	The duration as string type
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
	 * Static helper function to retrieve the part name for a given upload id and part_id
	 *
	 * @param 	int 	$id 		the uploads id
	 * @param 	int 	$part_id 	the part id
	 *
	 * @return 	string 	The title for given upload id
	 *
	 */
	public static function _getInstrument($id, $part_id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$part = $xml->xpath('//score-part[@id="' . $part_id . '"]');
		if ($part) {
			return (string) $part[0]->{'part-name'}->{0};
		} else {
			return "Unknown Instrument";
		}
	}
}