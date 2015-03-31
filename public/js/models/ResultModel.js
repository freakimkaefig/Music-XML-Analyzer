MusicXMLAnalyzer.ResultModel = function(){

	var that = {},

	URL_POST_RESULT_EXTRACT = '/result/extract';

	resultItems = null,

	init = function(){
		console.info('MusicXMLAnalyzer.ResultModel.init');

		resultItems = [];
	},

	addResultItem = function(result) {
		resultItems.push(result);
		var index = resultItems.indexOf(result);
		loadResultExtract(index, result);
	},

	loadResultExtract = function(index, result) {
		$.ajax({
			url: URL_POST_RESULT_EXTRACT,
			method: 'POST',
			data: result,
			success: function(data, textStatus, jqXHR) {
				_onLoadResultExtract(index, data, textStatus, jqXHR);
			}
		});
	},

	_onLoadResultExtract = function(index, data, textStatus, jqXHR) {
		console.log(data);
		data = JSON.parse(data);
		resultItems[index].extract = data;
		$(that).trigger('resultExtractReceived', [index, data]);
	}

	that.init = init;
	that.addResultItem = addResultItem;

	return that;
}