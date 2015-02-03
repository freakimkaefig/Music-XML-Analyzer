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
		//for testing purpose
		$xml = simplexml_load_file("https://dl.dropboxusercontent.com/u/58016505/ActorPreludeSample.xml");

		echo "<pre>";
		//"$this always refers to the object, in which a method exists, itself."
		echo "Notenverteilung: " . $this->getNoteValues($xml);
		echo "</br></br>häufigste Note: " . $this->getMostFrequentNote($xml);
		echo "</br></br>Anzahl Pausen: " . $this->getRestQuantity($xml);
		echo "</br></br>Anzahl Takte: " . $this->getMeasureQuantity($xml);
		echo "</br></br>Anzahl Noten: " . $this->getNoteQuantity($xml);
		echo "</br></br>Takt: " . $this->getMeter($xml);
		echo "</br></br>Notenschlüssel: " . $this->getClef($xml);
		echo "</br></br>Tonart: " . $this->getKey($xml);
		echo "</br></br>Notenlängen: " . $this->getNoteTypes($xml);
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
	//UNNÖTIG?
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
	public function getNoteQuantity($xml){
		return json_encode($this->countNotes($xml));
	}
	public function getMeter($xml){
		$json = json_encode($this->determineMeter($xml));
		return str_replace('\\', '', $json);
	}
	public function getClef($xml){
		$json = json_encode($this->determineClef($xml));
		//fix non utf-8 json-encoding for special german char 'ü'
		$json = str_replace('\u00fce', 'ü', $json);
		$json = str_replace('\u00fc', 'ü', $json);

		return $json;
	}
	public function getKey($xml){
		return json_encode($this->determineKey($xml));
	}
	public function getNoteTypes($xml){
		return json_encode($this->countNoteTypes($xml));
	}

	/////////////////////////////
	//Internal analysis functions
	/////////////////////////////
	function countIntervals($xml){
		//toDo: magic.
	}


	function countNoteTypes($xml){
		$notes = $xml->xpath("//note");

		$noteTypesArray = array();

		foreach($notes as $note) {
			$value = $note->type;
			$rest = $note->rest;
			if(!$rest){
				array_push($noteTypesArray,(string)$value);
			}
	    }
	    return array_count_values($noteTypesArray);;
	}


	function determineMeter($xml){
		$beat = $xml->xpath("//beats");
		$beatType =  $xml->xpath("//beat-type");
		$meter = $beat[0] ."/". $beatType[0];
		return $meter;
	}


	function determineKey($xml){
		$keys = $xml->xpath("//key");
		$keysArray = array();

		foreach($keys as $key) {
			$fifths = $key->fifths;
			$mode = (string)$key->mode;
			
			if($fifths != null && $mode === "major"){
				switch($fifths):
					case "0":
						$keyString = "C";
						break;
					case "1":
						$keyString = "G";
						break;
					case "2":
						$keyString = "D";
						break;
					case "3":
						$keyString = "A";
						break;
					case "4":
						$keyString = "E";
						break;
					case "5":
						$keyString = "H";
						break;
					case "6":
						$keyString = "Fis";
						break;
					case "7":
						$keyString = "Cis";
						break;
					case "-1":
						$keyString = "F";
						break;
					case "-2":
						$keyString = "B";
						break;
					case "-3":
						$keyString = "Es";
						break;
					case "-4":
						$keyString = "As";
						break;
					case "-5":
						$keyString = "Des";
						break;
					case "-6":
						$keyString = "Ges";
						break;
					case "-7":
						$keyString = "Ces";
						break;
				endswitch;
				array_push($keysArray, $keyString."-Dur");
			}
			elseif($fifths != null && $mode === "minor"){
				switch($fifths):
					case "0":
						$keyString = "A";
						break;
					case "1":
						$keyString = "E";
						break;
					case "2":
						$keyString = "H";
						break;
					case "3":
						$keyString = "Fis";
						break;
					case "4":
						$keyString = "Cis";
						break;
					case "5":
						$keyString = "Gis";
						break;
					case "6":
						$keyString = "Dis";
						break;
					case "7":
						$keyString = "Ais";
						break;
					case "-1":
						$keyString = "D";
						break;
					case "-2":
						$keyString = "G";
						break;
					case "-3":
						$keyString = "C";
						break;
					case "-4":
						$keyString = "F";
						break;
					case "-5":
						$keyString = "B";
						break;
					case "-6":
						$keyString = "Es";
						break;
					case "-7":
						$keyString = "As";
						break;
				endswitch;
				array_push($keysArray, $keyString."-Moll");
			}
	    }
	    return array_count_values($keysArray);;
	}


	function determineClef($xml){
		$clefs = $xml->xpath("//clef");
		//print_r($clefs);
		$clefsArray = array();

		foreach($clefs as $clef) {
			$value = $clef->sign;
			$line = $clef->line; //https://de.wikipedia.org/wiki/Notenschl%C3%BCssel#C-Schl.C3.BCssel
			
			if($value != null){
				switch($value):
					case "C":
						//inspect C-Clef:
						switch($line):
							case 1:
								$value = "Sopranschlüssel";
								break;
							case 2:
								$value = "Mezzosopranschlüessel";
								break;
							case 3:
								$value = "Altschlüessel";
								break;
							case 4:
								$value = "Tenorschlüessel";
								break;
							case 5:
								$value = "Baritonschlüessel";
								break;
						endswitch;
						break;
					case "F":
						$value = "Bassschlüessel";
						break;
					case "G":
						$value = "Violinschlüessel";
						break;
					case "percussion":
						$value = "Perkussionsschlüssel";
						break;
					case "TAB":
						$value = "Tabulatur";
						break;
					case "none":
						$value = "none";
						break;
					default:
						break;
				endswitch;
				array_push($clefsArray,$value);
			}
	    }
	    //print_R($clefsArray);
	    return array_count_values($clefsArray);;
	}


	function countMeasures($xml){
		$measures = $xml->xpath("//measure");
		return count($measures);
	}


	function countRests($xml){
		$rests = $xml->xpath("//rest");
		return count($rests);
	}


	function countNotes($xml){
		$notes = $xml->xpath("//note");
		return count($notes);
	}


	function countNoteValues($xml){

		//"The descendant (double-slash) operator in xpath will search all descendants for a match."
		//"The below is equivalent to the DOM method getElementsByTagName"
		//fetch all <note> tags
		$notes = $xml->xpath("//note");

		$notesArray = array();

		foreach($notes as $note) {
			$value = $note->pitch->step;

			if($value != null){
				//check for possible accidental
				$alter = $note->pitch->alter;
				if((int)$alter[0] === -1){
					$value = $value . "b";
				}
				elseif((int)$alter[0] === 1){
					$value = $value . "#";
				}
				//check if note equals rest and therefore mustn't be counted
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
