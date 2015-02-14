MusicXMLAnalyzer.NotationView = function(){

	var that = {},
	staveElements = [],
	noteElements = [],
	context = null,
	canvas = null,
	canvasLeft = null,
	canvasTop = null,

	paddingTopStaves = 0,
	spaceBetweenLines = 0,

	topValsNoteElements = null,

	

	init = function() {
		console.log("notation view");
		initCanvas();
		addStaveElements();
		renderStaveElements();
		//addOnStaveClickListener();
		setTopNoteValues();
		
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

	/* this method renders the 5 staves on the canvas by getting them from the staveElements Array */
	renderStaveElements = function() {
		staveElements.forEach(function(element) {
		    context.fillStyle = element.colour;
		    context.fillRect(element.left, element.top, element.width, element.height);
		});
	},

	/* this methods calcs the position of the notes */
	setTopNoteValues = function() {
		spaceBetweenLines = (canvas.height/14);

		topValsNoteElements = {
	    	f3: spaceBetweenLines * 1.5,
	    	e3: spaceBetweenLines * 2,
	    	d3: spaceBetweenLines * 2.5,
	    	c3: spaceBetweenLines * 3,
	    	h2: spaceBetweenLines * 3.5,
	    	a2: spaceBetweenLines * 4,
	    	g2: spaceBetweenLines * 4.5,
	    	f2: spaceBetweenLines * 5,
	    	e2: spaceBetweenLines * 5.5,
	    	d2: spaceBetweenLines * 6,
	    	c2: spaceBetweenLines * 6.5,
	    	h1: spaceBetweenLines * 7,
	    	a1: spaceBetweenLines * 7.5,
	    	g1: spaceBetweenLines * 8,
	    	f1: spaceBetweenLines * 8.5,
	    	e1: spaceBetweenLines * 9,
	    	d1: spaceBetweenLines * 9.5,
	    	c1: spaceBetweenLines * 10,
	    	h: spaceBetweenLines * 10.5,
	    	a: spaceBetweenLines * 11,
	    	g: spaceBetweenLines * 11.5,
	    	f: spaceBetweenLines * 12,
	    	e: spaceBetweenLines * 12.5
		};
	},

	/* This method handels the mouseover event of canvas */
	onMouseMoveCanvas = function(event) {

		var x = event.pageX - canvasLeft,
	        y = event.pageY - canvasTop;

    	// console.log("y: " + y);
    	if (checkHorizontalArea(y)) {		
    		console.log("current note preview = " + checkHorizontalArea(y));
    		context.clearRect(0, 0, canvas.width, canvas.height);
			renderStaveElements();
			renderNotePreview(topValsNoteElements[checkHorizontalArea(y)]);
    	}

	},

	checkHorizontalArea = function(y) {

		var horizontalVal = null;

		if (y > spaceBetweenLines * 1.25 && y <= spaceBetweenLines * 1.75) {
			horizontalVal = "f3";
		} else if (y > spaceBetweenLines * 1.75 && y <= spaceBetweenLines * 2.25) {
			horizontalVal = "e3";
		} else if (y > spaceBetweenLines * 2.25 && y <= spaceBetweenLines * 2.75) {
			horizontalVal = "d3";
		} else if (y > spaceBetweenLines * 2.75 && y <= spaceBetweenLines * 3.25) {
			horizontalVal = "c3";
		} else if (y > spaceBetweenLines * 3.25 && y <= spaceBetweenLines * 3.75) {
			horizontalVal = "h2";
		} else if (y > spaceBetweenLines * 3.75 && y <= spaceBetweenLines * 4.25) {
			horizontalVal = "a2";
		} else if (y > spaceBetweenLines * 4.25 && y <= spaceBetweenLines * 4.75) {
			horizontalVal = "g2";
		} else if (y > spaceBetweenLines * 4.75 && y <= spaceBetweenLines * 5.25) {
			horizontalVal = "f2";
		} else if (y > spaceBetweenLines * 5.25 && y <= spaceBetweenLines * 5.75) {
			horizontalVal = "e2";
		} else if (y > spaceBetweenLines * 5.75 && y <= spaceBetweenLines * 6.25) {
			horizontalVal = "d2";
		} else if (y > spaceBetweenLines * 6.25 && y <= spaceBetweenLines * 6.75) {
			horizontalVal = "c2";
		} else if (y > spaceBetweenLines * 6.75 && y <= spaceBetweenLines * 7.25) {
			horizontalVal = "h1";
		} else if (y > spaceBetweenLines * 7.25 && y <= spaceBetweenLines * 7.75) {
			horizontalVal = "a1";
		} else if (y > spaceBetweenLines * 7.75 && y <= spaceBetweenLines * 8.25) {
			horizontalVal = "g1";
		} else if (y > spaceBetweenLines * 8.25 && y <= spaceBetweenLines * 8.75) {
			horizontalVal = "f1";
		} else if (y > spaceBetweenLines * 8.75 && y <= spaceBetweenLines * 9.25) {
			horizontalVal = "e1";
		} else if (y > spaceBetweenLines * 9.25 && y <= spaceBetweenLines * 9.75) {
			horizontalVal = "d1";
		} else if (y > spaceBetweenLines * 9.75 && y <= spaceBetweenLines * 10.25) {
			horizontalVal = "c1";
		} else if (y > spaceBetweenLines * 10.25 && y <= spaceBetweenLines * 10.75) {
			horizontalVal = "h";
		} else if (y > spaceBetweenLines * 10.75 && y <= spaceBetweenLines * 11.25) {
			horizontalVal = "a";
		} else if (y > spaceBetweenLines * 11.25 && y <= spaceBetweenLines * 11.75) {
			horizontalVal = "g";
		} else if (y > spaceBetweenLines * 11.75 && y <= spaceBetweenLines * 12.25) {
			horizontalVal = "f";
		} else if (y > spaceBetweenLines * 12.25 && y <= spaceBetweenLines * 12.75) {
			horizontalVal = "e";
		}
		return horizontalVal;

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

	// display note elements on the canvas and get them from model
	renderNoteElements = function() {
		noteElements.forEach(function(element) {
		    context.fillStyle = element.colour;
		    context.fillRect(element.left, element.top, element.width, element.height);
		});
	},

	// display note elements on the canvas and get them from model
	renderNotePreview = function(top) {
	    context.fillStyle = "#d3d3d3";
	    context.fillRect(100, top - 7.5, 15, 15);
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