// Show chat screen
exports.show = function(req, res) {
	// Render home screen
	res.render('chatmessage', {
		title: 'myShoppe',
		callToAction: 'ITP211'
	});
};