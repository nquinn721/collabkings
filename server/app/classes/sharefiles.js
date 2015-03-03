module.exports = {
	sharedFiles : [],
	addFile : function (io, socket, file) {
		this.io = io;
		this.sharedFiles.push({user : socket.user, file : file});
		this.updateUsers();
	},
	updateUsers : function () {
		this.io.emit('sharedfiles', this.sharedFiles);
	}
}