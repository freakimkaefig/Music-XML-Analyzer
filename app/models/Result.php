<?php

class Result extends Eloquent {

	protected $table = 'results';

	protected $softDelete = false;

	protected $fillable = array('value');

	public function upload() {
		return $this->belongsTo('Upload');
	}
}