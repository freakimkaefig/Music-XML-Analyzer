@extends('layout.main')

@section('content')

<div class="row">

		<canvas id="myCanvas" width="600" height="200" style="border:1px solid #000000;">
		</canvas>
</div>
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
		<button type="button" class="btn btn-default btn-duration">none</button>
		<button type="button" class="btn btn-default btn-duration">sharp</button>
		<button type="button" class="btn btn-default btn-duration">flat</button>
	</div>
	<div class="col-xs-6">
		<p></p>
		<p>Clef: </p>
		<button type="button" class="btn btn-default btn-clef">F</button>
		<button type="button" class="btn btn-default btn-clef">G</button>
	</div>
</div>

<div class="row">
	<div class="col-xs-12">
		<p></p>
		<button type="button" class="btn btn-default btn-interaction">Delete</button>
		<button type="button" class="btn btn-default btn-interaction">Add</button>
	</div>
</div>

@stop