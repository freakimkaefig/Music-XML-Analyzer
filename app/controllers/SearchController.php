<?php

class SearchController extends BaseController {

	public function search()
	{
		/**
		 * Getting files for current user
		 */
		$user = User::find(Cookie::get('user_id'));
		$user->uploads->each(function($upload) {
			if (!$upload->result) {
				$xml = simplexml_load_file($upload->url);

				$resultObject = new stdClass();
				$resultObject->artist = (string) $this->_determineArtist($xml);
				$resultObject->title = (string) $this->_determineTitle($xml);
				$resultObject->clef = $this->_determineClef($xml);
				$resultObject->key = $this->_determineKey($xml);
				$resultObject->meter = $this->_determineMeter($xml);
				$resultObject->instruments = $this->_determineInstruments($xml);
				$resultObject->count_measures = $this->_countMeasures($xml);
				$resultObject->count_notes = $this->_countNotes($xml);
				$resultObject->note_distribution = $this->_countNoteValues($xml);
				$resultObject->note_types = $this->_countNoteTypes($xml);
				$resultObject->count_rests = $this->_countRests($xml);
				$resultObject->most_frequent_note = $this->_determineMostFrequentNote($xml);
				$resultObject->intervals = $this->_countIntervals($xml);

				$result = new Result;
				$result->value = json_encode($resultObject);
				$result->upload()->associate($upload);
				$result->save();
			}
		});

		return Redirect::route('dashboard');
	}

