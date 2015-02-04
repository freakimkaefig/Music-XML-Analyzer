@extends('layout.main')

@section('content')

<div class="row">
	<h1><center>Welcome to the Dashboard</center></h1>

	<div class="col-xs-12">
			
		<div id="pie1" class="pie col-xs-4"></div>
		<div id="pie2" class="pie col-xs-4"></div>
		<div id="pie3" class="pie col-xs-4"></div>

		<div class="row">
			<div class="chart col-xs-6">
				<h4>Different Statistics</h4>
			</div>
		</div>
	</div>

	<div class="col-xs-6 "id="chart"></div> 

	<div class="col-xs-6 "id="resultlist">

	</div> 
</div>

@stop