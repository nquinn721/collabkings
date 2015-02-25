function EditorManager() {
	this.editors = [];
}

EditorManager.prototype = {
	init : function  () {
		this.createEditor();
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