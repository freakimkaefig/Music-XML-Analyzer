<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/**
 * Migration to create the "users" table
 *
 * @package Database
 */
class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 * Creates table "users" with columns id, last_activity
	 *
	 * @return void
	 */
	public function up()
	{
		//Create Users table
		Schema::create('users', function($table) {
			$table->engine = "InnoDB";
			$table->increments('id', true);
			$table->timestamp('last_activity');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 * Drops table "users"
	 *
	 * @return void
	 */
	public function down()
	{
		//Drop Users table
		Schema::dropIfExists('users');
	}

}
