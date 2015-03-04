@extends('layout.main')

@section('content')

<div class="row">
	<div class="col-xs-4">
		<h2>Create Your Pattern</h2>
	</div>	
</div>

{{ Form::open(array('route' => 'patternSearch')) }}
{{ Form::hidden('pattern', '', array('id' => 'patternValue')) }}
<div class="row">
	<div class="col-xs-12">
		<p>Choose Mode: </p>
		<div class="btn-group" data-toggle="buttons">
        	<label id="2" class="btn btn-mode btn-primary active" data-toggle="tooltip" data-placement="top">
      			<input type="radio" value=":melody">melody
            </label>
        	<label id="0" class="btn btn-mode btn-primary" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":sound sequence">sound sequence
            </label>
        	<label id="1" class="btn btn-mode btn-primary" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":rhythm">rhythm
            </label>
		</div>
		<p></p>
		<p></p>
	</div>
</div>

<!-- HINT: if theres a column arround you get problems with mouse x and y-->
<canvas id="myCanvas" width="700" height="120" style="border:1px solid #000000;">
</canvas>

<div class="row">
	<div class="col-xs-12">
		<p></p>
		<p>Notes: </p>
		<div class="btn-group btn-group-names" data-toggle="buttons">
        	<label id="c" class="btn btn-note btn-material-grey active" data-toggle="tooltip" data-placement="top">
      			<input type="radio" value=":c">C
            </label>
        	<label id="d" class="btn btn-note btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":d">D
            </label>
        	<label id="e" class="btn btn-note btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":e">E
            </label>
        	<label id="f" class="btn btn-note btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":f">F
            </label>
        	<label id="g" class="btn btn-note btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":g">G
            </label>
        	<label id="a" class="btn btn-note btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":a">A
            </label>
            <label id="b" class="btn btn-note btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":b">B
            </label>
		</div>
	</div>
	<div class="col-xs-12">
		<p></p>
		<p>Duration: </p>
		<div class="btn-group" data-toggle="buttons">
        	<label id="whole" class="btn btn-duration btn-material-grey" data-toggle="tooltip" data-placement="top">
      			<input type="radio" value=":whole">1/1
            </label>
        	<label id="half" class="btn btn-duration btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":half">1/2
            </label>
        	<label id="quarter" class="btn btn-duration btn-material-grey active" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":quarter">1/4
            </label>
            <label id="eighth" class="btn btn-duration btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":eighth">1/8
            </label>
            <label id="16th" class="btn btn-duration btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":16th">1/16
            </label>
            <label id="32nd" class="btn btn-duration btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":32nd">1/32
            </label>
            <label id="64th" class="btn btn-duration btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":64th">1/64
            </label>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-xs-6">
		<p></p>
		<p>Accidential: </p>
		<div class="btn-group" data-toggle="buttons">
        	<label id="0" class="btn btn-accidential btn-material-grey active" data-toggle="tooltip" data-placement="top">
      			<input type="radio" value=":0">none
            </label>
        	<label id="1" class="btn btn-accidential btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":1">#
            </label>
        	<label id="-1" class="btn btn-accidential btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":-1">b
            </label>
		</div>
	</div>
	<div class="col-xs-6">
		<p></p>
		<p>Clef: </p>
		<div class="btn-group" data-toggle="buttons">
        	<label id="F" class="btn btn-clef btn-material-grey" data-toggle="tooltip" data-placement="top">
      			<input type="radio" value=":F">F
            </label>
        	<label id="G" class="btn btn-clef btn-material-grey active" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":G">G
            </label>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-xs-6">
		<p></p>
		<p>Special Ryth: </p>
		<div class="btn-group" data-toggle="buttons">
        	<label id="Triplet" class="btn btn-special-ryth btn-material-grey active" data-toggle="tooltip" data-placement="top">
                <input type="radio" value=":None">none
            </label>
        	<label id="Dotted" class="btn btn-special-ryth btn-material-grey" data-toggle="tooltip" data-placement="top">
        		<input type="radio" value=":Dotted">dotted
            </label>
            <label id="None" class="btn btn-special-ryth btn-material-grey" data-toggle="tooltip" data-placement="top">
                <input type="radio" value=":Triplet">triplet
            </label>
		</div>
	</div>
	<div class="col-xs-2">
		<p></p>
		<p>Octave: </p>
	    <select id="select-octave" class="form-control btn-material-grey">
		  <option value="2">2</option>
		  <option value="3">3</option>
		  <option selected="selected" value="4">4</option>
		  <option value="5">5</option>
		  <option value="6">6</option>
		</select>
	</div>
</div>
<div class="row">
	<div class="col-xs-6">
		<p></p>
		<p>Controls: </p>
		<button id="btn-add-note" type="button" class="btn btn-default btn-success">add</button>
		<button id="btn-remove-note" type="button" class="btn btn-default btn-danger">delete</button>
	</div>
</div>

{{ Form::submit('Search') }}
{{ Form::close() }}

@stop