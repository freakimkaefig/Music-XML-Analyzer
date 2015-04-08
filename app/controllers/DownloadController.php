<?php

class DownloadController extends BaseController {

	/**
	 * Function to get results as CSV
	 *
	 * @return 	\Illuminate\View\View 	The download view
	 *
	 */
	public function getResultsCSV() {
		$user = User::find(Cookie::get('user_id'));

		$path = $this->_generateCSV($user);
		return View::make('download.download')->with('path', $path);
	}


	/**
	 * Function to generate a CSV file
	 *
	 * @param   object    	The currently active user who requested the CSV file
	 *
	 * @return  String      Url to download generated CSV file
	 *
	 */
	private function _generateCSV($user) {

		// csv variables
		$seperator = ';';
		$stringClosing = '"';
		$escape = '\\';

		$uploads = $user->uploads->toArray();
		$filename = 'analysis_results.csv';
		$download_path = public_path() . '\\downloads\\' . $user->id . '\\';
		if (!file_exists($download_path) || !is_dir($download_path)) {
			mkdir($download_path, 0755);
		}
		$file_path = $download_path . $filename;
		file_put_contents($file_path, '');	// empty file
		$file = fopen($file_path, 'c+');	// open file
		$headRow = array("filename", "artist", "title", "meter", "count_measures", "count_notes", "count_rests", "most_frequent_note", "soprano clef", "mezzo-sopran clef", "alto clef", "tenor clef", "baritone clef", "bass clef", "G clef", "percussion clef", "tablature", "none", "C major", "G major", "D major", "A major", "E major", "H major", "F sharp major", "C sharp major", "F major", "B major", "Es major", "As major", "D flat major", "G flat major", "C flat major", "A minor", "E minor", "H minor", "F sharp minor", "C sharp minor", "G sharp minor", "D sharp minor", "A sharp minor", "D minor", "G minor", "C minor", "F minor", "B minor", "E flat minor", "A flat minor", "B", "C", "D", "Eb", "F", "D#", "E", "F#", "G", "A", "Bb", "C#", "A#", "E#", "Db", "Gb", "G#", "Cb", "Ab", "whole", "half", "quarter", "eighth",  "16th", "32nd", "64th", "Perfect unison", "Minor second", "Major second", "Minor third", "Major third", "Perfect fourth", "Tritone", "Perfect fifth", "Minor sixth", "Major sixth", "Minor seventh", "Major seventh", "Perfect octave", "Minor ninth", "Major ninth", "Minor tenth", "Major tenth", "Perfect eleventh", "Augmented eleventh", "Perfect twelfth", "Minor thirteenth", "Major thirteenth", "Minor fourteenth", "Major fourteenth", "Double octave", "Double octaven + Minor second", "Double octave + Major second",  "Double octave + Minor third", "Double octave + Major third", "Double octave + Perfect fourth", "Double octave + Tritone", "Double octave + Perfect fifth", "Double octave + Minor sixth", "Double octave + Major sixth", "instruments");
		$write = fputcsv($file, $headRow, $seperator, $stringClosing, $escape);
		foreach ($uploads as $upload) {
			$upload = Upload::find($upload['id']);
			if ($upload->result) {	// check if upload is already analyised

				$result_value = json_decode($upload->result->value);

				$upload_filename	= $upload->name();
				$artist 			= $result_value->artist[0];				// string
				$title 				= $result_value->title[0];				// string
				$meter 				= $result_value->meter;					// meter
				$count_measures 	= $result_value->count_measures;		// int
				$count_notes 		= $result_value->count_notes;			// int
				$count_rests 		= $result_value->count_rests;			// int
				$most_frequent_note = $result_value->most_frequent_note;	// string
				$clefs 				= $result_value->clef;					// array('label' => string, 'value' => int)
				$keys 				= $result_value->key;					// array('label' => string, 'value' => int)
				$note_distribution	= $result_value->note_distribution;		// array('label' => string, 'value' => int)
				$note_types			= $result_value->note_types;			// array('label' => string, 'value' => int)
				$intervals			= $result_value->intervals;				// array('label' => string, 'value' => int)
				$instruments 		= $result_value->instruments;			// array('string') 		// undefined length

				$row = array();

				array_push($row, $upload_filename);
				array_push($row, $artist);
				array_push($row, $title);
				array_push($row, $meter);
				array_push($row, $count_measures);
				array_push($row, $count_notes);
				array_push($row, $count_rests);
				array_push($row, $most_frequent_note);
				foreach ($clefs as $clef) {
					array_push($row, $clef->value);
				}
				foreach ($keys as $key) {
					array_push($row, $key->value);
				}
				foreach($note_distribution as $note) {
					array_push($row, $note->value);
				}
				foreach ($note_types as $note_type) {
					array_push($row, $note_type->value);
				}
				foreach ($intervals as $interval) {
					array_push($row, $interval->value);
				}
				array_push($row, implode(',', $instruments));

				Debugbar::info($row);

				$write = fputcsv($file, $row, $seperator, $stringClosing, $escape);
			}
		}
		fclose($file);

		return URL::to('/downloads/') . '/' . $user->id . '/' . $filename;
	}
}