	/////////////////////////////
	//Internal analysis private functions
	/////////////////////////////
	private function _countIntervals($xml){
		//toDo: magic.
		//Halbtonschritte zur Tonika (C-Dur)
		// C = 0
		// C#/Db = 1
		// D = 2
		// D#/Eb = 3
		// E = 4
		// F = 5
		// F#/Gb = 6
		// G = 7
		// G#/Ab = 8
		// A = 9
		// A#/Bb = 10
		// B = 11
		$tonika = array("C" => 0,
						"D" => 2,
						"E" => 4,
						"F" => 5,
						"G" => 7,
						"A" => 9,
						"B" => 11);

		$notes = $xml->xpath("//note");
		$notesArray = array();
		foreach($notes as $note){
			$rest = $note->rest;
			if(!$rest){
				// echo "rest is null<br/>";
				$noteStep = $note->pitch->step;
				$noteAlter = $note->pitch->alter;
				$noteOctave = $note->pitch->octave;

				if($noteStep && $noteOctave){
					$noteValue = $tonika[(string)$noteStep];
					if($noteAlter){
						$noteValue = (int)$noteValue + (int)$noteAlter;
					}
					$noteValue = (int)$noteOctave * 12 + (int)$noteValue;
					//array befüllen
					array_push($notesArray, $noteValue);
				}
			}
			else{
				//rest
			}
		}//end foreach
		// var_dump($notesArray);
		$intervalArray = array(
			(object)array("Interval" => "Perfect unison", "count" => 0 ),
			(object)array("Interval" => "Minor second", "count" => 0 ),
			(object)array("Interval" => "Major second", "count" => 0 ),
			(object)array("Interval" => "Minor third", "count" => 0 ),
			(object)array("Interval" => "Major third", "count" => 0 ),
			(object)array("Interval" => "Perfect fourth", "count" => 0 ),
			(object)array("Interval" => "Tritone", "count" => 0 ),
			(object)array("Interval" => "Perfect fifth", "count" => 0 ),
			(object)array("Interval" => "Minor sixth", "count" => 0 ),
			(object)array("Interval" => "Major sixth", "count" => 0 ),
			(object)array("Interval" => "Minor seventh", "count" => 0 ),
			(object)array("Interval" => "Major seventh", "count" => 0 ),
			(object)array("Interval" => "Perfect octave", "count" => 0 ),
			(object)array("Interval" => "Minor ninth", "count" => 0 ),
			(object)array("Interval" => "Major ninth", "count" => 0 ),
			(object)array("Interval" => "Minor tenth", "count" => 0 ),
			(object)array("Interval" => "Major tenth", "count" => 0 ),
			(object)array("Interval" => "Perfect eleventh", "count" => 0 ),
			(object)array("Interval" => "Augmented eleventh", "count" => 0 ),
			(object)array("Interval" => "Perfect twelfth", "count" => 0 ),
			(object)array("Interval" => "Minor thirteenth", "count" => 0 ),
			(object)array("Interval" => "Major thirteenth", "count" => 0 ),
			(object)array("Interval" => "Minor fourteenth", "count" => 0 ),
			(object)array("Interval" => "Major fourteenth", "count" => 0 ),
			(object)array("Interval" => "Double octave", "count" => 0 ),
			(object)array("Interval" => "Double octaven + Minor second", "count" => 0 ),
			(object)array("Interval" => "Double octave + Major second", "count" => 0 ),
			(object)array("Interval" => "Double octave + Minor third", "count" => 0 ),
			(object)array("Interval" => "Double octave + Major third", "count" => 0 ),
			(object)array("Interval" => "Double octave + Perfect fourth", "count" => 0 ),
			(object)array("Interval" => "Double octave + Tritone", "count" => 0 ),
			(object)array("Interval" => "Double octave + Perfect fifth", "count" => 0 ),
			(object)array("Interval" => "Double octave + Minor sixth", "count" => 0 ),
			(object)array("Interval" => "Double octave + Major sixth", "count" => 0 )
			);

		for($i = 0; $i < count($notesArray) - 1;$i++){
			$intervalValue = abs((int)$notesArray[$i] - (int)$notesArray[++$i]);
			// echo "<br/>intervall: ".$intervalValue;
			switch($intervalValue):
				case 0:
					$intervalArray[0]->count = $intervalArray[0]->count + 1;
					break;
				case 1:
					$intervalArray[1]->count = $intervalArray[1]->count + 1;
					break;
				case 2:
					$intervalArray[2]->count = $intervalArray[2]->count + 1;
					break;
				case 3:
					$intervalArray[3]->count = $intervalArray[3]->count + 1;
					break;
				case 4:
					$intervalArray[4]->count = $intervalArray[4]->count + 1;
					break;
				case 5:
					$intervalArray[5]->count = $intervalArray[5]->count + 1;
					break;
				case 6:
					$intervalArray[5]->count = $intervalArray[5]->count + 1;
					break;
				case 7:
					$intervalArray[7]->count = $intervalArray[7]->count + 1;
					break;
				case 8:
					$intervalArray[8]->count = $intervalArray[8]->count + 1;
					break;
				case 9:
					$intervalArray[9]->count = $intervalArray[9]->count + 1;
					break;
				case 10:
					$intervalArray[10]->count = $intervalArray[10]->count + 1;
					break;
				case 11:
					$intervalArray[1]->count = $intervalArray[1]->count + 1;
					break;
				case 12:
					$intervalArray[12]->count = $intervalArray[12]->count + 1;
					break;
				case 13:
					$intervalArray[13]->count = $intervalArray[13]->count + 1;
					break;
				case 14:
					$intervalArray[14]->count = $intervalArray[14]->count + 1;
					break;
				case 15:
					$intervalArray[15]->count = $intervalArray[15]->count + 1;
					break;
				case 16:
					$intervalArray[16]->count = $intervalArray[16]->count + 1;
					break;
				case 17:
					$intervalArray[17]->count = $intervalArray[17]->count + 1;
					break;
				case 18:
					$intervalArray[18]->count = $intervalArray[18]->count + 1;
					break;
				case 19:
					$intervalArray[19]->count = $intervalArray[19]->count + 1;
					break;
				case 20:
					$intervalArray[20]->count = $intervalArray[20]->count + 1;
					break;
				case 21:
					$intervalArray[21]->count = $intervalArray[21]->count + 1;
					break;
				case 22:
					$intervalArray[22]->count = $intervalArray[22]->count + 1;
					break;
				case 23:
					$intervalArray[23]->count = $intervalArray[23]->count + 1;
					break;
				case 24:
					$intervalArray[24]->count = $intervalArray[24]->count + 1;
					break;
				case 25:
					$intervalArray[25]->count = $intervalArray[25]->count + 1;
					break;
				case 26:
					$intervalArray[26]->count = $intervalArray[26]->count + 1;
					break;
				case 27:
					$intervalArray[27]->count = $intervalArray[27]->count + 1;
					break;
				case 28:
					$intervalArray[28]->count = $intervalArray[28]->count + 1;
					break;
				case 29:
					$intervalArray[29]->count = $intervalArray[29]->count + 1;
					break;
				case 30:
					$intervalArray[30]->count = $intervalArray[30]->count + 1;
					break;
				case 31:
					$intervalArray[31]->count = $intervalArray[31]->count + 1;
					break;
				case 32:
					$intervalArray[32]->count = $intervalArray[32]->count + 1;
					break;
				case 33:
					$intervalArray[33]->count = $intervalArray[33]->count + 1;
					break;
			endswitch;
		}

	    // echo "<pre>";
	    // var_dump($intervalArray);
	    // echo "</pre>";
		return $intervalArray;
	}


