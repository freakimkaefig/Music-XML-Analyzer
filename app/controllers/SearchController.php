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
		$intervalArray = array();
		foreach($notes as $note){
			$rest = $note->rest;
			if(!$rest){
				// echo "rest is null<br/>";
				$noteStep = $note->pitch->step;
				$noteAlter = $note->pitch->alter;
				$noteOctave = $note->pitch->octave;

				/*if(!$noteStep){
					echo "<br/>ERROR: $noteStep is null!<br/>";
					print_r($noteStep);
					var_dump($noteStep);
					echo "<br/>".$noteStep[0];
					// echo "<br/>".$noteStep->{0}; //"trying to get property of non-object"
					echo "<br/>";
				}else*/if($noteStep && $noteOctave){

					$noteValue = $tonika[(string)$noteStep];
					if($noteAlter){
						// var_dump($noteAlter);
						//notevalue += 1 or -1 (alter)
						// echo "<br/>step ".$noteStep;
						// echo "<br/>value before alter ".$noteValue;
						$noteValue = (int)$noteValue + (int)$noteAlter;
						// echo "<br/>alter ".$noteAlter;
						// echo "<br/>value after alter ".$noteValue."<br/>";
					}
					$noteValue = (int)$noteOctave * 12 + (int)$noteValue;
					//array befüllen
					array_push($notesArray, $noteValue);
				}
			}
			else{
				//Pause?
				// echo "<br/>REST?: ";
				// var_dump($note);
			}
		}//end foreach
		// var_dump($notesArray);
		for($i = 0; $i < count($notesArray) - 1;$i++){
			$intervalValue = abs((int)$notesArray[$i] - (int)$notesArray[++$i]);
			// echo "<br/>intervall: ".$intervalValue;
			switch($intervalValue):
				case 0:
					array_push(($intervalArray), "Perfect unison");
					break;
				case 1:
					array_push(($intervalArray), "Minor second");
					break;
				case 2:
					array_push(($intervalArray), "Major second");
					break;
				case 3:
					array_push(($intervalArray), "Minor third");
					break;
				case 4:
					array_push(($intervalArray), "Major third");
					break;
				case 5:
					array_push(($intervalArray), "Perfect fourth");
					break;
				case 6:
					array_push(($intervalArray), "Tritone");
					break;
				case 7:
					array_push(($intervalArray), "Perfect fifth");
					break;
				case 8:
					array_push(($intervalArray), "Minor sixth");
					break;
				case 9:
					array_push(($intervalArray), "Major sixth");
					break;
				case 10:
					array_push(($intervalArray), "Minor seventh");
					break;
				case 11:
					array_push(($intervalArray), "Major seventh");
					break;
				case 12:
					array_push(($intervalArray), "Perfect octave");
					break;
				case 13:
					array_push(($intervalArray), "Minor ninth");
					break;
				case 14:
					array_push(($intervalArray), "Major ninth");
					break;
				case 15:
					array_push(($intervalArray), "Minor tenth");
					break;
				case 16:
					array_push(($intervalArray), "Major tenth");
					break;
				case 17:
					array_push(($intervalArray), "Perfect eleventh");
					break;
				case 18:
					array_push(($intervalArray), "Augmented eleventh");
					break;
				case 19:
					array_push(($intervalArray), "Perfect twelfth");
					break;
				case 20:
					array_push(($intervalArray), "Minor thirteenth");
					break;
				case 21:
					array_push(($intervalArray), "Major thirteenth");
					break;
				case 22:
					array_push(($intervalArray), "Minor fourteenth");
					break;
				case 23:
					array_push(($intervalArray), "Major fourteenth");
					break;
				case 24:
					array_push(($intervalArray), "Double octave");
					break;
				case 25:
					array_push(($intervalArray), "Double octaven + Minor second");
					break;
				case 26:
					array_push(($intervalArray), "Double octave + Major second");
					break;
				case 27:
					array_push(($intervalArray), "Double octave + Minor third");
					break;
				case 28:
					array_push(($intervalArray), "Double octave + Major third");
					break;
				case 29:
					array_push(($intervalArray), "Double octave + Perfect fourth");
					break;
				case 30:
					array_push(($intervalArray), "Double octave + Tritone");
					break;
				case 31:
					array_push(($intervalArray), "Double octave + Perfect fifth");
					break;
				case 32:
					array_push(($intervalArray), "Double octave + Minor sixth");
					break;
				case 33:
					array_push(($intervalArray), "Double octave + Major sixth");
					break;
			endswitch;
		}

		return array_count_values($intervalArray);
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

		$noteTypesArray = array();

		foreach($notes as $note) {
			$value = $note->type;
			$rest = $note->rest;
			if(!$rest){
				array_push($noteTypesArray,(string)$value);
			}
	    }
	    return array_count_values($noteTypesArray);
	}


	private function _determineMeter($xml){
		$beat = $xml->xpath("//beats");
		$beatType =  $xml->xpath("//beat-type");
		$meter = $beat[0] ."/". $beatType[0];
		return $meter;
	}


	private function _determineKey($xml){
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
						$keyString = "F sharp";
						break;
					case "7":
						$keyString = "C sharp";
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
						$keyString = "D flat";
						break;
					case "-6":
						$keyString = "G flat";
						break;
					case "-7":
						$keyString = "C flat";
						break;
				endswitch;
				array_push($keysArray, $keyString." major");
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
						$keyString = "F sharp";
						break;
					case "4":
						$keyString = "C sharp";
						break;
					case "5":
						$keyString = "G sharp";
						break;
					case "6":
						$keyString = "D sharp";
						break;
					case "7":
						$keyString = "A sharp";
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
						$keyString = "E flat";
						break;
					case "-7":
						$keyString = "A flat";
						break;
				endswitch;
				array_push($keysArray, $keyString." minor");
			}
	    }
	    return array_count_values($keysArray);;
	}


	private function _determineClef($xml){
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
								$value = "soprano clef";
								break;
							case 2:
								$value = "mezzo-sopran clef";
								break;
							case 3:
								$value = "alto clef";
								break;
							case 4:
								$value = "tenor clef";
								break;
							case 5:
								$value = "baritone clef";
								break;
						endswitch;
						break;
					case "F":
						$value = "bass clef";
						break;
					case "G":
						$value = "G clef";
						break;
					case "percussion":
						$value = "percussion clef";
						break;
					case "TAB":
						$value = "tablature";
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
				//cast obj to string before pushing it to array
				array_push($notesArray,(string)$value);
			}
	    }
	    return array_count_values($notesArray);;
	}


	private function _determineMostFrequentNote($xml){

		//häufigkeiten der Noten zählen
		$countedNotes = $this->_countNoteValues($xml);

	    //häufigste note ausgeben
	    return array_search(max($countedNotes), $countedNotes);

	}

}
