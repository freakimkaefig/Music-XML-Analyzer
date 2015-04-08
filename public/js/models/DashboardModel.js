MusicXMLAnalyzer.DashboardModel = function(){

	var that = {},

	URL_GET_UPLOAD_IDS = "/dashboard/getUploadIds",
	URL_GET_RESULT_IDS = "/dashboard/getResultIds",
	URL_GET_RESULT_VALUE_BY_ID = "/dashboard/getResultValueById/",

	uploadIds = null,
	resultIds = null,
	results = null,
	tempInstruments = [],


	/**
	 * Init function
	 */
	init = function(){
		results = [];

		loadUploadIds();
		loadResultIds();
	},

	addLogMessage = function(msg) {
		$(that).trigger('logMessage', [msg]);
	},

	getResults = function(id) {
		if (id === undefined) {
			return results;
		} else if (id === 'all') {
			return results['all'];
		} else {
			var result = $.grep(results, function(e){ return e.id == id; });
			console.log(result);
			return result[0];
		}
	},

	loadUploadIds = function() {
		$.ajax({
			url: URL_GET_UPLOAD_IDS,
			success: _onLoadResults
		});
	},

	_onLoadResults = function(data, textStatus, jqXHR) {
		if (data !== "empty") {
			uploadIds = JSON.parse(data);
		} else {
			addLogMessage('No files uploaded! Click on upload to upload files.');
		}
	},

	loadResultIds = function() {
		$.ajax({
			url: URL_GET_RESULT_IDS,
			success: _onLoadResultIds
		});
	},

	_onLoadResultIds = function(data, textStatus, jqXHR) {
		if (data !== "empty") {
			resultIds = JSON.parse(data);

			for (var i = 0; i < resultIds.length; i++) {
				loadResultById(resultIds[i]);
			}
		} else {
			addLogMessage('Files not analyzed yet. Hang out ...');
			window.location.href = '/upload-complete';
		}
	},

	loadResultById = function(id) {
		$.ajax({
			url: URL_GET_RESULT_VALUE_BY_ID + id,
			success: function (data, textStatus, jqXHR) {
				_onLoadResultById(id, data, textStatus, jqXHR);
			}
		});
	},

	_onLoadResultById = function(id, data, textStatus, jqXHR) {
		var seen = false;
		for (var i = 0; i < results.length; i++) {
			if (results[i].id == id) seen = i;

			if (results[i].id === 'all') {
				// clear merged results
				results.splice(i, 1);
			}
		}

		if (seen) {
			results[seen] = { id: id, value: JSON.parse(data) };
		} else {
			results.push({ id: id, value: JSON.parse(data) });
		}

		if (results.length == resultIds.length) {
			// merge results
			mergedValues = _mergeResults(results);
			results['all'] = { id: 'all', value: mergedValues };
			$(that).trigger('model_ready', [ results ]);
		}
	},

	_mergeResults = function(resultsArr) {
		mergedArr = {
			artist: [],
			clef: null,
			count_measures: 0.0,
			count_notes: 0.0,
			count_rests: 0.0,
			instruments: [],
			intervals: [
				{ label: "Perfect unison", value: 0 },
				{ label: "Minor second", value: 0 },
				{ label: "Major second", value: 0 },
				{ label: "Minor third", value: 0 },
				{ label: "Major third", value: 0 },
				{ label: "Perfect fourth", value: 0 },
				{ label: "Tritone", value: 0 },
				{ label: "Perfect fifth", value: 0 },
				{ label: "Minor sixth", value: 0 },
				{ label: "Major sixth", value: 0 },
				{ label: "Minor seventh", value: 0 },
				{ label: "Major seventh", value: 0 },
				{ label: "Perfect octave", value: 0 },
				{ label: "Minor ninth", value: 0 },
				{ label: "Major ninth", value: 0 },
				{ label: "Minor tenth", value: 0 },
				{ label: "Major tenth", value: 0 },
				{ label: "Perfect eleventh", value: 0 },
				{ label: "Augmented eleventh", value: 0 },
				{ label: "Perfect twelfth", value: 0 },
				{ label: "Minor thirteenth", value: 0 },
				{ label: "Major thirteenth", value: 0 },
				{ label: "Minor fourteenth", value: 0 },
				{ label: "Major fourteenth", value: 0 },
				{ label: "Double octave", value: 0 },
				{ label: "Dbl. oct. + Min. 2nd", value: 0 },
				{ label: "Dbl. oct. + Maj. 2nd", value: 0 },
				{ label: "Dbl. oct. + Min. 3rd", value: 0 },
				{ label: "Dbl. oct. + Maj. 3rd", value: 0 },
				{ label: "Dbl. oct. + Perfect 4th", value: 0 },
				{ label: "Dbl. oct. + Tritone", value: 0 },
				{ label: "Dbl. oct. + Perfect 5th", value: 0 },
				{ label: "Dbl. oct. + Min. 6th", value: 0 },
				{ label: "Dbl. oct. + Maj. 6th", value: 0 }
			],
			key: [
				{ label: "C major", value: 0 },
				{ label: "G major", value: 0 },
				{ label: "D major", value: 0 },
				{ label: "A major", value: 0 },
				{ label: "E major", value: 1 },
				{ label: "H major", value: 0 },
				{ label: "F sharp major", value: 0 },
				{ label: "C sharp major", value: 0 },
				{ label: "F major", value: 0 },
				{ label: "B major", value: 0 },
				{ label: "Es major", value: 0 },
				{ label: "As major", value: 0 },
				{ label: "D flat major", value: 0 },
				{ label: "G flat major", value: 0 },
				{ label: "C flat major", value: 0 },
				{ label: "A minor", value: 0 },
				{ label: "E minor", value: 0 },
				{ label: "H minor", value: 0 },
				{ label: "F sharp minor", value: 0 },
				{ label: "C sharp minor", value: 0 },
				{ label: "G sharp minor", value: 0 },
				{ label: "D sharp minor", value: 0 },
				{ label: "A sharp minor", value: 0 },
				{ label: "D minor", value: 0 },
				{ label: "G minor", value: 0 },
				{ label: "C minor", value: 0 },
				{ label: "F minor", value: 0 },
				{ label: "B minor", value: 0 },
				{ label: "E flat minor", value: 0 },
				{ label: "A flat minor", value: 0 }
			],
			meter: [],
			most_frequent_note: '',
			note_distribution: [
				{ label: "B", value: 0 },
				{ label: "C", value: 0 },
				{ label: "D", value: 0 },
				{ label: "Eb", value: 0 },
				{ label: "F", value: 0 },
				{ label: "D#", value: 0 },
				{ label: "E", value: 0 },
				{ label: "F#", value: 0 },
				{ label: "G", value: 0 },
				{ label: "A", value: 0 },
				{ label: "Bb", value: 0 },
				{ label: "C#", value: 0 },
				{ label: "A#", value: 0 },
				{ label: "E#", value: 0 },
				{ label: "Db", value: 0 },
				{ label: "Gb", value: 0 },
				{ label: "G#", value: 0 },
				{ label: "Cb", value: 0 },
				{ label: "Ab", value: 0 }
			],
			note_types: [
				{ label: "whole", value: 0 },
				{ label: "half", value: 0 },
				{ label: "quarter", value: 0 },
				{ label: "eighth", value: 0 },
				{ label: "16th", value: 0 },
				{ label: "32nd", value: 0 },
				{ label: "64th", value: 0 }
			],
			title: []
		}

		addLogMessage('Calculating overall statistics ...');

		for (var i = 0; i < resultsArr.length; i++) {

			// merge artists
			mergedArr.artist.push(resultsArr[i].value.artist[0]);

			// merge clefs
			// ToDo: merge clefs

			// merge counted measures
			mergedArr.count_measures += parseFloat(resultsArr[i].value.count_measures);

			// merge counted notes
			mergedArr.count_notes += parseFloat(resultsArr[i].value.count_notes);

			// merge counted rests
			mergedArr.count_rests += parseFloat(resultsArr[i].value.count_rests);

			//merge instruments
			//mergedArr.instruments = mergedArr.instruments.concat(resultsArr[i].value.instruments);



			for(var x = 0; x < resultsArr[i].value.instruments.length; x++){
				tempInstruments.push(resultsArr[i].value.instruments[x]);
			}

			// merge counted intervals
			for (var intervalCounter = 0; intervalCounter < resultsArr[i].value.intervals.length; intervalCounter++) {
				mergedArr.intervals[intervalCounter].value += resultsArr[i].value.intervals[intervalCounter].value;
			}

			// merge keys
			for (var keyCounter = 0; keyCounter < resultsArr[i].value.key.length; keyCounter++) {
				mergedArr.key[keyCounter].value += resultsArr[i].value.key[keyCounter].value;
			}

			// merge meter
			if (!mergedArr.meter.length) {
				mergedArr.meter.push({ label: resultsArr[i].value.meter, value: 1 });
			} else {
				var found = false;
				for (var meterCounter = 0; meterCounter < mergedArr.meter.length; meterCounter++) {
					if (mergedArr.meter[meterCounter].label == resultsArr[i].value.meter) {
						found = true;
						mergedArr.meter[meterCounter].value++;
						break;
					}
				}
				if (!found) {
					mergedArr.meter.push({ label: resultsArr[i].value.meter, value: 1 });
				}
			}

			// merge note distributions
			for (var noteCounter = 0; noteCounter < resultsArr[i].value.note_distribution.length; noteCounter++) {
				mergedArr.note_distribution[noteCounter].value += resultsArr[i].value.note_distribution[noteCounter].value;
			}

			// merge note types
			for (var typeCounter = 0; typeCounter < resultsArr[i].value.note_types.length; typeCounter++) {
				mergedArr.note_types[typeCounter].value += resultsArr[i].value.note_types[typeCounter].value;
			}

			// merge titles
			mergedArr.title.push(resultsArr[i].value.title[0]);
		}

		var seen = {};
	    var out = [];
	    var len = tempInstruments.length;
	    var j = 0;
	    for(var i = 0; i < len; i++) {
		    var item = tempInstruments[i];
	        if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
        	}
	    }


	    for(var i = 0; i < out.length; i++){
			mergedArr.instruments = mergedArr.instruments.concat(out[i]);
		};

		// calculate most frequent note
		mostFrequentNoteIndex = -1;
		mostFrequentNoteValue = -1;
		for (var mostFrequentNoteCounter = 0; mostFrequentNoteCounter < mergedArr.note_distribution.length; mostFrequentNoteCounter++) {
			if (mergedArr.note_distribution[mostFrequentNoteCounter].value > mostFrequentNoteValue) {
				mostFrequentNoteIndex = mostFrequentNoteCounter;
				mostFrequentNoteValue = mergedArr.note_distribution[mostFrequentNoteCounter].value;
			}
		}
		mergedArr.most_frequent_note = mergedArr.note_distribution[mostFrequentNoteIndex].label;

		return mergedArr;
	};


	that.init = init;
	that.loadUploadIds = loadUploadIds;
	that.getResults = getResults;

	return that;
}