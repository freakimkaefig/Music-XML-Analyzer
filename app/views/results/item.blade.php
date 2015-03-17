<a href="{{ URL::route('resultDetail', array('id' => $result->file_id)) }}">
	<div class="row tr">
		<div class="col-xs-9 col-sm-10 text-left td">
			<h4>{{ ResultController::_getArtist($result->file_id) }} - {{ ResultController::_getTitle($result->file_id) }}</h4>
			<h5>{{ $result->file_url }}</h5>
		</div>
		<div class="col-xs-3 col-sm-2 text-right td">
			<h4>{{ count($result->occurences) }}</h4>
		</div>
	</div>
</a>