function Editor () {
	this.totalRows = 0;
	this.currentRow = 0;
	this.cursorLocation = 0;
	this.editorRow = $('.row');
	this.numbers = $('.numbers');

	this.editor = $('.editor');
	this.themeCSS = $('.csstheme');
	this.language = 'javascript';
}

Editor.prototype = {
	init : function () {
		this.showRows();	
	},
	row : function () {
		this.totalRows++;
		return $('<div>', {class : 'row'});
	},
	getRow : function () {
		return this.currentRow;
	},
	showRows : function () {
		for(var i = 0; i < this.editorRow.length; i++){
			this.totalRows++;
			this.numbers.append($('<div>', {class : 'num', text : i + 1}))
		}

	},
	changeTheme : function (theme) {
		this.themeCSS.attr('href', 'css/highlight/' + theme);
	},
	changeLanguage : function (language) {
		console.log(language);
		this.language = language;
		this.editor.attr('class', language);
	}
}