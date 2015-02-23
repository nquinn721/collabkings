module.exports = {
	url : [
		'http://google.com/api/something'
	],
	test : function(){
		return this.get('url');
	}
}