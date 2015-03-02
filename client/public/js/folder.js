function Folder (file, projectArea) {
	this.projectArea = projectArea;
	this.file = file;
	this.url = file;
}

Folder.prototype = {
	init : function () {
		this.createFolder();
		this.eventHandlers();
	},

	createFolder : function () {
		var project = $('<div>', {class : 'project ' + this.file, url : this.url}),
			folder = $('<div>', {class : 'folder ' + this.file, text : this.file}),
			i = $('<i>', {class : 'fa fa-folder-o'});

		this.folder = folder;
		this.i = i;

		project.append(folder.prepend(i, ' '));
		this.projectArea.append(project);
	},
	eventHandlers : function () {
		this.folder.on('click', this.open.bind(this));
	},
	open : function () {
		if(this.isOpen){
			this.i.removeClass('fa-folder-open-o').addClass('fa-folder-o');
			this.folder.find('.file').hide();
			this.isOpen = false;
		}else{
			this.i.removeClass('fa-folder-o').addClass('fa-folder-open-o');
			this.folder.find('.file').show();
			this.isOpen = true;
		}
	}
}