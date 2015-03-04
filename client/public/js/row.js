function Row () {
	this.characters = [];
	this.id;
	this.rowNumber;
	this.row;

	this.cursor;
	this.hasCursor;
	this.cursorPos;
}

Row.prototype = {
	init : function (num) {
		this.id = 'row-' + num;
		this.rowNumber = num;
		
		this.cursor = $('<div>', {class : 'cursor'});
		// this.eventHandlers();
	},
	updateId : function (num) {
		this.id = 'row-' + num;
		this.rowNumber = num;
		this.updateText();
	},
	addCharacter : function (char) {
		this.removeCursor();
		this.characters.splice(this.cursorPos, 0, this.createChar(char));
		this.addCursor(this.cursorPos + 1);
		this.updateText();
	},
	addCharacters : function (list, pos) {
		if(!list)return;
		for(var i = 0; i < list.length; i++)
			this.characters.push(list[i]);
		this.updateText();
	},
	addText : function (text) {
		this.removeCursor();
		for(var i in text)
			this.characters.push(this.createChar(text[i]));
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
	getRemainingCharacters : function () {
		return this.characters.splice(this.cursorPos + 1);	
	},
	
	getCursorPos : function () {
		return this.cursorPos;	
	},
	updateText : function () {
		this.getRow().text('');
		for(var i in this.characters)
			this.getRow().append(this.characters[i]);
	},
	getRow : function () {
		return $('#' + this.id);	
	},
	enter : function () {
		var index = this.cursorPos + 1,
			arr = [];
		for(var i = index; i < this.characters.length; i++)
			arr.push(this.characters[i]);
		for(var i = index - 1; i < this.characters.length; i++)
			this.characters.splice(i, 1);

		return arr;
	},
	createChar : function (char) {
		return $('<div>', {class : 'character', id : 'character-' + this.characters.length, text : char});
	},
	moveCursorToBeginning : function () {
		// this.removeCursor();
		// this.characters.unshift(this.cursor);
		this.characters.splice(this.characters.indexOf(this.cursor), 1);
		this.characters.unshift(this.cursor);
	},
	moveCursorToCharacter : function (id, direction) {
		var ch = this.getCharacter(id),
			index = this.characters.indexOf(ch);
		this.removeCursor();
		this.addCursor(direction === 'right' ? index + 1 : index);
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