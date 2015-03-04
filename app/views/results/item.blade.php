<a href="{{ URL::route('resultDetail', array('id' => $result->file_id)) }}">
	<div class="row">
		<div class="col-xs-9 col-sm-10 text-left">
			{{ ResultController::_getArtist($result->file_id) . ' - ' . ResultController::_getTitle($result->file_id) . ' (' . $result->file_url . ')' . ' [ID:' . $result->file_id . ']' }}
		</div>
		<div class="col-xs-3 col-sm-2 text-right">
			{{ count($result->occurences) }}
		</div>
	</div>
</a>