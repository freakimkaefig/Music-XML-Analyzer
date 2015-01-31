MusicXMLAnalyzer.UploadController = function() {

	var that = {},
	$progressWrapper = null,
	gotValidFile = null,

	init = function() {
		console.info('MusicXMLAnalyzer.UploadController.init');

		$progressWrapper = $('#progressWrapper');
		$progressWrapper.empty();

		gotValidFile = false;
		
		Dropzone.options.uploadDropzone = {
			acceptedFiles: '.xml, .iso',
			maxFiles: 10,
			maxFilesize: 1024,
			error: onError,
			success: onSuccess,
			queuecomplete: onQueueComplete
		};
		
	},

	onError = function(file, errorMessage, xhrObject) {
		// console.error("MusicXMLAnalyzer.UploadController.onError", event, errorMessage, xhrObject);

		$progressWrapper.append('<p>' + file.name + ' - ' + errorMessage + '</p>');
	},

	onSuccess = function(file, response) {
		// console.log("MusicXMLAnalyzer.UploadController.onSuccess", file, response);

		if (file.accepted) {
			gotValidFile = true;
		}
	},

	onQueueComplete = function() {
		console.log(gotValidFile);
		if (gotValidFile) {
			console.info("MusicXMLAnalyzer.UploadController.onQueueComplete", "READY");
			window.location.href = '/upload-complete';
		}
	},

	/**
	 * Function to reset the instance of ARTEService
	 */
	dispose = function() {
		that = {};
	};


	that.init = init;
	that.dispose = dispose;

	return that;
}