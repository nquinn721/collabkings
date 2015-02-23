function UserManager () {
	// Current User
	this.user;

	// User Collection
	this.users = [];
}

UserManager.prototype = {
	init : function (user) {
		this.login(user);
	},
	addUser : function (user) {
		this.users.push(new User(user));
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

	},
	login : function (user) {
		this.user = new User(user);
		this.user.login();
		this.users.push(this.user);
	}
}