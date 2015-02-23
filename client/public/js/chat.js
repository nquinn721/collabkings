function Chat (user){
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
		this.username.text(this.user);
	},
	displayMessage : function (msg) {
		var ms = this.msgArea,
			wr = this.msgWrapper,
			msg = $('<div>', {class : 'msg', text :msg.user + ' says: ' + msg.msg });

		ms.append(msg);

		if(wr.scrollTop() + wr.height() >= ms.height())
			wr.scrollTop(ms.height());
		
		this.textInput.val('').focus();
	},
	eventHandlers : function  () {
		var self = this;
		this.textInput.on('keydown', function (e) {
			if(e.keyCode === 13 && $(this).val() !== '')
				self.emit($(this).val());
		});
		this.header.on('click', this.minimize.bind(this));
		this.usersArea.on('contextmenu','.user', function(e){
			self.userContextMenu.call(self, e, $(this).prop('user'));
		});
	},
	socketHandlers : function () {
		io.on('msg', this.displayMessage.bind(this));
		io.on('users', this.manageUsers.bind(this));
		io.on('logout', this.logout.bind(this));
	},
	manageUsers : function (usersList) {
		this.usersArea.text('');
		for(var i in usersList){
			if(usersList[i]){
				var name = usersList[i].split(' ').join('').toLowerCase(),
					user = $('<div>', {class : 'user', user : name}),
					fa = $('<i>', {class : 'fa fa-user'});

				this.usersArea.append(user.append(fa,' ' + usersList[i]));
			}
		}
	},
	logout : function (user) {
		var user = user.split(' ').join('').toLowerCase();
		this.usersArea.find('[user=' +  user + ']').remove();
	},
	emit : function (msg) {
		io.emit('msg', {user : this.user, msg : msg});
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