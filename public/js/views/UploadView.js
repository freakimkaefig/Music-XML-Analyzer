MusicXMLAnalyzer.UploadView = function(){

	var that = {},

	$logMessages = null,
	logMessageCounter = null,

	$uploadModal = null,
	$uploadDropzone = null,
	$uploadSubmit = null,
	$uploadClose = null,
	gotValidFile = null,
	uploadCounter = null,


	init = function(){
		console.info('MusicXMLAnalyzer.UploadView.init');

		$uploadModal = $('#uploadModal');
		$uploadModal.data('backdrop', 'static');
		$uploadModal.data('keyboard', false);

		$uploadDropzone = $('#uploadDropzone');

		$uploadSubmit = $('#uploadSubmit');
		$uploadSubmit.on('click', onUploadSubmit);
		$uploadClose = $('#uploadClose');
		$uploadClose.on('click', onUploadClose);
		setUploadSubmit(false);

		var previewNode = document.querySelector('#template');
		previewNode.id = '';
		var previewTemplate = previewNode.parentNode.innerHTML;
		previewNode.parentNode.removeChild(previewNode);

		Dropzone.options.uploadDropzone = {
			acceptedFiles: '.xml',
			maxFiles: null,
			maxFilesize: 1024,
			// addRemoveLinks: true,
			// addedfile: onAddedFile,
			error: onError,
			success: onSuccess,
			queuecomplete: onQueueComplete,
			previewTemplate: previewTemplate
		};

		gotValidFile = false;
		uploadCounter = 0;

		$logMessages = $('#uploadMessages');
		uploadMessageCounter = 0;
	},

	setUploadSubmit = function(value) {
		if (value == true) {
			$uploadSubmit.removeAttr('disabled');
			$uploadClose.attr('disabled', 'disabled');
		} else {
			$uploadSubmit.attr('disabled', 'disabled');
			$uploadClose.removeAttr('disabled');
		}
	},

	disableAllInputs = function() {
		$uploadSubmit.attr('disabled', 'disabled');
		$uploadClose.attr('disabled', 'disabled');
	},

	onUploadSubmit = function(event) {
		console.info("MusicXMLAnalyzer.UploadController.onUploadSubmit");

		if (gotValidFile) {
			addLogMessage('Analyzing files. Hang out ...');
			disableAllInputs();
			$(that).trigger('uploadSubmit');
		} else {
			var errorMessage = 'You have no new files to analyze!'
			addLogMessage('ERROR: ' + errorMessage);
		}
	},

	onUploadClose = function() {
		$uploadModal.modal('toggle')
	}

	onError = function(file, errorMessage, xhrObject) {
		// console.error("MusicXMLAnalyzer.UploadController.onError", event, errorMessage, xhrObject);

		addLogMessage('ERROR: ' + file.name + ' - ' + errorMessage);
	},

	onSuccess = function(file, response) {
		console.info("MusicXMLAnalyzer.UploadController.onSuccess", file, response);

		if (!Route.check('/')) {
			$uploadModal.modal({
				keyboard: false,
				backdrop: 'static'
			});
			// console.info("MusicXMLAnalyzer.UploadController.onSuccess", "Fixed modal");
		}

		if (file.accepted) {
			gotValidFile = true;
			uploadCounter++;
			addLogMessage('Uploaded ' + file.name);
		}

	},

	onQueueComplete = function() {
		console.info("MusicXMLAnalyzer.UploadController.onQueueComplete");
		if (gotValidFile) {
			// console.info("MusicXMLAnalyzer.UploadController.onQueueComplete", "READY");
			setUploadSubmit(true);
		}
	},

	initLogMessages = function() {
		console.info("initLogMessage");
		uploadMessageCounter = 0;
		$logMessages.show();
		$logMessages.animate({
			height: 100
		}, 500);
	},

	disposeLogMessages = function() {
		window.setTimeout(function() {
			$logMessages.animate({
				height: 0
			},
			700,
			function() {
				$logMessages.hide();
				$logMessages.empty();
			});
		}, 100);
	},

	addLogMessage = function(msg) {
		console.info("addLogMessage", msg, uploadCounter);
		if (uploadCounter == 1) {
			initLogMessages();
		}
		$('#log' + (uploadMessageCounter - 3)).animate({
			"marginTop": "-30px"
		}, 200);
		$logMessages.append('<div id="log' + uploadMessageCounter + '"></div>');
		$('#log' + uploadMessageCounter).typed({
			strings: ['<p>' + msg + '</p>'],
			backDelay: 100000000000000,
			typeSpeed: 0,
			backSpeed: 0,
			loop: true,
		});
		uploadMessageCounter++;
	};

	that.init = init;
	that.disposeLogMessages = disposeLogMessages;
	that.addLogMessage = addLogMessage;

	return that;
}