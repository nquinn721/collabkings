var wrench = require('wrench');

function Manager (){
	this.dependencies = [];
	this.modules = {
		appInfo : {}
	};
	this.inheritedModules = {};
}


Manager.prototype = {
	collectDependencies : function(dir, settings){
		var dep;

		if(!settings.loadedClasses)settings.loadedClasses = [];
		if(!this.contains(settings.loadedClasses, 'classes'))settings.loadedClasses.push('classes');


		for(var i = 0; i < settings.loadedClasses.length; i++){

			dep = wrench.readdirSyncRecursive(dir + '/app/' + settings.loadedClasses[i]);
			
			for(var j = 0; j < dep.length; j++)
				if(dep[j].indexOf('.') > -1)
					this.dependencies.push(dir + '/app/' + settings.loadedClasses[i] + '/' + dep[j]);
				
		}

	},

	initClasses : function(IoC){
		// Init modules
		for(var prop in this.modules){
			var module = this.modules[prop];

			// Inject dependencies with IoC container
			if(module.init){
				IoC.process(module, module.init);
			}
		}
	},

	readyClasses : function(){

		// Ready method for when all modules are initiated
		for(var prop in this.modules)
			if(this.modules[prop].ready)this.modules[prop].ready();

	},

	buildClasses : function(base, ConfigClass, inheritedModules){
		// Collect inherited modules
		for(var j = 0; j < inheritedModules.length; j++){

			var im = require('../lib/inherited_modules/' + inheritedModules[j]),
				name = inheritedModules[j].split('.')[0],
				dependency = require(name);

			if(im.moduleName)
				this.inheritedModules[im.moduleName] = dependency;
			else
				this.inheritedModules[name] = dependency;
			

			if(im.init)im.init(dependency);
		}


		for(var i = 0; i < this.dependencies.length; i++){
			var module = require(this.dependencies[i]);
			

			// Make sure all modules are camelCased
			var moduleName = this.dependencies[i].split('/');
				moduleName = moduleName[moduleName.length - 1].replace(/\..*/, '');

			if(moduleName.indexOf('_') > -1){
				moduleName = moduleName.split('_');

				for(var j = 0; j < moduleName.length; j++)
					moduleName[j] = moduleName[j].substr(0,1).toUpperCase() + moduleName[1].substr(1);

				moduleName = moduleName.join('');
			}


			// Inherit from inherited modules
			for(var j in this.inheritedModules)
				module[j] = Object.defineProperty(module, j, {value : this.inheritedModules[j]});


			// Build list of modules and inherit from base
			this.modules[moduleName] = base._inherit(module, ConfigClass.config);
		}
	},


	// Utility Functions
	contains : function(arr, value) {
	    for (var i = 0; i < arr.length; i++)
	        if (arr[i] === value)
	            return true;
	    return false;
	}
}

module.exports = new Manager;