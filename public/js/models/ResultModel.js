/** @constructor */
MusicXMLAnalyzer.ResultModel = function() {

	var that = {},

	URL_POST_RESULT_EXTRACT = '/result/extract',

	numItems = null,
	resultItems = null,
	startedLoading = null,
	loadingCounter = null,

	/**
	 * this is the init mehtod of result model
	 *
	 */
	init = function() {

		numItems = 0;
		resultItems = [];
		startedLoading = false;
		loadingCounter = 0;
	},

	/**
	 * Sets number of items
	 *
	 * @param {number}    num    number of items
	 *
	 */
	setNumItems = function(num) {
		numItems = num;
	},

	/**
	 * Adds a result item to resultItems array
	 *
	 * @param {Result}    result    result item
	 *
	 */
	addResultItem = function(result) {
		resultItems.push(result);
		if (!startedLoading) {
			startedLoading = true;
			loadResultExtracts();
		}
	},

	/**
	 * This method loads extracts of the result
	 *
	 */
	loadResultExtracts = function() {
		// console.log(loadingCounter);
		$.ajax({
			url: URL_POST_RESULT_EXTRACT,
			method: 'POST',
			data: resultItems[loadingCounter],
			success: function(data, textStatus, jqXHR) {
				_onLoadResultExtract(loadingCounter, data, textStatus, jqXHR);
			}
		});
	},

	/**
	 * This method gets called when the result extracts have been loaded successfully
	 *
	 */
	_onLoadResultExtract = function(index, data, textStatus, jqXHR) {
		data = JSON.parse(data);
		// console.log(index, data);
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
