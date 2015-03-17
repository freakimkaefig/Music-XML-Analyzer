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


/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| Routes only available, when user has uploaded files
|--------------------------------------------------------------------------
*/
Route::group(array('before' => 'uploads'), function() 
{
	/* === SEARCH ROUTES === */
	Route::get('/search', array(
		'as' => 'search',
		'uses' => 'SearchController@search'
	));

	/* === DASHBOARD ROUTES === */
	Route::get('/dashboard', array(
		'as' => 'dashboard',
		'uses' => 'DashboardController@getToDashboard'
	));
	Route::get('/dashboard/getUploadIds', array(
		'as' => 'dashboard.getUploadIds',
		'uses' => 'DashboardController@getUploadIds'
	));
	Route::get('/dashboard/getResultIds', array(
		'as' => 'dashboard.getResultIds',
		'uses' => 'DashboardController@getResultIds'
	));
	Route::get('/dashboard/getResultValueById/{id}', array(
		'as' => 'dashboard.getResultValueById',
		'uses' => 'DashboardController@getResultValueById'
	));

	/* === PATTERN ROUTES === */

	/* === DELETE USER === */
	Route::get('/delete/me', array(
		'as' => 'delete-me',
		'uses' => 'HomeController@getDeleteMe'
	));

	/* === DOWNLOAD ROUTES === */
	Route::get('/download', array(
		'as' => 'download',
		'uses' => 'DownloadController@getResultsCSV'
	));
});

	Route::get('/pattern', array(
		'as' => 'pattern',
		'uses' => 'PatternController@getCreatePattern'
	));
	Route::post('/search', array(
		'as' => 'patternSearch',
		'uses' => 'PatternController@postPatternSearch'
	));
	Route::get('/results', array(
		'as' => 'searchResults',
		'uses' => 'ResultController@getSearchResults'
	));
	Route::get('/results/detail/{file}', array(
		'as' =>'resultDetail',
		'uses' => 'ResultController@getResultDetail'
	));


/*
|--------------------------------------------------------------------------
| Routes only available, when user is recognized
|--------------------------------------------------------------------------
*/
Route::group(array('before' => 'user'), function() 
{
	/* === UPLOAD ROUTES === */
	Route::post('/upload', array(
		'as' => 'postUpload',
		'uses' => 'UploadController@postUpload'
	));
	Route::get('/upload-complete', array(
		'as' => 'uploadComplete',
		'uses' => 'UploadController@getUploadComplete'
	));
});
