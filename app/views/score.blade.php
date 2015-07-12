@extends('layout.main')

@section('content')

<div class="col-xs-12">

	@if (Cache::has('score'))
		<center>
			<h1>
				<span id="artist">{{ ResultController::_getArtist(Cache::get('score')->file_id) }}</span> - <span id="title">{{ ResultController::_getTitle(Cache::get('score')->file_id) }}</span>
			</h1>

			<h2>
				<span>Part</span> <span class="partId">{{ Cache::get('score')->part_id }}</span> - <span id="instrument">{{ ResultController::_getInstrument(Cache::get('score')->file_id, Cache::get('score')->part_id) }}</span>
			</h2>

			@if (Cache::has('parts'))
				<div id="partSelectorContainer">
					<select id="partSelector">
					@foreach (Cache::get('parts') as $part)
						<option value="{{ URL::route('score', array('id' => Cache::get('score')->file_id, 'part' => $part->part_id)) }}"<?php if($part->selected): ?> selected<?php endif; ?>>Part {{ $part->part_id }} - {{ $part->part_name }}</option>
					@endforeach
					</select>
				</div>
			@endif

			{{ Form::hidden('score', json_encode(Cache::get('score')), array('id' => 'scoreValue')) }}

			<div id="canvasContainer"></div>
		</center>
	@else
		<p>Something went wrong, please go back to dashboard and try again!
	@endif
</div>

@stop