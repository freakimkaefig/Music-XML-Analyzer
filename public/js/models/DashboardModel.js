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

	getResults = function() {
		return results;
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
			artist: '', 
			clef: null,
			count_measures: 0,
			count_notes: 0,
			count_rests: 0,
			instruments: [],
			intervals: {
				'Double octave': 0,
				'Double octave + Major second': 0,
				'Double octave + Tritone': 0,
				'Major ninth': 0,
				'Major second': 0,
				'Major seventh': 0,
				'Major sixth': 0,
				'Major tenth': 0,
				'Major third': 0,
				'Minor ninth': 0,
				'Minor second': 0,
				'Minor seventh': 0,
				'Minor sixth': 0,
				'Minor tenth': 0,
				'Minor third': 0,
				'Perfect fifth': 0,
				'Perfect fourth': 0,
				'Perfect octave': 0,
				'Perfect twelfth': 0,
				'Perfect unison': 0,
				'Tritone': 0
			},
			key: {},
			meter: '',
			most_frequent_note: '',
			note_distribution: {
				'A': 0,
				'A#': 0,
				'Ab': 0,
				'B': 0,
				'Bb': 0,
				'C': 0,
				'C#': 0,
				'Cb': 0,
				'D': 0,
				'D#': 0,
				'Db': 0,
				'E': 0,
				'E#': 0,
				'Eb': 0,
				'F': 0,
				'F#': 0,
				'G': 0,
				'G#': 0,
				'Gb': 0
			},
			note_types: {
				'': 0,
				'16th': 0,
				'eighth': 0,
				'half': 0,
				'quarter': 0,
				'whole': 0
			},
			title: ''
		}
		for (var i = 0; i < resultsArr.length; i++) {
			// mergedArr.artist += // TODO artist as array
			// mergedArr.clef = ???
			mergedArr.count_measures += parseInt(resultsArr[i].value.count_measures);
			mergedArr.count_notes += parseInt(resultsArr[i].value.count_notes);
			mergedArr.count_rests += parseInt(resultsArr[i].value.count_rests);
			// mergedArr.instruments = ???
			mergedArr.intervals['Double octave'] += parseInt(resultsArr[i].value.intervals['Double octave']);
			mergedArr.intervals['Double octave + Major second'] += parseInt(resultsArr[i].value.intervals['Double octave + Major second']);
			mergedArr.intervals['Double octave + Tritone'] += parseInt(resultsArr[i].value.intervals['Double octave + Tritone']);
			mergedArr.intervals['Major ninth'] += parseInt(resultsArr[i].value.intervals['Major ninth']);
			mergedArr.intervals['Major second'] += parseInt(resultsArr[i].value.intervals['Major second']);
			mergedArr.intervals['Major seventh'] += parseInt(resultsArr[i].value.intervals['Major seventh']);
			mergedArr.intervals['Major sixth'] += parseInt(resultsArr[i].value.intervals['Major sixth']);
			mergedArr.intervals['Major tenth'] += parseInt(resultsArr[i].value.intervals['Major tenth']);
			mergedArr.intervals['Major third'] += parseInt(resultsArr[i].value.intervals['Major third']);
			mergedArr.intervals['Minor ninth'] += parseInt(resultsArr[i].value.intervals['Minor ninth']);
			mergedArr.intervals['Minor second'] += parseInt(resultsArr[i].value.intervals['Minor second']);
			mergedArr.intervals['Minor seventh'] += parseInt(resultsArr[i].value.intervals['Minor seventh']);
			mergedArr.intervals['Minor sixth'] += parseInt(resultsArr[i].value.intervals['Minor sixth']);
			mergedArr.intervals['Minor tenth'] += parseInt(resultsArr[i].value.intervals['Minor tenth']);
			mergedArr.intervals['Minor third'] += parseInt(resultsArr[i].value.intervals['Minor third']);
			mergedArr.intervals['Perfect fifth'] += parseInt(resultsArr[i].value.intervals['Perfect fifth']);
			mergedArr.intervals['Perfect fourth'] += parseInt(resultsArr[i].value.intervals['Perfect fourth']);
			mergedArr.intervals['Perfect octave'] += parseInt(resultsArr[i].value.intervals['Perfect octave']);
			mergedArr.intervals['Perfect twelfth'] += parseInt(resultsArr[i].value.intervals['Perfect twelfth']);
			mergedArr.intervals['Perfect unison'] += parseInt(resultsArr[i].value.intervals['Perfect unison']);
			mergedArr.intervals['Tritone'] += parseInt(resultsArr[i].value.intervals['Tritone']);
			// mergedArr.key += // TODO key as array
			// mergedArr.meter += // TODO meter as array
			// mergedArr.most_frequent_note += // retrieve from note_distribution
			mergedArr.note_distribution['A'] += parseInt(resultsArr[i].value.note_distribution['A']);
			mergedArr.note_distribution['A#'] += parseInt(resultsArr[i].value.note_distribution['A#']);
			mergedArr.note_distribution['Ab'] += parseInt(resultsArr[i].value.note_distribution['Ab']);
			mergedArr.note_distribution['B'] += parseInt(resultsArr[i].value.note_distribution['B']);
			mergedArr.note_distribution['Bb'] += parseInt(resultsArr[i].value.note_distribution['Bb']);
			mergedArr.note_distribution['C'] += parseInt(resultsArr[i].value.note_distribution['C']);
			mergedArr.note_distribution['C#'] += parseInt(resultsArr[i].value.note_distribution['C#']);
			mergedArr.note_distribution['Cb'] += parseInt(resultsArr[i].value.note_distribution['Cb']);
			mergedArr.note_distribution['D'] += parseInt(resultsArr[i].value.note_distribution['D']);
			mergedArr.note_distribution['D#'] += parseInt(resultsArr[i].value.note_distribution['D#']);
			mergedArr.note_distribution['Db'] += parseInt(resultsArr[i].value.note_distribution['Db']);
			mergedArr.note_distribution['E'] += parseInt(resultsArr[i].value.note_distribution['E']);
			mergedArr.note_distribution['E#'] += parseInt(resultsArr[i].value.note_distribution['E#']);
			mergedArr.note_distribution['Eb'] += parseInt(resultsArr[i].value.note_distribution['Eb']);
			mergedArr.note_distribution['F'] += parseInt(resultsArr[i].value.note_distribution['F']);
			mergedArr.note_distribution['F#'] += parseInt(resultsArr[i].value.note_distribution['F#']);
			mergedArr.note_distribution['G'] += parseInt(resultsArr[i].value.note_distribution['G']);
			mergedArr.note_distribution['G#'] += parseInt(resultsArr[i].value.note_distribution['G#']);
			mergedArr.note_distribution['Gb'] += parseInt(resultsArr[i].value.note_distribution['Gb']);
			mergedArr.note_types[''] += parseInt(resultsArr[i].value.note_types['']);
			mergedArr.note_types['16th'] += parseInt(resultsArr[i].value.note_types['16th']);
			mergedArr.note_types['eighth'] += parseInt(resultsArr[i].value.note_types['eighth']);
			mergedArr.note_types['half'] += parseInt(resultsArr[i].value.note_types['half']);
			mergedArr.note_types['quarter'] += parseInt(resultsArr[i].value.note_types['quarter']);
			mergedArr.note_types['whole'] += parseInt(resultsArr[i].value.note_types['whole']);
			// mergedArr.title += // TODO title as array
		}

		return mergedArr;
	}



	that.init = init;
	that.loadUploadIds = loadUploadIds;
	that.getResults = getResults;
	
	return that;
}