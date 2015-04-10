@extends('layout.main')
@section('content')

<div class="row text-center">
	<div class="col-xs-12 marbo30">
		<center><h4 class="no-margin">Choose Mode: </h4></center>
		<div class="btn-group" data-toggle="buttons">
			<label title="Create a melodiy pattern." id="melody-mode-2" onclick="ga('send', 'event', { eventCategory: 'Mode Melody', eventAction: 'Click' })" class="btn btn-mode btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
				<input type="radio" value=":melody">melody
			</label>
			<label title="Create a sound sequence pattern." id="sound-sequence-mode-0" onclick="ga('send', 'event', { eventCategory: 'Mode Sound Sequence', eventAction: 'Click' })" class="btn btn-mode btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
				<input type="radio" value=":sound sequence">sound sequence
			</label>
			<label title="Create a rhythm pattern." id="rhythm-mode-1" onclick="ga('send', 'event', { eventCategory: 'Mode Rhythm', eventAction: 'Click' })" class="btn btn-mode btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
				<input type="radio" value=":rhythm">rhythm
			</label>
		</div>
	</div>
</div>

<div class="row text-center">
	<div class="col-xs-12">
		<button title="Start playing the pattern." id="playPattern" onclick="ga('send', 'event', { eventCategory: 'Play Pattern', eventAction: 'Click' })" type="submit" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-play"></span> <span>Play</span></button>
		<button title="Stop playing the pattern." id="stopPattern" onclick="ga('send', 'event', { eventCategory: 'Stop Pattern', eventAction: 'Click' })" type="submit" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-stop"></span> <span>Stop</span></button>
	</div>
</div>

<canvas class="center-block" id="myCanvas" width="720" height="180" style="border:1px solid #000000; margin:auto"></canvas>

<div class="row text-center">
	<div class="col-xs-6 col-xs-offset-3 marbo20 marto10">
		<h5><strong><u>Hint:</u></strong> Search for patterns in your uploaded files. You can create your patterns directly by clicking on the above stave or by using the buttons below. <br><strong>Patterns must contain min. 2 notes, max. 12 notes.</strong></h5>
	</div>
</div>

{{ Form::open(array('route' => 'patternSearch')) }}
{{ Form::hidden('pattern', '', array('id' => 'patternValue')) }}

