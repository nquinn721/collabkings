function Chat (){
	var chat = $('.chat');
	this.chat = chat;
	this.header = chat.find('.chat-header');
	this.msgWrapper = chat.find('.chat-msg-area');
	this.msgArea = this.msgWrapper.find('div');
	this.usersArea = chat.find('.chat-users');
	this.textInput = chat.find('.chat-msg');
	this.username = chat.find('.username-area');
	this.contextmenu = $('.context-menu');


	this.user;
}

Chat.prototype = {
	init : function  (user) {
		this.user = user;
		this.eventHandlers();
		this.socketHandlers();
		this.textInput.focus();
		this.username.text(this.user.user);
		this.addUser(this.user);

	},
	displayMessage : function (msg) {
		var ms = this.msgArea,
			wr = this.msgWrapper,
			msg = $('<div>', {class : 'msg', text :msg.user + ' says: ' + msg.msg });

		ms.append(msg);

		if(wr.scrollTop() + wr.height() >= ms.height())
			wr.scrollTop(ms.height());
	},
	enter : function  () {
		this.textInput.val('').focus();
	},
	eventHandlers : function  () {
		var self = this;
		this.textInput.on('keydown', function (e) {
			if(e.keyCode === 13 && $(this).val() !== ''){
				self.emit($(this).val());
				self.enter();
			}
		});
		this.header.on('click', this.minimize.bind(this));
		this.usersArea.on('contextmenu','.user', function(e){
			self.userContextMenu.call(self, e, $(this).prop('user'));
		});
	},
	socketHandlers : function () {
		io.on('msg', this.displayMessage.bind(this));
		io.on('all-users', this.manageUsers.bind(this));
	},
	manageUsers : function (usersList) {
		console.log(usersList);
		this.usersArea.text('');
		for(var i in usersList)
			if(usersList[i])
				this.addUser(usersList[i]);
	},
	addUser : function (user) {
		var name = user.user.split(' ').join('').toLowerCase(),
			u = $('<div>', {class : 'user', user : name}),
			fa = $('<i>', {class : 'fa fa-user'});
		
		this.usersArea.append(u.append(fa,' ', user.user));	
	},
	logout : function (user) {
		var user = user.split(' ').join('').toLowerCase();
		this.usersArea.find('[user=' +  user + ']').remove();
	},
	emit : function (msg) {
		io.emit('msg', {user : this.user.user, msg : msg});
	},
	minimize : function () {

		if(!this.minimized){
			this.chat.animate({
				bottom : '-=' + (this.chat.height() - 30)
			}, 1000,  "easeInOutCubic");
			this.minimized = true;
		}else{
			this.chat.animate({
				bottom : '+=' + (this.chat.height() - 30)
			}, 1000,  "easeInOutCubic");
			this.minimized = false;
		}
	},
	userContextMenu : function (e, user) {
		var menuItem = $('<div>', {class : 'menu-item'}),
			whisper = menuItem.clone().text('Whisper'),
			info = menuItem.clone().text('Info');

		this.contextmenu.show().css({
			top : e.pageY,
			left : e.pageX,
			zIndex : 100
		}).text('').append(whisper, info).attr('user', user);
		return false;
	}
}