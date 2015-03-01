function FileManager() {
	// Collection
	this.files = [];
	this.folders = [];
	this.users = [];

	// HTML Collections
	this.projectArea = $('.file-manager');
	this.fileContext = $('.folder-context');
	this.createFileBox = $('.create-file');
}

FileManager.prototype = {
	init : function (manager, user) {
		this.user = user;
		this.manager = manager;
		this.getProjects();
		this.socketHandlers();
		this.eventHandlers();
		this.fileArea = this.projectArea.find('.mCSB_container');
	},
	addUser : function (user) {
		this.users.push(user);
	},
	removeUser : function (user) {
		if(typeof user === 'string'){
			for(var i = 0; i < this.users.length; i++){
				if(this.users[i].user === user){
					this.users.splice(i, 1);
					break;
				}
			}
		}else{
			this.users.splice(this.users.indexOf(user), 1);
		}		

	},
	createFile : function (file) {
		var f;
		if(file.indexOf('.') > -1){
			f = new File(file, this.fileArea);
			f.init();
			this.files.push(f);
		}else{
			f = new Folder(file, this.fileArea);
			f.init();
		 	this.folders.push(f);
		} 

	},
	parseFiles : function (files) {
		this.fileArea.html('');
		for(var i in files)
			this.createFile(files[i]);
	},
	socketHandlers : function () {
		io.on("projects", this.parseFiles.bind(this));
	},
	eventHandlers : function () {
		var self = this;
		this.projectArea.on('contextmenu', '.project', this.folderMenu.bind(this));
		this.projectArea.on('click', '.folder-context', this.folderEvent.bind(this));
		this.createFileBox.on('keyup', 'input', function (e) {
			if(e.keyCode === 13){
				self.createFileBox.hide();
				self.emitCreateFile($(this).val());
				$(this).val('');
			}
		})
	},
	showCreateFileBox : function () {
		this.createFileBox.show().find('input').focus();
	},
	emitCreateFile : function (file) {
		io.emit('project', {
			method : 'createFile',
			user : this.user.user,
			url : this.url,
			file : file
		})	
	},
	folderEvent : function (e) {
		var method = $(e.target).attr('class');
		if(method === 'createFile')this.showCreateFileBox();
	},
	folderMenu : function (e) {
		this.url = $(e.target).attr('url');
		this.fileContext.show().css({
			top : e.pageY,
			left : 50
		});
		return false;
	},
	open : function () {
		$(this).find('.file').show();	
	},
	getProjects : function () {
		io.emit("projects");
	}
}