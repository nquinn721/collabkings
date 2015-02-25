module.exports = {
	users : [],
	wrench : require('wrench'),
	init : function  (io) {
		this.io = io;
	},
	ready : function  () {
		var io = this.io,
			self = this;

		io.on('connection', function (socket) {
			socket.on('msg', function (msg) {
				io.emit('msg', msg);
			});
			
			socket.on('login', function(user){
				socket.user = user;
				self.users.push(user);
				io.emit('users', self.users);
			});

			socket.on('projects', function () {
				var name = socket.user.toLowerCase(),
					projects = self.wrench.readdirSyncRecursive(__dirname + "/../projects/" + name);
				socket.emit("projects", projects);
			});

			socket.on('disconnect', function () {
				if(socket.user){
					self.users.splice(self.users.indexOf(socket.user), 1);
					io.emit('logout', socket.user);
				}
			});
		});
	}
}