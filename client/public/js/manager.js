function Manager () {
	// Inherited Classes
	this.chatManager 	= new ChatManager;
	this.editorManager 	= new EditorManager;
	this.fileManager 	= new FileManager;
	this.userManager 	= new UserManager;

}

Manager.prototype = {
	init : function  () {
		this.eventHandlers();
		this.socketHandlers();
		this.initManagers();
	},
	initManagers : function  () {
		this.chatManager.init();
		this.fileManager.init();
		this.userManager.init();
		this.editorManager.init();
	},
	startChat : function (user) {
		localStorage.user = user;
		this.chatManager.init(user);
	},
	addUser : function (users) {
		var user = this.userManager.createUser(user);
		this.chatManager.addUser(user);
		this.fileManager.addUser(user);
		this.editorManager.addUser(user);
		this.userManager.addUser(user);
	},
	removeUser : function (user) {
		this.chatManager.removeUser(user);
		this.fileManager.removeUser(user);
		this.editorManager.removeUser(user);
		this.userManager.removeUser(user);
	},

	eventHandlers : function () {
		var self = this;
		$(document).on('click', function () {
			$('.context-menu').hide();
		});

		$('.login form').on('submit', this.login.bind(this));
		$('.theme select').on('change', function(){
			self.changeTheme($(this).val());
		});
		$('.language select').on('change', function(){
			self.changeLanguage($(this).val());
		});
	},
	socketHandlers : function  () {
		io.on('add-user', this.addUser.bind(this));
		io.on('remove-user', this.removeUser.bind(this));
	},
	
	hideLogin : function () {
		$('.login').hide();
	},
	
	login : function (username) {
		var username = $('.username').val();
		// this.startChat(username);
		this.hideLogin();
		// this.userManager.init(username);
		// this.files.init();

		return false;

	}
}