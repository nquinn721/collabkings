module.exports = {
	fs : require('fs'),
	loadFile : function (socket, user, url) {
		var i = 0;
		this.fs.readFile(__dirname + '/../projects/' + user.toLowerCase()  + url, 'utf8',function(err, file){
			socket.emit('readfile', file);
		});
	}
}