@extends('layout.main')

@section('content')


{{ Form::hidden('pattern', json_encode(Cache::get('pattern')[0]), array('id' => 'patternValue')) }}

<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<h1 class="text-center">Search results</h1>
			<h4 class="text-center">for your pattern</h4>
			<canvas id="patternCanvas" width="700" height="180"></canvas>
		</div>
	</div>

	<?php $results = Cache::get('results'); ?>
	@if (count($results))
	<div class="thead">
		<div class="row">
			<div class="col-xs-7 col-sm-10 text-left">
				<h3>Artist - Title (Filename)</h3>
			</div>
			<div class="col-xs-5 col-sm-2 text-right">
				<h3>Occurences</h3>
			</div>
		</div>
	</div>
	<div class="tbody">
			@foreach($results as $result)
				@include('results.item', array('result' => $result))
			@endforeach
	</div>
	@else
		<p class="no-results text-center">No results found for your pattern!</p>
	@endif

</div>

@stop