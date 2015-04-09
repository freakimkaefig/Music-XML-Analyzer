/** @constructor */
MusicXMLAnalyzer.HeaderController = function(){

	var that = {},
	view = null,
	/**
	 * Init function of HeaderController
	 * @function
     * @public
	 */
	init = function(){
		view = MusicXMLAnalyzer.HeaderView();
		view.init();
	};

	that.init = init;

	return that;
};