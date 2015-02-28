module.exports = {
	users : [],
	colors : ['red', 'green', 'yellow', 'pink', 'purple', 'blue', 'brown'],
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
				socket.user = {
					user : user, 
					color : self.colors[Math.round(Math.random() * self.colors.length)]
				};
				self.users.push(user);
				socket.emit('init', socket.user);
				socket.broadcast.emit('add-user', socket.user);
			});

			socket.on('get-all-users', function () {
				io.emit('all-users', self.users);
			})

			socket.on('projects', function () {
				// var name = socket.user.usertoLowerCase(),
				// 	projects = self.wrench.readdirSyncRecursive(__dirname + "/../projects/" + name);
				// socket.emit("projects", projects);
			});

			socket.on('disconnect', function () {
				if(socket.user){
					self.users.splice(self.users.indexOf(socket.user), 1);
					io.emit('remove-user', socket.user);
				}
			});
		});
	}
}