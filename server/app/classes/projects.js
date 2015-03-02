module.exports = {
	project : {},
	fs : require('fs'),
	init : function (io) {
		
	},
	manage : function (action, cb) {
		this[action.method](action, cb);
	},
	createFile : function (obj, cb) {
		var user = obj.user.toLowerCase(),
			url = obj.url,
			file = obj.file;
		this.fs.writeFile(__dirname + '/../projects/' + user + '/' + url + '/' + file, '', null, cb)
	},
	createFolder : function (obj) {
		var user = obj.user,
			url = obj.url;
		this.fs.mkdir(url, 777, function(err){
			console.log(err);
		});
	},
	renameFile : function (obj) {
		var user = obj.user,
			url  = obj.url,
			name = obj.name;
		this.fs.rename('../projects/' + user, '../porjects/' + user + url, function (err) {
			console.log(err);
		});
	},
	renameFolder : function (obj) {
		var user   = obj.user,
			folder = obj.folder,
			name   = obj.name;
	},
	moveFile : function (obj) {
		var user = obj.user,
			file = obj.file,
			url  = obj.url;
	},
	deleteFile : function (obj) {
		this.unlink(obj);
	},
	deleteFolder : function (obj) {
		this.unlink(obj);
	},
	unlink : function (obj) {
		var user   = obj.user,
			url    = obj.url;
		this.fs.unlink(__dirname + '/../projects/' + user + '/' + url, function(err){

		})
	}
}