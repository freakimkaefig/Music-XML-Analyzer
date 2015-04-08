<?php

class DashboardController extends BaseController {

	/**
	 * Function to handle GET request for dashboard
	 *
	 * @return 	\Illuminate\View\View 	The dashboard view
	 *
	 */
	public function getToDashboard() {
		return View::make('dashboard');
	}


	/**
	 * Function to get all upload ids for current user (Ajax)
	 *
	 * @return 	string 	A JSON string containing an array of upload ids
	 *
	 */
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


	/**
	 * Function to get all result ids for current user
	 *
	 * @return 	string 	A JSON string containing an array of result ids
	 *
	 */
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


	/**
	 * Function to get the result for a given id
	 *
	 * @param 	int 	The result id
	 *
	 * @return 	string 	A JSON string containing the result object
	 *
	 */
	public function getResultValueById($id) {
		$result = Result::find($id);
		return $result->value;
	}
}
