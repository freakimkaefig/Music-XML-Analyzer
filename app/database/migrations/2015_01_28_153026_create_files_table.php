<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//Create Files table
		Schema::create('files', function($table) {
			$table->engine = "InnoDB";
			$table->increments('id', true);
			$table->string('url', 250000);
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
		//Drop Files table
		Schema::dropIfExists('files');
	}

}
