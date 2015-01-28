<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
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
	 *
	 * @return void
	 */
	public function down()
	{
		//Drop Users table
		Schema::dropIfExists('users');
	}

}
