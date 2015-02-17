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
				$resultObject->artist = array((string) $this->_determineArtist($xml));
				$resultObject->title = array((string) $this->_determineTitle($xml));
				$resultObject->clef = $this->_determineClef($xml);
				$resultObject->key = array($this->_determineKey($xml));
				$resultObject->meter = array($this->_determineMeter($xml));
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
			(object)array("label" => "Perfect unison", "value" => 0 ),
			(object)array("label" => "Minor second", "value" => 0 ),
			(object)array("label" => "Major second", "value" => 0 ),
			(object)array("label" => "Minor third", "value" => 0 ),
			(object)array("label" => "Major third", "value" => 0 ),
			(object)array("label" => "Perfect fourth", "value" => 0 ),
			(object)array("label" => "Tritone", "value" => 0 ),
			(object)array("label" => "Perfect fifth", "value" => 0 ),
			(object)array("label" => "Minor sixth", "value" => 0 ),
			(object)array("label" => "Major sixth", "value" => 0 ),
			(object)array("label" => "Minor seventh", "value" => 0 ),
			(object)array("label" => "Major seventh", "value" => 0 ),
			(object)array("label" => "Perfect octave", "value" => 0 ),
			(object)array("label" => "Minor ninth", "value" => 0 ),
			(object)array("label" => "Major ninth", "value" => 0 ),
			(object)array("label" => "Minor tenth", "value" => 0 ),
			(object)array("label" => "Major tenth", "value" => 0 ),
			(object)array("label" => "Perfect eleventh", "value" => 0 ),
			(object)array("label" => "Augmented eleventh", "value" => 0 ),
			(object)array("label" => "Perfect twelfth", "value" => 0 ),
			(object)array("label" => "Minor thirteenth", "value" => 0 ),
			(object)array("label" => "Major thirteenth", "value" => 0 ),
			(object)array("label" => "Minor fourteenth", "value" => 0 ),
			(object)array("label" => "Major fourteenth", "value" => 0 ),
			(object)array("label" => "Double octave", "value" => 0 ),
			(object)array("label" => "Double octaven + Minor second", "value" => 0 ),
			(object)array("label" => "Double octave + Major second", "value" => 0 ),
			(object)array("label" => "Double octave + Minor third", "value" => 0 ),
			(object)array("label" => "Double octave + Major third", "value" => 0 ),
			(object)array("label" => "Double octave + Perfect fourth", "value" => 0 ),
			(object)array("label" => "Double octave + Tritone", "value" => 0 ),
			(object)array("label" => "Double octave + Perfect fifth", "value" => 0 ),
			(object)array("label" => "Double octave + Minor sixth", "value" => 0 ),
			(object)array("label" => "Double octave + Major sixth", "value" => 0 )
			);

		for($i = 0; $i < count($notesArray) - 1;$i++){
			$intervalValue = abs((int)$notesArray[$i] - (int)$notesArray[++$i]);
			// echo "<br/>intervall: ".$intervalValue;
			switch($intervalValue):
				case 0:
					$intervalArray[0]->value = $intervalArray[0]->value + 1;
					break;
				case 1:
					$intervalArray[1]->value = $intervalArray[1]->value + 1;
					break;
				case 2:
					$intervalArray[2]->value = $intervalArray[2]->value + 1;
					break;
				case 3:
					$intervalArray[3]->value = $intervalArray[3]->value + 1;
					break;
				case 4:
					$intervalArray[4]->value = $intervalArray[4]->value + 1;
					break;
				case 5:
					$intervalArray[5]->value = $intervalArray[5]->value + 1;
					break;
				case 6:
					$intervalArray[5]->value = $intervalArray[5]->value + 1;
					break;
				case 7:
					$intervalArray[7]->value = $intervalArray[7]->value + 1;
					break;
				case 8:
					$intervalArray[8]->value = $intervalArray[8]->value + 1;
					break;
				case 9:
					$intervalArray[9]->value = $intervalArray[9]->value + 1;
					break;
				case 10:
					$intervalArray[10]->value = $intervalArray[10]->value + 1;
					break;
				case 11:
					$intervalArray[1]->value = $intervalArray[1]->value + 1;
					break;
				case 12:
					$intervalArray[12]->value = $intervalArray[12]->value + 1;
					break;
				case 13:
					$intervalArray[13]->value = $intervalArray[13]->value + 1;
					break;
				case 14:
					$intervalArray[14]->value = $intervalArray[14]->value + 1;
					break;
				case 15:
					$intervalArray[15]->value = $intervalArray[15]->value + 1;
					break;
				case 16:
					$intervalArray[16]->value = $intervalArray[16]->value + 1;
					break;
				case 17:
					$intervalArray[17]->value = $intervalArray[17]->value + 1;
					break;
				case 18:
					$intervalArray[18]->value = $intervalArray[18]->value + 1;
					break;
				case 19:
					$intervalArray[19]->value = $intervalArray[19]->value + 1;
					break;
				case 20:
					$intervalArray[20]->value = $intervalArray[20]->value + 1;
					break;
				case 21:
					$intervalArray[21]->value = $intervalArray[21]->value + 1;
					break;
				case 22:
					$intervalArray[22]->value = $intervalArray[22]->value + 1;
					break;
				case 23:
					$intervalArray[23]->value = $intervalArray[23]->value + 1;
					break;
				case 24:
					$intervalArray[24]->value = $intervalArray[24]->value + 1;
					break;
				case 25:
					$intervalArray[25]->value = $intervalArray[25]->value + 1;
					break;
				case 26:
					$intervalArray[26]->value = $intervalArray[26]->value + 1;
					break;
				case 27:
					$intervalArray[27]->value = $intervalArray[27]->value + 1;
					break;
				case 28:
					$intervalArray[28]->value = $intervalArray[28]->value + 1;
					break;
				case 29:
					$intervalArray[29]->value = $intervalArray[29]->value + 1;
					break;
				case 30:
					$intervalArray[30]->value = $intervalArray[30]->value + 1;
					break;
				case 31:
					$intervalArray[31]->value = $intervalArray[31]->value + 1;
					break;
				case 32:
					$intervalArray[32]->value = $intervalArray[32]->value + 1;
					break;
				case 33:
					$intervalArray[33]->value = $intervalArray[33]->value + 1;
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
			(object)array("label" => "whole", "value" => 0 ),
			(object)array("label" => "half", "value" => 0 ),
			(object)array("label" => "quarter", "value" => 0 ),
			(object)array("label" => "eighth", "value" => 0 ),
			(object)array("label" => "16th", "value" => 0 ),
			(object)array("label" => "32nd", "value" => 0 ),
			(object)array("label" => "64th", "value" => 0 )
			);

		foreach($notes as $note) {
			$value = $note->type;
			// $rest = $note->rest;
			if($value){
				switch($value):
					case "whole":
						$noteTypesArray[0]->value = $noteTypesArray[0]->value + 1;
						break;
					case "half":
						$noteTypesArray[1]->value = $noteTypesArray[1]->value + 1;
						break;
					case "quarter":
						$noteTypesArray[2]->value = $noteTypesArray[2]->value + 1;
						break;
					case "eighth":
						$noteTypesArray[3]->value = $noteTypesArray[3]->value + 1;
						break;
					case "16th":
						$noteTypesArray[4]->value = $noteTypesArray[4]->value + 1;
						break;
					case "32nd":
						$noteTypesArray[5]->value = $noteTypesArray[5]->value + 1;
						break;	
					case "64th":
						$noteTypesArray[6]->value = $noteTypesArray[6]->value + 1;
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
			(object)array("label" => "C major", "value" => 0 ),
			(object)array("label" => "G major", "value" => 0 ),
			(object)array("label" => "D major", "value" => 0 ),
			(object)array("label" => "A major", "value" => 0 ),
			(object)array("label" => "E major", "value" => 0 ),
			(object)array("label" => "H major", "value" => 0 ),
			(object)array("label" => "F sharp major", "value" => 0 ),
			(object)array("label" => "C sharp major", "value" => 0 ),
			(object)array("label" => "F major", "value" => 0 ),
			(object)array("label" => "B major", "value" => 0 ),
			(object)array("label" => "Es major", "value" => 0 ),
			(object)array("label" => "As major", "value" => 0 ),
			(object)array("label" => "D flat major", "value" => 0 ),
			(object)array("label" => "G flat major", "value" => 0 ),
			(object)array("label" => "C flat major", "value" => 0 ),
			(object)array("label" => "A minor", "value" => 0 ),
			(object)array("label" => "E minor", "value" => 0 ),
			(object)array("label" => "H minor", "value" => 0 ),
			(object)array("label" => "F sharp minor", "value" => 0 ),
			(object)array("label" => "C sharp minor", "value" => 0 ),
			(object)array("label" => "G sharp minor", "value" => 0 ),
			(object)array("label" => "D sharp minor", "value" => 0 ),
			(object)array("label" => "A sharp minor", "value" => 0 ),
			(object)array("label" => "D minor", "value" => 0 ),
			(object)array("label" => "G minor", "value" => 0 ),
			(object)array("label" => "C minor", "value" => 0 ),
			(object)array("label" => "F minor", "value" => 0 ),
			(object)array("label" => "B minor", "value" => 0 ),
			(object)array("label" => "E flat minor", "value" => 0 ),
			(object)array("label" => "A flat minor", "value" => 0 )
			);

		foreach($keys as $key) {
			$fifths = $key->fifths;
			$mode = (string)$key->mode;
			
			if($fifths != null && $mode === "major"){
				switch($fifths):
					case "0":
						$keysArray[0]->value = $keysArray[0]->value + 1;
						break;
					case "1":
						$keysArray[1]->value = $keysArray[1]->value + 1;
						break;
					case "2":
						$keysArray[2]->value = $keysArray[2]->value + 1;
						break;
					case "3":
						$keysArray[3]->value = $keysArray[3]->value + 1;
						break;
					case "4":
						$keysArray[4]->value = $keysArray[4]->value + 1;
						break;
					case "5":
						$keysArray[5]->value = $keysArray[5]->value + 1;
						break;
					case "6":
						$keysArray[6]->value = $keysArray[6]->value + 1;
						break;
					case "7":
						$keysArray[7]->value = $keysArray[7]->value + 1;
						break;
					case "-1":
						$keysArray[8]->value = $keysArray[8]->value + 1;
						break;
					case "-2":
						$keysArray[9]->value = $keysArray[9]->value + 1;
						break;
					case "-3":
						$keysArray[10]->value = $keysArray[10]->value + 1;
						break;
					case "-4":
						$keysArray[11]->value = $keysArray[11]->value + 1;
						break;
					case "-5":
						$keysArray[12]->value = $keysArray[12]->value + 1;
						break;
					case "-6":
						$keysArray[13]->value = $keysArray[13]->value + 1;
						break;
					case "-7":
						$keysArray[14]->value = $keysArray[14]->value + 1;
						break;
				endswitch;
				// array_push($keysArray, $keyString." major");
			}
			elseif($fifths != null && $mode === "minor"){
				switch($fifths):
					case "0":
						$keysArray[15]->value = $keysArray[15]->value + 1;
						break;
					case "1":
						$keysArray[16]->value = $keysArray[16]->value + 1;
						break;
					case "2":
						$keysArray[17]->value = $keysArray[17]->value + 1;
						break;
					case "3":
						$keysArray[18]->value = $keysArray[18]->value + 1;
						break;
					case "4":
						$keysArray[19]->value = $keysArray[19]->value + 1;
						break;
					case "5":
						$keysArray[20]->value = $keysArray[20]->value + 1;
						break;
					case "6":
						$keysArray[21]->value = $keysArray[21]->value + 1;
						break;
					case "7":
						$keysArray[22]->value = $keysArray[22]->value + 1;
						break;
					case "-1":
						$keysArray[23]->value = $keysArray[23]->value + 1;
						break;
					case "-2":
						$keysArray[24]->value = $keysArray[24]->value + 1;
						break;
					case "-3":
						$keysArray[25]->value = $keysArray[25]->value + 1;
						break;
					case "-4":
						$keysArray[26]->value = $keysArray[26]->value + 1;
						break;
					case "-5":
						$keysArray[27]->value = $keysArray[27]->value + 1;
						break;
					case "-6":
						$keysArray[28]->value = $keysArray[28]->value + 1;
						break;
					case "-7":
						$keysArray[29]->value = $keysArray[29]->value + 1;
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
		// $a = (object)array("label" => "soprano clef", "value" => 0 );
		$clefsArray = array(
			(object)array("label" => "soprano clef", "value" => 0 ),
			(object)array("label" => "mezzo-sopran clef", "value" => 0 ),
			(object)array("label" => "alto clef", "value" => 0 ),
			(object)array("label" => "tenor clef", "value" => 0 ),
			(object)array("label" => "baritone clef", "value" => 0 ),
			(object)array("label" => "bass clef", "value" => 0 ),
			(object)array("label" => "G clef", "value" => 0 ),
			(object)array("label" => "percussion clef", "value" => 0 ),
			(object)array("label" => "tablature", "value" => 0 ),
			(object)array("label" => "none", "value" => 0 )
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
								$clefsArray[0]->value = $clefsArray[0]->value + 1;
								break;
							case 2:
								// $value = "mezzo-sopran clef";
								$clefsArray[1]->value = $clefsArray[1]->value + 1;
								break;
							case 3:
								// $value = "alto clef";
								$clefsArray[2]->value = $clefsArray[2]->value + 1;
								break;
							case 4:
								// $value = "tenor clef";
								$clefsArray[3]->value = $clefsArray[3]->value + 1;
								break;
							case 5:
								// $value = "baritone clef";
								$clefsArray[4]->value = $clefsArray[4]->value + 1;
								break;
						endswitch;
						break;
					case "F":
						// $value = "bass clef";
						$clefsArray[5]->value = $clefsArray[5]->value + 1;
						break;
					case "G":
						// $value = "G clef";
						$clefsArray[6]->value = $clefsArray[6]->value + 1;
						break;
					case "percussion":
						// $value = "percussion clef";
						$clefsArray[7]->value = $clefsArray[7]->value + 1;
						break;
					case "TAB":
						// $value = "tablature";
						$clefsArray[8]->value = $clefsArray[8]->value + 1;
						break;
					case "none":
						// $value = "none";
						$clefsArray[9]->value = $clefsArray[9]->value + 1;
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
			(object)array("label" => "B", "value" => 0 ),
			(object)array("label" => "C", "value" => 0 ),
			(object)array("label" => "D", "value" => 0 ),
			(object)array("label" => "Eb", "value" => 0 ),
			(object)array("label" => "F", "value" => 0 ),
			(object)array("label" => "D#", "value" => 0 ),
			(object)array("label" => "E", "value" => 0 ),
			(object)array("label" => "F#", "value" => 0 ),
			(object)array("label" => "G", "value" => 0 ),
			(object)array("label" => "A", "value" => 0 ),
			(object)array("label" => "Bb", "value" => 0 ),
			(object)array("label" => "C#", "value" => 0 ),
			(object)array("label" => "A#", "value" => 0 ),
			(object)array("label" => "E#", "value" => 0 ),
			(object)array("label" => "Db", "value" => 0 ),
			(object)array("label" => "Gb", "value" => 0 ),
			(object)array("label" => "G#", "value" => 0 ),
			(object)array("label" => "Cb", "value" => 0 ),
			(object)array("label" => "Ab", "value" => 0 ),

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
					$notesArray[0]->value = $notesArray[0]->value + 1;
					break;
				case "C":
					$notesArray[1]->value = $notesArray[1]->value + 1;
					break;
				case "D":
					$notesArray[2]->value = $notesArray[2]->value + 1;
					break;
				case "Eb":
					$notesArray[3]->value = $notesArray[3]->value + 1;
					break;
				case "F":
					$notesArray[4]->value = $notesArray[4]->value + 1;
					break;
				case "D#":
					$notesArray[5]->value = $notesArray[5]->value + 1;
					break;
				case "E":
					$notesArray[6]->value = $notesArray[6]->value + 1;
					break;
				case "F#":
					$notesArray[7]->value = $notesArray[7]->value + 1;
					break;
				case "G":
					$notesArray[8]->value = $notesArray[8]->value + 1;
					break;
				case "A":
					$notesArray[9]->value = $notesArray[9]->value + 1;
					break;
				case "Bb":
					$notesArray[10]->value = $notesArray[10]->value + 1;
					break;
				case "C#":
					$notesArray[11]->value = $notesArray[11]->value + 1;
					break;
				case "A#":
					$notesArray[12]->value = $notesArray[12]->value + 1;
					break;
				case "E#":
					$notesArray[13]->value = $notesArray[13]->value + 1;
					break;
				case "Db":
					$notesArray[14]->value = $notesArray[14]->value + 1;
					break;
				case "Gb":
					$notesArray[15]->value = $notesArray[15]->value + 1;
					break;
				case "G#":
					$notesArray[16]->value = $notesArray[16]->value + 1;
					break;
				case "Cb":
					$notesArray[17]->value = $notesArray[17]->value + 1;
					break;
				case "Ab":
					$notesArray[18]->value = $notesArray[18]->value + 1;
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
