MusicXMLAnalyzer.ResultModel = function() {

	var that = {},

	URL_POST_RESULT_EXTRACT = '/result/extract',

	numItems = null,
	resultItems = null,
	startedLoading = null,
	loadingCounter = null,

	init = function() {
		console.info('MusicXMLAnalyzer.ResultModel.init');

		numItems = 0;
		resultItems = [];
		startedLoading = false;
		loadingCounter = 0;
	},

	setNumItems = function(num) {
		numItems = num;
	},

	addResultItem = function(result) {
		resultItems.push(result);
		if (!startedLoading) {
			startedLoading = true;
			loadResultExtracts();
		}
	},

	loadResultExtracts = function() {
		$.ajax({
			url: URL_POST_RESULT_EXTRACT,
			method: 'POST',
			data: resultItems[loadingCounter],
			success: function(data, textStatus, jqXHR) {
				_onLoadResultExtract(loadingCounter, data, textStatus, jqXHR);
			}
		});
	},

	_onLoadResultExtract = function(index, data, textStatus, jqXHR) {
		data = JSON.parse(data);
		resultItems[index].extract = data;
		$(that).trigger('resultExtractReceived', [index, data]);
		loadingCounter++;
		if (loadingCounter < numItems) {
			loadResultExtracts();
		}
	};

	that.init = init;
	that.setNumItems = setNumItems;
	that.addResultItem = addResultItem;

	return that;
}
