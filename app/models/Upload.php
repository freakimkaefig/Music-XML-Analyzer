<?php

class Upload extends Eloquent {

	protected $table = 'uploads';

	protected $softDelete = false;

	protected $fillable = array('url');

	public function user() {
		return $this->belongsTo('User');
	}

	public function result() {
		return $this->hasOne('Result');
	}
}