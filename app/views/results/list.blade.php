@extends('layout.main')

@section('content')

<?php var_dump(Cache::get('pattern')); ?>
<?php var_dump(Cache::get('results')); ?>

<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<h1 class="text-center">Search results</h1>
		<br><br>
		<p>Results:</p>
		</div>
	</div>

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
		<?php $results = Cache::get('results'); ?>
		@foreach($results as $result)
			@include('results.item', array('result' => $result))
		@endforeach
	</div>

	<div class="row">
		<div class="col-xs-12">
			<canvas width="700" height="200"></canvas>
		</div>
	</div>
</div>

@stop