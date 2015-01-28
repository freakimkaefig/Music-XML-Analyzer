<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResultsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//Create Results table
		Schema::create('results', function($table) {
			$table->engine = "InnoDB";
			$table->increments('id', true);
			$table->string('value', 250000);
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
		//Drop Results table
		Schema::dropIfExists('results');
	}

}
