@extends('layout.main')

@section('content')

	<form id="dropzone" class="dropzone dz-clickable" method="POST" action="/upload">
		<div class="dz-message">
			<h4>Drag Files to Upload</h4>
			<span>Or click to browse</span>
		</div>
	</form>

@stop