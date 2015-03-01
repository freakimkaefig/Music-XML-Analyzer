@extends('layout.main')

@section('content')

<div class="row">
	<div class="col-xs-4">
		<h2>Create Your Pattern</h2>
	</div>	
</div>

{{ Form::open(array('route' => 'patternSearch')) }}
{{ Form::hidden('pattern', '', array('id' => 'patternValue')) }}
<div class="row">
	<div class="col-xs-4">
		<p>Choose Mode: </p>
		<button type="button" class="btn btn-default btn-mode">melody</button>
		<button type="button" class="btn btn-default btn-mode">sound sequence</button>
		<button type="button" class="btn btn-default btn-mode">rhythm</button>
		<p></p>
		<p></p>
	</div>
</div>

<!-- HINT: if theres a column arround you get problems with mouse x and y-->
<canvas id="myCanvas" width="700" height="120" style="border:1px solid #000000;">
</canvas>

<div class="row">
	<div class="col-xs-6">
		<p></p>
		<p>Notes: </p>
		<button type="button" class="btn btn-default btn-note">c</button>
		<button type="button" class="btn btn-default btn-note">d</button>
		<button type="button" class="btn btn-default btn-note">e</button>
		<button type="button" class="btn btn-default btn-note">f</button>
		<button type="button" class="btn btn-default btn-note">g</button>
		<button type="button" class="btn btn-default btn-note">a</button>
		<button type="button" class="btn btn-default btn-note">b</button>
		<button type="button" class="btn btn-default btn-note">break</button>
	</div>
	<div class="col-xs-6">
		<p></p>
		<p>Accidential: </p>
		<button type="button" class="btn btn-default btn-accidential">none</button>
		<button type="button" class="btn btn-default btn-accidential">#</button>
		<button type="button" class="btn btn-default btn-accidential">b</button>
	</div>
</div>

<div class="row">
	<div class="col-xs-6">
		<p></p>
		<p>Duration: </p>
		<button type="button" class="btn btn-default btn-duration">whole</button>
		<button type="button" class="btn btn-default btn-duration">half</button>
		<button type="button" class="btn btn-default btn-duration">quarter</button>
		<button type="button" class="btn btn-default btn-duration">eighth</button>
		<button type="button" class="btn btn-default btn-duration">16th</button>
		<button type="button" class="btn btn-default btn-duration">32nd</button>
		<button type="button" class="btn btn-default btn-duration">64th</button>
	</div>
	<div class="col-xs-6">
		<p></p>
		<p>Clef: </p>
		<button type="button" class="btn btn-default btn-clef">F</button>
		<button type="button" class="btn btn-default btn-clef">G</button>
	</div>
</div>
<div class="row">
	<div class="col-xs-6">
		<p></p>
		<p>Special Ryth: </p>
		<button type="button" class="btn btn-default btn-special-ryth">Triplet</button>
		<button type="button" class="btn btn-default btn-special-ryth">Dotted</button>
		<button type="button" class="btn btn-default btn-special-ryth">None</button>
	</div>
	<div class="col-xs-2">
		<p></p>
		<p>Octave: </p>
	    <select id="select-octave" class="form-control">
		  <option>2</option>
		  <option>3</option>
		  <option>4</option>
		  <option>5</option>
		  <option>6</option>
		</select>
	</div>
</div>
<div class="row">
	<div class="col-xs-6">
		<p></p>
		<p>Controlls: </p>
		<button id="btn-add-note" type="button" class="btn btn-default btn-success">Add</button>
		<button id="btn-remove-note" type="button" class="btn btn-default btn-danger">Delete</button>
	</div>
</div>
<!-- oktave missing -->

{{ Form::submit('Search') }}
{{ Form::close() }}

@stop