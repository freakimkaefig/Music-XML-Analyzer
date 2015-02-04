@extends('layout.main')

@section('content')

<div class="row">
	<h2>Create Your Pattern</h2>
</div>

<canvas id="myCanvas" width="1024" height="200" style="border:1px solid #000000;">
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
		<button type="button" class="btn btn-default btn-note">h</button>
		<button type="button" class="btn btn-default btn-note">break</button>
	</div>
	<div class="col-xs-6">
		<p></p>
		<p>Accidential: </p>
		<button type="button" class="btn btn-default btn-accidential">none</button>
		<button type="button" class="btn btn-default btn-accidential">sharp</button>
		<button type="button" class="btn btn-default btn-accidential">flat</button>
	</div>
</div>

<div class="row">
	<div class="col-xs-6">
		<p></p>
		<p>Duration: </p>
		<button type="button" class="btn btn-default btn-duration">1/1</button>
		<button type="button" class="btn btn-default btn-duration">1/2</button>
		<button type="button" class="btn btn-default btn-duration">1/4</button>
		<button type="button" class="btn btn-default btn-duration">1/8</button>
		<button type="button" class="btn btn-default btn-duration">1/16</button>
		<button type="button" class="btn btn-default btn-duration">1/32</button>
		<button type="button" class="btn btn-default btn-duration">1/64</button>
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
	</div>
	<div class="col-xs-6">
		<p></p>
		<p>Controlls: </p>
		<button id="btn-add-note" type="button" class="btn btn-default">Add</button>
		<button id="btn-remove-note" type="button" class="btn btn-default">Delete</button>
	</div>
</div>
<!-- oktave missing -->

@stop