<div class="container">
	<div class="row marbo20">
		<div class="col-xs-8">
			<p class="no-margin">Special Rhythm: </p>
			<div class="btn-group" data-toggle="buttons">
				<label title="NONE: Enter standard notes or breaks according to selected mode." id="spec-none" onclick="ga('send', 'event', { eventCategory: 'Special Rhythm: None', eventAction: 'Click' })" class="btn btn-special-ryth btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":none">None
                </label>
                <label title="TRIPLET: Once started you have to create three notes for a complete triplet. Pressing delete will remove the entire triplet." id="spec-triplet" onclick="ga('send', 'event', { eventCategory: 'Special Rhythm: Triplet', eventAction: 'Click' })" class="btn btn-special-ryth btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":triplet">Triplet
				</label>
				<label title="DOTTED: When active, notes and breaks will be dotted." id="spec-dotted" onclick="ga('send', 'event', { eventCategory: 'Special Rhythm: Dotted', eventAction: 'Click' })" class="btn btn-special-ryth btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":dotted">Dotted
				</label>
			</div>
		</div>

		<div class="col-xs-4">
            <p class="no-margin">Octave: </p>
            <div title="Choose the octave to create notes by button click or place notes directly on the stave via mouse." class="btn-group" data-toggle="buttons">
                <label id="3" onclick="ga('send', 'event', { eventCategory: 'Octave: 3', eventAction: 'Click' })" class="btn btn-octave btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":3">3
                </label>
                <label id="4" onclick="ga('send', 'event', { eventCategory: 'Octave: 4', eventAction: 'Click' })" class="btn btn-octave btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":4">4
                </label>
                <label id="5" onclick="ga('send', 'event', { eventCategory: 'Octave: 5', eventAction: 'Click' })" class="btn btn-octave btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":5">5
                </label>
                <label id="6" onclick="ga('send', 'event', { eventCategory: 'Octave: 6', eventAction: 'Click' })" class="btn btn-octave btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":6">6
                </label>
            </div>
		</div>
	</div>

	<div class="row marbo20">
		<div id="noteOrBreak" class="col-xs-8">
			<p class="no-margin">Notes/Breaks: </p>
			<div title="Select notes ranging from 'C' to 'B' or select 'REST' to create the corresponding element." class="btn-group" data-toggle="buttons">
				<label id="c" onclick="ga('send', 'event', { eventCategory: 'Note: C', eventAction: 'Click' })" class="btn btn-note btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":c">C
				</label>
				<label id="d" onclick="ga('send', 'event', { eventCategory: 'Note: D', eventAction: 'Click' })" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":d">D
				</label>
				<label id="e" onclick="ga('send', 'event', { eventCategory: 'Note: E', eventAction: 'Click' })" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":e">E
				</label>
				<label id="f" onclick="ga('send', 'event', { eventCategory: 'Note: F', eventAction: 'Click' })" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":f">F
				</label>
				<label id="g" onclick="ga('send', 'event', { eventCategory: 'Note: G', eventAction: 'Click' })" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":g">G
				</label>
				<label id="a" onclick="ga('send', 'event', { eventCategory: 'Note: A', eventAction: 'Click' })" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":a">A
				</label>
				<label id="b" onclick="ga('send', 'event', { eventCategory: 'Note: B', eventAction: 'Click' })" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":b">B
				</label>
                <label id="break" onclick="ga('send', 'event', { eventCategory: 'Note: Break', eventAction: 'Click' })" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":break">Rest
                </label>
			</div>
		</div>

		<div id="rhythmNoteOrBreak" class="col-xs-8">
			<p class="no-margin">Notes/Breaks: </p>
			<div title="In rhythm mode you can only choose between 'NOTE' or 'REST'. Elements will be rendered slightly different. See 'RHYTHM' tooltip for further information." class="btn-group" data-toggle="buttons">
				<label id="rhythmNote" onclick="ga('send', 'event', { eventCategory: 'Note: Note', eventAction: 'Click' })" class="btn btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":c">Note
				</label>
				<label id="rhythmBreak" onclick="ga('send', 'event', { eventCategory: 'Note: Rest', eventAction: 'Click' })" class="btn btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":break">Rest
                </label>
			</div>
		</div>

		<div class="col-xs-4">
			<p class="no-margin">Accidental: </p>
			<div title="If an accidental is selected it will be added to notes you create." class="btn-group" data-toggle="buttons">
				<label id="accidential-none" onclick="ga('send', 'event', { eventCategory: 'Accidential: None', eventAction: 'Click' })" class="btn btn-accidential btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":none">none
				</label>
				<label id="accidential-#" onclick="ga('send', 'event', { eventCategory: 'Accidential: #', eventAction: 'Click' })" class="btn btn-accidential btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":#">#
				</label>
				<label id="accidential-b" onclick="ga('send', 'event', { eventCategory: 'Accidential: b', eventAction: 'Click' })" class="btn btn-accidential btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":b">b
				</label>
			</div>
		</div>
	</div>

	<div class="row marbo20">
		<div class="col-xs-8">
			<p class="no-margin">Duration: </p>
			<div title="Select the desired duration for notes and rests." class="btn-group" data-toggle="buttons">
				<label id="whole" onclick="ga('send', 'event', { eventCategory: 'Duration: Whole', eventAction: 'Click' })" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":whole">1/1
				</label>
				<label id="half" onclick="ga('send', 'event', { eventCategory: 'Duration: Half', eventAction: 'Click' })" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":half">1/2
				</label>
				<label id="quarter" onclick="ga('send', 'event', { eventCategory: 'Duration: Quarter', eventAction: 'Click' })" class="btn btn-duration btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":quarter">1/4
				</label>
				<label id="eighth" onclick="ga('send', 'event', { eventCategory: 'Duration: Eighth', eventAction: 'Click' })" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":eighth">1/8
				</label>
				<label id="16th" onclick="ga('send', 'event', { eventCategory: 'Duration: 16th', eventAction: 'Click' })" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":16th">1/16
				</label>
				<label id="32nd" onclick="ga('send', 'event', { eventCategory: 'Duration: 32nd', eventAction: 'Click' })" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":32nd">1/32
				</label>
				<label id="64th" onclick="ga('send', 'event', { eventCategory: 'Duration: 64th', eventAction: 'Click' })" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":64th">1/64
				</label>
			</div>
		</div>
	</div>

	<div class="row">
        <div class="col-xs-3">
            <button title="Add your configured element (according to highlighted selection) to the stave above. " id="btn-add-note" onclick="ga('send', 'event', { eventCategory: 'Add Note', eventAction: 'Click' })" type="button" class="btn btn-material-green-400">Add</button>
            <button title="Removes the last element." id="btn-remove-note" onclick="ga('send', 'event', { eventCategory: 'Remove Note', eventAction: 'Click' })" type="button" class="btn btn-material-red-400">Delete</button>
        </div>

        <div title="What could possibly go wrong?" class="col-xs-4 pull-right">
			{{ Form::submit('Search', array('id' => 'searchPatternButton', 'class' => 'btn btn-success')) }}
			{{ Form::close() }}
		</div>
	</div>

	<div class="row">
		<div class="col-xs-12 col-md-6 col-md-offset-3">
			<div id="searchMessages" class="logBox"></div>
		</div>
	</div>
</div>
@stop