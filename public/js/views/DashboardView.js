/** @constructor */
MusicXMLAnalyzer.DashboardView = function(){

	var that = {},

	$logMessages = null,
	dashboardMessageCounter = null,
	$fileSelector = null,
	$plainFacts = null,
	$plainFacts2 = null,
	$plainFacts3 = null,
	$overallStatistics = null,

	noteDistribution = null,
	intervalDistribution = null,
	keyDistribution = null,
	noteTypeDistribution = null,
	meterDistribution = null,
	instruments = null,

	segmentColors = [
		"#64b5f6",	// blue-300
		"#81c784",	// green-300
		"#dce775",	// lime-300
		"#ff8a65",	// deep-orange-300
		"#ba68c8",	// purple-300
		"#4db6ac",	// teal-300
		"#fff176",	// yellow-300
		"#ffb74d",	// orange-300
		"#90a4ae",	// blue-grey-300

		"#1e88e5",	// blue-600
		"#43a047",	// green-600
		"#c0ca33",	// lime-600
		"#f4511e",	// deep-orange-600
		"#8e24aa",	// purple-600
		"#00897b",	// teal-600
		"#fdd835",	// yellow-600
		"#fb8c00",	// orange-600
		"#546e7a",	// blue-grey-600

		"#0d47a1",	// blue-900
		"#1b5e20",	// green-900
		"#827717",	// lime-900
		"#bf360c",	// deep-orange-900
		"#4a148c",	// purple-900
		"#004d40",	// teal-900
		"#f57f17",	// yellow-900
		"#e65100",	// orange-900
		"#263238",	// blue-grey-900
	],

	$scoreButtonContainer = null,

	/**
	 * Init function
	 * @function
     * @public
	 */
	init = function(){
		$logMessages = $('#dashboardMessages');
		initLogMessages();
		$showingResultsFor = $('#showingResultsFor');
		$fileSelector = $('#fileSelector');
		$plainFacts = $('#plainFacts');
		$plainFacts2 = $('#plainFacts2');
		$plainFacts3 = $('#plainFacts3');
		$overallStatistics = $('#overallStatistics');

		$scoreButtonContainer = $('#score_button_container');
	},

	/**
	 * Method to initiate log messages
	 * @function
     * @private
	 */
	initLogMessages = function() {
		dashboardMessageCounter = 0;
		$logMessages.show();
		$logMessages.animate({
			height: 70
		}, 10);
		addLogMessage('Fetching results from database ...');
	},

	/**
	 * Method to animate the log message box
	 * @function
     * @public
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
		}, 1500);
	},

	/**
	 * Method to add a log message
	 * @function
     * @public
	 *
	 * @param {string}    msg    message to be added
	 */
	addLogMessage = function(msg) {
		$('#log' + (dashboardMessageCounter - 3)).animate({
			"marginTop": "-30px"
		}, 200);
		$logMessages.append('<div id="log' + dashboardMessageCounter + '"></div>');
		$('#log' + dashboardMessageCounter).typed({
			strings: ['<p>' + msg + '</p>'],
			backDelay: 100000000000000,
			typeSpeed: 0,
			backSpeed: 0,
			loop: true,
		});
		dashboardMessageCounter++;
	},

	/**
	 * Method to initate the file selector on dashboard
	 * @function
     * @public
	 *
	 * @param {array}    data    array containing information to user uploaded files
	 */
	initFileSelector = function(data) {
		$fileSelector.empty();
		var selectorElement = '<select class="form-control btn-material-blue-grey-100" name="fileSelector">';
		selectorElement += '<option value="all" class="btn-material-blue-grey-100"> - All - </option>';
		var showingResultsForText = '<h4>Showing results for:</h4>';

		for (var i = 0; i < data.length; i++) {
			selectorElement += '<option value="';
			selectorElement += data[i].id;
			selectorElement += '" class="btn-material-blue-grey-100">';
			selectorElement += data[i].value.artist;
			selectorElement += ' - ';
			selectorElement += data[i].value.title;
			selectorElement += ' (';
			selectorElement += /[^/]*$/.exec(data[i].value.file_url)[0];
			selectorElement += ')';
			selectorElement += '</option>';
		}

		selectorElement += '</select>';
		$showingResultsFor.append(showingResultsForText);
		$fileSelector.append(selectorElement);
		$fileSelector.find('select').on('change', onFileSelectorChange);
	},

	/**
	 * Method description
	 * @function
     * @private
	 *
	 * @param {Event}    event    The triggered event
	 */
	onFileSelectorChange = function(event) {
		$(that).trigger('onFileSelectorChange', [ $fileSelector.find('select').val() ]);
	},

	/**
	 * Method to append number of notes to html-view
	 * @function
     * @public
	 *
	 * @param {int}    results    number of total notes
	 */
	initCountNotes = function(results){
		$overallStatistics.empty();
		$overallStatistics.append('<h3 class="text-center">Overall statistics</h3>');
		$plainFacts.empty();
		$plainFacts.append('<li><strong>Total notes:  </strong>' + results + '</li>');
		$plainFacts.find('li').on('change', onFileSelectorChange);
	},

	/**
	 * Method to append number of rests to html-view
	 * @function
     * @public
	 *
	 * @param {int}    results    number of total rests
	 */
	initCountRests = function(results){
		$plainFacts.append('<li><strong>Total rests:  </strong>' + results + '</li>');
	},

	/**
	 * Method to append number of measures to html-view
	 * @function
     * @public
	 *
	 * @param {int}    results    number of measures notes
	 */
	initCountMeasures = function(results){
		$plainFacts2.empty();
		$plainFacts2.append('<li><strong>Total measures:  </strong>' + results + '</li>');
	},

	/**
	 * Method to append most frequent to html-view
	 * @function
     * @public
	 *
	 * @param {string}    results    most frequent note
	 */
	initMostFrequentNote = function(results){
		$plainFacts2.append('<li><strong>Most frequent note:  </strong>' + results + '</li>');
	},

	/**
	 * Method to append instruments to html-view
	 * @function
     * @public
	 *
	 * @param {array}    results    array containing all instruments
	 */
	initInstruments = function(results) {
		$plainFacts3.empty();
		$plainFacts3.append('<li><strong>Instruments:  </strong></li>');
		$plainFacts3.append("<li>" + results.join(", ") + "</li>");
	},

	/**
	 * Method to create barchart representing the note distribution
	 * @function
     * @public
	 *
	 * @param {object}    data    objet containing information about the distribution of notes
	 */
	initNoteDistribution = function(data) {
		$('#bar_noteDistribution').empty();
		var containerWidth = $('#bar_noteDistribution').width() - 30;
		var margin ={ top:20, right:30, bottom:50, left: 40 },
		    width = containerWidth - margin.left - margin.right,
		    height= 300 - margin.top - margin.bottom +30;

		// scale to ordinal because x axis is not numerical
		var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

		//scale to numerical value by height
		var y = d3.scale.linear().range([height, 0]);

		// key on x axis
		var xAxis = d3.svg.axis()
		              .scale(x)
		              .orient("bottom");  //orient bottom because x-axis will appear below the bars

		// key on y axis
		var yAxis = d3.svg.axis()
		              .scale(y)
		              .orient("left");


		var svg = d3.select("#bar_noteDistribution")
		              .append("svg")  //append svg element inside #bar_noteDistribution
		              .attr("width", width+(2*margin.left)+margin.right)    //set width
		              .attr("height", height+margin.top+margin.bottom)  //set height
		              .append("g")
		              .attr("transform", "translate(" + margin.left + ",50)");

		// transform data object
	  	x.domain(data.map(function(d){ return d.label; }));
	  	y.domain([0, d3.max(data, function(d){return d.value; })]);

		svg.append("g")
		     .attr("class", "x axis")
		     .attr("transform", "translate(0,"+ height+")")
		     .call(xAxis);

		svg.append("g")
		     .attr("class", "y axis")
		     .attr("transform", "translate(0,0)")
		     .call(yAxis)
		     .append("text")
		     .attr("transform", "rotate(-90)")
		     .attr("y", 6)
		     .attr("dy", ".71em")
		     .style("text-anchor", "end")
		     .text("Count");

		svg.append("text")
	        .attr("x", (width / 2))
	        .attr("y", 0 - (margin.top / 2) -20)
	        .attr("text-anchor", "middle")
	        .style("font-size", "23px")
	        .style("font-weight", 300)
	        .style("font-family", 'RobotoDraft','Roboto','Helvetica Neue','Helvetica','Arial','sans-serif')
	        .text("Note distribution");

		svg.selectAll(".bar")
		   .data(data)
		   .enter()
		   .append("rect")
		   .attr("class", "bar")
		   .attr("x", function(d) { return x(d.label); })
		   .attr("width", x.rangeBand())
		   .attr("y", function(d) { return y(d.value); })
		   .attr("height", function(d) { return height - y(d.value); });
		   //.on("click", tip.show);

		   svg.selectAll("text.bar")
			.data(data)
			.enter()
			.append("text")
			.attr("class", "bar-value")
			.attr("x", function(d) { return x(d.label); })
			.attr("y", function(d) { return y(d.value); })
			.text(function(d) { return d.value; })
			.attr("dx", "2.5em")
			.attr("dy", "-.5em");

	},

	/**
	 * Method to create barchart representing the interval distribution
	 * @function
     * @public
	 *
	 * @param {object}    data    objet containing information about the distribution of intervals
	 */
	initIntervalDistribution = function(data) {
		$('#bar_intervalDistribution').empty();
		var containerWidth = $('#bar_intervalDistribution').width() - 30;
		var margin ={ top:20, right:30, bottom:130, left: 40 },
		    width = containerWidth - margin.left - margin.right,
		    height= 300 - margin.top - margin.bottom+80;

		// scale to ordinal because x axis is not numerical
		var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

		//scale to numerical value by height
		var y = d3.scale.linear().range([height, 0]);

		// key on x axis
		var xAxis = d3.svg.axis()
		              .scale(x)
		              .orient("bottom");  //orient bottom because x-axis will appear below the bars

		// key on y axis
		var yAxis = d3.svg.axis()
		              .scale(y)
		              .orient("left");


		var svg = d3.select("#bar_intervalDistribution")
		              .append("svg")  //append svg element inside #bar_intervalDistribution
		              .attr("width", width+(2*margin.left)+margin.right)    //set width
		              .attr("height", height+margin.top+margin.bottom)  //set height
		              .append("g")
		              .attr("transform", "translate(" + margin.left + ",50)");

		// transform data object
	  	x.domain(data.map(function(d){ return d.label; }));
	  	y.domain([0, d3.max(data, function(d){return d.value; })]);

		 svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0,"+ height+")")
		      .call(xAxis)
		      .selectAll("text")
			    .style("text-anchor", "start")
			    .attr("transform", "rotate(45)");


		svg.append("g")
		     .attr("class", "y axis")
		     .attr("transform", "translate(0,0)")
		     .call(yAxis)
		     .append("text")
		     .attr("transform", "rotate(-90)")
		     .attr("y", 6)
		     .attr("dy", ".71em")
		     .style("text-anchor", "end")
		     .text("Count");

		svg.append("text")
	        .attr("x", (width / 2))
	        .attr("y", 0 - (margin.top / 2) - 20)
	        .attr("text-anchor", "middle")
	        .style("font-size", "23px")
	        .style("font-weight", 300)
	        .style("font-family", 'RobotoDraft','Roboto','Helvetica Neue','Helvetica','Arial','sans-serif')
	        .text("Interval distribution");

		svg.selectAll(".bar")
		   .data(data)
		   .enter()
		   .append("rect")
		   .attr("class", "bar")
		   .attr("x", function(d) { return x(d.label); })
		   .attr("width", x.rangeBand())
		   .attr("y", function(d) { return y(d.value); })
		   .attr("height", function(d) { return height - y(d.value); });

		   svg.selectAll("text.bar")
			.data(data)
			.enter()
			.append("text")
			.attr("class", "bar-value")
			.attr("x", function(d) { return x(d.label); })
			.attr("y", function(d) { return y(d.value); })
			.text(function(d) { return d.value; })
			.attr("dx", "1em")
			.attr("dy", "-.5em");
	},

	/**
	 * Method to create piechart representing the key distribution
	 * @function
     * @public
	 *
	 * @param {object}    data    objet containing information about the distribution of keys
	 */
	initKeyDistribution = function(data) {
		if (keyDistribution) {
			keyDistribution.destroy();
		}
		keyDistribution = new d3pie("pie_keyDistribution", {
			header: {
				title: {
					text: "Key distribution"
				}
			},
			data: {
				content: data
			},
			tooltips: {
			    enabled: true,
			    type: "placeholder",
			    string: "{label}: ({value})  {percentage}%",
			    placeholderParser: function(index, data) {
			      data.label = data.label + "  ";
			      data.percentage = data.percentage;
			      data.value = data.value;
			    }
			},
			misc: {
				colors: {
					segments: segmentColors
				}
			}
		});
	},

	/**
	 * Method to create piechart representing the note-length distribution
	 * @function
     * @public
	 *
	 * @param {object}    data    objet containing information about the distribution of note-lengths
	 */
	initNoteTypeDistribution = function(data) {
		if (noteTypeDistribution) {
			noteTypeDistribution.destroy();
		}
		noteTypeDistribution = new d3pie("pie_noteTypeDistribution", {
			header: {
				title: {
					text: "Note duration"
				}
			},
			data: {
				content: data
			},
			tooltips: {
			    enabled: true,
			    type: "placeholder",
			    string: "{label}: ({value})  {percentage}%",
			    placeholderParser: function(index, data) {
			      data.label = data.label + "  ";
			      data.percentage = data.percentage;
			      data.value = data.value;
			    }
			},
			misc: {
				colors: {
					segments: segmentColors
				}
			}
		});
	},

	/**
	 * Method to create piechart representing the meter distribution
	 * @function
     * @public
	 *
	 * @param {object}    data    objet containing information about the distribution of meters
	 */
	initMeterDistribution = function(data) {
		var data2;
		if(typeof(data) == 'string'){
			data2 = [{label: data, value: 1}];
		}else{
			data2 = data;
		}

		if (meterDistribution) {
			meterDistribution.destroy();
		}
		meterDistribution = new d3pie("pie_meterDistribution", {
			header: {
				title: {
					text: "Meters"
				}
			},
			data: {
				content: data2
			},
			tooltips: {
			    enabled: true,
			    type: "placeholder",
			    string: "{label}: ({value})  {percentage}%",
			    placeholderParser: function(index, data) {
			      data.label = data.label + "  ";
			      data.percentage = data.percentage;
			      data.value = data.value;
			    }
			},
			misc: {
				colors: {
					segments: segmentColors
				}
			}
		});
	},

	initScoreButton = function(id) {
		console.log("initScoreButton", id);
		var button = '<a class="btn btn-success" target="_blank" href="/score/' + id + '" onclick="ga(\'send\', \'event\', { eventCategory: \'Dashboard: View Score\', eventAction: \'Click\' })"><span>Show Score</span></a>';
		$scoreButtonContainer.append(button);
	};

	that.init = init;
	that.disposeLogMessages = disposeLogMessages;
	that.addLogMessage = addLogMessage;
	that.initFileSelector = initFileSelector;
	that.initNoteDistribution = initNoteDistribution;
	that.initIntervalDistribution = initIntervalDistribution;
	that.initKeyDistribution = initKeyDistribution;
	that.initNoteTypeDistribution = initNoteTypeDistribution;
	that.initMeterDistribution = initMeterDistribution;

	that.initCountNotes = initCountNotes;
	that.initCountRests = initCountRests;
	that.initCountMeasures = initCountMeasures;
	that.initMostFrequentNote = initMostFrequentNote;
	that.initInstruments = initInstruments;

	that.initScoreButton = initScoreButton;

	return that;
}
