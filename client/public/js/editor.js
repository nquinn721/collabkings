function Editor (id) {
	this.users = [];
	this.totalRows = 0;
	this.currentRow = 0;
	this.previousRow = 0;
	this.cursorLocation = 0;
	this.codeArea = $('#' + id);
	this.numbers = this.codeArea.find('.numbers');
	this.rows = [];

	this.editor = this.codeArea.find('.editor');
	this.themeCSS = this.codeArea.find('.csstheme');
	this.language = 'javascript';

	this.id = id;


}

Editor.prototype = {
	init : function () {
		var row = this.createRow();
		this.currentRow = row;
		this.eventHandlers();
		this.getKeyCodes();
	},
	createRow : function () {
		var row = new Row(this.totalRows);
		row.init();
		this.totalRows++;
		this.rows.push(row);
		this.showRows();
		return row;
	},
	getRow : function () {
		return this.currentRow;
	},
	showRows : function () {
		this.numbers.html('');
		this.editor.html('');
		for(var i = 0; i < this.totalRows; i++){
			this.numbers.append(this.rows[i].rowNumber);
			this.editor.append(this.rows[i].row);
		}

	},

	eventHandlers : function () {
		var self = this;
		this.codeArea.on('click', this.handleClick.bind(this));
		this.editor.on('keydown', this.handleKeyup.bind(this));
	},
	handleKeyup : function (e) {
		var row = this.getRowHasCursor(),
			ck = this.keyCodes[e.keyCode];

		// Dont handle any key events if no row has cursor
		if(!row)return;


		if(ck === 'enter'){
			// var chars = this.getRemainingCharacters();
			this.createRow();
			this.moveDownRow();
			// this.addRemainingCharacters(chars);
		}else if(ck === 'up'){
			this.moveUpRow();
		}else if(ck === 'down'){
			this.moveDownRow();
		}else if(ck === 'left'){
			this.currentRow.moveCursorLeft();
		}else if(ck === 'right'){
			this.currentRow.moveCursorRight();
		}else{
			return this.addCharacter(e);
		}
	},
	getRemainingCharacters : function  () {
		return this.currentRow.enter();
	},
	addRemainingCharacters : function (chars) {
		this.currentRow.addCharacters(chars);
	},
	moveDownRow : function () {
		var row = this.getRowBelow();
		this.addCursor(row);
		this.currentRow = row;
	},
	moveUpRow : function  () {
		var row = this.getRowAbove();
		this.addCursor(row);
		this.currentRow = row;
	},
	handleClick : function (e) {
		var id = e.target ? e.target.id : e,
			row;
		console.log(id);
		this.editor.focus();

		if(id.match('character')){
			this.clearRowCursors();
			row = this.getRowById(e.target.parentNode.id);
			row.moveCursorToCharacter(row, id);
		} else if(id.match('row')){
			row = this.getRowById(id);
			this.addCursor(row, e);
		}else{
			row = this.rows[this.rows.length - 1];
			this.addCursor(row, e);
		}



	},
	addCursor : function (row) {
		if(!row)return;
		this.clearRowCursors();
		row.addCursor();
		this.currentRow = row;
	},
	addCharacter : function (e) {
		var row = this.getRowHasCursor();
		var ch = this.keyCodes[e.keyCode];


		if(ch === 'spacebar')
			ch = ' ';
		if(ch === 'tab')
			ch = '   ';

		if(ch === 'backspace' && row){
			row.removeCharacter();
			return false;
		}else if(row)
			ch = this.checkShift(e, ch);
			ch = this.checkCtrl(e, ch);
			row.addCharacter(ch, 1);
	},
	checkShift : function (e, ch) {
		if(e.shiftKey){
			if(this.shiftCombos[ch])return this.shiftCombos[ch];
			else return ch;
		}else return ch;
	},
	checkCtrl : function (e, ch) {
		return ch;	
	},
	clearRowCursors : function () {
		for(var i in this.rows)
			this.rows[i].removeCursor();
	},
	changeTheme : function (theme) {
		this.themeCSS.attr('href', 'css/highlight/' + theme);
	},
	changeLanguage : function (language) {
		this.language = language;
		this.editor.attr('class', language);
	},
	addUser : function (user) {
		this.users.push(user);
	},

	// Row Getters
	getRowBelow : function () {
		var id = this.currentRow.id,
			num = parseInt(id.split('-')[1]),
			row = this.getRowById('row-'+ (num + 1));
		if(row)
			return row;	
	},
	getRowAbove : function  () {
		var id = this.currentRow.id,
			num = parseInt(id.split('-')[1]);
		if(num !== 0)
			return this.getRowById('row-'+ (num - 1));
	},
	getRowById : function (id) {
		for(var i in this.rows)
			if(this.rows[i].id === id)
				return this.rows[i];	
	},
	getRowHasCursor : function () {
		for(var i in this.rows)
			if(this.rows[i].hasCursor)
				return this.rows[i];	
	},

	getKeyCodes : function () {
		this.shiftCombos = {
			'[' : '{',
			']' : '}',
			'9' : '(',
			'0' : ')',
			'-' : '_',
			'=' : '+',
			'1' : '!',
			'2' : '@',
			'3' : '#',
			'4' : '$',
			'5' : '%',
			'6' : '^',
			'7' : '&',
			'8' : '*',
			';' : ':',
			"'" : '"',
			'/' : '?',
			',' : '<',
			'.' : '>',
			'\\' : '|',
			'a' : 'A',
			'b' : 'B',
			'c' : 'C',
			'd' : 'D',
			'e' : 'E',
			'f' : 'F',
			'g' : 'G',
			'h' : 'H',
			'i' : 'I',
			'j' : 'J',
			'k' : 'K',
			'l' : 'L',
			'm' : 'M',
			'n' : 'N',
			'o' : 'O',
			'p' : 'P',
			'q' : 'Q',
			'r' : 'R',
			's' : 'S',
			't' : 'T',
			'u' : 'U',
			'v' : 'V',
			'w' : 'W',
			'x' : 'X',
			'y' : 'Y',
			'z' : 'Z'

		}
		this.keyCodes = {
			8 : 'backspace',
			9 : 'tab',
			13 : 'enter',
			19 : 'pause/break',
			20 : 'caps lock',
			27 : 'escape',
			33 : 'page up',
			34 : 'page down',
			35 : 'end',
			36 : 'home',
			37 : 'left',
			38 : 'up',
			39 : 'right',
			40 : 'down',
			45 : 'insert',
			46 : 'delete',
			48 : '0',
			49 : '1',
			50 : '2',
			51 : '3',
			52 : '4',
			53 : '5',
			54 : '6',
			55 : '7',
			56 : '8',
			57 : '9',
			65 : 'a',
			66 : 'b',
			67 : 'c',
			68 : 'd',
			69 : 'e',
			70 : 'f',
			71 : 'g',
			72 : 'h',
			73 : 'i',
			74 : 'j',
			75 : 'k',
			76 : 'l',
			77 : 'm',
			78 : 'n',
			79 : 'o',
			80 : 'p',
			81 : 'q',
			82 : 'r',
			83 : 's',
			84 : 't',
			85 : 'u',
			86 : 'v',
			87 : 'w',
			88 : 'x',
			89 : 'y',
			90 : 'z',
			186 : ';',
			187 : '=',
			188 : ',',
			189 : '-',
			190 : '.',
			191 : '/',
			219 : '[',
			220 : '\\',
			221 : ']',
			222 : "'",
			32  : 'spacebar'
		}
	}
}