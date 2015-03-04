<nav class="navbar navbar-material-blue-grey-800 navbar-fixed-top">

    <div class="navbar-header">
        <a class="navbar-brand" href="{{ URL::route('home') }}">LOGO</a>
    </div>
	<div class="container-fluid">

     	<?php if (Cookie::get('user_id')): ?>
     		<?php $user = User::find(Cookie::get('user_id')); ?>
     		<?php if ($user): ?>
		     	<ul class="nav navbar-nav navbar-right">
                <?php $uploads = $user->uploads; ?>
                <?php if (!$uploads->isEmpty()): ?>
			     	<li>
                        <a id="uploadButton" href="#" data-toggle="modal" data-target="#uploadModal">Uploads</a>
			     		@include('upload.dropzone')
			     	</li>
			      	<li>
                        <a href="{{ URL::route('dashboard') }}">Dashboard</a>
                    </li>
      		        <li>
                        <a href="{{ URL::route('pattern') }}">Search</a>
                    </li>
                    <li class="dropdown no-padding">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                            &nbsp;
                            <b class="caret"></b>
                        </a>
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