/**
 * About Base Class
 *
 * Can get/set individual properties
 * base.get('username');
 * base.set('username', 'name');
 *
 * Can get/set complicated string properties with /
 * base.get('user/username');
 * baser.get('env/desktop/method');
 *
 * base.set('user/username', 'name');
 * base.set(/env/desktop/method', 'newMethod');
 * 
 */


// Object.defineProperty(Object.prototype, 'set', {
// 	value : function(props, value){
// 		var prop = this.get(props);
// 		prop = value;
// 	}
// })

 function Base(){

 }

 Base.prototype = {

 	initConfig : function(config){
 		this.config = config;
 	},


 	/**
 	 * Allow for other classes to inherit from this class
 	 * @param  {Class} cl Class to inherit base
 	 */
 	_inherit : function(cl){
 		return this.setProperties(cl);
 	},

 	setProperties : function(module){
		
		Object.defineProperties(module, {
			orm : {value : require('orm')},
			get : {
				value : function(prop){
					var props = prop instanceof Array ? prop : prop.indexOf('/') ? prop.split('/') : prop.split('.');

					if(!this[props[0]])return 'No property found [' + props[0] + ']';

					if(props.length > 1)
						this[props.shift()].get(props);
					else return this[props[0]];
				}
			},
			set : {
				value : function(props, value){
					var prop = this.get(props);
					prop = value;
				}
			},
			create : {
				value : function(object){
			 		var fn = function(){};
			 		fn.prototye = this;
			 		fn = new fn;

			 		if(object){
			 			for(var prop in fn){
			 				if(object[prop])
			 					fn[prop] = object[prop]
			 			}
			 		}

			 		return fn;
			 	}
			}	
		})



	 	 

	 	if(this.config)
		 	Object.defineProperty(module, 'config', {value : this.config});

		return module;
	}
 	
 }

var base = new Base;







module.exports = base;