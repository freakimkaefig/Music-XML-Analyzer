@extends('layout.main')

@section('content')

<div class="canvas-wrapper">
	<div class="canvas-left">
		<div class="col-xs-12">
			<div class="col-xs-12">
				<div class="row">
					<div class="col-xs-12" id="score_close_button">
						<a class="btn btn-danger pull-left" href="#" onclick="ga('send', 'event', { eventCategory: 'Dashboard: Close Score', eventAction: 'Click' })"><span>Close</span></a>
					</div>
				</div>
				<div id="score_container">

				</div>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			</div>
		</div>
	</div>

	<div class="canvas-right">
		<div class="col-xs-12">
			<div class="row">
				<div class="col-sm-6">
					<a class="btn btn-success pull-left" href="{{ URL::route('download') }}" onclick="ga('send', 'event', { eventCategory: 'Dashboard: Download', eventAction: 'Click' })"><span class="glyphicon glyphicon-export"></span> <span>Export as CSV</span></a>
				</div>

				<div class="col-sm-6">
					<a class="btn btn-danger pull-right" href="{{ URL::route('pattern') }}" onclick="ga('send', 'event', { eventCategory: 'Dashboard: Search', eventAction: 'Click' })"><span class="glyphicon glyphicon-search"></span> <span>Search for patterns</span></a>
				</div>
			</div>

			<div class="row">
				<div class=" col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
					<div id="dashboardMessages" class="logBox"></div>
				</div>
				<div id="showingResultsFor" class="text-center col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3"></div>
				<div id="fileSelector" onclick="ga('send', 'event', { eventCategory: 'Dashboard: File Change', eventAction: 'Change' })" class="col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3"></div>
			</div>

			<div class="text-center" id="score_button_container"></div>

			<div id='overallStatistics'></div>

			<div class="row">
				<div class="col-xs-3 col-xs-offset-2">
					<ul id="plainFacts" class="no-list"></ul>
				</div>

				<div class="col-xs-3">
					<ul id="plainFacts2" class="no-list"></ul>
				</div>

				<div class="col-xs-3">
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

	</div>
</div>

@stop