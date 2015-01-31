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

/* === STATIC PAGE ROUTES === */
Route::get('/', array(
	'as' => 'home',
	'uses' => 'HomeController@getHome'
));
Route::get('/imprint', array(
	'as' => 'imprint',
	'uses' => 'HomeController@getToImprint'
));


/* === SEARCH ROUTES === */
Route::get('/search', array(
	'as' => 'search',
	'uses' => 'SearchController@search'
));

Route::get('/dashboard', array(
	'as' => 'dashboard',
	'uses' => 'DashboardController@getToDashboard'
));

// Route::get('/pattern', function()
// {
// 	print "test";
// });

/* === UPLOAD === */
Route::post('/upload', array(
	'as' => 'postUpload',
	'uses' => 'UploadController@postUpload'
));

Route::get('/upload-complete', array(
	'as' => 'uploadComplete',
	'uses' => 'UploadController@getUploadComplete'
));
