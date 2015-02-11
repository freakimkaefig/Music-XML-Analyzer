@extends('layout.main')

@section('content')

<div class="col-xs-12">
	<h1 class="text-center">Dashboard</h1>

	<div class="row">
		<div id="fileSelector" class="col-xs-12 col-sm-8 col-sm-offset-2 col-lg-4 col-lg-offset-4">
			<h4 class="text-center">Fetching results from database ...</h4>
		</div>
	</div>

	<div class="row">
		<div id="pie_noteDistribution" class="pie col-sm-6"></div>
		<div id="pie_intervalDistribution" class="pie col-sm-6"></div>
	</div>
	<div class="row">
		<div id="pie_keyDistribution" class="pie col-sm-6"></div>
		<div id="pie_meterDistribution" class="pie col-sm-6"></div>
	</div>
	<div class="row"></div>
		<div id="pie2" class="pie col-xs-6"></div>
		<div id="pie3" class="pie col-xs-6"></div>
	</div>

	<div class="row">
		<div class="chart col-xs-6">
		</div>
	</div>
</div>

<div class="col-xs-6 "id="chart"></div> 

<div class="col-xs-6 "id="resultlist">

</div>

@stop