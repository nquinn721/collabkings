module.exports = {
	project : {},
	fs : require('fs'),
	mkdir : require('mkdirp'),
	rimraf : require('rimraf'),
	init : function (io) {
		
	},
	manage : function (action, cb) {
		this[action.method](action, cb);
	},
	save : function (obj, cb) {
		this.createFile(obj, cb);
	},
	createFile : function (obj, cb) {
		var user = obj.user.toLowerCase(),
			url = obj.url,
			file = obj.file;

		this.fs.writeFile(__dirname + '/../projects/' + user + '/' + url + '/' + file, obj.str || '', null, cb)
	},
	createFolder : function (obj, cb) {
		var user = obj.user.toLowerCase(),
			url = obj.url,
			folder = obj.file;
		this.mkdir(__dirname + '/../projects/' + user + '/' + url + '/' + folder, 777, cb);
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
	deleteFile : function (obj, cb) {
		this.unlink(obj, cb);
	},
	deleteFolder : function (obj, cb) {
		var user   = obj.user,
			url    = obj.url;
		this.rimraf(__dirname + '/../projects/' + user + '/' + url, cb)
	},
	unlink : function (obj, cb) {
		var user   = obj.user,
			url    = obj.url;
		console.log(__dirname + '/../projects/' + user + '/' + url);
		this.fs.unlink(__dirname + '/../projects/' + user + '/' + url, cb)
	}
}