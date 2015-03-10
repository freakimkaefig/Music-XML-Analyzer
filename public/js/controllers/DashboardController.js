MusicXMLAnalyzer.DashboardController = function() {

	var that = {},

	model = null,
	view = null,

	init = function() {
		console.info('MusicXMLAnalyzer.DashboardController.init');

		model = MusicXMLAnalyzer.DashboardModel();
		model.init();
		view = MusicXMLAnalyzer.DashboardView();
		view.init();

		$(model).on('logMessage', onLogMessage);
		$(model).on('model_ready', onModelReady);

		$(view).on('onFileSelectorChange', onFileSelectorChange);
	},

	onLogMessage = function(event, msg) {
		view.addLogMessage(msg);
	},

	onModelReady = function(event, results) {
		console.log('MusicXMLAnalyzer.DashboardController.onModelReady');

		console.log(results);

		view.initFileSelector(results);
		// view.initBarChart(results.all.value.note_distribution)
		view.initNoteDistribution(results.all.value.note_distribution);
		view.initIntervalDistribution(results.all.value.intervals);
		view.initKeyDistribution(results.all.value.key);
		view.initMeterDistribution(results.all.value.meter);
		view.initNoteTypeDistribution(results.all.value.note_types);
		
		window.setTimeout(function() {
			
			view.disposeLogMessages();
		}, 3000);
	},

	onFileSelectorChange = function(event, id) {
		var result = model.getResults(id);
		view.initNoteDistribution(result.value.note_distribution);
		view.initIntervalDistribution(result.value.intervals);
		view.initKeyDistribution(result.value.key);
		view.initMeterDistribution(result.value.meter);
		view.initNoteTypeDistribution(result.value.note_types);
	};

	that.init = init;

	return that;
}