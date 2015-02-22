<?php

class ResultController extends BaseController {

	public function getSearchResults() {

		echo "<br><br><br><br>";

		if (Session::has('pattern')) {
			$pattern = Session::get('pattern');
			Cache::put('pattern', $pattern, 60*24);
		} elseif (Cache::has('pattern')) {
			echo "Retrieved pattern from cache!\n";
			$pattern = Cache::get('pattern');
		} else {
			return Redirect::route('pattern');
		}

		if (Session::has('results')) {
			$results = Session::get('results');
			Cache::put('results', $results, 60*24);
		} elseif (Cache::has('results')) {
			echo "Retrieved results from cache!\n";
			$results = Cache::get('results');
		} else {
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

			$notes = $xml->xpath('//note');

			// get the part in which the start note is
			$startPart = $xml->xpath('//note[' . $result->occurences[0]->note . ']/../..');

			// get the measure in which the start note is
			$startMeasure = $xml->xpath('//note[' . $result->occurences[0]->note . ']/..');

			// get the measure in which the end note is
			$endMeasure = $xml->xpath('//note[' . ($result->occurences[0]->note + count($pattern) - 1) . ']/..');

			var_dump($startPart);
			echo '<hr>';
			var_dump($startMeasure);
			echo '<hr>';
			var_dump($endMeasure);
			echo '<hr>';

		} else {
			Redirect::route('pattern');
		}
	}


	public static function _getArtist($id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$artist = $xml->xpath("//credit[credit-type='composer']");
		// var_dump($artist[0]);
		if ($artist) {
			return $artist[0]->{'credit-words'}->{0};
		} else {
			return "Unknown";
		}
	}
	public static function _getTitle($id) {
		$xml = simplexml_load_file(Upload::find($id)->url);
		$title = $xml->xpath("//credit[credit-type='title']");
		// var_dump($title[0]->{'credit-words'});
		if ($title) {
			return $title[0]->{'credit-words'}->{0};
		} else {
			return "Unknown";
		}
	}
}