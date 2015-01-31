<?php

class User extends Eloquent {
	
	protected $table = 'users';

	protected $softDelete = true;

	protected $fillable = array('last_activity');

	public function uploads() {
		return $this->hasMany('Upload');
	}

}
