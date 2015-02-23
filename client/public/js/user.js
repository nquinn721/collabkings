function User (user) {
	this.user = user;
}

User.prototype = {
	login : function () {
		io.emit("login", this.user);
	}
}