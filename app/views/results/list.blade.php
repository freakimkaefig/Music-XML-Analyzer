@extends('layout.main')

@section('content')

<div class="row">
	<div class="col-xs-12">
		<h1>Search results</h1>
		<p>Pattern:</p>
		<?php var_dump($pattern); ?>
		<?php var_dump($results); ?>
	</div>
</div>

<div class="row">
	<div class="col-xs-12">
		<canvas width="700" height="200"></canvas>
	</div>
</div>

@stop