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
/**
 * Route for home view
 *
 * @uses 	Route::get()
 */
Route::get('/', array(
	'as' => 'home',
	'uses' => 'HomeController@getHome'
));


/**
 * Route to clear database after deploy (used for heroku deploy hook)
 *
 * @uses 	Route::post()
 */
Route::post('/clear', array(
	'as' => 'postClear',
	'uses' => 'HomeController@getClear'
));
Route::get('/clear', array(
	'as' => 'postClear',
	'uses' => 'HomeController@getClear'
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


/*
|--------------------------------------------------------------------------
| Routes only available, when user has uploaded files
|--------------------------------------------------------------------------
*/
Route::group(array('before' => 'uploads'), function()
{
	/* === SEARCH ROUTES === */
	/**
	 * Route triggering analysis
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/search', array(
		'as' => 'search',
		'uses' => 'SearchController@search'
	));


	/* === DASHBOARD ROUTES === */
	/**
	 * Route for dashboard view
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/dashboard', array(
		'as' => 'dashboard',
		'uses' => 'DashboardController@getToDashboard'
	));

	/**
	 * Route for score view
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/score/{id}/{part?}', array(
		'as' => 'score',
		'uses' => 'DashboardController@renderScore'
	));

	/**
	 * Route for JSON upload ids (ajax)
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/dashboard/getUploadIds', array(
		'as' => 'dashboard.getUploadIds',
		'uses' => 'DashboardController@getUploadIds'
	));

	/**
	 * Route for JSON result ids (ajax)
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/dashboard/getResultIds', array(
		'as' => 'dashboard.getResultIds',
		'uses' => 'DashboardController@getResultIds'
	));

	/**
	 * Route for JSON analysis result (ajax)
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/dashboard/getResultValueById/{id}', array(
		'as' => 'dashboard.getResultValueById',
		'uses' => 'DashboardController@getResultValueById'
	));


	/* === PATTERN ROUTES === */
	/**
	 * Route for pattern input view
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/pattern', array(
		'as' => 'pattern',
		'uses' => 'PatternController@getCreatePattern'
	));

	/**
	 * Route for searching pattern in uploads
	 *
	 * @uses 	Route::get()
	 */
	Route::post('/search', array(
		'as' => 'patternSearch',
		'uses' => 'PatternController@postPatternSearch'
	));


	/* === DOWNLOAD ROUTES === */
	/**
	 * Route for downloading analysis results as CSV
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/download', array(
		'as' => 'download',
		'uses' => 'DownloadController@getResultsCSV'
	));


	/* === RESULT ROUTES === */
	/**
	 * Route for search results list
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/results', array(
		'as' => 'searchResults',
		'uses' => 'ResultController@getSearchResults'
	));

	/**
	 * Route for getting search result detail
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/results/detail/{file}/{page}', array(
		'as' =>'resultDetail',
		'uses' => 'ResultController@getResultDetail'
	));

	/**
	 * Route for generating result extract
	 *
	 * @uses 	Route::get()
	 */
	Route::post('/result/extract', array(
		'as' => 'resultExtract',
		'uses' => 'ResultController@postResultExtract'
	));


	/* === DELETE USER === */
	/**
	 * Route to reset user data
	 *
	 * @uses 	Route::get()
	 */
	Route::get('/delete/me', array(
		'as' => 'delete-me',
		'uses' => 'HomeController@getDeleteMe'
	));

});