	private function _determineArtist($xml){
		$artist = $xml->xpath("//credit[credit-type='composer']");
		// var_dump($artist[0]);
		if ($artist) {
			return $artist[0]->{'credit-words'}->{0};
		} else {
			return "Unknown";
		}
	}


	private function _determineTitle($xml){
		$title = $xml->xpath("//credit[credit-type='title']");
		// var_dump($title[0]->{'credit-words'});
		if ($title) {
			return $title[0]->{'credit-words'}->{0};
		} else {
			return "Unknown";
		}
	}


	private function _determineInstruments($xml){
		$instruments = $xml->xpath("//score-part");
		$instrumentsArray = array();

		foreach($instruments as $instrument){
			if (!preg_match('/[0-9]/', $instrument->{'part-name'})){
			    $value = $instrument->{'part-name'};

				array_push($instrumentsArray,(string)$value);
			}
		}
		//get instruments summarized in groups:
		$instruments2 = $xml->xpath("//part-group[group-name]");

		foreach($instruments2 as $instrument2){
			if(!preg_match('/[0-9]/', $instrument2->{'group-name'})){
			    $value = $instrument2->{'group-name'};

				array_push($instrumentsArray,(string)$value);
			}
		}
		return $instrumentsArray;
	}


	private function _countNoteTypes($xml){
		$notes = $xml->xpath("//note");

		$noteTypesArray = array(
			(object)array("type" => "whole", "count" => 0 ),
			(object)array("type" => "half", "count" => 0 ),
			(object)array("type" => "quarter", "count" => 0 ),
			(object)array("type" => "eighth", "count" => 0 ),
			(object)array("type" => "16th", "count" => 0 ),
			(object)array("type" => "32nd", "count" => 0 ),
			(object)array("type" => "64th", "count" => 0 )
			);

		foreach($notes as $note) {
			$value = $note->type;
			// $rest = $note->rest;
			if($value){
				switch($value):
					case "whole":
						$noteTypesArray[0]->count = $noteTypesArray[0]->count + 1;
						break;
					case "half":
						$noteTypesArray[1]->count = $noteTypesArray[1]->count + 1;
						break;
					case "quarter":
						$noteTypesArray[2]->count = $noteTypesArray[2]->count + 1;
						break;
					case "eighth":
						$noteTypesArray[3]->count = $noteTypesArray[3]->count + 1;
						break;
					case "16th":
						$noteTypesArray[4]->count = $noteTypesArray[4]->count + 1;
						break;
					case "32nd":
						$noteTypesArray[5]->count = $noteTypesArray[5]->count + 1;
						break;	
					case "64th":
						$noteTypesArray[6]->count = $noteTypesArray[6]->count + 1;
						break;				
				endswitch;
			}
	    }
	    // echo "<pre>";
	    // var_dump($noteTypesArray);
	    // echo "</pre>";
	    return $noteTypesArray;
	}


	private function _determineMeter($xml){
		$beat = $xml->xpath("//beats");
		$beatType =  $xml->xpath("//beat-type");
		$meter = $beat[0] ."/". $beatType[0];
		return $meter;
	}


