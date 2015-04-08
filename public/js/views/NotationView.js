MusicXMLAnalyzer.NotationView = function(){

	var that = {},
	context = null,
	canvas = null,
	canvasLeft = null,
	canvasTop = null,
	renderer = null,
	stave = null,

	hoveredNote = null;
	hoveredOctave = null;

	paddingTopStaves = 0,
	spaceBetweenLines = 0,

	topValsNoteElements = null,

	VEXFLOW_REST_SIGN = "r",

	/**
	 * Init function
	 */
	init = function() {
		patternController = MusicXMLAnalyzer.PatternController();
		patternModel = MusicXMLAnalyzer.PatternModel();

		initCanvas();
		setTopNoteValues();
		registerListener();
	},

	/**
	 * This method inits canvas and context and sets canvas top and left to variable
	 */
	initCanvas = function() {
		canvas = document.getElementById('myCanvas');
	    canvasLeft = canvas.offsetLeft;
	    canvasTop = canvas.offsetTop;

  		renderer = new Vex.Flow.Renderer(canvas,Vex.Flow.Renderer.Backends.CANVAS);

  		context = renderer.getContext();
  		stave = new Vex.Flow.Stave(10, 45, 700);
  		addClef(patternModel.getCurrentMode());
	},

	/**
	 * Method clears canvas, creates new stave and adds a new clef on mode change
	 *
	 * @param {event}    event    not needed
	 *
	 * @param {int}      mode     not needed
	 */
	onChangeMode = function(event, mode) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		stave = new Vex.Flow.Stave(10, 45, 700);
  		addClef(patternModel.getCurrentMode());
	},

	/**
	 * Method adds a clef according to mode
	 *
	 * @param {int}    mode    current selected mode
	 */
	addClef = function(mode) {
		if (mode === 1) {
  			stave.addClef("percussion").setContext(context).draw();
  		} else {
  			stave.addClef("treble").setContext(context).draw();
  		}
	},

	/**
	 * Method registers listener to canvas
	 */
	registerListener = function() {
		$("#myCanvas").on("mousemove", onMouseMoveCanvas);
		$("#myCanvas").on("click", onMouseClickCanvas);

		$(patternController).on('changed_mode', onChangeMode);
	},

	/**
	 * Method displays note elements on the canvas and get them from model
	 *
	 * @param {object}    vexflowNotes    contains notes for vexflow
	 */
	renderNotes = function(vexflowNotes) {

		// delete canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		stave.setContext(context).draw();

		var voice = new Vex.Flow.Voice({
		    resolution: Vex.Flow.RESOLUTION
		});


		//easiest way to disable time-checking
		voice.setStrict(false);

		// Add notes to voice
		voice.addTickables(vexflowNotes);

		// Format and justify the notes to 700 pixels
		var formatter = new Vex.Flow.Formatter().
		    joinVoices([voice]).format([voice], 700);

		//TRIPLET
		//get beams and tuplets from model
		var beams = patternModel.getTupletArray();
		var tuplets = patternModel.getBeamArray();

		voice.draw(context, stave);

		//TRIPLET
		for(var i=0; i < tuplets.length; i++) {
			tuplets[i].setContext(context).draw();
		}

		for(var i=0; i < beams.length; i++) {
			for(var j=0; j < beams[i].length; j++) {
				beams[i][j].setContext(context).draw();
			}
		}



	},

	/**
	 * Method renders preview note on canvas at mouseover
	 */
	renderVexFlowNotePreview = function() {
		// delete canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		stave.setContext(context).draw();

		// get all vexflow note elements from model which already exist
  		var vexflowNotes = patternModel.getAllVexFlowNoteElements();

  		//bugprevention: vexflow changes the position of dots
  		//for loop sets the position of all available dots to 0
  		for (var i=0;  i < vexflowNotes.length; i++) {

  			if (typeof vexflowNotes[i].modifiers[0] !== 'undefined') {
  				vexflowNotes[i].modifiers[0].dot_shiftY = 0;
  			}
  		}

  		var previewNote = null;
		var key = hoveredNote;
  		var durationContent = patternModel.getDuration4Vexflow(patternModel.getCurrentNoteDuration());
  		// to check if break is selected or not
  		// when break is selected: only key "b/4"
  		var noteName = patternModel.getCurrentNoteName();
  		var accidental = patternModel.getCurrentAccidential();
  		var rythSpec = patternModel.getCurrentNoteRythSpecial();

  		if (accidental === "#" || accidental === "b") {
			key += accidental;
		}
  		// add the preview to to notes array
  		// further down it's been removed again
  		if (noteName === "break") {
			previewNote = new Vex.Flow.StaveNote({ keys: ["b/4"],
	    						duration: durationContent + VEXFLOW_REST_SIGN,
	    						auto_stem: true });
		} else {
			var keys = key + "/" + hoveredOctave;
			if (patternModel.getCurrentMode() === 1) {
				if (durationContent === "w" || durationContent === "h" || durationContent === "wd" || durationContent === "hd") {
					keys += "/d0";
				} else {
					keys += "/d2";
				}
			}
			previewNote = new Vex.Flow.StaveNote({ keys: [keys],
	    						duration: durationContent,
	    						auto_stem: true });
		}

		if (accidental === "#" || accidental === "b") {
			previewNote.addAccidental(0, new Vex.Flow.Accidental(accidental));
		}

		if (rythSpec === "dotted") {
			previewNote.addDot(0);
		}

		// set color of preview note
		previewNote.color = "#8B8B8B";

  		vexflowNotes.push(previewNote);

		var voice = new Vex.Flow.Voice({
		    resolution: Vex.Flow.RESOLUTION
		});

		//disable time-checking
		voice.setStrict(false);
		// Add notes to voice
		voice.addTickables(vexflowNotes);

		// Format and justify the notes to 700 pixels
		var formatter = new Vex.Flow.Formatter().
		    joinVoices([voice]).format([voice], 700);

	    //TRIPLET
		//get beams and tuplets from model
		var beams = patternModel.getTupletArray();
		var tuplets = patternModel.getBeamArray();

		// Render voice
		voice.draw(context, stave);

		//TRIPLET
		for(var i=0; i < tuplets.length; i++) {
			tuplets[i].setContext(context).draw();
		}

		for(var i=0; i < beams.length; i++) {
			for(var j=0; j < beams[i].length; j++) {
				beams[i][j].setContext(context).draw();
			}
		}

		//delete last array entry
		vexflowNotes.pop();

	},
	/**
	 * Method calculates the position of the notes
	 */
	setTopNoteValues = function() {
		spaceBetweenLines = (canvas.height/16);
	},

	/**
	 * Method handels the mouseover event on canvas
	 */
	onMouseMoveCanvas = function(event) {

		var x = event.pageX - canvasLeft,
	        y = event.pageY - canvasTop;

    	//check if cursor is hover a existing note position
    	//if yes the method returns val and not null

    	//when rhythm mode -> just note b/4 is displayed when hovering
    	if (patternModel.getCurrentMode() === 1) {
    		hoveredOctave = "4";
    		hoveredNote = "b";
    		renderVexFlowNotePreview("b");
    	}
    	else if (checkHorizontalArea(y)) {
    		// call method to render note preview with given noteName
    		renderVexFlowNotePreview();
    	}
	},

	/**
	 * Method handels mouseclick event on canvas
	 */
	onMouseClickCanvas = function() {

		var noteName = patternModel.getCurrentNoteName();

		var hoveredArea = null;

		if (noteName === "break") {
			hoveredArea = "break/4";
			patternController.addNoteByCanvasClick(hoveredArea);
		} else {
			hoveredArea = hoveredNote + "/" + hoveredOctave;
			patternController.addNoteByCanvasClick(hoveredArea);
		}

	},

	/**
	 * Method checks on which horitiontal position the mousecursor is and saves the corresponding note
	 *
	 * @param {int}    		y    		 horizontal position of cursor
	 *
	 * @return {string}    hoverdnote    hovered note according to calculated cursor position
	 */
	checkHorizontalArea = function(y) {

		if (y > spaceBetweenLines * 1.25 && y <= spaceBetweenLines * 1.75) {
			hoveredNote = "b";
			hoveredOctave = "6";
		} else if (y > spaceBetweenLines * 1.75 && y <= spaceBetweenLines * 2.25) {
			hoveredNote = "a";
			hoveredOctave = "6";
		} else if (y > spaceBetweenLines * 2.25 && y <= spaceBetweenLines * 2.75) {
			hoveredNote = "g";
			hoveredOctave = "6";
		} else if (y > spaceBetweenLines * 2.75 && y <= spaceBetweenLines * 3.25) {
			hoveredNote = "f";
			hoveredOctave = "6";
		} else if (y > spaceBetweenLines * 3.25 && y <= spaceBetweenLines * 3.75) {
			hoveredNote = "e";
			hoveredOctave = "6";
		} else if (y > spaceBetweenLines * 3.75 && y <= spaceBetweenLines * 4.25) {
			hoveredNote = "d";
			hoveredOctave = "6";
		} else if (y > spaceBetweenLines * 4.25 && y <= spaceBetweenLines * 4.75) {
			hoveredNote = "c";
			hoveredOctave = "6";
		} else if (y > spaceBetweenLines * 4.75 && y <= spaceBetweenLines * 5.25) {
			hoveredNote = "b";
			hoveredOctave = "5";
		} else if (y > spaceBetweenLines * 5.25 && y <= spaceBetweenLines * 5.75) {
			hoveredNote = "a";
			hoveredOctave = "5";
		} else if (y > spaceBetweenLines * 5.75 && y <= spaceBetweenLines * 6.25) {
			hoveredNote = "g";
			hoveredOctave = "5";
		} else if (y > spaceBetweenLines * 6.25 && y <= spaceBetweenLines * 6.75) {
			hoveredNote = "f";
			hoveredOctave = "5";
		} else if (y > spaceBetweenLines * 6.75 && y <= spaceBetweenLines * 7.25) {
			hoveredNote = "e";
			hoveredOctave = "5";
		} else if (y > spaceBetweenLines * 7.25 && y <= spaceBetweenLines * 7.75) {
			hoveredNote = "d";
			hoveredOctave = "5";
		} else if (y > spaceBetweenLines * 7.75 && y <= spaceBetweenLines * 8.25) {
			hoveredNote = "c";
			hoveredOctave = "5";
		} else if (y > spaceBetweenLines * 8.25 && y <= spaceBetweenLines * 8.75) {
			hoveredNote = "b";
			hoveredOctave = "4";
		} else if (y > spaceBetweenLines * 8.75 && y <= spaceBetweenLines * 9.25) {
			hoveredNote = "a";
			hoveredOctave = "4";
		} else if (y > spaceBetweenLines * 9.25 && y <= spaceBetweenLines * 9.75) {
			hoveredNote = "g";
			hoveredOctave = "4";
		} else if (y > spaceBetweenLines * 9.75 && y <= spaceBetweenLines * 10.25) {
			// c1
			hoveredNote = "f";
			hoveredOctave = "4";
		} else if (y > spaceBetweenLines * 10.25 && y <= spaceBetweenLines * 10.75) {
			hoveredNote = "e";
			hoveredOctave = "4";
		} else if (y > spaceBetweenLines * 10.75 && y <= spaceBetweenLines * 11.25) {
			hoveredNote = "d";
			hoveredOctave = "4";
		} else if (y > spaceBetweenLines * 11.25 && y <= spaceBetweenLines * 11.75) {
			hoveredNote = "c";
			hoveredOctave = "4";
		} else if (y > spaceBetweenLines * 11.75 && y <= spaceBetweenLines * 12.25) {
			hoveredNote = "b";
			hoveredOctave = "3";
		} else if (y > spaceBetweenLines * 12.25 && y <= spaceBetweenLines * 12.75) {
			hoveredNote = "a";
			hoveredOctave = "3";
		} else if (y > spaceBetweenLines * 12.75 && y <= spaceBetweenLines * 13.25) {
			hoveredNote = "g";
			hoveredOctave = "3";
		} else if (y > spaceBetweenLines * 13.25 && y <= spaceBetweenLines * 13.75) {
			hoveredNote = "f";
			hoveredOctave = "3";
		} else if (y > spaceBetweenLines * 13.75 && y <= spaceBetweenLines * 14.25) {
			hoveredNote = "e";
			hoveredOctave = "3";
		} else if (y > spaceBetweenLines * 14.25 && y <= spaceBetweenLines * 14.75) {
			hoveredNote = "d";
			hoveredOctave = "3";
		} else if (y > spaceBetweenLines * 14.75 && y <= spaceBetweenLines * 15.25) {
			hoveredNote = "c";
			hoveredOctave = "3";
		}

		return hoveredNote;
	},

	/**
	 * Method to clear canvas and redraw staves
	 */
	clearCanvas = function() {
		// clear canvas and redraw staves
		context.clearRect(0, 0, canvas.width, canvas.height);
		stave.setContext(context).draw();
	};


	that.init = init;
	that.renderNotes = renderNotes;
	that.clearCanvas = clearCanvas;

	return that;
}