<?php

class ScoreController
{
	private $upload;
	private $resultObject;

	public function setUpload($upload) {
		$this->upload = $upload;
	}

	public function getUpload() {
		return $this->upload;
	}

	public function generateScore($partId) {
		if ($this->upload) {
			$doc = new DOMDocument();
			$doc->load($this->upload->url);
			$xPath = new DOMXPath($doc);

			if ($partId === null) {
				$part = $xPath->query('//part')->item(0);
				$partId = $part->getAttribute('id');
				Debugbar::info($partId);
			} else {
				$part = $xPath->query('//part[@id="' . $partId . '"]')->item(0);
			}

			$this->resultObject = new stdClass();
			$this->resultObject->part_id = $partId;
			$this->resultObject->measures = array();


			// calculate beat type
			$partBeats = $part->getElementsByTagName('beats')->item(0)->nodeValue;
			$curBeats = $partBeats;
			$partBeatType = $part->getElementsByTagName('beat-type')->item(0)->nodeValue;
			$curBeatType = $partBeatType;

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
				$this->resultObject->measures[] = $measureObject;
				$measureCounter++;
			}

			return $this->resultObject;
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
}