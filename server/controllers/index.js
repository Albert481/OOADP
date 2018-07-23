// Show home screen
exports.show = function(req, res) {
	// Render home screen
	res.render('index', {
		title: 'myShoppe',
		notifi_id: -1,
		callToAction: 'ITP211'
	});
};
