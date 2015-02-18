<?php

class User extends Eloquent {
	
	protected $table = 'users';

	protected $softDelete = false;

	protected $fillable = array('last_activity');

	public function uploads() {
		return $this->hasMany('Upload');
	}

	public function resetLastActivity() {
		$this->last_activity = date('Y-m-d H:m:s');
		$this->save();
	}
}
