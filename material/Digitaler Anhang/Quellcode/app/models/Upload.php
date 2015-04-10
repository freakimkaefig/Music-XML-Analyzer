<?php

/**
 * Model for representation of uploaded files
 *
 * @package 	Models
 */
class Upload extends Eloquent {

	/**
	 * String containing the database table
	 * @var string
	 */
	protected $table = 'uploads';

	/**
	 * Controlling soft delete
	 * @var bool
	 */
	protected $softDelete = false;

	/**
	 * Array with fillable fields
	 * @var array
	 */
	protected $fillable = array('url');


	/**
	 * Function to retrieve associated upload
	 * @return 	\User 	The user model associated
	 */
	public function user() {
		return $this->belongsTo('User');
	}

	/**
	 * Function to retrieve associated result
	 * @return 	\Result 	The result model associated
	 */
	public function result() {
		return $this->hasOne('Result');
	}

	/**
	 * Function to get the file name
	 * @return 	string 	The filename
	 */
	public function name() {
		$path = explode('/', $this->url);
		return $path[count($path) - 1];
	}

	/**
	 * Function to get the filesize
	 * @return 	string 	The filesize
	 */
	public function filesize() {
		// Assume failure
		$result = -1;

		$curl = curl_init( $this->url );

		curl_setopt( $curl, CURLOPT_NOBODY, true );
		curl_setopt( $curl, CURLOPT_HEADER, true );
		curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $curl, CURLOPT_FOLLOWLOCATION, true );
		curl_setopt( $curl, CURLOPT_USERAGENT, get_user_agent_string() );

		$data = curl_exec( $curl );
		curl_close( $curl );

		if( $data ) {
			$content_length = "unknown";
		    $status = "unknown";

		    if( preg_match( "/^HTTP\/1\.[01] (\d\d\d)/", $data, $matches ) ) {
		    	$status = (int)$matches[1];
		    }

		    if( preg_match( "/Content-Length: (\d+)/", $data, $matches ) ) {
		    	$content_length = (int)$matches[1];
		    }

		    if( $status == 200 || ($status > 300 && $status <= 308) ) {
		    	$result = $content_length;
		    }
		}
		return $result;
	}

	/**
	 * Function to recursively remove a directory
	 * @return 	bool 	Returns false if operation fails
	 */
	public static function delTree($dir) {
		if (is_dir($dir)) {
			$files = array_diff(scandir($dir), array('.','..'));
			foreach ($files as $file) {
		    	(is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
		    }
		    return rmdir($dir);
		} else {
			return false;
		}
	}
}
