<?php

class UploadController extends BaseController {
	
	public function postUpload() {
		$input = Input::all();
	    // $rules = array(
	    //     'file' => 'max:3000',
	    // );
	 
	    // $validation = Validator::make($input, $rules);
	 
	    // if ($validation->fails())
	    // {
	    //     return Response::make($validation->errors->first(), 400);
	    // }
	 
	    $file               = Input::file('file');
	    $destinationPath    = 'uploads';
	 
	    // Get real extension according to mime type
	    $ext                = $file->guessClientExtension();  
	 
	    // Client file name, including the extension of the client
	    $fullname           = $file->getClientOriginalName(); 
	 
	    // Hash processed file name, including the real extension
	    $hashname           = date('H.i.s').'-'.md5($fullname).'.'.$ext; 
	    $upload_success     = Input::file('file')->move($destinationPath, $hashname);
	    $models             = new Picture;
	    $models->filename   = $hashname;
	    $models->article_id = $id;
	    $models->user_id    = Auth::user()->id;
	    $models->save();
	 
	    if( $upload_success ) {
	       return Response::json('success', 200);
	    } else {
	       return Response::json('error', 400);
	    }
	}

}
