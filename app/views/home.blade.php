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
					<p>Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Phasellus ullamcorper ipsum rutrum nunc.</p>
				</div>
			</div>
			<div class="col-xs-4">
				<div class="col-xs-12">
					<img class="img-circle img-responsive img-center" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Placeholder" style="width: 140px;">
					<h2>Phasellus gravida semper</h2>
					<p>Phasellus viverra nulla ut metus varius laoreet. In consectetuer turpis ut velit.</p>
				</div>
			</div>
			<div class="col-xs-4">
				<div class="col-xs-12">
					<img class="img-circle img-responsive img-center" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Placeholder" style="width: 140px;">
					<h2>Curabitur vestibulum</h2>
					<p>Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Curabitur at lacus ac velit ornare lobortis.</p>
				</div>
			</div>
		</div>
		<div class="row">
			<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#uploadModal">
			Start something beautiful ;)
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
				</div>
			</div>
		</div>
	</div>
</div>
@stop
