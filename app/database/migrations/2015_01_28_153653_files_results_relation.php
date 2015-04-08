<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/**
 * Migration to create the relation between "results" and "files"
 *
 * @package Database
 */
class FilesResultsRelation extends Migration {

	/**
	 * Run the migrations.
	 * Adds file_id to "results" table
	 *
	 * @return void
	 */
	public function up()
	{
		//Create results <-> files relation
		Schema::table('results', function($table) {
			$table->integer('file_id')->unsigned();
			$table->foreign('file_id')->references('id')->on('files');
		});
	}

	/**
	 * Reverse the migrations.
	 * Removes foreign_key file_id from "results" table
	 *
	 * @return void
	 */
	public function down()
	{
		//Remove results <-> files relation
		Schema::table('results', function($table) {
			$table->dropForeign('results_file_id_foreign');
		});

		Schema::table('results', function($table) {
			$table->dropColumn('file_id');
		});

	}

}
