/** @constructor */
MusicXMLAnalyzer.HeaderView = function(){

	var that = {},

	deleteMeLink = null,


	/**
	 * Init function
	 * @function
     * @public
	 */
	init = function(){
		deleteMeLink = $('#deleteMeLink');
		deleteMeLink.on('click', onDeleteMeLinkClick);
	},

	/**
	 * Resets the page and removes current work
	 * @function
     * @private
	 *
	 * @param {event}    event    the triggered click event
	 *
	 */
	onDeleteMeLinkClick = function(event) {
		return confirm('This will remove all of your previous work. Are you sure?');
	};

	that.init = init;

	return that;

};