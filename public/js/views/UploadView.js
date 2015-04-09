MusicXMLAnalyzer.UploadView = function(){

	var that = {},

	$logMessages = null,
	uploadMessageCounter = null,

	$uploadModal = null,
	$uploadDropzone = null,
	$uploadSubmit = null,
	$uploadClose = null,
	gotValidFile = null,
	uploadCounter = null,

	 /**
	 * Init function of UploadView
	 *
	 */
	init = function(){
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

	/**
	 * This method sets the upload submit button active or disabled
	 *
	 * @param {boolean}    value    boolean value for active or disabled
	 *
	 */
	setUploadSubmit = function(value) {
		if (value == true) {
			$uploadSubmit.removeAttr('disabled');
			$uploadClose.attr('disabled', 'disabled');
		} else {
			$uploadSubmit.attr('disabled', 'disabled');
			$uploadClose.removeAttr('disabled');
		}
	},

	/**
	 * Disables all input buttons
	 *
	 */
	disableAllInputs = function() {
		$uploadSubmit.attr('disabled', 'disabled');
		$uploadClose.attr('disabled', 'disabled');
	},

	/**
	 * Gets called when upload hast been started
	 *
	 * @param {event}    event    click event
	 *
	 */
	onUploadSubmit = function(event) {
		if (gotValidFile) {
			addLogMessage('Analyzing files. Hang out ...');
			disableAllInputs();
			$(that).trigger('uploadSubmit');
		} else {
			var errorMessage = 'You have no new files to analyze!';
			addLogMessage('ERROR: ' + errorMessage);
		}
	},

	/**
	 * Gets called when uploading data is done
	 *
	 */
	onUploadClose = function() {
		$uploadModal.modal('toggle');
	},

	/**
	 * Gets called when an error occurs
	 *
	 * @param {file}    file    the file to upload
	 *
	 * @param {string}    errorMessage    error message
	 *
	 * @param {object}    xhrObject    an xhr object
	 */
	onError = function(file, errorMessage, xhrObject) {
		addLogMessage('ERROR: ' + file.name + ' - ' + errorMessage);
	},

	/**
	 * Gets called when uploading data has been successful
	 *
	 * @param {file}    file    the file to upload
	 *
	 * @param {string}    respone    response message
	 *
	 */
	onSuccess = function(file, response) {
		if (!Route.check('/')) {
			$uploadModal.modal({
				keyboard: false,
				backdrop: 'static'
			});
		}

		if (file.accepted) {
			gotValidFile = true;
			uploadCounter++;
			addLogMessage('Uploaded ' + file.name);
		}

	},

	/**
	 * Gets called when upload queue is complete
	 *
	 */
	onQueueComplete = function() {
		if (gotValidFile) {
			setUploadSubmit(true);
		}
	},

	/**
	 * Inits the log messages for uploading
	 *
	 */
	initLogMessages = function() {
		uploadMessageCounter = 0;
		$logMessages.show();
		$logMessages.animate({
			height: 100
		}, 500);
	},

	/**
	 * Disposes log messages concerning the upload
	 *
	 */
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

	/**
	 * Adds a log message
	 *
	 * @param {string}    msg    log message
	 *
	 */
	addLogMessage = function(msg) {
		if (uploadCounter === 1) {
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