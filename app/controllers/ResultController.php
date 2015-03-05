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
				$resultNotes[$i] = $resultObject;

				// setting variables from search results
				$start = $result->occurences[$i]->start;
				$end = $result->occurences[$i]->end;
				$voice = $result->occurences[$i]->voice;
				$part_id = $result->occurences[$i]->part_id;

				// calculating measure number, where the first note is in
				$startMeasureNumber = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('note')->item($start)->parentNode->getAttribute('number');
				if ($startMeasureNumber != 1) {
					// Check if measure before can be included in extract
					$startMeasureNumber -= 1;
				}

				// calculate measure number, where the last note is in
				$endMeasureNumber = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('note')->item($end)->parentNode->getAttribute('number');
				if ($endMeasureNumber < $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('measure')->length) {
					// Check if measure after can be included in extract
					$endMeasureNumber += 1;
				}
				$measureCounter = 0;
				$partBeats = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('beats')->item(0)->nodeValue;
				$curBeats = $partBeats;
				$partBeatType = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('beat-type')->item(0)->nodeValue;
				$curBeatType = $partBeatType;
				for ($j = $startMeasureNumber; $j <= $endMeasureNumber; $j++) {
					$measure = $xPath->query('//part[@id="' . $part_id . '"]/measure[@number="' . $j . '"]')->item(0);
					$measureNotes = $xPath->query('//part[@id="' . $part_id . '"]/measure[@number="' . $j . '"]/note');
					// Debugbar::info("counter: " . $measureCounter);
					$measureObject = new stdClass();
					$time_signature = false;
					$beats = $measure->getElementsByTagName('beats');
					$beat_type = $measure->getElementsByTagName('beat-type');
					if (($beats->length && $beat_type->length) || $measureCounter == 0) {
						if ($measureCounter > 0) {
							$curBeats = $beats->item(0)->nodeValue;
							$curBeatType = $beat_type->item(0)->nodeValue;
						}
						$time_signature = $curBeats . "/" . $curBeatType;
					}
					$measureObject->time_signature = $time_signature;
					$resultNotes[$i]->measures[$measureCounter] = $measureObject;
					foreach ($measureNotes as $note) {
						switch ($pattern->type) {
							case 0:
								/**
								 * sound sequence
								 * {
								 *   pitch: {
								 *     step: "B",
								 *     alter: 0,
								 *     octave: 5
								 *   }
								 * }
								 */
								if ($note->getElementsByTagName('voice')->item(0)->nodeValue == $voice) {
									$noteObject = new stdClass();
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
									}
									// Debugbar::info($noteObject);
									$resultNotes[$i]->measures[$measureCounter]->notes[] = $noteObject;
								}
								break;

							case 1:
								/**
								 * rhythm
								 * [{
								 *   pitch: {
								 *     ???
								 *   }
								 * }]
								 */
								break;

							case 2:
								/**
								 * melody
								 * [{
								 *   type: "note"
								 *   pitch: {
								 *     step: "B",
								 *     alter: 0,
								 *     octave: 5
								 *   }
								 * },
								 * {
								 *   type: "rest",
								 *   duration: "whole"
								 * }]
								 */
								break;
						}
					}
					$measureCounter++;
				}
			}
			// Debugbar::info($resultNotes);

			return View::make('results.detail')->with('resultNotes', $resultNotes);
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
}