<?php

/**
 * Model for representation of analysis results
 *
 * @package 	Models
 */
class Result extends Eloquent {

	/**
	 * String containing the database table
	 * @var string
	 */
	protected $table = 'results';

	/**
	 * Controlling soft delete
	 * @var bool
	 */
	protected $softDelete = false;

	/**
	 * Array with fillable fields
	 * @var array
	 */
	protected $fillable = array('value');

	/**
	 * Function to retrieve associated upload
	 * @return 	\Upload 	A collection of users uploads
	 */
	public function upload() {
		return $this->belongsTo('Upload');
	}
}