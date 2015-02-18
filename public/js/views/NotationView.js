MusicXMLAnalyzer.NotationView = function(){

	var that = {},
	staveElements = [],
	noteElements = [],
	context = null,
	canvas = null,
	canvasLeft = null,
	canvasTop = null,
	renderer = null,
	stave = null,

	paddingTopStaves = 0,
	spaceBetweenLines = 0,

	topValsNoteElements = null,
	

	init = function() {
		console.log("notation view");
		patternController = MusicXMLAnalyzer.PatternController();

		initCanvas();
		setTopNoteValues();
		registerListener();

	},


	/* This method inits canvas and context and sets canvas top and left to variable*/
	initCanvas = function() {
		// canvas = document.getElementById('myCanvas');
		canvas = document.getElementById('myCanvas');
	    canvasLeft = canvas.offsetLeft;
	    canvasTop = canvas.offsetTop;

	    // context = canvas.getContext('2d');
  		renderer = new Vex.Flow.Renderer(canvas,Vex.Flow.Renderer.Backends.CANVAS);

  		context = renderer.getContext();
  		stave = new Vex.Flow.Stave(10, 0, 500);
  		stave.addClef("treble").setContext(context).draw();

	},

	registerListener = function() {
		$("#myCanvas").on("mousemove", onMouseMoveCanvas);
		$("#myCanvas").on("click", onMouseClickCanvas);
	},

	renderVexFlowNotePreview = function(noteName) {
		stave.setContext(context).draw();

  		// Create one note
		var notes = [
		  	new Vex.Flow.StaveNote({ keys: [noteName],
		    						 duration: "q",
		    						 auto_stem: true }),
		  	];

		var voice = new Vex.Flow.Voice({
		    num_beats: 1,
		    beat_value: 4,
		    resolution: Vex.Flow.RESOLUTION
		});

		// Add notes to voice
		voice.addTickables(notes);

		// Format and justify the notes to 500 pixels
		var formatter = new Vex.Flow.Formatter().
		    joinVoices([voice]).format([voice], 500);

		// Render voice
		voice.draw(context, stave);
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

    	//check if cursor is hover a existing note position
    	if (checkHorizontalArea(y)) {		
    		// log current hovering note
    		console.log("current note preview = " + checkHorizontalArea(y));

    		// delete canvas
    		context.clearRect(0, 0, canvas.width, canvas.height);

    		// call method to render note preview with given noteName
    		renderVexFlowNotePreview(checkHorizontalArea(y));

    	}

	},

	/* This method handels the mouseover event of canvas */
	onMouseClickCanvas = function(event) {

		console.log("on canvas click");
		patternController.addNoteByCanvasClick("dummy/Note");

	},

	/* This method checks on which horizontal position the cursor is and saves the corresponding note to the variable */
	checkHorizontalArea = function(y) {

		var horizontalVal = null;

		if (y > spaceBetweenLines * 1.25 && y <= spaceBetweenLines * 1.75) {
			horizontalVal = "f/6";
		} else if (y > spaceBetweenLines * 1.75 && y <= spaceBetweenLines * 2.25) {
			horizontalVal = "e/6";
		} else if (y > spaceBetweenLines * 2.25 && y <= spaceBetweenLines * 2.75) {
			horizontalVal = "d/6";
		} else if (y > spaceBetweenLines * 2.75 && y <= spaceBetweenLines * 3.25) {
			horizontalVal = "c/6";
		} else if (y > spaceBetweenLines * 3.25 && y <= spaceBetweenLines * 3.75) {
			horizontalVal = "b/5";
		} else if (y > spaceBetweenLines * 3.75 && y <= spaceBetweenLines * 4.25) {
			horizontalVal = "a/5";
		} else if (y > spaceBetweenLines * 4.25 && y <= spaceBetweenLines * 4.75) {
			horizontalVal = "g/5";
		} else if (y > spaceBetweenLines * 4.75 && y <= spaceBetweenLines * 5.25) {
			horizontalVal = "f/5";
		} else if (y > spaceBetweenLines * 5.25 && y <= spaceBetweenLines * 5.75) {
			horizontalVal = "e/5";
		} else if (y > spaceBetweenLines * 5.75 && y <= spaceBetweenLines * 6.25) {
			horizontalVal = "d/5";
		} else if (y > spaceBetweenLines * 6.25 && y <= spaceBetweenLines * 6.75) {
			horizontalVal = "c/5";
		} else if (y > spaceBetweenLines * 6.75 && y <= spaceBetweenLines * 7.25) {
			horizontalVal = "b/4";
		} else if (y > spaceBetweenLines * 7.25 && y <= spaceBetweenLines * 7.75) {
			horizontalVal = "a/4";
		} else if (y > spaceBetweenLines * 7.75 && y <= spaceBetweenLines * 8.25) {
			horizontalVal = "g/4";
		} else if (y > spaceBetweenLines * 8.25 && y <= spaceBetweenLines * 8.75) {
			horizontalVal = "f/4";
		} else if (y > spaceBetweenLines * 8.75 && y <= spaceBetweenLines * 9.25) {
			horizontalVal = "e/4";
		} else if (y > spaceBetweenLines * 9.25 && y <= spaceBetweenLines * 9.75) {
			horizontalVal = "d/4";
		} else if (y > spaceBetweenLines * 9.75 && y <= spaceBetweenLines * 10.25) {
			// eigentlich ein c1
			horizontalVal = "c/4";
		} else if (y > spaceBetweenLines * 10.25 && y <= spaceBetweenLines * 10.75) {
			horizontalVal = "b/3";
		} else if (y > spaceBetweenLines * 10.75 && y <= spaceBetweenLines * 11.25) {
			horizontalVal = "a/3";
		} else if (y > spaceBetweenLines * 11.25 && y <= spaceBetweenLines * 11.75) {
			horizontalVal = "g/3";
		} else if (y > spaceBetweenLines * 11.75 && y <= spaceBetweenLines * 12.25) {
			horizontalVal = "f/3";
		} else if (y > spaceBetweenLines * 12.25 && y <= spaceBetweenLines * 12.75) {
			horizontalVal = "e/3";
		}
		return horizontalVal;

	},


	// display note elements on the canvas and get them from model
	renderNoteElements = function() {
		
	},
	

	addNote = function() {
		
	},
	

	calcNotePositionHorizontal = function(mouseX) {
		
	};

	
	
	that.init = init;
	that.calcNotePositionHorizontal = calcNotePositionHorizontal;

	return that;
}