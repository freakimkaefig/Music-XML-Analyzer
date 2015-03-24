<nav class="navbar navbar-material-blue-grey-800 navbar-fixed-top">

    <div class="navbar-header">
        <a class="navbar-brand" href="{{ URL::route('home') }}">Music XML Analyzer</a>
    </div>
	<div class="container-fluid">

     	<?php if (Cookie::get('user_id')): ?>
     		<?php $user = User::find(Cookie::get('user_id')); ?>
     		<?php if ($user): ?>
		     	<ul class="nav navbar-nav navbar-right">
                <?php $uploads = $user->uploads; ?>
                <?php if (!$uploads->isEmpty()): ?>
			     	<li class="btn-flat btn-material-grey-200">
                        <a id="uploadButton" href="#" data-toggle="modal" data-target="#uploadModal">Uploads</a>
			     		@include('upload.dropzone')
			     	</li>
			      	<li class="btn-flat btn-material-grey-200">
                        <a href="{{ URL::route('dashboard') }}">Dashboard</a>
                    </li>
      		        <li class="btn-flat btn-material-grey-200">
                        <a href="{{ URL::route('pattern') }}">Search</a>
                    </li>
                    <li class="divider">
                        <p class="navbar-text"></p>
                    </li>
                    <li class="btn-flat btn-material-red-A100">
                        <a id="deleteMeLink" href="/delete/me">Reset</a>
                    </li>
                <?php endif; ?>
			  	</ul>
     		<?php endif; ?>
     	<?php endif; ?>


	</div>
</nav>