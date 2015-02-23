var fs = require('fs');

module.exports = function(dir, app, modules){
	var routes = fs.readdirSync(dir + '/app/routes');
	for(var i in routes){
		var route = require(dir + '/app/routes/' + routes[i]);
		for(var i in route){
			
			if(typeof route[i] === 'object'){
				var r = route[i].route;
				app[route.type || 'get'](i, modules[r[0]][r[1]].bind(modules[r[0]]));
			} else {
				var r = route[i].split('.');
				app.get(i, modules[r[0]][r[1]].bind(modules[r[0]]));
			}
		}
	}
}