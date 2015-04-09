<?php

return array(

	/*
	|--------------------------------------------------------------------------
	| Database Connections
	|--------------------------------------------------------------------------
	|
	| Here are each of the database connections setup for your application.
	| Of course, examples of configuring each database platform that is
	| supported by Laravel is shown below to make development simple.
	|
	|
	| All database work in Laravel is done through the PHP PDO facilities
	| so make sure you have the driver for your particular database of
	| choice installed on your machine before you begin development.
	|
	*/

	'default' => 'pgsql',
	'connections' => array(

		'pgsql' => array(
			'driver'    => 'pgsql',
			'host'      => parse_url(getenv("DATABASE_URL"))['host'],
			'database'  => substr(parse_url(getenv("DATABASE_URL"))['path'], 1),
			'username'  => parse_url(getenv("DATABASE_URL"))['user'],
			'password'  => parse_url(getenv("DATABASE_URL"))['pass'],
			'charset'   => 'utf8',
			'prefix'    => '',
			'schema' 	=> 'public',
		),

	),

);
