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

Route::get('/pattern', array(
	'as' => 'pattern',
	'uses' => 'PatternController@getCreatePattern'
));

/* === UPLOAD === */
Route::post('/upload', array(
	'as' => 'postUpload',
	'uses' => 'UploadController@postUpload'
));

Route::get('/upload-complete', array(
	'as' => 'uploadComplete',
	'uses' => 'UploadController@getUploadComplete'
));
