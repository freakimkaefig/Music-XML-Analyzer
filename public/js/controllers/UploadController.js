MusicXMLAnalyzer.UploadController = function() {

	var that = {},
	$uploadModal = null,
	$progressWrapper = null,
	$uploadSubmit = null,
	$uploadClose = null,
	gotValidFile = null,

	init = function() {
		console.info('MusicXMLAnalyzer.UploadController.init');

		$uploadModal = $('#uploadModal');
		$uploadModal.data('backdrop', 'static');
		$uploadModal.data('keyboard', false);

		$progressWrapper = $('#progressWrapper');

		$uploadSubmit = $('#uploadSubmit');
		$uploadSubmit.on('click', onUploadSubmit);
		$uploadClose = $('#uploadClose');
		$uploadClose.on('click', onUploadClose);
		setUploadSubmit(false);

		gotValidFile = false;
		
		Dropzone.options.uploadDropzone = {
			acceptedFiles: '.xml',
			maxFiles: 10,
			maxFilesize: 1024,
			// addRemoveLinks: true,
			// addedfile: onAddedFile,
			error: onError,
			success: onSuccess,
			queuecomplete: onQueueComplete
		};

	},

	setUploadSubmit = function(value) {
		if (value == true) {
			$uploadSubmit.removeAttr('disabled');
			$uploadClose.attr('disabled', 'disabled');
		} else {
			$uploadSubmit.attr('disabled', 'disabled');
			$uploadClose.removeAttr('disabled');
		}
	}

	onUploadSubmit = function(event) {
		console.info("MusicXMLAnalyzer.UploadController.onUploadSubmit");

		if (gotValidFile) {
			window.location.href = '/upload-complete';
		} else {
			var errorMessage = 'You have no new files to analyze!'
			$progressWrapper.prepend('<p>' + errorMessage + '</p>');
		}
	},

	onUploadClose = function() {
		$uploadModal.modal('toggle')
	}

	onError = function(file, errorMessage, xhrObject) {
		console.error("MusicXMLAnalyzer.UploadController.onError", event, errorMessage, xhrObject);

		$progressWrapper.prepend('<p>' + file.name + ' - ' + errorMessage + '</p>');
	},

	onSuccess = function(file, response) {
		console.info("MusicXMLAnalyzer.UploadController.onSuccess", file, response);

		if (!Route.check('/')) {
			$uploadModal.modal({
				keyboard: false,
				backdrop: 'static'
			});
			// $uploadModal.data('backdrop', 'static');
			// $uploadModal.data('keyboard', false);
			console.info("MusicXMLAnalyzer.UploadController.onSuccess", "Fixed modal");
		}

		if (file.accepted) {
			gotValidFile = true;
		}
	},

	onQueueComplete = function() {
		console.info("MusicXMLAnalyzer.UploadController.onQueueComplete");
		if (gotValidFile) {
			console.info("MusicXMLAnalyzer.UploadController.onQueueComplete", "READY");
			setUploadSubmit(true);
		}
	},

	dispose = function() {
		that = {};
	};


	that.init = init;
	that.dispose = dispose;

	return that;
}