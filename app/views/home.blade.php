@extends('layout.main')
@section('content')
<div class="row">
	<div class="col-xs-8 col-xs-offset-2 text-center">
		<h1>Hello Music XML Analyzer</h1>
		<div class="row">
			<div class="col-xs-4">
				<div class="col-xs-12">
					<img class="img-circle img-responsive img-center" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Placeholder" style="width: 140px;">
					<h2>Upload your music xml files</h2>
					<p>Upload one or more of your music-xml-files per drag'n'drop.</p>
				</div>
			</div>
			<div class="col-xs-4">
				<div class="col-xs-12">
					<img class="img-circle img-responsive img-center" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Placeholder" style="width: 140px;">
					<h2>Automatic Analysis</h2>
					<p>Your uploaded data will be analysed and some fancy statistics will be created.</p>
				</div>
			</div>
			<div class="col-xs-4">
				<div class="col-xs-12">
					<img class="img-circle img-responsive img-center" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Placeholder" style="width: 140px;">
					<h2>Search for patterns</h2>
					<p>Melodic patterns, rhythms and tone-sequences can be found</p>
				</div>
			</div>
		</div>
		<div class="row">
			<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#uploadModal">
			Start something beautiful
			</button>
			<!-- Modal -->
			<div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="Upload" aria-hidden="true">
				<div class="modal-dialog">
					<div class="dz-message">
						<h4>Drag your music xml files here!</h4>
						<span>Or click to browse</span>
					</div>
					<form id="uploadDropzone" class="dropzone dropzone-fullscreen dz-clickable" method="POST" action="/upload">
						<div class="dz-message"></div>
					</form>
					<div id="progressWrapper"></div>
				</div>
			</div>
		</div>
	</div>
</div>
@stop
