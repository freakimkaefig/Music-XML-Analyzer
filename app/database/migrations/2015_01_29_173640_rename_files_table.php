<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameFilesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//Remove results <-> files relation
		Schema::table('results', function($table) {
			$table->dropForeign('results_file_id_foreign');
		});

		Schema::table('results', function($table) {
			$table->dropColumn('file_id');
		});

		//Remove users <-> files relation
		Schema::table('files', function($table) {
			$table->dropForeign('files_user_id_foreign');
		});

		Schema::table('files', function($table) {
			$table->dropColumn('user_id');
		});

		// Remove table users
		Schema::dropIfExists('files');


		//Create Uploads table
		Schema::create('uploads', function($table) {
			$table->engine = "InnoDB";
			$table->increments('id', true);
			$table->string('url', 250000);
			$table->timestamps();
		});

		//Create users <-> uploads relation
		Schema::table('uploads', function($table) {
			$table->integer('user_id')->unsigned();
			$table->foreign('user_id')->references('id')->on('users');
		});

		//Create results <-> uploads relation
		Schema::table('results', function($table) {
			$table->integer('upload_id')->unsigned();
			$table->foreign('upload_id')->references('id')->on('uploads');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//Remove results <-> uploads relation
		Schema::table('results', function($table) {
			$table->dropForeign('results_upload_id_foreign');
		});

		Schema::table('results', function($table) {
			$table->dropColumn('upload_id');
		});

		//Remove users <-> uploads relation
		Schema::table('uploads', function($table) {
			$table->dropForeign('uploads_user_id_foreign');
		});

		Schema::table('uploads', function($table) {
			$table->dropColumn('user_id');
		});

		Schema::dropIfExists('uploads');

		

		//Create Files table
		Schema::create('files', function($table) {
			$table->engine = "InnoDB";
			$table->increments('id', true);
			$table->string('url', 250000);
			$table->timestamps();
		});

		//Create users <-> files relation
		Schema::table('files', function($table) {
			$table->integer('user_id')->unsigned();
			$table->foreign('user_id')->references('id')->on('users');
		});

		//Create results <-> files relation
		Schema::table('results', function($table) {
			$table->integer('file_id')->unsigned();
			$table->foreign('file_id')->references('id')->on('files');
		});
	}

}