	private function _determineKey($xml){
		$keys = $xml->xpath("//key");
		$keysArray = array(
			(object)array("note" => "C major", "count" => 0 ),
			(object)array("note" => "G major", "count" => 0 ),
			(object)array("note" => "D major", "count" => 0 ),
			(object)array("note" => "A major", "count" => 0 ),
			(object)array("note" => "E major", "count" => 0 ),
			(object)array("note" => "H major", "count" => 0 ),
			(object)array("note" => "F sharp major", "count" => 0 ),
			(object)array("note" => "C sharp major", "count" => 0 ),
			(object)array("note" => "F major", "count" => 0 ),
			(object)array("note" => "B major", "count" => 0 ),
			(object)array("note" => "Es major", "count" => 0 ),
			(object)array("note" => "As major", "count" => 0 ),
			(object)array("note" => "D flat major", "count" => 0 ),
			(object)array("note" => "G flat major", "count" => 0 ),
			(object)array("note" => "C flat major", "count" => 0 ),
			(object)array("note" => "A minor", "count" => 0 ),
			(object)array("note" => "E minor", "count" => 0 ),
			(object)array("note" => "H minor", "count" => 0 ),
			(object)array("note" => "F sharp minor", "count" => 0 ),
			(object)array("note" => "C sharp minor", "count" => 0 ),
			(object)array("note" => "G sharp minor", "count" => 0 ),
			(object)array("note" => "D sharp minor", "count" => 0 ),
			(object)array("note" => "A sharp minor", "count" => 0 ),
			(object)array("note" => "D minor", "count" => 0 ),
			(object)array("note" => "G minor", "count" => 0 ),
			(object)array("note" => "C minor", "count" => 0 ),
			(object)array("note" => "F minor", "count" => 0 ),
			(object)array("note" => "B minor", "count" => 0 ),
			(object)array("note" => "E flat minor", "count" => 0 ),
			(object)array("note" => "A flat minor", "count" => 0 )
			);

		foreach($keys as $key) {
			$fifths = $key->fifths;
			$mode = (string)$key->mode;
			
			if($fifths != null && $mode === "major"){
				switch($fifths):
					case "0":
						$keysArray[0]->count = $keysArray[0]->count + 1;
						break;
					case "1":
						$keysArray[1]->count = $keysArray[1]->count + 1;
						break;
					case "2":
						$keysArray[2]->count = $keysArray[2]->count + 1;
						break;
					case "3":
						$keysArray[3]->count = $keysArray[3]->count + 1;
						break;
					case "4":
						$keysArray[4]->count = $keysArray[4]->count + 1;
						break;
					case "5":
						$keysArray[5]->count = $keysArray[5]->count + 1;
						break;
					case "6":
						$keysArray[6]->count = $keysArray[6]->count + 1;
						break;
					case "7":
						$keysArray[7]->count = $keysArray[7]->count + 1;
						break;
					case "-1":
						$keysArray[8]->count = $keysArray[8]->count + 1;
						break;
					case "-2":
						$keysArray[9]->count = $keysArray[9]->count + 1;
						break;
					case "-3":
						$keysArray[10]->count = $keysArray[10]->count + 1;
						break;
					case "-4":
						$keysArray[11]->count = $keysArray[11]->count + 1;
						break;
					case "-5":
						$keysArray[12]->count = $keysArray[12]->count + 1;
						break;
					case "-6":
						$keysArray[13]->count = $keysArray[13]->count + 1;
						break;
					case "-7":
						$keysArray[14]->count = $keysArray[14]->count + 1;
						break;
				endswitch;
				// array_push($keysArray, $keyString." major");
			}
			elseif($fifths != null && $mode === "minor"){
				switch($fifths):
					case "0":
						$keysArray[15]->count = $keysArray[15]->count + 1;
						break;
					case "1":
						$keysArray[16]->count = $keysArray[16]->count + 1;
						break;
					case "2":
						$keysArray[17]->count = $keysArray[17]->count + 1;
						break;
					case "3":
						$keysArray[18]->count = $keysArray[18]->count + 1;
						break;
					case "4":
						$keysArray[19]->count = $keysArray[19]->count + 1;
						break;
					case "5":
						$keysArray[20]->count = $keysArray[20]->count + 1;
						break;
					case "6":
						$keysArray[21]->count = $keysArray[21]->count + 1;
						break;
					case "7":
						$keysArray[22]->count = $keysArray[22]->count + 1;
						break;
					case "-1":
						$keysArray[23]->count = $keysArray[23]->count + 1;
						break;
					case "-2":
						$keysArray[24]->count = $keysArray[24]->count + 1;
						break;
					case "-3":
						$keysArray[25]->count = $keysArray[25]->count + 1;
						break;
					case "-4":
						$keysArray[26]->count = $keysArray[26]->count + 1;
						break;
					case "-5":
						$keysArray[27]->count = $keysArray[27]->count + 1;
						break;
					case "-6":
						$keysArray[28]->count = $keysArray[28]->count + 1;
						break;
					case "-7":
						$keysArray[29]->count = $keysArray[29]->count + 1;
						break;
				endswitch;
				// array_push($keysArray, $keyString." minor");
			}
	    }
	    // echo "<pre>";
	    // var_dump($keysArray);
	    // echo "</pre>";
	    return $keysArray;
	}


