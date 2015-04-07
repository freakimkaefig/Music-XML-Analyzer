MusicXMLAnalyzer.DashboardView = function(){

	var that = {},

	$logMessages = null,
	dashboardMessageCounter = null,
	$fileSelector = null,

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

	init = function(){
		console.info('MusicXMLAnalyzer.DashboardView.init');

		$logMessages = $('#dashboardMessages');
		initLogMessages();
		$showingResultsFor = $('#showingResultsFor');
		$fileSelector = $('#fileSelector');
		$plainFacts = $('#plainFacts');
		$plainFacts2 = $('#plainFacts2');
		$plainFacts3 = $('#plainFacts3');
		$overallStatistics = $('#overallStatistics');

	},

	initLogMessages = function() {
		dashboardMessageCounter = 0;
		$logMessages.show();
		$logMessages.animate({
			height: 70
		}, 10);
		addLogMessage('Fetching results from database ...');
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
		}, 1500);
	},

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

	onFileSelectorChange = function(event) {
		$(that).trigger('onFileSelectorChange', [ $fileSelector.find('select').val() ]);
	},

	changeFile = function(result) {

	},

	initCountNotes = function(results){
		$overallStatistics.empty();
		$overallStatistics.append('<h3 class="text-center">Overall Statistics</h3><br>');
		$plainFacts.empty();
		$plainFacts.append('<li><strong>Total Notes:  </strong>' + results + '</li><br><br>');
		$plainFacts.find('li').on('change', onFileSelectorChange);
	},

	initCountRests = function(results){
		$plainFacts.append('<li><strong>Total Rests:  </strong>' + results + '</li>');
	},

	initCountMeasures = function(results){
		$plainFacts2.empty();
		$plainFacts2.append('<li><strong>Total Measures:  </strong>' + results + '</li><br><br>');
	},

	initMostFrequentNote = function(results){
		$plainFacts2.append('<li><strong>Most frequent Note:  </strong>' + results + '</li>');
	},

	initInstruments = function(results) {
		$plainFacts3.empty();
		$plainFacts3.append('<li><strong>Instruments:  </strong></li>');
		$plainFacts3.append("<li>" + results.join(", ") + "</li>");
	},

	/*BAR-CHART NOTE-DISTRIBUTION*/
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
	/*BAR-CHART INTERVAL-DISTRIBUTION*/
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
	        .text("Intervall distribution");

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
	/*PIE-CHART KEY-DISTRIBUTION*/
	initKeyDistribution = function(data) {
		console.log(this);
		if (keyDistribution) {
			keyDistribution.destroy();
		}
		keyDistribution = new d3pie("pie_keyDistribution", {
			header: {
				title: {
					text: "Key Distribution"
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
	/*PIE-CHART NOTE-DURATION*/
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
	/*PIE-CHART METERS*/
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
	that.changeFile = changeFile;

	return that;
}