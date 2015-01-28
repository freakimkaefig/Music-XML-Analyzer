<?php

class UploadController extends BaseController {

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

	public function uploadFiles()
	{
		Log::info('UploadController@uploadFiles');
		$file = Input::file('file');
	    $extension = File::extension($file->getClientOriginalName());
	    $directory = 'upload/' . "01"; //Auth::user()->id;
	    $filename =  "test." . $extension;

	    $upload_success = Input::file('file')->move($directory, $filename); 
	}
	
}
