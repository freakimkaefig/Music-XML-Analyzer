MusicXMLAnalyzer.NotationView = function(){

	var that = {},
	context = null,
	canvas = null,
	canvasLeft = null,
	canvasTop = null,
	renderer = null,
	stave = null,

	hoveredNote = null;

	paddingTopStaves = 0,
	spaceBetweenLines = 0,

	topValsNoteElements = null,
	

	init = function() {
		console.log("notation view");
		patternController = MusicXMLAnalyzer.PatternController();
		patternModel = MusicXMLAnalyzer.PatternModel();

		initCanvas();
		setTopNoteValues();
		registerListener();
	},


	/* This method inits canvas and context and sets canvas top and left to variable*/
	initCanvas = function() {
		canvas = document.getElementById('myCanvas');
	    canvasLeft = canvas.offsetLeft;
	    canvasTop = canvas.offsetTop;

  		renderer = new Vex.Flow.Renderer(canvas,Vex.Flow.Renderer.Backends.CANVAS);

  		context = renderer.getContext();
  		stave = new Vex.Flow.Stave(10, 0, 700);
  		stave.addClef("treble").setContext(context).draw();

	},

	registerListener = function() {
		$("#myCanvas").on("mousemove", onMouseMoveCanvas);
		$("#myCanvas").on("click", onMouseClickCanvas);
	},

	// display note elements on the canvas and get them from model
	// via controller
	renderNotes = function(vexflowNotes, completeDurationIn64th) {
		console.log("renderNotes");

		// delete canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		stave.setContext(context).draw();

		var voice = new Vex.Flow.Voice({
		    num_beats: completeDurationIn64th,
		    beat_value: 64,
		    resolution: Vex.Flow.RESOLUTION
		});

		// Add notes to voice
		voice.addTickables(vexflowNotes);

		// Format and justify the notes to 700 pixels
		var formatter = new Vex.Flow.Formatter().
		    joinVoices([voice]).format([voice], 700);

		// Render voice
		voice.draw(context, stave);
		
	},

	renderVexFlowNotePreview = function(noteName) {
		console.log("render notes preview");
		// delete canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		stave.setContext(context).draw();

		// get all vexflow note elements from model which already exist 
  		var vexFlowNotes = patternModel.getAllVexFlowNoteElements();
  		// get complete duration for num_beats
  		var completeDurationIn64th = patternModel.getCompleteDurationIn64th();
  		var currentDuration = patternModel.getCurrentNoteDuration();
		// get Vexflow duration with duration from buttons
  		var currentDuration4VexFlow = patternModel.getDuration4Vexflow(currentDuration);
  		// get duration in 64th with currentDuration val
  		var durationPreviewNoteIn64th = patternModel.getDurationIn64thNotes(currentDuration);
  		
		vexFlowNotes.push(new Vex.Flow.StaveNote({ keys: [noteName],
		    						 duration: currentDuration4VexFlow,
		    						 auto_stem: true }));
		  		  	
		// console.log("complete dur: " + completeDurationIn64th);

		var voice = new Vex.Flow.Voice({
		    //complete duration + the note you preview
		    num_beats: completeDurationIn64th + durationPreviewNoteIn64th,
		    beat_value: 64,
		    resolution: Vex.Flow.RESOLUTION
		});
		//easiest way to disable time-checking
		voice.setStrict(false);

		// Add notes to voice
		voice.addTickables(vexFlowNotes);

		// Format and justify the notes to 700 pixels
		var formatter = new Vex.Flow.Formatter().
		    joinVoices([voice]).format([voice], 700);

		// Render voice
		voice.draw(context, stave);

		//delete last array entry
		vexFlowNotes.pop();
	},

	onNotationViewUpdate = function(event, notes) {
		console.log("view triggered");
		//console.log("notes: " + notes);
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
    	//if yes the method returns val and not null
    	if (checkHorizontalArea(y)) {		
    		// call method to render note preview with given noteName
    		renderVexFlowNotePreview(checkHorizontalArea(y));

    	}

	},

	/* This method handels the mouseover event of canvas */
	onMouseClickCanvas = function(event) {

		console.log("on canvas click");
		patternController.addNoteByCanvasClick(hoveredNote);

	},

	/* This method checks on which horizontal position the cursor is and saves the corresponding note to the variable */
	checkHorizontalArea = function(y) {

		if (y > spaceBetweenLines * 1.25 && y <= spaceBetweenLines * 1.75) {
			hoveredNote = "f/6";
		} else if (y > spaceBetweenLines * 1.75 && y <= spaceBetweenLines * 2.25) {
			hoveredNote = "e/6";
		} else if (y > spaceBetweenLines * 2.25 && y <= spaceBetweenLines * 2.75) {
			hoveredNote = "d/6";
		} else if (y > spaceBetweenLines * 2.75 && y <= spaceBetweenLines * 3.25) {
			hoveredNote = "c/6";
		} else if (y > spaceBetweenLines * 3.25 && y <= spaceBetweenLines * 3.75) {
			hoveredNote = "b/5";
		} else if (y > spaceBetweenLines * 3.75 && y <= spaceBetweenLines * 4.25) {
			hoveredNote = "a/5";
		} else if (y > spaceBetweenLines * 4.25 && y <= spaceBetweenLines * 4.75) {
			hoveredNote = "g/5";
		} else if (y > spaceBetweenLines * 4.75 && y <= spaceBetweenLines * 5.25) {
			hoveredNote = "f/5";
		} else if (y > spaceBetweenLines * 5.25 && y <= spaceBetweenLines * 5.75) {
			hoveredNote = "e/5";
		} else if (y > spaceBetweenLines * 5.75 && y <= spaceBetweenLines * 6.25) {
			hoveredNote = "d/5";
		} else if (y > spaceBetweenLines * 6.25 && y <= spaceBetweenLines * 6.75) {
			hoveredNote = "c/5";
		} else if (y > spaceBetweenLines * 6.75 && y <= spaceBetweenLines * 7.25) {
			hoveredNote = "b/4";
		} else if (y > spaceBetweenLines * 7.25 && y <= spaceBetweenLines * 7.75) {
			hoveredNote = "a/4";
		} else if (y > spaceBetweenLines * 7.75 && y <= spaceBetweenLines * 8.25) {
			hoveredNote = "g/4";
		} else if (y > spaceBetweenLines * 8.25 && y <= spaceBetweenLines * 8.75) {
			hoveredNote = "f/4";
		} else if (y > spaceBetweenLines * 8.75 && y <= spaceBetweenLines * 9.25) {
			hoveredNote = "e/4";
		} else if (y > spaceBetweenLines * 9.25 && y <= spaceBetweenLines * 9.75) {
			hoveredNote = "d/4";
		} else if (y > spaceBetweenLines * 9.75 && y <= spaceBetweenLines * 10.25) {
			// eigentlich ein c1
			hoveredNote = "c/4";
		} else if (y > spaceBetweenLines * 10.25 && y <= spaceBetweenLines * 10.75) {
			hoveredNote = "b/3";
		} else if (y > spaceBetweenLines * 10.75 && y <= spaceBetweenLines * 11.25) {
			hoveredNote = "a/3";
		} else if (y > spaceBetweenLines * 11.25 && y <= spaceBetweenLines * 11.75) {
			hoveredNote = "g/3";
		} else if (y > spaceBetweenLines * 11.75 && y <= spaceBetweenLines * 12.25) {
			hoveredNote = "f/3";
		} else if (y > spaceBetweenLines * 12.25 && y <= spaceBetweenLines * 12.75) {
			hoveredNote = "e/3";
		}
		return hoveredNote;

	};
	
	
	that.init = init;
	that.renderNotes = renderNotes;

	return that;
}