<?php

class DownloadController extends BaseController {
	public function getResultsCSV() {
		$user = User::find(Cookie::get('user_id'));

		$this->_generateCSV($user);
		return View::make('home');
	}

	private function _generateCSV($user) {

		$uploads = $user->uploads->toArray();
		foreach ($uploads as $upload) {
			$upload = Upload::find($upload['id']);
			if ($upload->result) {	// check if upload is already analyised
				$download_path = public_path() . '\\downloads\\' . $user->id . '\\';
				if (!file_exists($download_path) || !is_dir($download_path)) {
					mkdir($download_path, 0755);
				}
				$filename = 'analysis_results.csv';
				$file_path = $download_path . $filename;
				$file = fopen($file_path, 'c');
				$result_value = json_decode($upload->result->value);

				Debugbar::info($result_value);
			}
		}

		// Debugbar::info($results);

	}
}


// {"file_url":"http:\/\/music-xml-analyzer.local\/uploads\/139\/ActorPreludeSample.xml","artist":["Lee Actor (2003)"],"title":["Prelude to a Tragedy"],"clef":[{"label":"soprano clef","value":0},{"label":"mezzo-sopran clef","value":0},{"label":"alto clef","value":1},{"label":"tenor clef","value":1},{"label":"baritone clef","value":0},{"label":"bass clef","value":8},{"label":"G clef","value":13},{"label":"percussion clef","value":2},{"label":"tablature","value":0},{"label":"none","value":0}],"key":[{"label":"C major","value":22},{"label":"G major","value":0},{"label":"D major","value":0},{"label":"A major","value":0},{"label":"E major","value":0},{"label":"H major","value":0},{"label":"F sharp major","value":0},{"label":"C sharp major","value":0},{"label":"F major","value":0},{"label":"B major","value":0},{"label":"Es major","value":0},{"label":"As major","value":0},{"label":"D flat major","value":0},{"label":"G flat major","value":0},{"label":"C flat major","value":0},{"label":"A minor","value":0},{"label":"E minor","value":0},{"label":"H minor","value":0},{"label":"F sharp minor","value":0},{"label":"C sharp minor","value":0},{"label":"G sharp minor","value":0},{"label":"D sharp minor","value":0},{"label":"A sharp minor","value":0},{"label":"D minor","value":0},{"label":"G minor","value":0},{"label":"C minor","value":0},{"label":"F minor","value":0},{"label":"B minor","value":0},{"label":"E flat minor","value":0},{"label":"A flat minor","value":0}],"meter":"3\/4","instruments":["Piccolo","Flutes","Oboes","English Horn","Clarinets in Bb","Bass Clarinet in Bb","Bassoons","Trumpets in C","Tuba","Timpani","Harp","Violin I","Violin II","Viola","Violoncello","Contrabass","Horns in F","Trombones","Percussion"],"count_measures":902,"count_notes":2945,"note_distribution":[{"label":"B","value":165},{"label":"C","value":173},{"label":"D","value":128},{"label":"Eb","value":85},{"label":"F","value":164},{"label":"D#","value":34},{"label":"E","value":280},{"label":"F#","value":233},{"label":"G","value":218},{"label":"A","value":134},{"label":"Bb","value":110},{"label":"C#","value":61},{"label":"A#","value":13},{"label":"E#","value":4},{"label":"Db","value":21},{"label":"Gb","value":33},{"label":"G#","value":58},{"label":"Cb","value":12},{"label":"Ab","value":25}],"note_types":[{"label":"whole","value":52},{"label":"half","value":188},{"label":"quarter","value":249},{"label":"eighth","value":22},{"label":"16th","value":1595},{"label":"32nd","value":0},{"label":"64th","value":0}],"count_rests":757,"most_frequent_note":15,"intervals":[{"label":"Perfect unison","value":97},{"label":"Minor second","value":513},{"label":"Major second","value":107},{"label":"Minor third","value":15},{"label":"Major third","value":27},{"label":"Perfect fourth","value":40},{"label":"Tritone","value":0},{"label":"Perfect fifth","value":23},{"label":"Minor sixth","value":9},{"label":"Major sixth","value":4},{"label":"Minor seventh","value":28},{"label":"Major seventh","value":0},{"label":"Perfect octave","value":37},{"label":"Minor ninth","value":44},{"label":"Major ninth","value":14},{"label":"Minor tenth","value":4},{"label":"Major tenth","value":4},{"label":"Perfect eleventh","value":0},{"label":"Augmented eleventh","value":0},{"label":"Perfect twelfth","value":2},{"label":"Minor thirteenth","value":0},{"label":"Major thirteenth","value":0},{"label":"Minor fourteenth","value":0},{"label":"Major fourteenth","value":0},{"label":"Double octave","value":1},{"label":"Double octaven + Minor second","value":0},{"label":"Double octave + Major second","value":1},{"label":"Double octave + Minor third","value":0},{"label":"Double octave + Major third","value":0},{"label":"Double octave + Perfect fourth","value":0},{"label":"Double octave + Tritone","value":1},{"label":"Double octave + Perfect fifth","value":0},{"label":"Double octave + Minor sixth","value":0},{"label":"Double octave + Major sixth","value":0}]}