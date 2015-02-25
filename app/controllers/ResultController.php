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
			foreach ($results as $item) {
				if ($item->file_id == $id) {
					$result = $item;
				}
			}

			$pattern = Cache::get('pattern');

			$upload = Upload::find($id);

			$xml = simplexml_load_file($upload->url);
			// getting extracts with start, end and measures between
			$resultNotes = array();
			for ($i = 0; $i < count($result->occurences); $i++) {
				// $resultExtracts[$i] = array();

				$resultObject = new stdClass();
				$resultObject->type = $pattern->type;
				$resultObject->notes = array();
				$resultNotes[$i] = $resultObject;

				$start = $result->occurences[$i]->start;
				$end = $result->occurences[$i]->end;
				$voice = $result->occurences[$i]->voice;
				$part_id = $result->occurences[$i]->part_id;

				$startMeasure = $xml->xpath('//part[@id="' . $part_id . '"]//note[' . $start . ']/..');
				$startMeasureNumber = (int)$startMeasure[0]['number'];
				$endMeasure = $xml->xpath('//part[@id="' . $part_id . '"]//note[' . $end . ']/..');
				$endMeasureNumber = (int)$endMeasure[0]['number'];
				for ($j = $startMeasureNumber; $j <= $endMeasureNumber; $j++) {
					// $measure = $xml->xpath('//part[@id="' . $part_id . '"]/measure[@number="' . $j . '"]');
					// $resultExtracts[$i][] = $measure;
					$measureNotes = $xml->xpath('//part[@id="' . $part_id . '"]/measure[@number="' . $j . '"]/note');
					// Debugbar::info($measureNotes);

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
								$noteObject->pitch = new stdClass();
								$noteObject->pitch->step = (string)$note->pitch->step;
								$noteObject->pitch->alter = (int)$note->pitch->alter;
								$noteObject->pitch->octave = (int)$note->pitch->octave;
								$resultNotes[$i]->notes[] = $noteObject;
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
		// Debugbar::info($artist[0]);
		if ($artist) {
			return $artist[0]->{'credit-words'}->{0};
		} else {
			return "Unknown";
		}
	}
	public static function _getTitle($id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$title = $xml->xpath("//credit[credit-type='title']");
		// Debugbar::info($title[0]->{'credit-words'});
		if ($title) {
			return $title[0]->{'credit-words'}->{0};
		} else {
			return "Unknown";
		}
	}
}