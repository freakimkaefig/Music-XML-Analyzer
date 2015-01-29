<?php

class Result extends Eloquent {

	protected $table = 'results';

	protected $softDelete = true;

	protected $fillable = array('value');

	public function file() {
		return $this->belongsTo('Upload');
	}
}