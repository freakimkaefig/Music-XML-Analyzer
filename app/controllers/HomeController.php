<?php

class HomeController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| Default Home Controller
	|--------------------------------------------------------------------------
	|
	| You may wish to use controllers instead of, or in addition to, Closure
	| based routes. That's great! Here is an example controller method to
	| get you started. To route to this controller, just add the route:
	|
	|	Route::get('/', 'HomeController@showWelcome');
	|
	*/

	public function getHome()
	{
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

	private function _createNewUser() {
		$user = new User;
		$user->last_activity = date('Y-m-d H:m:s');
		$user->save();

		$name = 'user_id';
		$value = $user->id;
		$minutes = 60*24*7;
		Cookie::queue($name, $value, $minutes);
	}

	public function getToImprint()
	{
		return View::make('imprint');
	}
	
}
