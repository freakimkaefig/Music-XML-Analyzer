/** @constructor */
MusicXMLAnalyzer.ResultView = function(){

	var that = {},

	$patternValue = null,

	patternCanvas = null,

	$carousel = null,

	$artist = null,
	$title = null,
	$exportButton = null,

	finishedLoading = false,

	$logMessages = null,
	resultMessageCounter = null,

	/**
	 * Init function
	 * @function
     * @public
	 */
	init = function(){
		if ($('#patternCanvas').length) {
			$patternValue = $('#patternValue');
			initPatternCanvas(JSON.parse($patternValue.val()));
		}

		if ($('#extract-carousel').length) {
			$carousel = $('#extract-carousel');
			initResultItems();
		}

		$artist = $('#artist');
		$title = $('#title');
		$exportButton = $('.exportButton');
		$exportButton.on('click', generateExportPdf);
		$exportButton.addClass('disabled');

		$('.list-item').on('click', onListItemClick);

		$logMessages = $('#resultMessages');
		resultMessageCounter = 0;
	},

	/**
	 * Method preapares model export
	 * @function
     * @public
	 */
	setModelReady = function() {
		console.info("MusicXMLAnalyzer.ResultView.setModelReady");
		finishedLoading = true;
		prepareExport();
	},

	/**
	 * Method inits result items
	 * @function
     * @private
	 */
	initResultItems = function() {
		var numItems = $carousel.find('.item').length;
		$carousel.find('.item').each(function(index) {
			var result = JSON.parse($(this).find('.resultItem').val());
			$(that).trigger('addResultItem', [numItems, result]);
		});
	},

	/**
	 * Method renders result extract
	 * @function
     * @public
	 *
	 * @param {int}    		index   counter
	 * @param {object}      data    contains information about extract position
	 */
	renderResultExtract = function(index, data) {
		var measuresText = '<strong>Measures: </strong>' + data.start_extract + ' - ' + data.end_extract;
		$carousel.find('#item' + index).find('.facts-list').find('.measures').html(measuresText);

		$carousel.find('#resultExtract' + index).val(JSON.stringify(data));

		// initialize canvas
		var canvas = document.createElement('canvas');
		canvas.id = "canvas" + index;
		canvas.className = "canvas";
		canvas.width = 970;
		canvas.height = Math.ceil(data.measures.length / 2) * 180;
		var canvasContainer = document.getElementById('canvasContainer' + index);
		canvasContainer.innerHTML = "";
		canvasContainer.appendChild(canvas);

		var measures = generateVexflowNotes(data, true);

		var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
		var context = renderer.getContext();
		var stave = new Vex.Flow.Stave(10, 0, 700);
		stave.addClef("treble").setContext(context).draw();
		renderNotes(measures, canvas, renderer, context, stave, false);

	},

	/**
	 * Method prepares pdf export
	 * @function
     * @private
	 */
	prepareExport = function() {
		$('.item').each(function(index) {
			var dimensions = calculateDimensions(this);

			resultImage = resizedataURL(dimensions.canvasImg, dimensions.width, dimensions.height, index);
		});

		$exportButton.removeClass('disabled');
	},

	/**
	 * Method to calculate width & height for resizing images (pdf donwload)
	 * @function
     * @private
	 */
	 calculateDimensions = function(ele) {
	 	var itemCanvas = $(ele).find('.canvas')[0];
	 	var canvasImg = itemCanvas.toDataURL("image/jpeg", 1.0);
		width = 700;
		if (itemCanvas.width > 0 || itemCanvas.height > 0) {
			height = (parseFloat(width) * parseFloat(itemCanvas.height)) / parseFloat(itemCanvas.width);
			return { canvasImg: canvasImg, width: width, height: height };
		} else {
			alert("Something went wrong. Try reloading the page.");
		}
	 },


	/**
	 * Method creates images from carousel data
	 * @function
     * @private
	 *
	 * @param {URI}    		datas   		carousel image uri
	 * @param {float}       wantedWidth    	width of the image
	 * @param {float}       wantedHeight    height of the image
	 * @param {int}       	index    		counter
	 */
	resizedataURL = function(datas, wantedWidth, wantedHeight, index) {
        // We create an image to receive the Data URI
        var img = document.createElement('img');

        // When the event "onload" is triggered we can resize the image.
        img.onload = function() {
            // We create a canvas and get its context.
            var can = document.createElement('canvas');

            // We set the dimensions at the wanted size.
            can.width = wantedWidth;
            can.height = wantedHeight;

            // We resize the image with the canvas method drawImage();
            can.getContext('2d').drawImage(img, 0, 0, wantedWidth, wantedHeight);

            var dataURI = can.toDataURL("image/jpeg", 1.0);

            // return dataURI;
            console.log(dataURI);
        	addImageToDOM(index, dataURI);
        };

        // We put the Data URI in the image's src attribute
    	img.src = datas;
    },

	/**
	 * Method adds image to dom
	 * @function
     * @private
	 *
	 * @param {int}    		index   	counter
	 * @param {string}      dataURI    	uri to image data
	 */
    addImageToDOM = function(index, dataURI) {
    	$('#image' + index).val(dataURI);
    },

	/**
	 * Method generates pdf export
	 * @function
     * @private
	 */
	generateExportPdf = function() {
		var doc = new jsPDF();

		// add title page
		doc.setFontSize(36);
		doc.text(15, 30, "SEARCH RESULTS");

		// insert pattern
		doc.setFontSize(14);
		doc.text(15, 70, "for your pattern:");
		var patternImg = patternCanvas.toDataURL("image/jpeg", 1.0);
		doc.addImage(patternImg, "JPEG", 15, 80);

		// insert artist and title
		doc.setFontSize(24);
		doc.text(15, 180, "Artist: " + $artist.text());
		doc.text(15, 200, "Title: " + $title.text());

		doc.setFontSize(14);
		doc.text(15, 240, "created with MusicXMLAnalyzer");
		doc.text(15, 250, "http://musicxmlanalyzer.de");

		var pageHeader = $artist.text() + " - " + $title.text();

		// add page for each result
		$('.item').each(function(index) {
			doc.addPage();
			var pageNumber = "" + (index + 2);

			// insert page number
			doc.setFontSize(10);
			doc.text(15, 20, pageHeader);
			doc.text(190, 20, pageNumber);

			// insert facts
			doc.setFontSize(14);
			doc.text(15, 40, $(this).find('.partName').text());
			doc.text(15, 50, $(this).find('.partId').text());
			doc.text(15, 60, $(this).find('.voice').text());
			doc.text(15, 70, $(this).find('.key').text());
			doc.text(15, 80, $(this).find('.measures').text());

			// insert result extract
			var resultimg = $(this).find('.image').val();

			try {
				doc.addImage(resultimg, "JPEG", 15, 100);
			} catch (e) {
				alert("An error occured generating the pdf");
				console.error(e);
				return false;
			}
		});

		// save doc
		doc.save("search_results.pdf");
	},

	/**
	 * Method renders pattern canvas above result carousel
	 * @function
     * @private
	 *
	 * @param {object}    	pattern   user created pattern
	 */
	initPatternCanvas = function(pattern) {
		patternCanvas = document.getElementById('patternCanvas');

		var vexflowNotes = generateVexflowNotes({ measures: [{ notes: pattern.notes }], type: pattern.type }, false);
		var renderer = new Vex.Flow.Renderer(patternCanvas, Vex.Flow.Renderer.Backends.CANVAS);
		var context = renderer.getContext();
		var stave = new Vex.Flow.Stave(10, 0, 700);

		renderNotes(vexflowNotes, patternCanvas, renderer, context, stave, true);
	},

	/**
	 * Method renders result extract
	 * @function
     * @private
	 *
	 * @param {array}    		measures    array containing the measures of result extract
	 * @param {object}     		canvas      the canvas proportions
	 * @param {canvas}     		context     the canvas context
	 * @param {object}     		pattern     the user pattern
	 */
	renderNotes = function(measures, canvas, renderer, context, stave, pattern) {

		// clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.fillStyle = '#EEEEEE';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = '#000000';

		var voice = new Vex.Flow.Voice({
		    num_beats: 4,
		    beat_value: 4,
		    resolution: Vex.Flow.RESOLUTION
		});

		// disable strict timing
		voice.setStrict(false);

		var tieStart = null;
		var tieStop = null;
		var ties = [];
		for (var i = 0; i < measures.length; i++) {
			// calculate x & y coordinates and width of the current measure
			var x, y, width;
			width = 480;
			height = 180;
			padding = 5;
			if (i%2 === 0) {
				x = padding;
				y = i * (height / 2);
			} else {
				x = padding + width;
				y = (i - 1) * (height / 2);
			}

			if (pattern) {
				width = 690;
				height = 120;
			}
			// Add offset from top to center vertical
			y += 25;

			staveBar = new Vex.Flow.Stave(x, y, width);	// generate new stave for measure

			if (i%2 === 0) {
				if (pattern && measures[i].pattern.type === 1) {
					staveBar.addClef("percussion");
				} else {
					staveBar.addClef("treble");	// add clef to every measure starting in a new line
				}
			}
			if (measures[i].time_signature) {
				staveBar.addTimeSignature(measures[i].time_signature);	// add time signature if changed
			}
			if (i > 0 && i < measures.length-1) {
				staveBar.setBegBarType(Vex.Flow.Barline.type.SINGLE);	// set measure bar line
			}
			if (i === measures.length-1) {
				staveBar.setEndBarType(Vex.Flow.Barline.type.END);	// set double measure bar line at last measure
			}

			// creating ties between notes
			for (var j = 0; j < measures[i].notes.length; j++) {

				// ties
				if (measures[i].ties) {
					if (measures[i].ties[j] !== false && measures[i].ties[j] !== undefined) {
						if (measures[i].ties[j].indexOf("stop") > -1) {
							tieStop = measures[i].notes[j];
							if (tieStart !== null) {
								var tie = new Vex.Flow.StaveTie({ first_note: tieStart, last_note: tieStop, first_indices: [0], last_indices: [0] });
								ties.push(tie);
								tieStart = null;
								tieStop = null;
							}
						}
						if (measures[i].ties[j].indexOf("start") > -1) {
							tieStart = measures[i].notes[j];
						}
					}
				}
			}

			// tuplets
			var tuplets = [];
			for (var j = 0; j < measures[i].notes.length; j++) {
				if (measures[i].tuplets && measures[i].tuplets[j]) {
					if (measures[i].tuplets[j].toString() !== 'false' && measures[i].tuplets[j].toString() !== 'undefined') {
						var tupletNotes = measures[i].notes.slice(j, (j + parseInt(measures[i].tuplets[j])));
						var tupletLocation = tupletNotes[0].stem.stem_direction;
						var tuplet = new Vex.Flow.Tuplet(tupletNotes);
						tuplet.setTupletLocation(tupletLocation);
						tuplets.push(tuplet);
						j = (j + parseInt(measures[i].tuplets[j])-1);
					}
				}
			}

			// draw measure bar line
			staveBar.setContext(context).draw();

			// draw measure with notes
			var beams = Vex.Flow.Beam.generateBeams(measures[i].notes);
			Vex.Flow.Formatter.FormatAndDraw(context, staveBar, measures[i].notes);
			beams.forEach(function(beam) {
				beam.setContext(context).draw();
			});

			// draw tuplets
			for (var t = 0; t < tuplets.length; t++) {
				tuplets[t].setContext(context).draw();
			}
		}

		for (var t2 = 0; t2 < ties.length; t2++) {
			ties[t2].setContext(context).draw();
		}
	},

	/**
	 * Method generates vexflow notes
	 * @function
     * @private
	 *
	 * @param {object}     		pattern     the user pattern
	 * @param {object}     		result      search result
	 */
	generateVexflowNotes = function(pattern, result) {
		// prepare pattern if no result from ResultController.php
		if (!result) {
			for (var i = 0; i < pattern.measures.length; i++) {
				for (var j = 0; j < pattern.measures[i].notes.length; j++) {
					if (pattern.measures[i].notes[j].pitch && pattern.measures[i].notes[j].pitch.beam) {
						pattern.measures[i].notes[j].pitch.tuplet = "3";
					} else if(pattern.measures[i].notes[j].pitch) {
						pattern.measures[i].notes[j].pitch.tuplet = false;
					}
				}
			}
		}


		var measures = [];

		switch (pattern.type) {
			case 0:
				// sound sequence
				for (var i = 0; i < pattern.measures.length; i++) {	// iterate over measures in result
					var notes = [];	//creating notes array for notes in current measure
					var time_signature = pattern.measures[i].time_signature;
					for (var j = 0; j < pattern.measures[i].notes.length; j++) {	// iterate over all notes in current measure
						var step = pattern.measures[i].notes[j].pitch.step;	// determine the step
						var octave = pattern.measures[i].notes[j].pitch.octave;	// determine the octave
						var alter = pattern.measures[i].notes[j].pitch.alter;	// determine the alter
						var keys = [getVexflowKey(step, octave, alter )];	// generating key in vexflow format

						var note = new Vex.Flow.StaveNote({ keys: keys, duration: "q", auto_stem: true });

						if (alter == -1) {	// if accidental should be "b"
							note.addAccidental(0, new Vex.Flow.Accidental("b"));	// add "b"
						} else if (alter == 1) {	// if accidental should be "#"
							note.addAccidental(0, new Vex.Flow.Accidental("#"));	// add "#"
						}

						notes.push(note);
					}
					measures.push({ notes: notes, time_signature: time_signature, pattern: pattern });	// push note to array
				}
				break;

			case 1:
				// rhythm
				for (var i = 0; i < pattern.measures.length; i++) {
					var notes = [];
					var tuplets = [];
					var time_signature = pattern.measures[i].time_signature;
					for (var j = 0; j < pattern.measures[i].notes.length; j++) {

						// set color of current note
						var note;
						if (pattern.measures[i].notes[j].type === "note") {
							// determine note variables
							var type = pattern.measures[i].notes[j].pitch.type;
							if (type === "whole" || type === "half") {
								var keys = ["b/4/d0"];
							} else {
								var keys = ["b/4/d2"];
							}

							var tuplet = false;
							if (pattern.measures[i].notes[j].pitch.beam) {
								var beam = pattern.measures[i].notes[j].pitch.beam;
								if (beam === "begin" || beam === "continue" || beam === "end") {
									tuplet = "3";
								}
							}

							var durationType = 0;
							if (pattern.measures[i].notes[j].pitch.dot) {
								durationType = 2;
							}
							var noteDuration = getVexflowDuration(type, durationType);

							note = new Vex.Flow.StaveNote({ keys: keys, duration: noteDuration, auto_stem: true });

							if (pattern.measures[i].notes[j].pitch.dot) {
								note.addDotToAll();
							}

							tuplets[j] = tuplet;
							notes.push(note);
						} else if (pattern.measures[i].notes[j].type === "rest") {
							var durationType = 1; // rests type is 1
							var noteDuration = getVexflowDuration(pattern.measures[i].notes[j].duration, durationType);

							note = new Vex.Flow.StaveNote({ keys: ["b/4"], duration: noteDuration });

							if (pattern.measures[i].notes[j].dot) {
								note.addDotToAll();
							}

							tuplets[j] = [false];
							notes.push(note);
						}
					}
					measures.push({ notes: notes, tuplets: tuplets, time_signature: time_signature, pattern: pattern });
				}
				break;

			case 2:
				// melody
				for (var i = 0; i < pattern.measures.length; i++) {
					var notes = [];
					noteCounter = 0;
					// var beams = [];
					var ties = [];
					var tuplets = [];
					var time_signature = pattern.measures[i].time_signature;
					if (pattern.measures[i].notes) {
						for (var j = 0; j < pattern.measures[i].notes.length; j++) {

							// set color of current note
							var color = pattern.measures[i].notes[j].color;

							var note;
							if (pattern.measures[i].notes[j].type === "note") {
								if (!pattern.measures[i].notes[j].pitch.chord) {
									// determine note variables
									var step = pattern.measures[i].notes[j].pitch.step;
									var octave = pattern.measures[i].notes[j].pitch.octave;
									var alter = pattern.measures[i].notes[j].pitch.alter;
									var keys = [getVexflowKey(step, octave, alter )];

									var noteTies = [false];
									if (pattern.measures[i].notes[j].pitch.ties) {
										noteTies = pattern.measures[i].notes[j].pitch.ties;
									}

									var tuplet = false;
									if (pattern.measures[i].notes[j].pitch.tuplet) {
										tuplet = pattern.measures[i].notes[j].pitch.tuplet;
									}

									var type = pattern.measures[i].notes[j].pitch.type;
									var durationType = 0;
									if (pattern.measures[i].notes[j].pitch.dot) {
										durationType = 2;
									}
									var noteDuration = getVexflowDuration(type, durationType);

									note = new Vex.Flow.StaveNote({ keys: keys, duration: noteDuration, auto_stem: true });
									note.color = color;
									note = checkNextNotes(pattern, note, i, j);
									switch (alter) {
										case -2: note.addAccidental(0, new Vex.Flow.Accidental("bb")); break;
										case -1: note.addAccidental(0, new Vex.Flow.Accidental("b")); break;
										case 1: note.addAccidental(0, new Vex.Flow.Accidental("#")); break;
										case 2: note.addAccidental(0, new Vex.Flow.Accidental("#")); break;
									}

									if (pattern.measures[i].notes[j].pitch.dot) {
										note.addDotToAll();
									}

									ties[noteCounter] = noteTies;
									tuplets[noteCounter] = tuplet;
									notes.push(note);
									noteCounter++;
								}
							} else if (pattern.measures[i].notes[j].type === "rest") {
								var durationType = 1; // rests type is 1
								var noteDuration = getVexflowDuration(pattern.measures[i].notes[j].duration, durationType);

								note = new Vex.Flow.StaveNote({ keys: ["b/4"], duration: noteDuration });
								note.color = color;

								if (pattern.measures[i].notes[j].dot) {
									note.addDotToAll();
								}

								ties[noteCounter] = [false];
								notes.push(note);
								noteCounter++;
							} else if (pattern.measures[i].notes[j].type === "unpitched") {
								var step = pattern.measures[i].notes[j].pitch.step;
								var octave = pattern.measures[i].notes[j].pitch.octave;
								var alter = pattern.measures[i].notes[j].pitch.alter;
								var keys = [getVexflowKey(step, octave, alter ) + "/d2"];

								var noteTies = [false];
								if (pattern.measures[i].notes[j].pitch.ties) {
									noteTies = pattern.measures[i].notes[j].pitch.ties;
								}

								var type = pattern.measures[i].notes[j].pitch.type;
								var durationType = 0;
								if (pattern.measures[i].notes[j].pitch.dot) {
									durationType = 2;
								}
								var noteDuration = getVexflowDuration(type, durationType);
								note = new Vex.Flow.StaveNote({ keys: keys, duration: noteDuration, auto_stem: true});
								note.color = color;
								note = checkNextNotes(pattern, note, i, j);

								if (pattern.measures[i].notes[j].pitch.dot) {
									note.addDotToAll();
								}

								ties[noteCounter] = noteTies;
								notes.push(note);
								noteCounter++;
							}
						}
					}
					measures.push({ notes: notes, ties: ties, tuplets: tuplets, time_signature: time_signature, pattern: pattern });
				}
				break;
		}
		return measures;
	},

	/**
	 * Method checks if the following note belongs to current chord
	 * Also handles highlighting of chords in results
	 * @function
     * @private
	 *
	 * @param {object}    		pattern    array containing notes
	 * @param {Vex.Flow.Note}   note       the current vexflow note
	 * @param {int}     		i  		   counter of the current measure
	 * @param {int}     		j     	   counter of the current note
	 *
	 * @return {Vex.Flow.Note} 	Returns a vexflow compatible note object
	 */
	checkNextNotes = function(pattern, note, i, j) {
		j++;
		var newNote = note;
		var newKeys = note.keys;
		if (pattern.measures[i].notes[j]) {
			if (pattern.measures[i].notes[j].pitch) {
				if (pattern.measures[i].notes[j].pitch.chord) {
					var step = pattern.measures[i].notes[j].pitch.step;
					var octave = pattern.measures[i].notes[j].pitch.octave;
					var alter = pattern.measures[i].notes[j].pitch.alter;
					newKeys.push(getVexflowKey(step, octave, alter));
					newNote = null;
					newNote = new Vex.Flow.StaveNote({ keys: newKeys, duration: note.duration, auto_stem: true });
					newNote = checkNextNotes(pattern, newNote, i, j);

					if (pattern.measures[i].notes[j].color == "#b71c1c" || note.color == "#b71c1c") {
						newNote.color = "#b71c1c";
					} else {
						newNote.color = note.color;
					}
				}
			}

		}
		return newNote;
	},


	/**
	 * Method converts duration from string to number values as 1/64
	 * @function
     * @private
	 *
	 * @param {string}    	duration    string of note duration
	 *
	 * @return {number}     duration value as number
	 *
	 */
	getDurationIn64th = function(duration) {
		switch (duration) {
			case "whole":
				return 64; break;
			case "half":
				return 32; break;
			case "quarter":
				return 16; break;
			case "eighth":
				return 8; break;
			case "16th":
				return 4; break;
			case "32nd":
				return 2; break;
			case "64th":
				return 1; break;
			default:
				return 0; break;
		}
	},

	/**
	 * Method returns the note duration in vexflow style
	 * @function
     * @private
	 *
	 * @param {string}    		duration    duration of note
	 * @param {number}     		type      	type of note (0 = note, 1 = rest, 2 = dotted note)
	 *
	 * @return {string}         duration for vexflow
	 */
	getVexflowDuration = function(duration, type) {
		switch (duration) {
			case "whole":
				switch (type) {
					case 0: return "w"; break;		// 0 is normal note
					case 1: return "wr"; break;		// 1 is a rest
					case 2: return "wd"; break;		// 2 is a dotted note
				}
				break;
			case "half":
				switch (type) {
					case 0: return "h"; break;
					case 1: return "hr"; break;
					case 2: return "hd"; break;
				}
				break;
			case "quarter":
				switch (type) {
					case 0: return "q"; break;
					case 1: return "qr"; break;
					case 2: return "qd"; break;
				}
				break;
			case "eighth":
				switch (type) {
					case 0: return "8"; break;
					case 1: return "8r"; break;
					case 2: return "8d"; break;
				}
				break;
			case "16th":
				switch (type) {
					case 0: return "16"; break;
					case 1: return "16r"; break;
					case 2: return "16d"; break;
				}
				break;
			case "32nd":
				switch (type) {
					case 0: return "32"; break;
					case 1: return "32r"; break;
					case 2: return "32d"; break;
				}
				break;
			case "64th":
				switch (type) {
					case 0: return "64"; break;
					case 1: return "64r"; break;
					case 2: return "64d"; break;
				}
				break;
			default:
				switch (type) {
					case 0: return "128"; break;
					case 1: return "128r"; break;
					case 2: return "128d"; break;
				}
				break;
		}
	},

	/**
	 * Method returns key description for vexflow
	 * @function
     * @private
	 *
	 * @param {string}    step    	note name
	 * @param {string}    octave    octave number
	 * @param {string}    alter     accidential of the note
	 *
	 * @return {string}   key description for vexflow
	 */
	getVexflowKey = function(step, octave, alter) {
		key = step.toLowerCase();
		switch (alter) {
			case -2:
				key += "bb"; break;
			case -1:
				key += "b"; break;
			case 1:
				key += "#"; break;
			case 2:
				key += "##"; break;
			default:
				break;
		}
		key += "/";
		key += octave;
		return key;
	},

	/**
	 * Gets called when a list item has been clicked
	 * @function
     * @private
	 *
	 * @param {Event}    event    the triggered click event
	 *
	 */
	onListItemClick = function(event) {
		initLogMessages();
		addLogMessage("We're preparing your results.");
		window.setTimeout(function() {
			addLogMessage("We're working.");
			window.setTimeout(function() {
				addLogMessage("Please be patient.");
				window.setTimeout(function() {
					addLogMessage("Don't worry we didn't forget you.");
					window.setTimeout(function() {
						addLogMessage("Okay. We're ready soon. We promise.");
						window.setTimeout(function() {
							addLogMessage("Maybe a little coffee?");
						}, 3000);
					}, 3000);
				}, 3000);
			}, 3000);
		}, 3000);

	},

	/**
	 * Inits the log messages
	 * @function
     * @private
	 *
	 */
	initLogMessages = function() {
		resultMessageCounter = 0;
		$logMessages.show();
		$logMessages.animate({
			height: 100
		}, 500);
	},

	/**
	 * Disposes log messages
	 * @function
     * @private
	 *
	 */
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
		}, 100);
	},

	/**
	 * Adds a log message
	 * @function
     * @private
	 *
	 * @param {string}    msg    log message
	 *
	 */
	addLogMessage = function(msg) {
		$('#log' + (resultMessageCounter - 3)).animate({
			"marginTop": "-30px"
		}, 200);
		$logMessages.append('<div id="log' + resultMessageCounter + '"></div>');
		$('#log' + resultMessageCounter).typed({
			strings: ['<p>' + msg + '</p>'],
			backDelay: 100000000000000,
			typeSpeed: 0,
			backSpeed: 0,
			loop: true,
		});
		resultMessageCounter++;
	};

	that.init = init;
	that.renderResultExtract = renderResultExtract;
	that.setModelReady = setModelReady;

	return that;
}