	private function _determineClef($xml){
		$clefs = $xml->xpath("//clef");
		//print_r($clefs);
		// $a = (object)array("clef" => "soprano clef", "count" => 0 );
		$clefsArray = array(
			(object)array("clef" => "soprano clef", "count" => 0 ),
			(object)array("clef" => "mezzo-sopran clef", "count" => 0 ),
			(object)array("clef" => "alto clef", "count" => 0 ),
			(object)array("clef" => "tenor clef", "count" => 0 ),
			(object)array("clef" => "baritone clef", "count" => 0 ),
			(object)array("clef" => "bass clef", "count" => 0 ),
			(object)array("clef" => "G clef", "count" => 0 ),
			(object)array("clef" => "percussion clef", "count" => 0 ),
			(object)array("clef" => "tablature", "count" => 0 ),
			(object)array("clef" => "none", "count" => 0 )
			);
		// var_dump($clefsArray);
		foreach($clefs as $clef) {
			$value = $clef->sign;
			$line = $clef->line; //https://de.wikipedia.org/wiki/Notenschl%C3%BCssel#C-Schl.C3.BCssel
			
			if($value != null){
				switch($value):
					case "C":
						//inspect C-Clef:
						switch($line):
							case 1:
								// $value = "soprano clef";
								$clefsArray[0]->count = $clefsArray[0]->count + 1;
								break;
							case 2:
								// $value = "mezzo-sopran clef";
								$clefsArray[1]->count = $clefsArray[1]->count + 1;
								break;
							case 3:
								// $value = "alto clef";
								$clefsArray[2]->count = $clefsArray[2]->count + 1;
								break;
							case 4:
								// $value = "tenor clef";
								$clefsArray[3]->count = $clefsArray[3]->count + 1;
								break;
							case 5:
								// $value = "baritone clef";
								$clefsArray[4]->count = $clefsArray[4]->count + 1;
								break;
						endswitch;
						break;
					case "F":
						// $value = "bass clef";
						$clefsArray[5]->count = $clefsArray[5]->count + 1;
						break;
					case "G":
						// $value = "G clef";
						$clefsArray[6]->count = $clefsArray[6]->count + 1;
						break;
					case "percussion":
						// $value = "percussion clef";
						$clefsArray[7]->count = $clefsArray[7]->count + 1;
						break;
					case "TAB":
						// $value = "tablature";
						$clefsArray[8]->count = $clefsArray[8]->count + 1;
						break;
					case "none":
						// $value = "none";
						$clefsArray[9]->count = $clefsArray[9]->count + 1;
						break;
					default:
						break;
				endswitch;
				// array_push($clefsArray,$value);
			}
	    }
	    //print_R($clefsArray);
	    // return array_count_values($clefsArray);
	    // echo "<pre>";
	    // var_dump($clefsArray);
	    // echo "</pre>";
	    return $clefsArray;
	}


