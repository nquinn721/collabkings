function IoC(){
	this.dependencies = {};
}

IoC.prototype = {

	/**
	 * Adds list of modules to local dependencies
	 * @param  {Object} dep List of dependencies with key = name value = dependency
	 */
	registerDependencies : function(dep, io){
		// console.log(dep);
		this.dependencies = dep;
		this.dependencies.io = io;
	},

	/**
	 * Map dependency to array of strings
	 * @param  {Array} arr Array of strings class is requiring for dependencies
	 * @return {Array}	   Array of dependencies
	 */
	getDependencies : function (arr) {
		var self = this;
		var a = arr.map(function(value){
			return self.dependencies[value.trim()];
		});

		return a;
	},

	/**
	 * Processes class for dependency injection
	 * @param  {class} target Class used for context
	 * @param  {method} targetfn Method of class we are passing dependencies to
	 */
	process : function(target, targetfn){
		var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
			text = targetfn.toString(),
			args = text.match(FN_ARGS)[1].split(',').filter(function(n){ return n != undefined && n != ''});
		// console.log(this.dependencies);
		targetfn.apply(target, this.getDependencies(args));
	}

}

module.exports = new IoC;