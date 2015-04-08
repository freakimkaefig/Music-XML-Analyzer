@extends('layout.main')
@section('content')

<div class="row text-center">
	<div class="col-xs-12 marbo30">
		<center><h4 class="no-margin">Choose Mode: </h4></center>
		<div class="btn-group" data-toggle="buttons">
			<label title="Create a melodic pattern." id="melody-mode-2" class="btn btn-mode btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
				<input type="radio" value=":melody">melody
			</label>
			<label title="Create a sound sequence pattern." id="sound-sequence-mode-0" class="btn btn-mode btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
				<input type="radio" value=":sound sequence">sound sequence
			</label>
			<label title="Create a rhythm pattern." id="rhythm-mode-1" class="btn btn-mode btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
				<input type="radio" value=":rhythm">rhythm
			</label>
		</div>
	</div>
</div>

<div class="row text-center">
	<div class="col-xs-12">
		<button title="Start playing the pattern." id="playPattern" type="submit" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-play"></span> <span>Play</span></button>
		<button title="Stop playing the pattern." id="stopPattern" type="submit" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-stop"></span> <span>Stop</span></button>
	</div>
</div>

<!-- HINT: if there is a column arround you get problems with mouse x and y-->
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
			<p class="no-margin">Special Ryth: </p>
			<div class="btn-group" data-toggle="buttons">
				<label title="NONE: Enter standard notes or breaks according to selected mode." id="spec-none" class="btn btn-special-ryth btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":none">None
                </label>
                <label title="TRIPLET: Once started you have to create three notes for a complete triplet. Pressing delete will remove the entire triplet." id="spec-triplet" class="btn btn-special-ryth btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":triplet">Triplet
				</label>
				<label title="DOTTED: When active, notes and breaks will be dotted." id="spec-dotted" class="btn btn-special-ryth btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":dotted">Dotted
				</label>
			</div>
		</div>
		<div class="col-xs-4">
            <p class="no-margin">Octave: </p>
            <div title="Choose the octave to create notes by button click or place notes directly on the stave via mouse." class="btn-group" data-toggle="buttons">
                <label id="3" class="btn btn-octave btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":3">3
                </label>
                <label id="4" class="btn btn-octave btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":4">4
                </label>
                <label id="5" class="btn btn-octave btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":5">5
                </label>
                <label id="6" class="btn btn-octave btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":6">6
                </label>
            </div>
		</div>
	</div>

	<div class="row marbo20">
		<div id="noteOrBreak" class="col-xs-8">
			<p class="no-margin">Notes/Breaks: </p>
			<div title="Select notes ranging from 'C' to 'B' or select 'REST' to create the corresponding element." class="btn-group" data-toggle="buttons">
				<label id="c" class="btn btn-note btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":c">C
				</label>
				<label id="d" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":d">D
				</label>
				<label id="e" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":e">E
				</label>
				<label id="f" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":f">F
				</label>
				<label id="g" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":g">G
				</label>
				<label id="a" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":a">A
				</label>
				<label id="b" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":b">B
				</label>
                <label id="break" class="btn btn-note btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":break">Rest
                </label>
			</div>
		</div>
		<div id="rhythmNoteOrBreak" class="col-xs-8">
			<p class="no-margin">Notes/Breaks: </p>
			<div title="In rhythm mode you can only choose between 'NOTE' or 'REST'. Elements will be rendered slightly different. See 'RHYTHM' tooltip for further information." class="btn-group" data-toggle="buttons">
				<label id="rhythmNote" class="btn btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":c">Note
				</label>
				<label id="rhythmBreak" class="btn btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
                    <input type="radio" value=":break">Rest
                </label>
			</div>
		</div>
		<div class="col-xs-4">
			<p class="no-margin">Accidental: </p>
			<div title="If an accidental is selected it will be added to notes you create." class="btn-group" data-toggle="buttons">
				<label id="accidential-none" class="btn btn-accidential btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":none">none
				</label>
				<label id="accidential-#" class="btn btn-accidential btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":#">#
				</label>
				<label id="accidential-b" class="btn btn-accidential btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":b">b
				</label>
			</div>
		</div>
	</div>

	<div class="row marbo20">
		<div class="col-xs-8">
			<p class="no-margin">Duration: </p>
			<div title="Select the desired duration for notes and rests." class="btn-group" data-toggle="buttons">
				<label id="whole" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":whole">1/1
				</label>
				<label id="half" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":half">1/2
				</label>
				<label id="quarter" class="btn btn-duration btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":quarter">1/4
				</label>
				<label id="eighth" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":eighth">1/8
				</label>
				<label id="16th" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":16th">1/16
				</label>
				<label id="32nd" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":32nd">1/32
				</label>
				<label id="64th" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":64th">1/64
				</label>
			</div>
		</div>
	</div>

	<div class="row">
        <div class="col-xs-3">
            <button title="Add your configured element (according to highlighted selection) to the stave above. " id="btn-add-note" type="button" class="btn btn-material-green-400">Add</button>
            <button title="Removes the last element." id="btn-remove-note" type="button" class="btn btn-material-red-400">Delete</button>
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