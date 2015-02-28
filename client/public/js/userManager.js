function UserManager () {
	// Current User
	this.user;

	// User Collection
	this.users = [];
}

UserManager.prototype = {
	init : function (manager, user) {
		this.manager = manager;
		this.user = new User(user);
	},
	createUser : function (user) {
		var user = new User(user);
		return user;
	},
	addUser : function (user) {
		this.users.push(user);
	},
	removeUser : function (user) {
		if(typeof user === 'string'){
			for(var i = 0; i < this.users.length; i++){
				if(this.users[i].user === user){
					this.users.splice(i, 1);
					break;
				}
			}
		}else{
			this.users.splice(this.users.indexOf(user), 1);
		}		

	}
}