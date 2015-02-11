MusicXMLAnalyzer.DashboardController = function() {

	var that = {},

	model = null,
	view = null,

	init = function(dashboardModel, dashboardView) {
		console.info('MusicXMLAnalyzer.DashboardController.init');

		model = dashboardModel;
		view = dashboardView;

		$(model).on('model_ready', onModelReady);

		$(view).on('onFileSelectorChange', onFileSelectorChange);
	},

	onModelReady = function(event, results) {
		console.log('MusicXMLAnalyzer.DashboardController.onModelReady');

		console.log(results);

		view.initFileSelector(results);
		view.initNoteDistribution(results.all.value.note_distribution);
		view.initIntervalDistribution(results.all.value.intervals);
		
	},

	onFileSelectorChange = function(event, id) {
		var result = model.getResults(id);
		view.initNoteDistribution(result.value.note_distribution);
		view.initIntervalDistribution(result.value.intervals);
	};

	that.init = init;

	return that;
}