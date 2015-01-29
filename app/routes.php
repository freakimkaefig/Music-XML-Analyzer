<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', array(
	'as' => 'home',
	'uses' => 'HomeController@getHome'
));

Route::get('/search', array(
	'as' => 'search',
	'uses' => 'SearchController@search'
));
Route::get('/imprint', array(
	'as' => 'imprint',
	'uses' => 'HomeController@getToImprint'
));

Route::get('/dashboard', array(
	'as' => 'dashboard',
	'uses' => 'DashboardController@getToDashboard'
));

// Route::get('/pattern', function()
// {
// 	print "test";
// });

Route::post('/upload', function () {
    $file = Input::file('file');
    if($file) {
        $destinationPath = public_path() . '/uploads/';
        $filename = $file->getClientOriginalName();
        $upload_success = Input::file('file')->move($destinationPath, $filename);
        
        if ($upload_success) {
            return Response::json('success', 200);
        } else {
            return Response::json('error', 400);
        }
    }
});
