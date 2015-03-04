@extends('layout.main')
@section('content')
<div class="col-xs-12">
	<h1 class="text-center">Create Your Pattern</h1>
</div>
<!-- HINT: if there is a column arround you get problems with mouse x and y-->
<canvas class="center-block" id="myCanvas" width="700" height="120" style="border:1px solid #000000; margin:auto"></canvas>
{{ Form::open(array('route' => 'patternSearch')) }}
{{ Form::hidden('pattern', '', array('id' => 'patternValue')) }}
<div class="container">
	<div class="row row-centered">
		<div class="col-xs-8 col-centered col-min">
			<p>Choose Mode: </p>
			<div class="btn-group" data-toggle="buttons">
				<label id="2" class="btn btn-mode btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":melody">melody
				</label>
				<label id="0" class="btn btn-mode btn-material-blue-grey " data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":sound sequence">sound sequence
				</label>
				<label id="1" class="btn btn-mode btn-material-blue-grey " data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":rhythm">rhythm
				</label>
			</div>
		</div>
		<div class="col-xs-4 col-centered col-min">
			<p></p>
			<p>Special Ryth: </p>
			<div class="btn-group" data-toggle="buttons">
				<label id="Triplet" class="btn btn-special-ryth btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":Triplet">Triplet
				</label>
				<label id="Dotted" class="btn btn-special-ryth btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":Dotted">Dotted
				</label>
				<label id="None" class="btn btn-special-ryth btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":None">None
				</label>
			</div>
		</div>
	</div>
	<div class="row row-centered">
		<div class="col-xs-8 col-centered col-min">
			<p>Notes: </p>
			<div class="btn-group" data-toggle="buttons">
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
			</div>
		</div>
		<div class="col-xs-4 col-centered col-min">
			<p></p>
			<p>Accidential: </p>
			<div class="btn-group" data-toggle="buttons">
				<label id="none" class="btn btn-accidential btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":none">none
				</label>
				<label id="#" class="btn btn-accidential btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":#">#
				</label>
				<label id="b" class="btn btn-accidential btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":b">b
				</label>
			</div>
		</div>
	</div>
	<div class="row row-centered">
		<div class="col-xs-8 col-centered col-min">
			<p></p>
			<p>Duration: </p>
			<div class="btn-group" data-toggle="buttons">
				<label id="whole" class="btn btn-duration btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":whole">1/1
				</label>
				<label id="half" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":half">1/2
				</label>
				<label id="quarter" class="btn btn-duration btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
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
		<div class="col-xs-4 col-centered col-min">
			<p></p>
			<p>Clef: </p>
			<div class="btn-group" data-toggle="buttons">
				<label id="F" class="btn btn-clef btn-material-blue-grey active" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":F">F
				</label>
				<label id="G" class="btn btn-clef btn-material-blue-grey" data-toggle="tooltip" data-placement="top">
					<input type="radio" value=":G">G
				</label>
			</div>
		</div>
	</div>
	<div class="row row-centered">
		<div class="col-xs-2">
			<p>Octave: </p>
			<select id="select-octave" class="form-control btn-material-blue-grey">
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
			</select>
		</div>
	</div>
	<div class="row row-centered">
		<div class="col-xs-12">
			<button id="btn-add-note" type="button" class="btn btn-material-green-400">Add</button>
			<button id="btn-remove-note" type="button" class="btn btn-material-red-400">Delete</button>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			{{ Form::submit('Search', array('class' => 'btn btn-success btn-xxl pull-right')) }}
			{{ Form::close() }}
		</div>
	</div>
</div>
@stop