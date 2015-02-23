function FileManager() {
	// Collection
	this.files = [];
	this.folders = [];

	// HTML Collections
	this.projectArea = $('.project-area');
}

FileManager.prototype = {
	init : function () {
		this.getProjects();
		this.socketHandlers();
		this.eventHandlers();
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