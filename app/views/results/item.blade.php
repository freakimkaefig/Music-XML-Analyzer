<a href="{{ URL::route('resultDetail', array('file' => $result->file_id, 'occurences' => implode(',', $result->occurences))) }}">
	<div class="row">
		<div class="col-xs-2">
			{{ $result->file_id }}
		</div>
		<div class="col-xs-6">
			{{ $result->file_url }}
		</div>
		<div class="col-xs-4">
			{{ implode(', ', $result->occurences) }}
		</div>
	</div>
</a>