<!DOCTYPE html>
<html>
	<head>
		@include('layout.head')
	</head>
	<body>			
		@include('layout.header')
		<div id="content" class="container-fluid">
			@yield('content')
		</div>
		
		@include('layout.scripts')
	</body>
</html>