var Route = {
	check: function(route) {
		var queryString = location.href.split(location.host)[1];
		// console.log(queryString, route, queryString.match(route));
		return (queryString.match(route));
	}
};
