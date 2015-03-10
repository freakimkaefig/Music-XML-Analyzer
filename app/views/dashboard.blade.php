@extends('layout.main')

@section('content')

<div class="col-xs-12">
	
<div class"row"="">
	<h1 class="text-center col-sm-9" style="float: none; margin: 0 auto;">Dashboard</h1>
	<a class="btn btn-success btn-lg col-sm-3" style="float: right; margin: -40px 0 20px 0" href="http://music-xml-analyzer.local/pattern">Search for Patterns</a>
</div>
	<div class="row">
		<div class=" col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
			<div id="dashboardMessages" class="logBox"></div>
		</div>
		<h4 class="text-center col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">Showing results for:</h4>
		<div id="fileSelector" class="col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3"></div>
	</div>
	<div>
	<hr>
	<h3 class="text-center">Note distribution</h3>
	<div class="row">
		<div id="bar_noteDistribution" class="bar-chart col-xs-12"></div>
	</div>
	</div>
	<hr>
	<h3 class="text-center">Interval distribution</h3>
	<div class="row">
		<div id="bar_intervalDistribution" class="bar-chart col-xs-12"></div>
	</div>
	<hr>

	<div class="row">
		<div id="pie_noteDistribution" class="pie col-sm-6"></div>
		<div id="pie_intervalDistribution" class="pie col-sm-6"></div>
	</div>
	<div class="row">
		<div id="pie_keyDistribution" class="pie col-sm-6"></div>
		<div id="pie_noteTypeDistribution" class="pie col-sm-6"></div>
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