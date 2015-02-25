function Cursor (user) {
	this.cursor = $('<div>', {class : 'cursor', id : 'cursor-' + user});

	this.cursorPos = undefined;
}

Cursor.prototype = {
	
}