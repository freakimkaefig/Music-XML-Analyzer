<nav id="footer-nav" class="navbar navbar-material-blue-grey-800 navbar-fixed-bottom" role="navigation">
	<div class="container-fluid">
		<ul class="nav navbar-nav navbar-left">
      		<li><a href="{{ URL::route('imprint') }}">&copy; 2015 Music XML Analyzer</a></li>
  		</ul>
        <?php if (Cookie::get('user_id')): ?>
            <?php $user = User::find(Cookie::get('user_id')); ?>
            <?php if ($user): ?>
        <ul class="nav navbar-nav navbar-right">
  			<li><a href="#">(User ID: {{ $user->id }})</a></li> <!-- For debugging only delete on production -->
        </ul>
            <?php endif; ?>
        <?php endif; ?>
	</div>
</nav>