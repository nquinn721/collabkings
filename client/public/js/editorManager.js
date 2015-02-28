function EditorManager() {
	this.editors = [];
	this.users = [];
}

EditorManager.prototype = {
	init : function  (manager) {
		this.manager = manager;
		this.createEditor();
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
	createEditor : function () {
		var editor = new Editor('editor1');
		editor.init();
		this.editors.push(editor);	
	},
	changeLanguage : function (editor, language) {
		var editor = this.getEditor(editor);
		editor.changeLanguage(language);
	},
	changeTheme : function (editor, theme) {
		var editor = this.getEditor(editor);
		editor.changeTheme(theme);
	},
	getEditor : function (id) {
		for(var i = 0; i < this.editors.length; i++)
			if(this.editors[i].id === id)
				return this.editors[i];
	}
}