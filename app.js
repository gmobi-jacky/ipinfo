/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START app]
'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {

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

  res.status(200).json({
        ip: ip,
        headers: req.headers,
        session: req.session,
        query: req.query,
        body: req.body
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
