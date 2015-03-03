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


	init = function(){
		console.info('MusicXMLAnalyzer.DashboardView.init');

		$logMessages = $('#dashboardMessages');
		initLogMessages();

		$fileSelector = $('#fileSelector');
	},

	initLogMessages = function() {
		dashboardMessageCounter = 0;
		$logMessages.show();
		$logMessages.animate({
			height: 70
		}, 2500);
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
		}, 3000);
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
		var selectorElement = '<select class="form-control btn-material-grey" name="fileSelector">';
		selectorElement += '<option value="all"> - All - </option>';

		for (var i = 0; i < data.length; i++) {
			selectorElement += '<option value="';
			selectorElement += data[i].id
			selectorElement += '">';
			selectorElement += data[i].value.artist;
			selectorElement += ' - ';
			selectorElement += data[i].value.title;
			selectorElement += ' (';
			selectorElement += /[^/]*$/.exec(data[i].value.file_url)[0];
			selectorElement += ')';
			selectorElement += '</option>';
		}

		selectorElement += '</select>';
		$fileSelector.append(selectorElement);
		$fileSelector.find('select').on('change', onFileSelectorChange);
	},

	onFileSelectorChange = function(event) {
		console.info('MusicXMLAnalyzer.DashboardView.onFileSelectorChange', $fileSelector.find('select').val());
		$(that).trigger('onFileSelectorChange', [ $fileSelector.find('select').val() ]);
	},

	changeFile = function(result) {

	},

	initBarChart = function(data) {
		var containerWidth = $('#bar_intervalDistribution').width() - 30;
		var margin ={ top:20, right:30, bottom:50, left: 40 },
		    width = containerWidth - margin.left - margin.right, 
		    height= 300 - margin.top - margin.bottom;

		// scale to ordinal because x axis is not numerical
		var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

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

		var tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d) { return "<strong>" + d.value + "</strong> <span>(" + d.label + ")</span>"; });
		  
		var svg = d3.select("#bar_intervalDistribution")  
		              .append("svg")  //append svg element inside #bar_intervalDistribution
		              .attr("width", width+(2*margin.left)+margin.right)    //set width
		              .attr("height", height+margin.top+margin.bottom)  //set height
		              .append("g")
		              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.call(tip);

		// transform data object
	  	x.domain(data.map(function(d){ return d.label}));
	  	y.domain([0, d3.max(data, function(d){return d.value})]);

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

		svg.selectAll(".bar")
		   .data(data)
		   .enter()
		   .append("rect")
		   .attr("class", "bar")
		   .attr("x", function(d) { return x(d.label); })
		   .attr("width", x.rangeBand())
		   .attr("y", function(d) { return y(d.value); })
		   .attr("height", function(d) { return height - y(d.value); })
		   .on("click", tip.show);
	},

	initNoteDistribution = function(data) {
		$('#bar_noteDistribution').empty();
		var containerWidth = $('#bar_noteDistribution').width() - 30;
		var margin ={ top:20, right:30, bottom:50, left: 40 },
		    width = containerWidth - margin.left - margin.right, 
		    height= 300 - margin.top - margin.bottom;

		// scale to ordinal because x axis is not numerical
		var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

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

		var tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d) { return "<strong>" + d.value + "</strong> <span>(" + d.label + ")</span>"; });
		  
		var svg = d3.select("#bar_noteDistribution")  
		              .append("svg")  //append svg element inside #bar_noteDistribution
		              .attr("width", width+(2*margin.left)+margin.right)    //set width
		              .attr("height", height+margin.top+margin.bottom)  //set height
		              .append("g")
		              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.call(tip);

		// transform data object
	  	x.domain(data.map(function(d){ return d.label}));
	  	y.domain([0, d3.max(data, function(d){return d.value})]);

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

		svg.selectAll(".bar")
		   .data(data)
		   .enter()
		   .append("rect")
		   .attr("class", "bar")
		   .attr("x", function(d) { return x(d.label); })
		   .attr("width", x.rangeBand())
		   .attr("y", function(d) { return y(d.value); })
		   .attr("height", function(d) { return height - y(d.value); })
		   .on("click", tip.show); 
	},

	initIntervalDistribution = function(data) {
		$('#bar_intervalDistribution').empty();
		var containerWidth = $('#bar_intervalDistribution').width() - 30;
		var margin ={ top:20, right:30, bottom:50, left: 40 },
		    width = containerWidth - margin.left - margin.right, 
		    height= 300 - margin.top - margin.bottom;

		// scale to ordinal because x axis is not numerical
		var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

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

		var tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d) { return "<strong>" + d.value + "</strong> <span>(" + d.label + ")</span>"; });
		  
		var svg = d3.select("#bar_intervalDistribution")  
		              .append("svg")  //append svg element inside #bar_intervalDistribution
		              .attr("width", width+(2*margin.left)+margin.right)    //set width
		              .attr("height", height+margin.top+margin.bottom)  //set height
		              .append("g")
		              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.call(tip);

		// transform data object
	  	x.domain(data.map(function(d){ return d.label}));
	  	y.domain([0, d3.max(data, function(d){return d.value})]);

		// svg.append("g")
		//      .attr("class", "x axis")
		//      .attr("transform", "translate(0,"+ height+")")
		//      .call(xAxis);
		  
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

		// svg.select(".x.axis")
		//    .selectAll(".tick")
		//    .attr("transform", "rotate(-90) translate(0,"+height+")");

		svg.selectAll(".bar")
		   .data(data)
		   .enter()
		   .append("rect")
		   .attr("class", "bar")
		   .attr("x", function(d) { return x(d.label); })
		   .attr("width", x.rangeBand())
		   .attr("y", function(d) { return y(d.value); })
		   .attr("height", function(d) { return height - y(d.value); })
		   .on("click", tip.show);
	},

	initKeyDistribution = function(data) {
		if (keyDistribution) {
			keyDistribution.destroy();
		}
		keyDistribution = new d3pie("pie_keyDistribution", {
			header: {
				title: {
					text: "Key Distribution",
					fontSize: 22,
					font: "open sans"
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
			}
		}); 
	},

	initNoteTypeDistribution = function(data) {
		if (noteTypeDistribution) {
			noteTypeDistribution.destroy();
		}
		noteTypeDistribution = new d3pie("pie_noteTypeDistribution", {
			header: {
				title: {
					text: "Note duration",
					fontSize: 22,
					font: "open sans"
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
			}
		});
	},

	initMeterDistribution = function(data) {
		if (meterDistribution) {
			meterDistribution.destroy();
		}
		meterDistribution = new d3pie("pie2", {
			header: {
				title: {
					text: "Meters",
					fontSize: 22,
					font: "open sans"
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
			}
		});
	},

	initInstruments = function() {
		instruments = new d3pie("pie3", {
			header: {
				title: {
					text: "Instrumente"
				}
			},
			data: {
				content: [
					{ label: "Violine", value: 11 },
					{ label: "Gitarre", value: 2 },
					{ label: "Bass", value: 13 },
					{ label: "Klarinette", value: 26 },
					{ label: "Schlagzeug", value: 51 },
					{ label: "Horn", value: 39 },
					{ label: "Flöte", value: 5 }
				]
			},
			 tooltips: {
			    enabled: true,
			    type: "placeholder",
			    string: "{label}: {percentage}%",
			    styles: {
			      fadeInSpeed: 500,
			      backgroundColor: "#00cc99",
			      backgroundOpacity: 0.8,
			      color: "#ffffcc",
			      borderRadius: 4,
			      font: "verdana",
			      fontSize: 20,
			      padding: 20
			    }
			  }
		});
	},

	initBarChart1 = function() {
		var names = ['Anzahl Takte', 'Anzahl Noten', 'Anzahl Instrumente'],
		    occ_numbers = [34, 15, 20],
		    chart,
		    width = 500,
		    bar_height = 20,
		    height = bar_height * names.length;

		var x, y;
		x = d3.scale.linear()
		   .domain([0, d3.max(occ_numbers)])
		   .range([0, width]);

		y = d3.scale.ordinal()
		   .domain(occ_numbers)
		   .rangeBands([0, height]);


		var left_width = 150;

		var gap = 5;
	 	// redefine y for adjusting the gap
	  	y = d3.scale.ordinal()
	    	.domain(occ_numbers)
	   		.rangeBands([0, (bar_height + 2 * gap) * names.length]);
	 
	 
	  	chart = d3.select(".chart")
		    .append('svg')
		    .attr('class', 'chart')
		    .attr('width', left_width + width + 40)
		    .attr('height', (bar_height + gap * 2) * names.length + 30)
		    .append("g")
		    .attr("transform", "translate(10, 20)");

		chart.selectAll("line")
			.data(x.ticks(10))		//d3.max(occ_numbers) zeigts in 1er schritten
			.enter().append("line")
			.attr("x1", function(d) { return x(d) + left_width; })
			.attr("x2", function(d) { return x(d) + left_width; })
			.attr("y1", 0)
			.attr("y2", (bar_height + gap * 2) * names.length);
	 
		chart.selectAll(".rule")
			.data(x.ticks(10))		//d3.max(occ_numbers) zeigts in 1er schritten
			.enter().append("text")
			.attr("class", "rule")
			.attr("x", function(d) { return x(d) + left_width; })
			.attr("y", 0)
			.attr("dy", -6)
			.attr("text-anchor", "middle")
			.attr("font-size", 10)
			.text(String);

		chart.selectAll("rect")
			.data(occ_numbers)
			.enter().append("rect")
			.attr("x", left_width)
			.attr("y", y)
			.attr("width", x)
			.attr("height", y.rangeBand());

		chart.selectAll("text.score")
			.data(occ_numbers)
			.enter().append("text")
			.attr("x", function(d) { return x(d) + left_width; })
			.attr("y", function(d){ return y(d) + y.rangeBand()/2; } )
			.attr("dx", -5)
			.attr("dy", ".36em")
			.attr("text-anchor", "end")
			.attr('class', 'score')
			.text(String);

		chart.selectAll("text.name")
			.data(names)
			.enter().append("text")
			.attr("x", left_width / 2)
			.attr("y", function(d, i){ return y(occ_numbers[i]) + y.rangeBand()/2; } )
			.attr("dy", ".36em")
			.attr("text-anchor", "middle")
			.attr('class', 'name')
			.text(String);
	},


	initBarChart2 = function() {
		var margin ={top:20, right:30, bottom:30, left:40},
		    width=960-margin.left - margin.right, 
		    height=500-margin.top-margin.bottom;

		// scale to ordinal because x axis is not numerical
		var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

		//scale to numerical value by height
		var y = d3.scale.linear().range([height, 0]);

		var chart = d3.select("#chart")  
		              .append("svg")  //append svg element inside #chart
		              .attr("width", width+(2*margin.left)+margin.right)    //set width
		              .attr("height", height+margin.top+margin.bottom);  //set height
		var xAxis = d3.svg.axis()
		              .scale(x)
		              .orient("bottom");  //orient bottom because x-axis will appear below the bars

		var yAxis = d3.svg.axis()
		              .scale(y)
		              .orient("left");

		d3.json("http://codepen.io/superpikar/pen/kcJDf.js", function(error, data){ // link zu testdateie mit 8 key-value paaren:   https://dl.dropboxusercontent.com/u/19535961/example-json.js
		  x.domain(data.map(function(d){ return d.letter}));
		  y.domain([0, d3.max(data, function(d){return d.frequency})]);
		  
		  var bar = chart.selectAll("g")
		                    .data(data)
		                  	.enter()
		                    .append("g")
		                    .attr("transform", function(d, i){
		                    	return "translate("+x(d.letter)+", 0)";
		                    });
		  
		  bar.append("rect")
		      .attr("y", function(d) { 
		        return y(d.frequency); 
		      })
		      .attr("x", function(d,i){
		        return x.rangeBand()+(margin.left/4);
		      })
		      .attr("height", function(d) { 
		      	return height - y(d.frequency); 
		      })
		      .attr("width", x.rangeBand());  //set width base on range on ordinal data

		  bar.append("text")
		      .attr("x", x.rangeBand()+margin.left )
		      .attr("y", function(d) { return y(d.frequency) -10; })
		      .attr("dy", ".75em")
		      .text(function(d) { return d.frequency; });
		  
		  chart.append("g")
		        .attr("class", "x axis")
		        .attr("transform", "translate("+margin.left+","+ height+")")        
		        .call(xAxis);
		  
		  chart.append("g")
		        .attr("class", "y axis")
		        .attr("transform", "translate("+margin.left+",0)")
		        .call(yAxis)
		        .append("text")
		        .attr("transform", "rotate(-90)")
		        .attr("y", 6)
		        .attr("dy", ".71em")
		        .style("text-anchor", "end")
		        .text("Frequency");
		});
	};

	that.init = init;
	that.disposeLogMessages = disposeLogMessages;
	that.addLogMessage = addLogMessage;
	that.initFileSelector = initFileSelector;
	that.initBarChart = initBarChart;
	that.initNoteDistribution = initNoteDistribution;
	that.initIntervalDistribution = initIntervalDistribution;
	that.initKeyDistribution = initKeyDistribution;
	that.initNoteTypeDistribution = initNoteTypeDistribution;
	that.initMeterDistribution = initMeterDistribution;

	that.changeFile = changeFile;

	return that;
}