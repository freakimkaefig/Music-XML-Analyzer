@extends('layout.main')

@section('content')

<div class="container">
{{-- <div class="row text-center">
	<div class="col-xs-12">
		<h3>Your pattern:</h3>
	</div>
</div> --}}
	<div class="row">
		<div class="col-xs-12 text-center">
			<h1>Search results</h1>
			<h4>for your pattern:</h4>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			{{ Form::hidden('pattern', json_encode(Cache::get('pattern')[0]), array('id' => 'patternValue')) }}
			<canvas id="patternCanvas" width="700" height="180"></canvas>
		</div>
	</div>
</div>

<div class="row text-center">
	<div class="col-xs-12">
		<h4>found in:</h4>
		<h2><span id="artist">{{ ResultController::_getArtist($result->file_id) }}</span> - <span id="title">{{ ResultController::_getTitle($result->file_id) }}</span></h2>
	</div>
</div>

{{-- <div class="row marbo20">
	<div class="col-xs-6">
		<button id="playResult" type="button" class="btn btn-lg btn-primary pull-right"><span class="glyphicon glyphicon-play"></span> <span>Play</span></button>
	</div>
	<div class="col-xs-3">
		<button id="stopResult" type="button" class="btn btn-lg btn-primary"><span class="glyphicon glyphicon-stop"></span> <span>Stop</span></button>
	</div>
	<div class="col-xs-3">
		<button id="exportButton" type="button" class="btn btn-lg btn-success pull-right"><span class="glyphicon glyphicon-file"></span> <span>Export as PDF</span></button>
	</div>
</div> --}}

<div id="extract-carousel" class="carousel slide" data-ride="carousel" data-interval="false">
	
	<!-- Wrapper for slides -->
	<div class="carousel-inner" role="listbox">
		<?php for ($i = 0; $i < count($resultNotes); $i++): ?>
			<div class="item<?php if ($i==0) echo ' active'; ?>">
				<div class="facts-list martop30">
					<div class="col-xs-1 col-xs-offset-1">
						<button id="playResult" type="button" class="playResult btn btn-lg btn-primary"><span class="glyphicon glyphicon-play"></span> <span>Play</span></button>
						<button id="stopResult" type="button" class="stopResult btn btn-lg btn-primary"><span class="glyphicon glyphicon-stop"></span> <span>Stop</span></button>
					</div>
					<div class="col-xs-2 col-xs-offset-1 martop40">
						<h4>About the finding:</h4>
					</div>
					<div class="col-xs-3 martop40">
						<ul class="no-list">
							<li class="partName"><strong>Part name (Instrument):</strong> {{ $resultNotes[$i]->part_name }}</li>
							<li class="partId"><strong>Part ID:</strong> {{ $resultNotes[$i]->part_id }}</li>
							<li class="voice"><strong>Voice:</strong> {{ $resultNotes[$i]->voice }}</li>
						</ul>
					</div>
					<div class="col-xs-3 martop40">
						<ul class="no-list">
							<li class="key"><strong>Key:</strong> {{ ResultController::_getKey($result->file_id) }}</li>
							<li class="measures"><strong>Measures: </strong>{{ $resultNotes[$i]->startExtract }} - {{ $resultNotes[$i]->endExtract }}</li>
						</ul>
					</div>
					<div class="col-xs-1 pull-right martop40">
						<button id="exportButton" type="button" class="btn btn-lg btn-success pull-right"><span class="glyphicon glyphicon-file"></span> <span>Export as PDF</span></button>
					</div>
				</div>
				<center><canvas id="canvas<?php echo $i; ?>" class="canvas" height="<?php echo round(count($resultNotes[$i]->measures) / 2) * 190; ?>" width="970"></canvas></center>
				{{ Form::hidden('resultNotes' . $i, json_encode($resultNotes[$i]), array('id' => 'notes' . $i, 'class' => 'notes')) }}
				{{ Form::hidden('base64Image' . $i, "", array('id' => 'image' . $i, 'class' => 'image')) }}
			</div>
		<?php endfor; ?>
	</div>

	<div class="carousel-controls">
		<!-- Control -->
		{{-- <a class="left carousel-control" href="#extract-carousel" role="button" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a> --}}
		
		<!-- Indicators -->
		<ol class="carousel-indicators">
			<?php for ($i = 0; $i < count($resultNotes); $i++): ?>
				<li data-target="#extract-carousel" data-slide-to="<?php echo $i; ?>"<?php if ($i==0) echo ' class="active"'; ?>></li>
			<?php endfor; ?>
		</ol>

		<!-- Control -->
		<a class="left carousel-control" href="#extract-carousel" role="button" data-slide="prev">
	        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
	        <span class="sr-only">Previous</span>
	    </a>
		<a class="right carousel-control" href="#extract-carousel" role="button" data-slide="next">
	        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
	        <span class="sr-only">Next</span>
	    </a>
		{{-- <a class="right carousel-control" href="#extract-carousel" role="button" data-slide="next">
			<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a> --}}
	</div>

	
</div>

<div class="row">
	<div class="col-xs-12">
		<a href="{{ URL::route('searchResults') }}">&laquo; Back to results</a>
	</div>
</div>

@stop