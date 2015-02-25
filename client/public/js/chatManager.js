function ChatManager () {
	// Collections
	this.users = [];
}

ChatManager.prototype = {
	init : function  () {
		
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

	},
}