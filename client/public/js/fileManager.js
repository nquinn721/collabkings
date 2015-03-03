function FileManager() {

	// Collection
	this.files = [];
	this.folders = [];
	this.users = [];

	// HTML Collections
	this.projectArea = $('.file-manager');
	this.folderContext = $('.folder-context');
	this.fileContext = $('.file-context');
	this.createFileBox = $('.create-file');
	this.createFolderBox = $('.create-folder');
	this.deleteFileBox = $('.delete-file');
	this.deleteFolderBox = $('.delete-folder');
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
		this.projectArea.on('contextmenu', '.folder', this.folderMenu.bind(this));
		this.projectArea.on('contextmenu', '.file', this.fileMenu.bind(this));
		this.projectArea.on('click', this.fileEvent.bind(this));
		this.createFileBox.on('keyup', 'input', function (e) {
			if(e.keyCode === 13){
				self.createFileBox.hide();
				self.updateProject('createFile', $(this).val());
				$(this).val('');
			}
		});
		this.createFolderBox.on('keyup', 'input', function (e) {
			if(e.keyCode === 13){
				self.createFolderBox.hide();
				self.updateProject('createFolder', $(this).val());
				$(this).val('');
			}
		});
		this.deleteFileBox.on('click', 'input', function (e) {
			if($(e.target).hasClass('yes'))
				self.updateProject('deleteFile');
			self.deleteFileBox.hide();
		});
		this.deleteFolderBox.on('click', 'input', function (e) {
			if($(e.target).hasClass('yes'))
				self.updateProject('deleteFolder');
			self.deleteFolderBox.hide();
		});
	},
	showCreateFileBox : function () {
		this.createFileBox.show().find('input').focus();
	},
	showCreateFolderBox : function () {
		this.createFolderBox.show().find('input').focus();
	},
	showDeleteFileBox : function () {
		this.deleteFileBox.show();	
	},
	showDeleteFolderBox : function () {
		this.deleteFolderBox.show();	
	},
	updateProject : function (method, file) {
		io.emit('project', {
			method : method,
			user : this.user.user,
			url : this.url,
			file : file
		})	
	},
	fileEvent : function (e) {
		var t = $(e.target),
			method = t.attr('class'),
			attr = t.attr('url');
		if(typeof attr !== typeof undefined && attr !== false)
			this.url = t.attr('url');
		if(method === 'createFile')this.showCreateFileBox();
		if(method === 'createFolder')this.showCreateFolderBox();
		if(method === 'deleteFolder')this.showDeleteFolderBox();
		if(method === 'deleteFile')this.showDeleteFileBox();
		if(method === 'shareFile')this.shareFile();
	},
	fileMenu : function (e) {
		$('.context').hide();
		this.url = $(e.target).attr('url');
		this.fileContext.show().css({
			top : e.pageY,
			left : 50
		});
		return false;
	},
	folderMenu : function (e) {
		$('.context').hide();
		this.url = $(e.target).attr('url');
		this.folderContext.show().css({
			top : e.pageY,
			left : 50
		});
		return false;
	},
	shareFile : function () {
		io.emit('sharefile', this.url);
	},
	open : function () {
		$(this).find('.file').show();	
	},
	getProjects : function () {
		io.emit("projects");
	}
}