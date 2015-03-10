@extends('layout.main')

@section('content')


{{ Form::hidden('pattern', json_encode(Cache::get('pattern')[0]), array('id' => 'patternValue')) }}

<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<canvas id="patternCanvas" width="950" height="186"></canvas>
			<h1 class="text-center">Search results</h1>
		</div>
	</div>

	<?php $results = Cache::get('results'); ?>
	@if (count($results))
	<div class="thead">
		<div class="row">
			<div class="col-xs-7 col-sm-10 text-left">
				Artist - Title (Filename)
			</div>
			<div class="col-xs-5 col-sm-2 text-right">
				Occurences
			</div>
		</div>
	</div>
	<hr>
	<div class="tbody">
			@foreach($results as $result)
				@include('results.item', array('result' => $result))
			@endforeach
	</div>
	@else
		<p class="no-results text-center">No results found for your pattern!</p>
	@endif

	<div class="row">
		<div class="col-xs-12">
			<h2>DEBUG</h2>
			<h4>PATTERN</h4>
			<?php
			echo"<pre>";
			var_dump(Cache::get('pattern'));
			echo"</pre>";
			echo "<h4>RESULTS</h4>";
			echo"<pre>";
			var_dump(Cache::get('results'));
			echo"</pre>";
			?>
		</div>
	</div>
</div>

@stop