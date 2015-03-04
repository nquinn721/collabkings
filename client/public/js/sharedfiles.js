function SharedFiles () {
	this.sharedFiles = [];

	this.section = $('.shared-files .shared-body');
}

SharedFiles.prototype = {
	init : function () {
		this.socketEvents();
	},
	socketEvents : function () {
		io.on('sharedfiles', this.handleFiles.bind(this));	
	},
	handleFiles : function (files) {
		this.sharedFiles = files;
		this.updateText();
	},
	
	updateText : function () {
		this.clearText();
		for(var i = 0; i < this.sharedFiles.length; i++){
			var fa = $('<i>', {class : 'fa fa-file-o'})
			var file = this.sharedFiles[i].file;
			var name = this.sharedFiles[i].user.user.toLowerCase();
			f = file.split('/');
			this.section.append($('<div>', {class : name + file + ' file'}).append(fa, ' ', f[f.length - 1]));
		}
	},
	clearText : function () {
		this.section.text('');
	}
}