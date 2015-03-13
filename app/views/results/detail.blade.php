@extends('layout.main')

@section('content')

<div class="container">
	<div class="row">
		<div class="col-xs-12">
			{{ Form::hidden('pattern', json_encode(Cache::get('pattern')[0]), array('id' => 'patternValue')) }}
			<canvas id="patternCanvas" width="700" height="186"></canvas>
		</div>
	</div>
</div>

<div class="row text-center">
	<div class="col-xs-12">
		<h1>{{ ResultController::_getArtist($result->file_id) }} - {{ ResultController::_getTitle($result->file_id) }}</h1>
	</div>
</div>

<input id="playResult" type="button" value="Play Result"/>
<div id="extract-carousel" class="carousel slide" data-ride="carousel" data-interval="false">

	<!-- Indicators -->
	<ol class="carousel-indicators">
		<?php for ($i = 0; $i < count($resultNotes); $i++): ?>
			<li data-target="#extract-carousel" data-slide-to="<?php echo $i; ?>"<?php if ($i==0) echo ' class="active"'; ?>></li>
		<?php endfor; ?>
	</ol>

	<!-- Wrapper for slides -->
	<div class="carousel-inner" role="listbox">
		<?php for ($i = 0; $i < count($resultNotes); $i++): ?>
			<div class="item<?php if ($i==0) echo ' active'; ?>">
				<div class="facts-list">
					<div class="col-xs-4 col-xs-offset-2">
						<ul class="no-list">
							<li><strong>Part name (Instrument):</strong> {{ $resultNotes[$i]->part_name }}</li>
							<li><strong>Part ID:</strong> {{ $resultNotes[$i]->part_id }}</li>
							<li><strong>Voice:</strong> {{ $resultNotes[$i]->voice }}</li>
							<li><strong>Key:</strong> {{ ResultController::_getKey($result->file_id) }}</li>
						</ul>
					</div>
					<div class="col-xs-4">
						<ul class="no-list">
							<li><strong>Measures:</strong><br>{{ $resultNotes[$i]->startExtract }} - {{ $resultNotes[$i]->endExtract }}</li>
						</ul>
					</div>
				</div>
				<center><canvas id="canvas<?php echo $i; ?>" class="canvas" height="<?php echo round(count($resultNotes[$i]->measures) / 2) * 130; ?>" width="970"></canvas></center>
				{{ Form::hidden('resultNotes' . $i, json_encode($resultNotes[$i]), array('id' => 'notes' . $i, 'class' => 'notes')) }}
			</div>
		<?php endfor; ?>
	</div>

	<!-- Controls -->
	<a class="left carousel-control" href="#extract-carousel" role="button" data-slide="prev">
		<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
		<span class="sr-only">Previous</span>
	</a>
	<a class="right carousel-control" href="#extract-carousel" role="button" data-slide="next">
		<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
		<span class="sr-only">Next</span>
	</a>
</div>

<div class="row">
	<div class="col-xs-12">
		<a href="{{ URL::route('searchResults') }}">&laquo; Back to results</a>
	</div>
</div>

@stop