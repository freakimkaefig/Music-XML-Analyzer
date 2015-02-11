MusicXMLAnalyzer.NotationView = function(){

	var that = {},
	staveElements = [],
	noteElements = [],
	context = null,
	canvas = null,
	canvasLeft = null,
	canvasTop = null,

	init = function() {
		console.log("notation view");
		initCanvas();
		addStaveElements();
		renderStaveElements();
		addOnStaveClickListener();
	},

	/* This method inits canvas and context */
	initCanvas = function() {
		canvas = document.getElementById('myCanvas');
	    canvasLeft = canvas.offsetLeft;
	    canvasTop = canvas.offsetTop;

	    context = canvas.getContext('2d');
	},

	/* This method adds the 5 note lines to canvas */
	addStaveElements = function() {

		var spaceBetweenLines = (canvas.height/14) * 5;
		console.log("c h: " + spaceBetweenLines);

		for(var i = 0; i < 5; i++) {
			staveElements.push({
			    staveId: i,
			    colour: '#000000',
			    width: canvas.width,
			    height: 1.5,
			    top: spaceBetweenLines + (12 * i),
			    left: 0
			});	
		}
		
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