@extends('layout.main')

@section('content')

<div id="extract-carousel" class="carousel slide" data-ride="carousel" data-interval="false">

<?php
// Debugbar::info($resultNotes);
?>

	<!-- Indicators -->
	<ol class="carousel-indicators">
		<?php for ($i = 0; $i < count($resultNotes); $i++): ?>
			<li data-target="#extract-carousel" data-slide-to="<?php echo $i; ?>"<?php if ($i==0) echo ' class="active"'; ?>></li>
		<?php endfor; ?>
	</ol>

	<!-- Wrapper for slides -->
	<div class="carousel-inner" role="listbox">
		<?php for ($i = 0; $i < count($resultNotes); $i++): ?>
			<div class="item<?php if ($i==0) echo ' active'; ?>">
				<center><canvas id="canvas<?php echo $i; ?>" class="canvas" height="200" width="700"></canvas></center>
				{{ Form::hidden('resultNotes' . $i, json_encode($resultNotes[$i]), array('id' => 'notes' . $i, 'class' => 'notes')) }}
			</div>
		<?php endfor; ?>
	</div>

	<!-- Controls -->
	<a class="left carousel-control" href="#extract-carousel" role="button" data-slide="prev">
		<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
		<span class="sr-only">Previous</span>
	</a>
	<a class="right carousel-control" href="#extract-carousel" role="button" data-slide="next">
		<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
		<span class="sr-only">Next</span>
	</a>
</div>

@stop