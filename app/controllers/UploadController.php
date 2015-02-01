<?php

class UploadController extends BaseController {
	
	public function postUpload() {
		if (Cookie::get('user_id')) {
			$user = User::find(Cookie::get('user_id'));
			$file = Input::file('file');
			if($file) {
			    $destinationPath = public_path() . '/uploads/' . $user->id . '/';
			    $filename = $file->getClientOriginalName();
			    $upload_success = Input::file('file')->move($destinationPath, $filename);
			    
			    if ($upload_success) {
					$url = URL::to('/uploads/') . '/' . $user->id . '/' . $filename; 
			    	$this->_saveFile($user, $url);
			    	return Response::json('success', 200);
			    } else {
			        return Response::json('error', 400);
			    }
			}
		} else {
			return Redirect::route('home');
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
