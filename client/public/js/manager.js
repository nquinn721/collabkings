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
	},
	initManagers : function (user) {
		this.user = this.userManager.createUser(user);
		this.chatManager.init(this, this.user);
		this.fileManager.init(this, this.user);
		this.userManager.init(this, this.user);
		this.editorManager.init(this, this.user);
	},
	startChat : function (user) {
		localStorage.user = user;
		this.chatManager.init(user);
	},
	addUser : function (user) {
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
		$('.username').focus();
		$('.code-area').mCustomScrollbar();

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
		io.on('init', this.initManagers.bind(this));
		io.on('logout', this.logout.bind(this));
	},
	
	hideLogin : function () {
		$('.login').hide();
	},
	logout : function (user) {
		
	},
	login : function (username) {
		var user = $('.username').val();
		
		this.hideLogin();
		io.emit("login", user);
		return false;
	}
}