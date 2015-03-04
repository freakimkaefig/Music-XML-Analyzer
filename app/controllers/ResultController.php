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

			$pattern = Cache::get('pattern');

			$upload = Upload::find($id);

			$doc = new DOMDocument();
			$doc->load($upload->url);
			$xPath = new DOMXPath($doc);
			// getting extracts with start, end and measures between
			$resultNotes = array();
			for ($i = 0; $i < count($result->occurences); $i++) {

				$resultObject = new stdClass();
				$resultObject->type = 2;
				$resultObject->notes = array();
				$resultNotes[$i] = $resultObject;

				$start = $result->occurences[$i]->start;
				$end = $result->occurences[$i]->end;
				$voice = $result->occurences[$i]->voice;
				$part_id = $result->occurences[$i]->part_id;

				$startMeasureNumber = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('note')->item($start)->parentNode->getAttribute('number');
				$endMeasureNumber = $xPath->query('//part[@id="' . $part_id . '"]')->item(0)->getElementsByTagName('note')->item($end)->parentNode->getAttribute('number');
				$measureCounter = 0;
				for ($j = $startMeasureNumber; $j <= $endMeasureNumber; $j++) {
					$measureNotes = $xPath->query('//part[@id="' . $part_id . '"]/measure[@number="' . $j . '"]/note');
					// Debugbar::info($measureNotes);
					$measureObject = new stdClass();
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
								$noteObject = new stdClass();
								$pitch = $note->getElementsByTagName('pitch');
								if ($pitch->length) {
									// it's a note
									$noteObject->type = "note";
									$noteObject->pitch = new stdClass();

									$step = $pitch->item(0)->getElementsByTagName('step');
									if ($step->length) {
										$noteObject->pitch->step = $step->item(0)->nodeValue;
									}

									$alter = $pitch->item(0)->getElementsByTagName('alter');
									if ($alter->length) {
										$noteObject->pitch->alter = $alter->item(0)->nodeValue;
									} else {
										$noteObject->pitch->alter = 0;
									}

									$octave = $pitch->item(0)->getElementsByTagName('octave');
									if ($octave->length) {
										$noteObject->pitch->octave = $octave->item(0)->nodeValue;
									}

									$type = $note->getElementsByTagName('type');
									if ($type->length) {
										$noteObject->pitch->type = $type->item(0)->nodeValue;
									}
									
								} else {
									// it's a rest
									$noteObject->type = "rest";
									$noteObject->duration = "half";		// TODO: calulate rest duration
								}
								$resultNotes[$i]->measures[$measureCounter]->notes[] = $noteObject;
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
		Debugbar::info($id);
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