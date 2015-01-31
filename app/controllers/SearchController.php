<?php

class SearchController extends BaseController {

	public function search()
	{
		/////////////////////////
		// Getting files for current user
		/////////////////////////
		echo "</br></br></br></br>";
		if (Cookie::get('user_id')) {
			$user = User::find(Cookie::get('user_id'));
			$user->uploads->each(function($upload) {
				echo $upload->id;
				echo '<br>';
				echo $upload->url;
				echo '<hr>';
				$files[] = array(
					'id' => $upload->id,
					'url' => $upload->url,
				);
			});
		}

		/////////////////////////
		//Testing php xpath query
		/////////////////////////

		//load xml file from url
		$xml = simplexml_load_file("https://dl.dropboxusercontent.com/u/8633542/xQuery/Test.xml");
		
		echo "<pre>";
		//"$this always refers to the object, in which a method exists, itself."
		//echo $this->getNoteValues($xml);
		//echo "</br></br>häufigste Note: " . $this->getMostFrequentNote($xml);
		echo "</br></br>Anzahl Pausen: " . $this->getRestQuantity($xml);
		echo "</br></br>Anzahl Takte: " . $this->getMeasureQuantity($xml);
		echo "</pre>";
		
		/////////////////////////
		/////////////////////////
		/////////////////////////


		//toJson:
		//jsonencode bzw jsondecode zur umwandlung von php objekten in json




		//return search view
		return View::make('search');
	}

	///////////////
	//Public Getter
	///////////////
	public function getNoteValues($xml){
		return json_encode($this->countNoteValues($xml));
	}
	public function getMostFrequentNote($xml){
		return json_encode($this->determineMostFrequentNote($xml));
	}
	public function getRestQuantity($xml){
		return json_encode($this->countRests($xml));
	}
	public function getMeasureQuantity($xml){
		return json_encode($this->countMeasures($xml));
	}

	/////////////////////////////
	//Internal analysis functions
	/////////////////////////////

	function countMeasures($xml){
		$measures = $xml->xpath("//measure");
		return count($measures);
	}


	function countRests($xml){
		$rests = $xml->xpath("//rest");
		return count($rests);
	}


	function countNoteValues($xml){

		//"The descendant (double-slash) operator in xpath will search all descendants for a match."
		//"The below is equivalent to the DOM method getElementsByTagName"
		//fetch all <note> tags
		$notes = $xml->xpath("//note");

		//Array anlegen
		$notesArray = array();

		//Noten zählen:
		foreach($notes as $note) {
			$value = $note->pitch->step;
			//check if note equals rest and therefore mustn't be counted
			if($value != null){
				//cast obj to string before pushing it to array
				array_push($notesArray,(string)$value);
			}
	    }
	    return array_count_values($notesArray);;
	}


	function determineMostFrequentNote($xml){

		//häufigkeiten der Noten zählen
		$countedNotes = $this->countNoteValues($xml);

	    //häufigste note ausgeben
	    return array_search(max($countedNotes), $countedNotes);

	}

}
