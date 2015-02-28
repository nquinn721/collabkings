function ChatManager () {
	// Collections
	this.users = [];
}

ChatManager.prototype = {
	init : function  (manager, user) {
		this.manager = manager;
		this.chat = new Chat();
		this.chat.init(user);
		this.users.push(user);
	},
	addUser : function (user) {
		this.users.push(user);
		this.chat.manageUsers(this.users);
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
}