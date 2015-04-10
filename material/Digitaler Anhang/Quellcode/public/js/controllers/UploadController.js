/** @constructor */
MusicXMLAnalyzer.UploadController = function() {

	var that = {},
	view = null,

	/**
	 * Init function of UploadController
	 * @function
     * @public
	 */
	init = function() {
		view = MusicXMLAnalyzer.UploadView();
		view.init();

		$(view).on('uploadSubmit', onUploadSubmit);
	},

	/**
	 * Callback function for upload submit button
	 * @function
     * @private
	 *
	 * @param 	{Event} 	event 	The triggered event
	 */
	onUploadSubmit = function(event) {
		window.location.href = '/upload-complete';
	};

	that.init = init;

	return that;
}