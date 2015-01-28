var Route = {
	check: function(route) {
		var queryString = location.href.split(location.host)[1];
		//optionally removing the leading `/`
		// var queryString = location.href.split(location.host)[1].replace(/^\//,'');
		return (route === queryString);
	}
};
