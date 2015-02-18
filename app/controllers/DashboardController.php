<?php

class DashboardController extends BaseController {

	public function getToDashboard()
	{
		return View::make('dashboard');
	}

	public function getUploadIds() {
		$uploads = [];

		foreach (Upload::where('user_id', '=', Cookie::get('user_id'))->get() as $upload) {
			$uploads[] = $upload->id;
		}

		if (count($uploads)) {
			return json_encode($uploads);
		} else {
			return "empty";
		}
	}

	public function getResultIds() {
		$results = [];

		foreach (Upload::where('user_id', '=', Cookie::get('user_id'))->get() as $upload) {
			if ($upload->result) {
				$result = $upload->result;
				$results[] = $result->id;
			}
		}

		if (count($results)) {
			return json_encode($results);
		} else {
			return "empty";
		}
	}

	public function getResultValueById($id) {
		$result = Result::find($id);
		return $result->value;
	}
}
