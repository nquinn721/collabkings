function File(file, projectArea) {
	this.file = file;
	this.projectArea = projectArea;
	this.project;
	this.isOpen = false;
	this.parent;


	this.ext = file.split('.')[1];


}

File.prototype = {
	init : function () {
		this.getParents();
		this.createProject();
		this.eventHandlers();
	},
	createProject : function () {
		var project = $("<div>", {class : 'file'}),
			i = $('<i>', {class : 'fa fa-file-o'});

		this.fileDiv = project;
		this.fa = i;

		project.append(i, ' ', this.file);
		
		if(this.parent)
			this.parent.append(project);
		else
			this.projectArea.append(project);
			
		
	},
	eventHandlers : function () {
		this.fileDiv.on('click', this.open.bind(this));
	},
	open : function () {
		this.fileDiv.css('background', '#222');
		return false;
	},
	getParents : function () {
		if(this.file.match(/\\|\//)){
			var f = this.file.split('\\');
			console.log(f, f[f.length - 1])
			this.file = f[f.length - 1];
			this.parent = $('.' + f[f.length - 2]);
		}
	}
}