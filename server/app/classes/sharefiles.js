module.exports = {
	sharedFiles : [],
	collection : {},
	addFile : function (io, socket, file) {
		if(this.collection[socket.user.user + file])return;
		this.io = io;

		this.sharedFiles.push({user : socket.user, file : file});
		this.collection[socket.user.user + file] = true;
		this.updateUsers();
	},
	updateUsers : function () {
		if(this.io)
			this.io.emit('sharedfiles', this.sharedFiles);
	},
	clearUserFiles : function (user) {
		for(var i in this.sharedFiles)
			if(this.sharedFiles[i].user.user === user.user)
				this.sharedFiles.splice(i, 1);
		for(var i in this.collection)
			if(i.match(user.user))
				delete this.collection[i];
		this.updateUsers();
	}
}