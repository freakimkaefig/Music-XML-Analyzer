MusicXMLAnalyzer.DashboardView = function(){

var that = {},


	init = function(){
		console.info('MusicXMLAnalyzer.DashboardView.init');
		//BAR-CHART
		var data = [4, 8, 15, 16, 23, 42];

		 x = d3.scale.linear()
		    .domain([0, d3.max(data)])
		    .range([0, 420]);

		d3.select(".chart")
		  .selectAll("div")
		    .data(data)
		  .enter().append("div")
		    .style("width", function(d) { return x(d) + "px"; })
		    .text(function(d) { return d; });
		 
		//PIE-CHART
		var pie = new d3pie("pie", {
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
			/*
			callbacks: {
				onMouseoverSegment: function(info) {
					console.log("mouseover:", info);
				},
				onMouseoutSegment: function(info) {
					console.log("mouseout:", info);
				}
			}
			*/
		});


	};

	
	
	that.init = init;
	

	return that;
}