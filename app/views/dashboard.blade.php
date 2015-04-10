@extends('layout.main')

@section('content')

<div class="col-xs-12">
	<div class="row">
		<div class="col-sm-6">
			<a class="btn btn-success pull-left" href="{{ URL::route('download') }}" onclick="ga('send', 'event', { eventCategory: 'Dashboard: Download', eventAction: 'Click' })"><span class="glyphicon glyphicon-export"></span> <span>Export as CSV</span></a>
		</div>

		<div class="col-sm-6">
			<a class="btn btn-danger pull-right" href="{{ URL::route('pattern') }}" onclick="ga('send', 'event', { eventCategory: 'Dashboard: Search', eventAction: 'Click' })"><span class="glyphicon glyphicon-search"></span> <span>Search for Patterns</span></a>
		</div>
	</div>

	<div class="row">
		<div class=" col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
			<div id="dashboardMessages" class="logBox"></div>
		</div>
		<div id="showingResultsFor" class="text-center col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3"></div>
		<div id="fileSelector" onclick="ga('send', 'event', { eventCategory: 'Dashboard: File Change', eventAction: 'Change' })" class="col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3"></div>
	</div>

	<div id='overallStatistics'></div>

	<div class="row">
		<div id="overallStatistics" class="col-xs-3 col-xs-offset-2">
			<ul id="plainFacts" class="no-list"></ul>
		</div>

		<div id="overallStatistics" class="col-xs-3">
			<ul id="plainFacts2" class="no-list"></ul>
		</div>

		<div id="overallStatistics" class="col-xs-3">
			<ul id="plainFacts3" class="no-list inline-list"></ul>
		</div>
	</div>

	<div class="row">
		<div id="bar_noteDistribution" class="bar-chart col-xs-12"></div>
	</div>

	<div class="row">
		<div id="bar_intervalDistribution" class="bar-chart col-xs-12"></div>
	</div>

	<div class="row text-center">
		<div id="pie_keyDistribution" class="pie col-xs-4"></div>

		<div id="pie_noteTypeDistribution" class="pie col-xs-4"></div>

		<div id="pie_meterDistribution" class="pie col-xs-4"></div>
	</div>
</div>

<div class="col-xs-6 "id="chart"></div>

<div class="col-xs-6 "id="resultlist"></div>

@stop