@extends('layout.main')

@section('content')

<div class="row">
	<div class="col-xs-12">
		<h1><center>Welcome to the Dashboard</h1>
	
		<div id="pie1" class="pie col-xs-4"></div>
		<div id="pie2" class="pie col-xs-4"></div>
		<div id="pie3" class="pie col-xs-4"></div>


		<div class="chart col-xs-6">
			<h4>Different Statistics</h4>
		</div>


	</div>

	<div class="col-xs-6 "id="chart"></div> 
</div>

@stop