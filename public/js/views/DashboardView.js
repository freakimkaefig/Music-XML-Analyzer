MusicXMLAnalyzer.DashboardView = function(){

var that = {},


	init = function(){
		console.info('MusicXMLAnalyzer.DashboardView.init');

//PIE-CHART
	var pie = new d3pie("pie1", {
		header: {
			title: {
				text: "Notenverteilung"
			}
		},
		data: {
			content: [
				{ label: "C", value: 264131 },
				{ label: "D", value: 218812 },
				{ label: "E", value: 157618 },
				{ label: "F", value: 264131 },
				{ label: "G", value: 518812 },
				{ label: "A", value: 265131 },
				{ label: "H", value: 111112 }
			]
		},
	});  

	pie = new d3pie("pie2", {
		header: {
			title: {
				text: "Taktarten"
			}
		},
		data: {
			content: [
				{ label: "1", value: 264131 },
				{ label: "1/2", value: 218812 },
				{ label: "1/4", value: 157618 },
				{ label: "3/4", value: 264131 },
				{ label: "5/8", value: 518812 }
			]
		},
	}); 

	pie = new d3pie("pie3", {
		header: {
			title: {
				text: "Instrumente"
			}
		},
		data: {
			content: [
				{ label: "Violine", value: 264131 },
				{ label: "Gitarre", value: 218812 },
				{ label: "Bass", value: 157618 },
				{ label: "Klarinette", value: 264131 },
				{ label: "Schlagzeug", value: 518812 },
				{ label: "Horn", value: 518812 },
				{ label: "Flöte", value: 518812 }
			]
		},
	}); 


	/*//BAR-CHART 1
	data = [8,46,57,24,21,24,26];

	 x = d3.scale.linear()
	    .domain([0, d3.max(data)])
	    .range([0, 300]);

	d3.select(".chart")
	  .selectAll("div")
	    .data(data)
	  .enter().append("div")
	    .style("width", function(d) { return x(d) + "px" })
	    .text(function(d) { return d });  */

	//BAR-CHART 2

	var names = ['John', 'Tim', 'Sam', 'Greg', 'Charles'],
	    hotdogs = [8, 15, 20, 12, 25],
	    chart,
	    width = 500,
	    bar_height = 20,
	    height = bar_height * names.length;

	var x, y;
	x = d3.scale.linear()
	   .domain([0, d3.max(hotdogs)])
	   .range([0, width]);

	y = d3.scale.ordinal()
	   .domain(hotdogs)
	   .rangeBands([0, height]);


	var left_width = 100;

	var gap = 5;
 	// redefine y for adjusting the gap
  	y = d3.scale.ordinal()
    	.domain(hotdogs)
   		.rangeBands([0, (bar_height + 2 * gap) * names.length]);
 
 
  	chart = d3.select(".chart")
	    .append('svg')
	    .attr('class', 'chart')
	    .attr('width', left_width + width + 40)
	    .attr('height', (bar_height + gap * 2) * names.length + 30)
	    .append("g")
	    .attr("transform", "translate(10, 20)");

	chart.selectAll("line")
		.data(x.ticks(d3.max(hotdogs)))
		.enter().append("line")
		.attr("x1", function(d) { return x(d) + left_width; })
		.attr("x2", function(d) { return x(d) + left_width; })
		.attr("y1", 0)
		.attr("y2", (bar_height + gap * 2) * names.length);
 
	chart.selectAll(".rule")
		.data(x.ticks(d3.max(hotdogs)))
		.enter().append("text")
		.attr("class", "rule")
		.attr("x", function(d) { return x(d) + left_width; })
		.attr("y", 0)
		.attr("dy", -6)
		.attr("text-anchor", "middle")
		.attr("font-size", 10)
		.text(String);

	chart.selectAll("rect")
		.data(hotdogs)
		.enter().append("rect")
		.attr("x", left_width)
		.attr("y", y)
		.attr("width", x)
		.attr("height", y.rangeBand());

	chart.selectAll("text.score")
		.data(hotdogs)
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
		.attr("y", function(d, i){ return y(hotdogs[i]) + y.rangeBand()/2; } )
		.attr("dy", ".36em")
		.attr("text-anchor", "middle")
		.attr('class', 'name')
		.text(String);



	};

	that.init = init;
	

	return that;
}