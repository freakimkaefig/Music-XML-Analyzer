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

	public function name() {
		$path = explode('/', $this->url);
		return $path[count($path) - 1];
	}

	// http://stackoverflow.com/questions/2602612/php-remote-file-size-without-downloading-file
	public function filesize() {
		// Assume failure.
		$result = -1;

		$curl = curl_init( $this->url );

		// Issue a HEAD request and follow any redirects.
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

		    // http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
		    if( $status == 200 || ($status > 300 && $status <= 308) ) {
		    	$result = $content_length;
		    }
		}

		return $result;
	}
}