	private function _countMeasures($xml){
		$measures = $xml->xpath("//measure");
		return count($measures);
	}


	private function _countRests($xml){
		$rests = $xml->xpath("//rest");
		return count($rests);
	}


	private function _countNotes($xml){
		$notes = $xml->xpath("//note");
		return count($notes);
	}


	private function _countNoteValues($xml){

		//"The descendant (double-slash) operator in xpath will search all descendants for a match."
		//"The below is equivalent to the DOM method getElementsByTagName"
		//fetch all <note> tags
		$notes = $xml->xpath("//note");

		$notesArray = array(
			(object)array("note" => "B", "count" => 0 ),
			(object)array("note" => "C", "count" => 0 ),
			(object)array("note" => "D", "count" => 0 ),
			(object)array("note" => "Eb", "count" => 0 ),
			(object)array("note" => "F", "count" => 0 ),
			(object)array("note" => "D#", "count" => 0 ),
			(object)array("note" => "E", "count" => 0 ),
			(object)array("note" => "F#", "count" => 0 ),
			(object)array("note" => "G", "count" => 0 ),
			(object)array("note" => "A", "count" => 0 ),
			(object)array("note" => "Bb", "count" => 0 ),
			(object)array("note" => "C#", "count" => 0 ),
			(object)array("note" => "A#", "count" => 0 ),
			(object)array("note" => "E#", "count" => 0 ),
			(object)array("note" => "Db", "count" => 0 ),
			(object)array("note" => "Gb", "count" => 0 ),
			(object)array("note" => "G#", "count" => 0 ),
			(object)array("note" => "Cb", "count" => 0 ),
			(object)array("note" => "Ab", "count" => 0 ),

			);

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
			}
			switch($value):
				case "B":
					$notesArray[0]->count = $notesArray[0]->count + 1;
					break;
				case "C":
					$notesArray[1]->count = $notesArray[1]->count + 1;
					break;
				case "D":
					$notesArray[2]->count = $notesArray[2]->count + 1;
					break;
				case "Eb":
					$notesArray[3]->count = $notesArray[3]->count + 1;
					break;
				case "F":
					$notesArray[4]->count = $notesArray[4]->count + 1;
					break;
				case "D#":
					$notesArray[5]->count = $notesArray[5]->count + 1;
					break;
				case "E":
					$notesArray[6]->count = $notesArray[6]->count + 1;
					break;
				case "F#":
					$notesArray[7]->count = $notesArray[7]->count + 1;
					break;
				case "G":
					$notesArray[8]->count = $notesArray[8]->count + 1;
					break;
				case "A":
					$notesArray[9]->count = $notesArray[9]->count + 1;
					break;
				case "Bb":
					$notesArray[10]->count = $notesArray[10]->count + 1;
					break;
				case "C#":
					$notesArray[11]->count = $notesArray[11]->count + 1;
					break;
				case "A#":
					$notesArray[12]->count = $notesArray[12]->count + 1;
					break;
				case "E#":
					$notesArray[13]->count = $notesArray[13]->count + 1;
					break;
				case "Db":
					$notesArray[14]->count = $notesArray[14]->count + 1;
					break;
				case "Gb":
					$notesArray[15]->count = $notesArray[15]->count + 1;
					break;
				case "G#":
					$notesArray[16]->count = $notesArray[16]->count + 1;
					break;
				case "Cb":
					$notesArray[17]->count = $notesArray[17]->count + 1;
					break;
				case "Ab":
					$notesArray[18]->count = $notesArray[18]->count + 1;
					break;
			endswitch;
	    }
	    // echo "<pre>";
	    // var_dump($notesArray);
	    // echo "</pre>";
	    return $notesArray;
	}


	private function _determineMostFrequentNote($xml){

		//häufigkeiten der Noten zählen
		$countedNotes = $this->_countNoteValues($xml);

	    //häufigste note ausgeben
	    return array_search(max($countedNotes), $countedNotes);

	}

}
