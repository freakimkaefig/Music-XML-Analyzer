@extends('layout.main')
@section('content')
<div class="row">
	<div class="col-xs-8 col-xs-offset-2 text-center">
		<h1>Music XML Analyzer</h1>
		<div id="start_row" class="row">
			<div class="col-xs-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-cloud-upload" aria-hidden="true"></span>
					<h2>Upload your music xml files</h2>
					<p>Upload one or more of your music-xml-files per drag'n'drop.</p>
				</div>
			</div>
			<div class="col-xs-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-eye-open" aria-hidden="true"></span>
					<h2>Automatic Analysation</h2>
					<p>Your uploaded data will be analysed and some fancy statistics will be created.</p>
				</div>
			</div>
			<div class="col-xs-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-search" aria-hidden="true"></span>
					<h2>Search for patterns</h2>
					<p>Melodic patterns, rhythms and tone-sequences can be found</p>
				</div>
			</div>
		</div>
		<div id="buttons_row" class="row">
			<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#uploadModal">
			Start something beautiful
			</button>
			@include('upload.dropzone')
		</div>
	</div>
</div>
@stop
