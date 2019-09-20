export function loggerMiddleware(req, res, next) {
	console.log(`Request...`, {
		'req.route': req.route,
		'req.headers': req.headers, 
		'req.query': req.query,
		'req.body': req.body,
		'req.cookies': req.cookies
	});
	console.log(`Response...`, {
		'res.statusCode': res.statusCode,
		'res.body': res.body,
	})
	next();
};