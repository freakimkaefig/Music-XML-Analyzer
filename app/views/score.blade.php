@extends('layout.main')

@section('content')

<div class="col-xs-12">
	<h1>Hello Score!</h1>

	@if (Cache::has('score'))
		<pre>
		{{ var_dump(Cache::get('score')) }}
		</pre>
	@else
		<p>Something went wrong, please go back to dashboard and try again!
	@endif
</div>

@stop