MusicXMLAnalyzer.DashboardModel = function(){

	var that = {},

	URL_GET_UPLOAD_IDS = "/dashboard/getUploadIds",
	URL_GET_RESULT_IDS = "/dashboard/getResultIds",
	URL_GET_RESULT_VALUE_BY_ID = "/dashboard/getResultValueById/",

	uploadIds = null,
	resultIds = null,
	results = null,

	init = function(){
		console.info('MusicXMLAnalyzer.DashboardModel.init');

		results = [];

		loadUploadIds();
		loadResultIds();
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
		uploadIds = JSON.parse(data);
	},

	loadResultIds = function() {
		$.ajax({
			url: URL_GET_RESULT_IDS,
			success: _onLoadResultIds
		});
	},

	_onLoadResultIds = function(data, textStatus, jqXHR) {
		resultIds = JSON.parse(data);

		for (var i = 0; i < resultIds.length; i++) {
			loadResultById(resultIds[i]);
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
				{ label: "Double octaven + Minor second", value: 0 },
				{ label: "Double octave + Major second", value: 0 },
				{ label: "Double octave + Minor third", value: 0 },
				{ label: "Double octave + Major third", value: 0 },
				{ label: "Double octave + Perfect fourth", value: 0 },
				{ label: "Double octave + Tritone", value: 0 },
				{ label: "Double octave + Perfect fifth", value: 0 },
				{ label: "Double octave + Minor sixth", value: 0 },
				{ label: "Double octave + Major sixth", value: 0 }
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
				{ label: "C major", value: 0 },
				{ label: "G major", value: 0 },
				{ label: "D major", value: 0 },
				{ label: "A major", value: 0 },
				{ label: "E major", value: 0 },
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
			note_types: {
				'': 0.0,
				'16th': 0.0,
				'eighth': 0.0,
				'half': 0.0,
				'quarter': 0.0,
				'whole': 0.0
			},
			title: []
		}
		for (var i = 0; i < resultsArr.length; i++) {
			mergedArr.artist.push(resultsArr[i].value.artist[0]);
			// ToDo: merge clefs
			mergedArr.count_measures += parseFloat(resultsArr[i].value.count_measures);
			mergedArr.count_notes += parseFloat(resultsArr[i].value.count_notes);
			mergedArr.count_rests += parseFloat(resultsArr[i].value.count_rests);
			// ToDo: merge instruments
			for (var j = 0; j < resultsArr[i].value.intervals.length; j++) {
				mergedArr.intervals[j].value += resultsArr[i].value.intervals[j].value;
			}
			for (var j = 0; j < resultsArr[i].value.key.length; j++) {
				mergedArr.key[j].value += resultsArr[i].value.key[j].value;
			}
			$.merge(mergedArr.meter, resultsArr[i].value.meter);	// ToDo: merge same values and count occurences
			// ToDo: calculate most_frequent_note
			for (var j = 0; j < resultsArr[i].value.note_distribution.length; j++) {
				mergedArr.note_distribution[j].value += resultsArr[i].value.note_distribution[j].value;
			}
			mergedArr.note_types[''] += parseFloat(resultsArr[i].value.note_types['']);
			mergedArr.note_types['16th'] += parseFloat(resultsArr[i].value.note_types['16th']);
			mergedArr.note_types['eighth'] += parseFloat(resultsArr[i].value.note_types['eighth']);
			mergedArr.note_types['half'] += parseFloat(resultsArr[i].value.note_types['half']);
			mergedArr.note_types['quarter'] += parseFloat(resultsArr[i].value.note_types['quarter']);
			mergedArr.note_types['whole'] += parseFloat(resultsArr[i].value.note_types['whole']);
			mergedArr.title.push(resultsArr[i].value.title[0]);
		}

		return mergedArr;
	};


	that.init = init;
	that.loadUploadIds = loadUploadIds;
	that.getResults = getResults;
	
	return that;
}