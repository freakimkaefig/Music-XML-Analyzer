MusicXMLAnalyzer.DashboardController = function() {

	var that = {},

	model = null,
	view = null,

	init = function(dashboardModel, dashboardView) {
		console.info('MusicXMLAnalyzer.DashboardController.init');

		model = dashboardModel;
		view = dashboardView;

		$(model).on('model_ready', onModelReady);
	},

	onModelReady = function(event, results) {
		console.log('MusicXMLAnalyzer.DashboardController.onModelReady');

		console.log(results);

		view.initFileSelector(results);
		view.initNoteDistribution(results.all.value.note_distribution);
		view.initIntervalDistribution(results.all.value.intervals);
		
	};

	that.init = init;

	return that;
}