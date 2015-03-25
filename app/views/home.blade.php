@extends('layout.main')
@section('content')
<div class="row">
	<div class="col-xs-8 col-xs-offset-2 text-center">
		<h1>Music XML Analyzer</h1>
		<h4 style="margin-bottom: 50px;">Looking for patterns? We'll find them.</h4>
		<div id="start_row" class="row">
			<div class="col-xs-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-cloud-upload" aria-hidden="true" style="margin-bottom: -30px; margin-top: 15px; "></span>
					<h2>Upload your music xml files</h2>
					<p>Upload one or more of your music-xml-files per drag'n'drop.</p>
				</div>
			</div>
			<div class="col-xs-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-eye-open" aria-hidden="true" style="margin-bottom: -30px; margin-top: 15px;"></span>
					<h2>Automatic Analysation</h2>
					<p>Your uploaded data will be analysed and some fancy statistics will be created.</p>
				</div>
			</div>
			<div class="col-xs-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-search" aria-hidden="true" style="margin-bottom: -30px; margin-top: 15px;"></span>
					<h2>Search for patterns</h2>
					<p>Melodic patterns, rhythms and tone sequences can be found.</p>
				</div>
			</div>
		</div>
		<div id="buttons_row" class="row">
			<button type="button" class="btn btn-danger btn-xxl" data-toggle="modal" data-target="#uploadModal">Start uploading now!</button>
			@include('upload.dropzone')
		</div>
	</div>
</div>
{{-- Coders @ bottom --}}
<div class="coder col-xs-8 col-xs-offset-2">
	<div class="row">
		<h5 class="col-xs-1 col-xs-offset-1">Coded by: </h5>
		<address class="col-xs-2">
			<strong>Lukas Lamm</strong><br>
			<small><a href="mailto:#">lukas.lamm89@gmail.com</a></small>
		</address>
		<address class="col-xs-2">
			<strong>David Lechler</strong><br>
			<small><a href="mailto:#">davidlechler@outlook.de</a></small>
		</address>
		<address class="col-xs-2">
			<strong>Tobias Semmelmann</strong><br>
			<small><a href="mailto:#">semmler1988@gmail.com</a></small>
		</address>
		<address class="col-xs-2">
			<strong>Matthias Schneider</strong><br>
			<small><a href="mailto:#">matthias.schneider89@gmail.com</a></small>
		</address>
		
		{{-- <div class="col-xs-2"></div> --}}
	</div>
</div>
@stop
