<?php

class ResultController extends BaseController {

	public function getSearchResults() {

		$pattern = Session::get('pattern');
		$results = Session::get('results');

		return View::make('results.list')
			->with('pattern', $pattern)
			->with('results', $results);
	}
}