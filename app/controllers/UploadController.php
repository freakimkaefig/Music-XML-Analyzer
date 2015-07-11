<?php

/**
 * Controller to handle uploads
 * Ability to transform timewise files to partwise files
 *
 * @package 	Controllers
 */
class UploadController extends BaseController {

	/**
	 * Function to handle POST request for file upload
	 *
	 * @return 	\Illuminate\Http\JsonResponse 	The JSON response code
	 *
	 */
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


	/**
	 * Function to transform MusicXML files in format "score-timewise" to format "score partwise"
	 *
	 * @param 	string 			$url 	The url of the file to transform
	 *
	 * @return 	bool|string 	False when operation fails, URL as string when operation succeeds
	 *
	 */
	private function xslTransform($url) {
		$simpleXml = simplexml_load_file($url);
		$timewise = $simpleXml->xpath("//score-timewise");
		if ($timewise) {
			$xslDoc = new DOMDocument();
			$xslDoc->load(URL::to("libs/timewise_to_partwise.xsl"));

			$xmlDoc = new DOMDocument();
			$xmlDoc->load($url);

			$userId = Cookie::get('user_id');
			$urlParts = explode('/', $url);
			$filename = end($urlParts);
			$path = public_path() . '\\uploads\\' . $userId . '\\' . $filename;

			$proc = new XSLTProcessor();
			$proc->importStylesheet($xslDoc);
			$transformation = $proc->transformToURI($xmlDoc, $path);
			if ($transformation) {
				return $url;
			} else {
				return false;
			}
		}
		return $url;
	}


	/**
	 * Function to save files to database
	 *
	 * @param 	\User 	$user 	The user as Eloquent Model
	 * @param 	string 	$url 	The file url
	 *
	 */
	private function _saveFile($user, $url) {
		$upload = new Upload;
		$upload->url = $this->xslTransform($url);
		$content = file_get_contents($upload->url);
		$upload->content = $content;
		$upload->user()->associate($user);
		$upload->save();
		$content2 = $upload->content;
		Log::info($content2);
	}


	/**
	 * Function to trigger that the upload is complete
	 *
	 * @return 	\Illuminate\Http\RedirectResponse 	The redirect to trigger search
	 *
	 */
	public function getUploadComplete() {
		return Redirect::route('search');
	}

}
