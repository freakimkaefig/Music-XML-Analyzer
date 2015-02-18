MusicXMLAnalyzer.HeaderView = function(){

	var that = {},

	deleteMeLink = null,

	init = function(){
		console.info('MusicXMLAnalyzer.HeaderView.init');

		deleteMeLink = $('#deleteMeLink');
		deleteMeLink.on('click', onDeleteMeLinkClick);
	},

	onDeleteMeLinkClick = function(event) {
		return confirm('This will remove all of your previous work. Are you sure?');
	};

	that.init = init;

	return that;

};