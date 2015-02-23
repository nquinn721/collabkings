function Manager () {
	// Inherited Classes
	this.chat 	= new Chat;
	this.editor = new Editor;
	this.files 	= new FileManager;
	this.user 	= new UserManager;

}

Manager.prototype = {
	init : function  () {
		this.eventHandlers();
		this.editor.init();
		// if(localStorage.user){
		// 	this.login(localStorage.user);
		// }
	},
	startChat : function (user) {
		localStorage.user = user;
		this.chat.init(user);
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
	changeLanguage : function (language) {
		this.editor.changeLanguage(language);
	},
	changeTheme : function (theme) {
		this.editor.changeTheme(theme);
	},
	hideLogin : function () {
		$('.login').hide();
	},
	
	login : function (username) {
		var username = $('.username').val();
		this.startChat(username);
		this.hideLogin();
		this.user.init(username);
		this.files.init();

		return false;

	}
}