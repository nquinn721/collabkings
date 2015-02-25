function Row (num) {
	this.characters = [];
	this.id = 'row-' + num;
	this.rowNumber = $('<div>', {class : 'row-number', id : "row-number-" + num, text : num + 1});
	this.row = $('<div>', {class : 'row', id : 'row-' + num});

	this.cursor = $('<div>', {class : 'cursor'});
	this.hasCursor;
	this.cursorPos;
}

Row.prototype = {
	init : function () {
		// this.eventHandlers();
	},
	addCharacter : function (char, pos) {
		// this.characters.splice(this.characters.indexOf(this.cursor), 1);
		this.removeCursor();
		this.characters.splice(this.cursorPos, 0, this.createChar(char));
		this.addCursor(this.cursorPos + 1);

		// this.characters.push(this.createChar(char), this.cursor);
		this.updateText();
	},
	addCharacters : function (list, pos) {
		if(!list)return;
		for(var i = 0; i < list.length; i++)
			this.characters.push(list[i]);
		this.updateText();
	},
	removeCharacter : function (char, pos) {
		var pos = this.characters.indexOf(this.cursor) - 1;
		if(pos < 0)return;

		this.characters.splice(pos, 1);
		this.updateText();
	},
	eventHandlers : function () {
	},
	addCursor : function (pos) {
		this.hasCursor = true;
		if(pos === undefined)pos = this.characters.length;
		this.characters.splice(pos, 0, this.cursor);
		this.cursorPos = pos;
		this.updateText();
	},
	removeCursor : function () {
		if(!this.hasCursor)return;

		this.hasCursor = false;
		this.characters.splice(this.characters.indexOf(this.cursor), 1);
		this.updateText();
	},
	moveCursorToBeginning : function () {
		// this.removeCursor();
		// this.characters.unshift(this.cursor);
	},

	updateText : function () {
		var row = this.getRow();
		row.text('');
		for(var i in this.characters)
			row.append(this.characters[i]);

		$('.editor').each(function(i, f){
			hljs.highlightBlock(f);
		});
	},
	enter : function () {
		var index = this.characters.indexOf(this.cursor) + 1,
			arr = [];
		for(var i = index; i < this.characters.length; i++)
			arr.push(this.characters[i]);
		for(var i = index - 1; i < this.characters.length; i++)
			this.characters.splice(i, 1);

		return arr;
	},
	getRow : function () {
		return $('#' + this.id);
	},
	createChar : function (char) {
		return $('<div>', {class : 'character', id : 'character-' + this.characters.length, text : char});
	},
	moveCursorToCharacter : function (id) {
		var ch = this.getCharacter(id),
			index = this.characters.indexOf(ch);
		this.removeCursor();
		this.addCursor(index);
	},
	moveCursorRight : function () {
		if(this.cursorPos === this.characters.length - 1)return;

		this.removeCursor();
		this.cursorPos += 1;
		this.addCursor(this.cursorPos);
	},
	moveCursorLeft : function  () {
		if(this.cursorPos === 0)return;

		this.removeCursor();
		this.cursorPos -= 1;
		this.addCursor(this.cursorPos);
	},
	getCharacter : function (id) {
		for(var i in this.characters){
			if(this.characters[i]){
				if(this.characters[i].attr('id') === id){
					return this.characters[i];
					
				}
			}
		}
	}

}