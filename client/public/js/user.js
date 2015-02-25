function User (user) {
	this.user = user.user;
	this.color = user.color;
}

User.prototype = {
	login : function () {
		io.emit("login", this.user);
	}
}