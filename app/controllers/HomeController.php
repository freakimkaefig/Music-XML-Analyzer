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
				$uploads = $user->uploads;
				if (!$uploads->isEmpty()) {
					return View::make('dashboard');
				}
			}
		}
		
		$this->_createNewUser();
		return View::make('Home');
	}

	private function _createNewUser() {
		$user = new User;
		$user->last_activity = date('Y-m-d H:m:s');
		$user->save();

		$name = 'user_id';
		$value = $user->id;
		$minutes = 60;
		Cookie::queue($name, $value, $minutes);
	}

	public function getToImprint()
	{
		return View::make('imprint');
	}
	
}
