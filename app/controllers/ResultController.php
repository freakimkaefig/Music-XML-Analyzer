<?php

class ResultController extends BaseController {

	public function getSearchResults() {

		if (Session::has('pattern')) {
			$pattern = Session::get('pattern');
		} elseif (Cache::has('pattern')) {
			$pattern = Cache::get('pattern');
		} else {
			return Redirect::route('pattern');
		}

		if (Session::has('results')) {
			$results = Session::get('results');
		} elseif (Cache::has('results')) {
			$results = Cache::get('results');
		} else {
			return Redirect::route('pattern');
		}

		return View::make('results.list')
			->with('pattern', $pattern)
			->with('results', $results);
	}

	public function getResultDetail($file, $occurences) {

		$upload = Upload::find($file);
		var_dump($upload->url);
		echo '<br>';
		dd(explode(',', $occurences));
	}
}