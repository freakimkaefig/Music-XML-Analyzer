<?php

/**
 * Controller to handle requests to home
 * Functions to create and delete users
 *
 * @package 	Controllers
 */
class HomeController extends BaseController {

	/**
	 * Function to handle GET request for front page
	 *
	 * @return 	\Illuminate\Http\RedirectResponse|\Illuminate\View\View 	if user already uploaded files the function redirects to dashboard, if not the home view is returned
	 *
	 */
	public function getHome() {
		if (Cookie::get('user_id')) {
			$user = User::find(Cookie::get('user_id'));
			if ($user) {
				$name = 'user_id';
				$value = $user->id;
				$minutes = 60*24*7;
				Cookie::queue($name, $value, $minutes);
				$user->resetLastActivity();
				$uploads = $user->uploads;
				if (!$uploads->isEmpty()) {
					return Redirect::route('dashboard');
				} else {
					return View::make('home');
				}
			}
		}

		$this->_createNewUser();

		return View::make('home');
	}


	/**
	 * Function to handle GET request for resetting user data
	 *
	 * @return 	\Illuminate\Http\RedirectResponse 	Redirect to home view
	 *
	 */
	public function getDeleteMe()
	{
		$user = User::find(Cookie::get('user_id'));

		$user->uploads->each(function($upload) {

			if (count($upload->result)) {
				$upload->result->delete();
			}
			$upload->delete();
	    });

		$upload_directory = public_path() . '/uploads/' . $user->id;
		$success = Upload::delTree($upload_directory);
		$download_directory = public_path() . '/downloads/' . $user->id;
		$success = Upload::delTree($download_directory);
	    $user->delete();

	    $this->_createNewUser();

	    return Redirect::route('home');
	}


	/**
	 * Function to create a new user in database
	 */
	private function _createNewUser() {
		$user = new User;
		$user->last_activity = date('Y-m-d H:m:s');
		$user->save();

		$name = 'user_id';
		$value = $user->id;
		$minutes = 60*24*7;
		Cookie::queue($name, $value, $minutes);
	}


	/**
	 * Function to handle GET and POST request to clear database.
	 * This function is used when deploying to remote
	 */
	public function getClear()
	{
		foreach (User::all() as $user)
		{
			echo "Checking uploads for User " . $user->id . ".<br>";
		    $user->uploads->each(function($upload) {
				if (count($upload->result)) {
		    		echo "Deleting result " . $upload->result->id . " for upload " . $upload->id . ".<br>";
					$upload->result->delete();
				}
	    		echo "Deleting result " . $upload->id . " (" . $upload->url . ").<br>";
				$upload->delete();
		    });

    		echo "Deleting user " . $user->id . ".<br>";
		    $user->delete();
		    echo "<hr>";

		    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
		    DB::table('users')->truncate();
		    DB::table('uploads')->truncate();
		    DB::table('results')->truncate();
		    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
		}
	}

}
