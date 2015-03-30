<!-- Modal -->
<div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="Upload" aria-hidden="true">

	<div id="template" class="preview col-xs-2">
		<div>
			<div class="image"><img data-dz-thumbnail></div>
			<div class="details">
				<div class="filename"><span data-dz-name></span></div>
				<div class="size"><span data-dz-size></span></div>
				<div class="progress active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
				    <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
				</div>
			</div>
		</div>
	</div>

	<div class="modal-dialog">
		<div class="dz-message">
			<h4>Drag your music xml files here!</h4>
			<span>Or click to browse</span>
		</div>
		<div class="dropzone-background">
			<form id="uploadDropzone" class="dropzone dropzone-fullscreen dz-clickable" method="POST" action="{{ URL::route('postUpload') }}">
				<div class="dz-message"></div>

				<?php if (Cookie::get('user_id')): ?>
				<?php
					$user = User::find(Cookie::get('user_id'));
					if ($user) {
						if (count($user->uploads)) {
							$user->uploads->each(function($upload) {
				?>
						<div class="preview col-xs-2">
							<div class="image"><img data-dz-thumbnail=""></div>
							<div class="details">
								<div class="filename"><span data-dz-name="">{{ $upload->name() }}</span></div>
								<div class="size"><span data-dz-size=""><strong>13.2</strong> KB</span></div>
							</div>
							<div class="progress active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
							    <div class="progress-bar progress-bar-success" style="width:100%;" data-dz-uploadprogress></div>
							</div>
						</div>
				<?php
							});
						}
					}
				?>
				<?php endif; ?>
			</form>
		</div>
		<div id="uploadMessages" class="logBox text-left"></div>
		<div id="buttonContainer">
			<button type="button" id="uploadClose" class="btn btn-material-grey-600 pull-left btn-lg">Close</button>
			<button type="button" id="uploadSubmit" class="btn btn-danger pull-right btn-lg">Analyze</button>
		</div>
	</div>
</div>