MusicXMLAnalyzer.NotationView = function(){

	var that = {},
	staveElements = [],
	noteElements = [],
	context = null,
	canvas = null,
	canvasLeft = null,
	canvasTop = null,

	paddingTopStaves = 0;
	spaceBetweenLines = 0;

	init = function() {
		console.log("notation view");
		initCanvas();
		addStaveElements();
		renderStaveElements();
		//addOnStaveClickListener();

		$("#myCanvas").on("mousemove", onMouseMoveCanvas);
	},

	/* This method inits canvas and context and sets canvas top and left to variable*/
	initCanvas = function() {
		canvas = document.getElementById('myCanvas');
	    canvasLeft = canvas.offsetLeft;
	    canvasTop = canvas.offsetTop;

	    context = canvas.getContext('2d');
	},

	/* This method adds the 5 note lines to canvas */
	addStaveElements = function() {

		paddingTopStaves = (canvas.height/14) * 5;
		spaceBetweenLines = (canvas.height/14);
		
		console.log("c h: " + spaceBetweenLines);

		for(var i = 0; i < 5; i++) {
			staveElements.push({
			    staveId: i,
			    colour: '#000000',
			    width: canvas.width,
			    height: 1.5,
			    top: paddingTopStaves + (spaceBetweenLines * i),
			    left: 0
			});	
		}
		
	},

	/* This method handels the mouseover event of canvas */
	onMouseMoveCanvas = function(event) {

		var x = event.pageX - canvasLeft,
	        y = event.pageY - canvasTop;

    	// console.log("y: " + y);

    	checkHorizontalArea(y);

	//TODO
	//hier die erkennung für notenlinien abfragen
	},

	checkHorizontalArea = function(y) {

		var horizontalArea = -1;

		if (y > spaceBetweenLines * 1.25 && y <= spaceBetweenLines * 1.75) {
			console.log("f");
		} else if (y > spaceBetweenLines * 1.75 && y <= spaceBetweenLines * 2.25) {
			console.log("e");
		} else if (y > spaceBetweenLines * 2.25 && y <= spaceBetweenLines * 2.75) {
			console.log("d");
		} else if (y > spaceBetweenLines * 2.75 && y <= spaceBetweenLines * 3.25) {
			console.log("c");
		} else if (y > spaceBetweenLines * 3.25 && y <= spaceBetweenLines * 3.75) {
			console.log("h");
		} else if (y > spaceBetweenLines * 3.75 && y <= spaceBetweenLines * 4.25) {
			console.log("a");
		} else if (y > spaceBetweenLines * 4.25 && y <= spaceBetweenLines * 4.75) {
			console.log("g");
		} else if (y > spaceBetweenLines * 4.75 && y <= spaceBetweenLines * 5.25) {
			console.log("f");
		} else if (y > spaceBetweenLines * 5.25 && y <= spaceBetweenLines * 5.75) {
			console.log("e");
		} else if (y > spaceBetweenLines * 5.75 && y <= spaceBetweenLines * 6.25) {
			console.log("d");
		} else if (y > spaceBetweenLines * 6.25 && y <= spaceBetweenLines * 6.75) {
			console.log("c");
		} else if (y > spaceBetweenLines * 6.75 && y <= spaceBetweenLines * 7.25) {
			console.log("h");
		} else if (y > spaceBetweenLines * 7.25 && y <= spaceBetweenLines * 7.75) {
			console.log("a");
		} else if (y > spaceBetweenLines * 7.75 && y <= spaceBetweenLines * 8.25) {
			console.log("g");
		} else if (y > spaceBetweenLines * 8.25 && y <= spaceBetweenLines * 8.75) {
			console.log("f");
		} else if (y > spaceBetweenLines * 8.75 && y <= spaceBetweenLines * 9.25) {
			console.log("e");
		} else if (y > spaceBetweenLines * 9.25 && y <= spaceBetweenLines * 9.75) {
			console.log("d");
		} else if (y > spaceBetweenLines * 9.75 && y <= spaceBetweenLines * 10.25) {
			console.log("c");
		} else if (y > spaceBetweenLines * 10.25 && y <= spaceBetweenLines * 10.75) {
			console.log("h");
		} else if (y > spaceBetweenLines * 10.75 && y <= spaceBetweenLines * 11.25) {
			console.log("a");
		} else if (y > spaceBetweenLines * 11.25 && y <= spaceBetweenLines * 11.75) {
			console.log("g");
		} else if (y > spaceBetweenLines * 11.75 && y <= spaceBetweenLines * 12.25) {
			console.log("f");
		} else if (y > spaceBetweenLines * 12.25 && y <= spaceBetweenLines * 12.75) {
			console.log("e");
		}
		// return horizontalArea;

	},

	addOnStaveClickListener = function() {
		
		canvas.addEventListener('click', function(event) {
		    var x = event.pageX - canvasLeft,
		        y = event.pageY - canvasTop;
		    	console.log(x, y);
		    staveElements.forEach(function(element) {
		        console.log("top" )
		        if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
		            //alert('clicked an staveElement');
		            console.log("got it " + element.staveId);

		            addNote(element.top, calcNotePositionHorizontal(x));
		            
		            renderNoteElements();		            
		        }
		    });

		}, false);
	},

	/* this method renders the 5 staves on the canvas by getting them from the staveElements Array */
	renderStaveElements = function() {
		staveElements.forEach(function(element) {
		    context.fillStyle = element.colour;
		    context.fillRect(element.left, element.top, element.width, element.height);
		});
	},

	// display note elements on the canvas and get them from model
	renderNoteElements = function() {
		noteElements.forEach(function(element) {
		    context.fillStyle = element.colour;
		    context.fillRect(element.left, element.top, element.width, element.height);
		});
	},
	

	addNote = function(topVal, leftVal) {
		noteElements.push({
		    colour: '#000000',
		    width: 20,
		    height: 20,
		    top: topVal - 6,
		    left: leftVal
		});	
	},
	

	calcNotePositionHorizontal = function(mouseX) {
		var staveParts = canvas.width / 4;
		var notePosHorizontal = 0;

		if (mouseX < staveParts * 1) {
			notePosHorizontal = staveParts / 2; 	
		}
		else if (mouseX < staveParts * 2 && mouseX > staveParts * 1){
			notePosHorizontal = staveParts * 1.5;
		}
		else if (mouseX < staveParts * 3 && mouseX > staveParts * 2){
			notePosHorizontal = staveParts * 2.5;
		}
		else if (mouseX < staveParts * 4 && mouseX > staveParts * 3){
			notePosHorizontal = staveParts * 3.5;
		}
		return notePosHorizontal;
	};

	
	
	that.init = init;
	that.calcNotePositionHorizontal = calcNotePositionHorizontal;

	return that;
}