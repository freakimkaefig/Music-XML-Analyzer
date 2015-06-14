<?php

/**
 * Controller for analysis of uploads
 *
 * @package 	Controllers
 */
class SearchController extends BaseController {

	/**
	 * Search function for automatic analysis of xml files
	 *
	 * @return  \Illuminate\Http\RedirectResponse      Redirect to dashboard
	 *
	 */
	public function search()
	{
		// Getting files for current user
		$user = User::find(Cookie::get('user_id'));
		$user->uploads->each(function($upload) {
			if (!$upload->result) {
				// if no result for upload exists, create a new result
				$result = new Result;
				$result->upload()->associate($upload);
			} else {
				// if a result for upload already exists, get result and overwrite value
				$result = $upload->result;
			}
			$xml = simplexml_load_file($upload->url);
			$resultObject = new stdClass();
			$resultObject->file_url = $upload->url;
			$resultObject->artist = array((string) $this->_determineArtist($xml));
			$resultObject->title = array((string) $this->_determineTitle($xml));
			$resultObject->clef = $this->_determineClef($xml);
			$resultObject->key = $this->_determineKey($xml);
			$resultObject->meter = $this->_determineMeter($xml);
			$resultObject->instruments = $this->_determineInstruments($xml);
			$resultObject->count_measures = $this->_countMeasures($xml);
			$resultObject->count_notes = (int)$this->_countNotes($xml) - (int)$this->_countRests($xml);
			$resultObject->note_distribution = $this->_countNoteValues($xml);
			$resultObject->note_types = $this->_countNoteTypes($xml);
			$resultObject->count_rests = $this->_countRests($xml);
			$resultObject->most_frequent_note = $this->_determineMostFrequentNote($xml);
			$resultObject->intervals = $this->_countIntervals($xml);

			$result->value = json_encode($resultObject);
			$result->save();
		});

		return Redirect::route('dashboard');
	}

