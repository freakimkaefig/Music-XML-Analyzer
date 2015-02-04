<?php

class DashboardController extends BaseController {

	public function getToDashboard()
	{
		return View::make('dashboard');
	}

	public function getUploadIds() {
		$uploads = [];
		$user = User::find(Cookie::get('user_id'));
		$user->uploads->each(function($upload) {
			$uploads[] = $upload->id;
		});
		return json_encode($uploads);
	}

	public function getResultIds() {
		$results = [];
		$user = User::find(Cookie::get('user_id'));
		$user->uploads->each(function($upload) {
			if ($upload->result) {
				$result = $upload->result;
				$results[] = $result->id;
			}
		});
		return json_encode($results);
	}

	public function getResultValueById($id) {
		$result = Result::find($id);
		return json_encode($result->value);
	}
}
