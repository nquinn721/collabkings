function FileManager() {
	// Collection
	this.files = [];
	this.folders = [];

	// HTML Collections
	this.projectArea = $('.file-manager');
}

FileManager.prototype = {
	init : function () {
		this.getProjects();
		this.socketHandlers();
		this.eventHandlers();
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
			f = new File(file, this.projectArea);
			f.init();
			this.files.push();
		}else{
			f = new Folder(file, this.projectArea);
			f.init();
		 	this.folders.push(f);
		} 

	},
	parseFiles : function (files) {
		for(var i in files)
			this.createFile(files[i]);
	},
	socketHandlers : function () {
		io.on("projects", this.parseFiles.bind(this));
	},
	eventHandlers : function () {
	},
	open : function () {
		$(this).find('.file').show();	
	},
	getProjects : function () {
		io.emit("projects");
	}
}