	/**
	 * Helper function to count intervals in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  array      			interval array containing the frequency of intervals in a xml file
	 *
	 */
	private function _countIntervals($xml){
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
				$noteStep = $note->pitch->step;
				$noteAlter = $note->pitch->alter;
				$noteOctave = $note->pitch->octave;

				if($noteStep && $noteOctave){
					$noteValue = $tonika[(string)$noteStep];
					if($noteAlter){
						$noteValue = (int)$noteValue + (int)$noteAlter;
					}
					$noteValue = (int)$noteOctave * 12 + (int)$noteValue;
					//fill array
					array_push($notesArray, $noteValue);
				}
			}
		}//end foreach
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
			(object)array("label" => "Dbl. oct. + Min. 2nd", "value" => 0 ),
			(object)array("label" => "Dbl. oct. + Maj. 2nd", "value" => 0 ),
			(object)array("label" => "Dbl. oct. + Min. 3rd", "value" => 0 ),
			(object)array("label" => "Dbl. oct. + Maj. 3rd", "value" => 0 ),
			(object)array("label" => "Dbl. oct. + Perfect 4th", "value" => 0 ),
			(object)array("label" => "Dbl. oct. + Tritone", "value" => 0 ),
			(object)array("label" => "Dbl. oct. + Perfect 5th", "value" => 0 ),
			(object)array("label" => "Dbl. oct. + Min. 6th", "value" => 0 ),
			(object)array("label" => "Dbl. oct. + Maj. 6th", "value" => 0 ),
			(object)array("label" => "Unknown", "value" => 0 )
			);

		for($i = 0; $i < count($notesArray) - 1;$i++){
			$intervalValue = abs((int)$notesArray[$i] - (int)$notesArray[++$i]);

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
				default:
					$intervalArray[34]->value = $intervalArray[34]->value + 1;
					break;
			endswitch;
		}

		return $intervalArray;
	}

	/**
	 * Helper function to determine the artist/composer a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  string      		name of the artist (if available)
	 *
	 */
	private function _determineArtist($xml){
		$artist = $xml->xpath("//credit[credit-type='composer']");
		if ($artist) {
			return $artist[0]->{'credit-words'}->{0};
		} else {
			return "Unknown Artist";
		}
	}

	/**
	 * Helper function to determine the title in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  string      		title of the xml file
	 *
	 */
	private function _determineTitle($xml){
		$title = $xml->xpath("//credit[credit-type='title']");
		if ($title) {
			return $title[0]->{'credit-words'}->{0};
		} else {
			return "Unknown Title";
		}
	}

	/**
	 * Helper function to determine the instruments in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  array      			instruments array containing the instruments taking part in a xml file
	 *
	 */
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

	/**
	 * Helper function to count note-length frequency in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  array      			note-length array containing the frequency of note-lengths in a xml file
	 *
	 */
	private function _countNoteTypes($xml){
		$notes = $xml->xpath("//note");

		$noteTypesArray = array(
			(object)array("label" => "whole", "value" => 0 ),
			(object)array("label" => "half", "value" => 0 ),
			(object)array("label" => "quarter", "value" => 0 ),
			(object)array("label" => "eighth", "value" => 0 ),
			(object)array("label" => "16th", "value" => 0 ),
			(object)array("label" => "32nd", "value" => 0 ),
			(object)array("label" => "64th", "value" => 0 ),
			(object)array("label" => "Unknown", "value" => 0 )
			);

		foreach($notes as $note) {
			$value = $note->type;
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
			}else //unknown note type
			{
				$noteTypesArray[7]->value = $noteTypesArray[7]->value + 1;
			}
	    }
	    return $noteTypesArray;
	}

	/**
	 * Helper function to determine the start meter in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  string      		the start meter of the given file
	 *
	 */
	private function _determineMeter($xml){
		$beat = $xml->xpath("//beats");
		$beatType =  $xml->xpath("//beat-type");
		if(count($beat)>0 && count($beatType)>0){
			$meter = $beat[0] ."/". $beatType[0];
			return $meter;
		}else{
			return "Unknown";
		}
	}

	/**
	 * Helper function to determine the frequency of keys in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  array      			key array containing the frequency of keys in a xml file
	 *
	 */
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
			(object)array("label" => "A flat minor", "value" => 0 ),
			(object)array("label" => "Unknown", "value" => 0 )
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
			} else //unknown key
			{
				$keysArray[30]->value = $keysArray[30]->value + 1;
			}
	    }

	    return $keysArray;
	}

	/**
	 * Helper function to determine the clef in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  array      			clef array containing the frequency of clefs in a xml file
	 *
	 */
	private function _determineClef($xml){
		$clefs = $xml->xpath("//clef");

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

		foreach($clefs as $clef) {
			$value = $clef->sign;
			$line = $clef->line;

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

			}
	    }

	    return $clefsArray;
	}

	/**
	 * Helper function to count measures in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  int      			number of measures in a given xml file
	 *
	 */
	private function _countMeasures($xml){
		$measures = $xml->xpath("//measure");
		return count($measures);
	}

	/**
	 * Helper function to count rests in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  int      			number of rests in a given xml file
	 *
	 */
	private function _countRests($xml){
		$rests = $xml->xpath("//rest");
		return count($rests);
	}

	/**
	 * Helper function to count notes in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  in      			number of notes in a given xml file
	 *
	 */
	private function _countNotes($xml){
		$notes = $xml->xpath("//note");
		return count($notes);
	}

	/**
	 * Helper function to count note values in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  array      			notes array containing the frequency of note values in a xml file
	 *
	 */
	private function _countNoteValues($xml){
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
			(object)array("label" => "Unknown", "value" => 0 )
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
				default:
					$notesArray[19]->value = $notesArray[19]->value + 1;
					break;
			endswitch;
	    }

	    return $notesArray;
	}

	/**
	 * Helper function to determine the most frequent note in a given \SimpleXMLElement file
	 *
	 * @param   \SimpleXMLElement 	$xml   uploaded user file
	 *
	 * @return  string      		name of the most frequent note in a given xml file
	 *
	 */
	private function _determineMostFrequentNote($xml){

		$countedNotes = $this->_countNoteValues($xml);

		usort($countedNotes, function($a, $b) {
			if ($a->value == $b->value) {
				return 0;
			}

			return $a->value < $b->value ? -1 : 1;
		});
		$highest = array_slice($countedNotes, -1, 1);

	    return $highest[0]->label;

	}

}
