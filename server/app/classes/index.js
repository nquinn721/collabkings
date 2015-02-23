module.exports = {
	fs : require('fs'),

	home : function (req, res) {
		var styles = this.fs.readdirSync(__dirname + '/../../../client/public/css/highlight');
		res.render('index', {styles : styles});
	}
}