MusicXMLAnalyzer.NotationView = function(){

	var that = {},
	staveElements = [],
	noteElements = [],
	context = null,
	elem = null,
	elemLeft = null,
	elemTop = null,

	init = function() {
		console.log("notation view");
		initCanvas();
		//initVexCanvas();
		addStaveElements();
		renderStaveElements();
		addOnStaveClickListener();
	},

	initCanvas = function() {
		elem = document.getElementById('myCanvas');
	    elemLeft = elem.offsetLeft;
	    elemTop = elem.offsetTop;

	    context = elem.getContext('2d');
	},

	addStaveElements = function() {

		for(var i = 1; i <= 5; i++) {
			
			staveElements.push({
			    staveId: i,
			    colour: '#000000',
			    width: elem.width,
			    height: 3,
			    top: 20 * i,
			    left: 0
			});	
		}
		
	},

	renderStaveElements = function() {
		staveElements.forEach(function(element) {
		    context.fillStyle = element.colour;
		    context.fillRect(element.left, element.top, element.width, element.height);
		});
	},

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
	
	addOnStaveClickListener = function() {
		elem.addEventListener('click', function(event) {
		    var x = event.pageX - elemLeft,
		        y = event.pageY - elemTop;
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

	calcNotePositionHorizontal = function(mouseX) {
		var staveParts = elem.width / 4;
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