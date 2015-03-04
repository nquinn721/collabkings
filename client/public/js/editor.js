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
		this.socketHandlers();
	},
	createRow : function (text, index) {
		var row = new Row();
		row.init(index || this.totalRows);


		if(index){
			this.updateRowIds(index);
			this.rows.splice(index, 0, row);
		} else
			this.rows.push(row);


		this.totalRows++;
		this.showRows();
		if(text){
			if(typeof text === 'object')
				row.addCharacters(text);
			else
				row.addText(text);
		}
		return row;
	},
	updateRowIds : function (index) {
		for(var i = index; i < this.totalRows; i++)
			this.rows[i].updateId(i + 1);	
	},
	showRows : function () {
		this.numbers.html('');
		this.editor.html(''); 
		for(var i = 0; i < this.totalRows; i++){
			this.numbers.append($('<div>', {class : 'row-number', id : "row-number-" + i, text : i + 1}));
			this.editor.append($('<div>', {class : 'row', id : 'row-' + i}));
			this.rows[i].updateText();
		}
	},

	eventHandlers : function () {
		var self = this;
		this.codeArea.on('click', this.handleClick.bind(this));
		this.editor.on('keydown', this.handleKeyup.bind(this));
		$('#save').on('click', this.save.bind(this));
	},
	socketHandlers : function () {
		io.on('readfile', this.readFile.bind(this));	
	},
	handleClick : function (e) {
		var target = e.target ? e.target.nodeName === 'SPAN' ? $(e.target).parents('div') : e.target : e,
			id = $(target).attr('id'),
			row;
		this.editor.focus();


		if(id.match('character')){
			var characterLeft = $(target).offset().left + ($(target).width() / 2),
				mouseLeft = e.pageX;
			row = $(target).parent().attr('id');
			this.currentRow.removeCursor(id);
			row = this.getRowById(row);
			row.moveCursorToCharacter(id, (characterLeft > mouseLeft ? 'left' : 'right'));
			this.currentRow = row;
		} else if(id.match('row')){
			this.currentRow.removeCursor();
			row = this.getRowById(id);
			this.moveCursor(row);
		}else{
			this.currentRow.removeCursor();
			row = this.rows[this.rows.length - 1];
			this.moveCursor(row);
		}

		this.updateHighlighter();

	},
	handleKeyup : function (e) {
		var row = this.getRowHasCursor(),
			ck = this.keyCodes[e.keyCode];
		
		// Dont handle any key events if no row has cursor
		if(!row)return;

		if(ck === 'f5')return true;


		if(ck === 'enter'){
			var index = parseInt(row.id.split('-')[1]);
			var text = this.currentRow.getRemainingCharacters();
			if(this.getRowBelow())
				this.createRow(text, index + 1);
			else
				this.createRow(text);
			this.moveDownRow();
			this.currentRow.moveCursorToBeginning();
		}else if(ck === 'up'){
			this.moveUpRow();
		}else if(ck === 'down'){
			this.moveDownRow();
		}else if(ck === 'left'){
			this.currentRow.moveCursorLeft();
		}else if(ck === 'right'){
			this.currentRow.moveCursorRight();
		}else{
			this.addCharacter(e);
		}
		this.updateHighlighter();
		return false;
	},
	readFile : function (file) {
		if(!file){
			this.clearEditor();
			this.createRow();
			return;
		};
		var file = file.split("\n");
		this.rows = [];
		this.totalRows = 0;
		for(var i = 0; i < file.length; i++){
			this.createRow(file[i]);
		}
		this.updateHighlighter();
	},
	clearEditor : function () {
		this.rows = [];
		this.editor.html('');	
		this.numbers.html('');
		this.totalRows = 0;
	},
	moveDownRow : function () {
		var row = this.getRowBelow();
		var pos = this.currentRow.getCursorPos();
		if(row){
			this.currentRow.removeCursor();
			this.moveCursor(row, pos);
		}
	},
	moveUpRow : function  () {
		var row = this.getRowAbove();
		var pos = this.currentRow.getCursorPos();
		if(row){
			this.currentRow.removeCursor();
			this.moveCursor(row, pos);
		}
	},
	
	moveCursor : function (row, pos) {
		if(!row)return;
		row.addCursor(pos);
		this.currentRow = row;
		this.updateHighlighter();
	},
	addCharacter : function (e) {
		var row = this.currentRow;
		var ch = this.keyCodes[e.keyCode];

		if(ch === 'spacebar')
			ch = ' ';
		if(ch === 'tab')
			ch = '   ';

		if(ch === 'backspace'){
			row.removeCharacter();
		}else{
			ch = this.checkShift(e, ch);
			ch = this.checkCtrl(e, ch);
			row.addCharacter(ch);
		}
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
	getRowByIndex : function (index) {
		for(var i in this.rows)
			if(parseInt(this.rows[i].rowNumber) === parseInt(index))
				return this.rows[i];
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
	updateHighlighter : function  () {
		$('.editor').each(function(i, f){
			hljs.highlightBlock(f);
		});
	},

	save : function () {
		var str = "";
		for(var i in this.rows)
			str += $('#' + this.rows[i].id).text() + "\n";
		io.emit('project', {user : "Nate", method : "save", file : 'bobart.js', str : str, url : '/'});
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
			116 : "f5",
			32  : 'spacebar'
		}
	}
}