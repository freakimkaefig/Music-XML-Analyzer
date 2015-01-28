MusicXMLAnalyzer.DashboardView = function(){

var that = {},


	init = function(){
		console.info('MusicXMLAnalyzer.DashboardView.init');

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


		 var pie = new d3pie("pieChart", {
			"header": {
				"title": {
					"text": "Notenverteilung",
					"fontSize": 22,
					"font": "verdana"
				},
			},
			
			"size": {
				"canvasHeight": 400,
				"canvasWidth": 590,
				"pieInnerRadius": "25%",
				"pieOuterRadius": "90%"
			},
			"data": {
				"content": [
					{
						"label": "C",
						"value": 8,
						"color": "#7e3838"
					},
					{
						"label": "D",
						"value": 5,
						"color": "#7e4a38"
					},
					{
						"label": "E",
						"value": 2,
						"color": "#7e5838"
					},
					{
						"label": "F",
						"value": 3,
						"color": "#7e6538"
					},
					{
						"label": "G",
						"value": 2,
						"color": "#7e7238"
					},
					{
						"label": "A",
						"value": 1,
						"color": "#7c7e38"
					},
					{
						"label": "H",
						"value": 3,
						"color": "#707e38"
					}
				]
			},
			"labels": {
				"inner": {
					"format": "value"
				},
				"mainLabel": {
					"font": "verdana"
				},
				"percentage": {
					"color": "#e1e1e1",
					"font": "verdana",
					"decimalPlaces": 0
				},
				"value": {
					"color": "#e1e1e1",
					"font": "verdana"
				},
				"lines": {
					"enabled": true,
					"color": "#cccccc"
				}
			},
			"effects": {
				"pullOutSegmentOnClick": {
					"effect": "linear",
					"speed": 400,
					"size": 8
				}
			}
		});


	};

	
	
	that.init = init;
	

	return that;
}