<?php

class UploadController extends BaseController {
	
	public function postUpload() {
		$user = User::find(Cookie::get('user_id'));
		$file = Input::file('file');
		if($file) {
		    $destinationPath = public_path() . '/uploads/' . $user->id . '/';
		    $filename = $file->getClientOriginalName();
		    $filename = str_replace("Ä", "Ae", $filename);
		    $filename = str_replace("ä", "ae", $filename);
		    $filename = str_replace("Ö", "Oe", $filename);
		    $filename = str_replace("ö", "oe", $filename);
		    $filename = str_replace("Ü", "Ue", $filename);
		    $filename = str_replace("ü", "ue", $filename);
		    $filename = str_replace("ß", "ss", $filename);
		    $filename = str_replace("á", "a", $filename);
		    $filename = str_replace("à", "a", $filename);
		    $filename = str_replace("â", "a", $filename);
		    $filename = str_replace("é", "e", $filename);
		    $filename = str_replace("è", "e", $filename);
		    $filename = str_replace("ê", "e", $filename);
		    $filename = str_replace("ó", "o", $filename);
		    $filename = str_replace("ò", "o", $filename);
		    $filename = str_replace("ô", "o", $filename);
		    $filename = str_replace("í", "i", $filename);
		    $filename = str_replace("ì", "i", $filename);
		    $filename = str_replace("î", "i", $filename);
		    $filename = preg_replace("/[^a-z0-9.]+/i", "_", $filename);
		    $upload_success = Input::file('file')->move($destinationPath, $filename);
		    
		    if ($upload_success) {
				$url = URL::to('/uploads/') . '/' . $user->id . '/' . $filename; 
		    	$this->_saveFile($user, $url);
		    	return Response::json('success', 200);
		    } else {
		        return Response::json('error', 400);
		    }
		}
	}

	private function _saveFile($user, $url) {
		$upload = new Upload;
		$upload->url = $url;
		$upload->user()->associate($user);
		$upload->save();
	}

	public function getUploadComplete() {
		return Redirect::route('search');
	}

}
