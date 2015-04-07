var Route = {
	check: function(route) {
		var queryString = location.href.split(location.host)[1];
		return (queryString.match(route));
	}
};
