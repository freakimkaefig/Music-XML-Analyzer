<nav class="navbar navbar-material navbar-fixed-top">

	<div class="container-fluid">
     	<ul class="nav navbar-nav">
     		<li><a class="navbar-brand" href="{{ URL::route('home') }}">LOGO</a></li>
     	</ul>

     	<?php if (Cookie::get('user_id')): ?>
     		<?php $user = User::find(Cookie::get('user_id')); ?>
     		<?php if ($user): ?>
		     	<ul class="nav navbar-nav navbar-right">
                    <li><a href="#">User ID: {{ $user->id }}</a></li> <!-- For debugging only delete on production -->
                <?php $uploads = $user->uploads; ?>
                <?php if (!$uploads->isEmpty()): ?>
			     	<li>
                        <button id="uploadButton" type="button" class="btn btn-flat btn-material-white navbar-btn" data-toggle="modal" data-target="#uploadModal">Uploads</button>
			     		@include('upload.dropzone')
			     	</li>
			      	<li><a href="{{ URL::route('dashboard') }}">Dashboard</a></li>
      		        <li><a href="{{ URL::route('pattern') }}">Search</a></li>
                    <li class="dropdown no-padding">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                        <span class="caret"></span>
                        <ul class="dropdown-menu" role="menu">
                            <li><a id="deleteMeLink" href="/delete/me" class="navbar-btn btn-danger">You need a fresh start?</a></li>
                        </ul>
                    </li>
                <?php endif; ?>
			  	</ul>
     		<?php endif; ?>
     	<?php endif; ?>


	</div>
</nav>