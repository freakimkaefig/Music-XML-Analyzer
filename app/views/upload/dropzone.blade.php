<!-- Modal -->
<div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="Upload" aria-hidden="true">
	<div class="modal-dialog">
		<div class="dz-message">
			<h4>Drag your music xml files here!</h4>
			<span>Or click to browse</span>
		</div>
		<form id="uploadDropzone" class="dropzone dropzone-fullscreen dz-clickable" method="POST" action="/upload">
			<div class="dz-message"></div>
			
			<?php if (Cookie::get('user_id')): ?>
			<?php
				$user = User::find(Cookie::get('user_id'));
				$user->uploads->each(function($upload) {
			?>
				<div class="dz-preview dz-file-preview dz-processing dz-complete">
					<div class="dz-image"><img data-dz-thumbnail=""></div>
					<div class="dz-details">
						<div class="dz-size"><span data-dz-size=""><strong>13.2</strong> KB</span></div>
						<div class="dz-filename"><span data-dz-name="">{{ $upload->name() }}</span></div>
					</div>
				</div>
			<?php
				});
			?>
			<?php endif; ?>
		</form>
		<div id="progressWrapper">
			<button type="button" id="uploadClose" class="btn btn-default pull-left btn-lg">Close</button>
			<button type="button" id="uploadSubmit" class="btn btn-primary pull-right btn-lg">Analyze</button>
		</div>
		<div>
			
		</div>
	</div>
</div>