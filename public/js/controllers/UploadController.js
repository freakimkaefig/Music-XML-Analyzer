MusicXMLAnalyzer.UploadController = function() {

	var that = {},
	view = null,

	/**
	 * Init function of UploadController
	 */
	init = function() {
		view = MusicXMLAnalyzer.UploadView();
		view.init();

		$(view).on('uploadSubmit', onUploadSubmit);
	},

	onUploadSubmit = function(event) {
		window.location.href = '/upload-complete';
	};

	that.init = init;

	return that;
}