@extends('layout.main')
@section('content')
<div class="row">
	<div class="col-md-8 col-md-offset-2 text-center">
		<h1>Music XML Analyzer</h1>
		<h4 style="margin-bottom: 50px;">Looking for patterns in music? We'll find them.</h4>
		<div id="start_row" class="row">
			<div class="col-sm-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-cloud-upload" aria-hidden="true" style="margin-bottom: -30px; margin-top: 15px; "></span>
					<h2>Upload your music xml files</h2>
					<p>Upload one or more of your music-xml-files per drag'n'drop.</p>
				</div>
			</div>

			<div class="col-sm-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-eye-open" aria-hidden="true" style="margin-bottom: -30px; margin-top: 15px;"></span>
					<h2>Automatic analysis</h2>
					<p>Your uploaded data will be analyzed and some fancy statistics will be created.</p>
				</div>
			</div>

			<div class="col-sm-4">
				<div class="col-xs-12">
					<span class="icon glyphicon glyphicon-search" aria-hidden="true" style="margin-bottom: -30px; margin-top: 15px;"></span>
					<h2>Search for patterns</h2>
					<p>Melodic patterns, rhythms and tone sequences can be found.</p>
				</div>
			</div>
		</div>

		<div id="buttons_row" class="row">
			<button type="button" class="btn btn-danger btn-xxl" data-toggle="modal" data-target="#uploadModal" onclick="ga('send', 'event', { eventCategory: 'Home: Upload Button', eventAction: 'Click' })">Start uploading now!</button>
			@include('upload.dropzone')
		</div>
	</div>
</div>
{{-- Coders @ bottom --}}
<div class="coder col-xs-12">
	<div class="row">
		<div class="col-xs-12 col-md-1 col-lg-2 text-center">
			<h5>Coded by: </h5>
		</div>

		<div class="col-sm-3 col-md-2">
			<address>
				<strong>Lukas Lamm</strong><br>
				<small><a href="mailto:freak.im.kaefig@gmx.net">freak.im.kaefig@gmx.net</a></small>
			</address>
		</div>

		<div class="col-sm-3 col-md-2">
			<address>
				<strong>David Lechler</strong><br>
				<small><a href="mailto:davidlechler@outlook.de">davidlechler@outlook.de</a></small>
			</address>
		</div>

		<div class="col-sm-3 col-md-2">
			<address>
				<strong>Tobias Semmelmann</strong><br>
				<small><a href="mailto:semmler1988@gmail.com">semmler1988@gmail.com</a></small>
			</address>
		</div>

		<div class="col-sm-3 col-md-2">
			<address>
				<strong>Matthias Schneider</strong><br>
				<small><a href="mailto:matthias.schneider89@gmail.com">matthias.schneider89@gmail.com</a></small>
			</address>
		</div>

		<div class="col-xs-12 col-md-3 col-lg-2 docs">
			<a href="http://freakimkaefig.github.io/Music-XML-Analyzer/" target="_blank" class="btn btn-material-teal-400" id="documentationButton" onclick="ga('send', 'event', { eventCategory: 'Home: Documentation Button', eventAction: 'Click' })">Documentation</a>
		</div>
	</div>

	<div class="row">
		<div class="col-xs-12 col-md-1 col-lg-2 text-center">
			<h5>Supervised by: </h5>
		</div>
		<div class="col-sm-3 col-md-2">
			<address>
				<strong>Manuel Burghardt</strong><br>
				<small><a href="mailto:manuel.burghardt@ur.de">manuel.burghardt@ur.de</a></small>
			</address>
		</div>
		<div class="col-sm-6 col-md-4">
			<address>
				<strong>Lehrstuhl für Medieninformatik - Universität Regensburg</strong><br>
				<small><a href="http://www.uni-regensburg.de/sprache-literatur-kultur/medieninformatik/" target="_blank">http://www.uni-regensburg.de/sprache-literatur-kultur/medieninformatik/</a></small>
			</address>
		</div>
		<div class="col-sm-3 col-md-2">
			<address>
				<strong><a href="https://github.com/freakimkaefig/Music-XML-Analyzer/blob/master/LICENSE.md">Licensed under MIT open source license</a></strong>
				<small>More on: <a href="https://github.com/freakimkaefig/Music-XML-Analyzer" target="_blank">GitHub</a></small>
			</address>
		</div>
	</div>
</div>

@stop
