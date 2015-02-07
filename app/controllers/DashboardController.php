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

		return json_encode($uploads);
	}

	public function getResultIds() {
		$results = [];

		foreach (Upload::where('user_id', '=', Cookie::get('user_id'))->get() as $upload) {
			if ($upload->result) {
				$result = $upload->result;
				$results[] = $result->id;
			}
		}

		return json_encode($results);
	}

	public function getResultValueById($id) {
		$result = Result::find($id);
		return $result->value;
	}
}
