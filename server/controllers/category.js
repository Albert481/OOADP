// Show categories screen
exports.show = function(req, res) {
	// Render home screen
	res.render('category', {
		title: 'myShoppe',
		callToAction: 'ITP211'
	});
};
