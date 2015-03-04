module.exports = {
	users : [],
	colors : ['red', 'green', 'yellow', 'pink', 'purple', 'blue', 'brown'],
	wrench : require('wrench'),
	fs : require('fs'),
	init : function  (io, projects, sharefiles, files) {
		this.projects = projects;
		this.io = io;
		this.sharefile = sharefiles;
		this.files = files;
	},
	ready : function  () {
		var io = this.io,
			self = this;

		io.on('connection', function (socket) {
			socket.on('msg', function (msg) {
				io.emit('msg', msg);
			});
			
			socket.on('project', function(action){
				self.projects.manage(action, function(){
					self.updateProjects(socket);
				})
			});

			socket.on('login', function(user){
				socket.user = {
					user : user, 
					color : self.colors[Math.round(Math.random() * self.colors.length)]
				};
				self.users.push(socket.user);
				socket.emit('init', socket.user);
				socket.broadcast.emit('add-user', socket.user);
				io.emit('all-users', self.users);
			});
 

			socket.on('projects', function(){
				self.updateProjects(socket);
			});
			socket.on('readfile', function(url){
				self.files.loadFile(socket, socket.user.user, url);
			});
			socket.on('sharefile', function(url){
				self.sharefile.addFile(io, socket, url);
			})

			socket.on('disconnect', function () {
				if(socket.user){
					self.users.splice(self.users.indexOf(socket.user), 1);
					io.emit('remove-user', socket.user);
					self.sharefile.clearUserFiles(socket.user);
				}
			});
		});
	},
	updateProjects : function (socket) {
		var name = socket.user.user.toLowerCase();
		if(this.fs.existsSync(__dirname + '/../projects/' + name)){
			var projects = this.wrench.readdirSyncRecursive(__dirname + "/../projects/" + name);
			socket.emit("projects", projects);
		}
	}
}