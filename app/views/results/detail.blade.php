@extends('layout.main')

@section('content')

<div id="extract-carousel" class="carousel slide" data-ride="carousel" data-interval="false">

	<!-- Indicators -->
	<ol class="carousel-indicators">
		<?php for ($i = 0; $i < count($resultExtracts); $i++): ?>
			<li data-target="#extract-carousel" data-slide-to="<?php echo $i; ?>"<?php if ($i==0) echo ' class="active"'; ?>></li>
		<?php endfor; ?>
	</ol>

	<!-- Wrapper for slides -->
	<div class="carousel-inner" role="listbox">
		<?php for ($i = 0; $i < count($resultExtracts); $i++): ?>
			<div class="item<?php if ($i==0) echo ' active'; ?>">
				<canvas id="canvas<?php echo $i; ?>" style="width:100%; height:640px;"></canvas>
				<script type="text/javascript">
				var c = document.getElementById("canvas<?php echo $i; ?>");
				var ctx = c.getContext("2d");
				ctx.font = "10px Arial";
				ctx.fillText("Hello World!", 0, 0);
				</script>
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