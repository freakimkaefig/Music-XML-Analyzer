<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UsersFilesRelation extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//Create users <-> files relation
		Schema::table('files', function($table) {
			$table->integer('user_id')->unsigned();
			$table->foreign('user_id')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//Remove users <-> files relation
		Schema::table('files', function($table) {
			$table->dropForeign('files_user_id_foreign');
		});

		Schema::table('files', function($table) {
			$table->dropColumn('user_id');
		});

	}

}
