'use strict';

const express = require('express');
const app = express();
function getClientIP(req){
	var ip = req.headers['push-real-ip'] ||
		req.headers['x-forwarded-for'] ||
		req.headers['x-real-ip'] ||
		req.connection.remoteAddress;
	var oip = ip;
	if (req.query.ip)
		ip = req.query.ip;
	if (ip&&ip.indexOf(',') != -1){
		var ips = ip.split(',');
		ip = ips[0]
		if (!ip && ips.length > 1)
			ip = ips[1]
		if (ip == '127.0.0.1' && ips.length > 1){
			ip = ips[1]
		}
	}
	if (ip && ip.indexOf('::ffff:') == 0){
		ip = ip.substring('::ffff:'.length)
	}
	return ip;
}
app.get('/', (req, res) => {
  	res.status(200).json({
        ip: getClientIP(req),
        headers: req.headers,
        session: req.session,
        query: req.query,
        body: req.body
    });
});

app.get('/s', (req, res) => {
	var data = {
        ip: getClientIP(req),
        country : req.headers['x-appengine-country'] || '',
        city : req.headers['x-appengine-city'] || '',
        region : req.headers['x-appengine-region'] || '',
        citylatlong : req.headers['x-appengine-citylatlong'] || ''
    }
    if ('?' == data.country || !data.country) delete data.country;
    if ('?' == data.city || !data.city) delete data.city;
    if ('?' == data.region || !data.region) delete data.region;
    if ('?' == data.citylatlong || !data.citylatlong) delete data.citylatlong;
  	res.status(200).json(data);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
