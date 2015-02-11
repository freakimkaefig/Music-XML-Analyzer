MusicXMLAnalyzer.UploadController = function() {

	var that = {},

	view = null,

	init = function(uploadView) {
		console.info('MusicXMLAnalyzer.UploadController.init');

		view = uploadView;

		$(view).on('uploadSubmit', onUploadSubmit);
	},

	onUploadSubmit = function(event) {
		window.location.href = '/upload-complete';
	};

	that.init = init;

	return that;
}