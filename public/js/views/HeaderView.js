/** @constructor */
MusicXMLAnalyzer.HeaderView = function(){

	var that = {},

	deleteMeLink = null,


	/**
	 * Init function
	 */
	init = function(){
		deleteMeLink = $('#deleteMeLink');
		deleteMeLink.on('click', onDeleteMeLinkClick);
	},

	/**
	 * Resets the page and removes current work
	 *
	 * @param {event}    event    click event
	 *
	 */
	onDeleteMeLinkClick = function(event) {
		return confirm('This will remove all of your previous work. Are you sure?');
	};

	that.init = init;

	return that;

};