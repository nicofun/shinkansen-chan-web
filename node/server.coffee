config = require 'config'
request = require 'request'

zatsuKey = config.zatsuKey;
zatsuUrl = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY="
zatsuUrl = zatsuUrl + zatsuKey

headers =
	'Content-type': 'application/json; charset=utf-8'

io = require("socket.io").listen 8000;

io.sockets.on "connection", (socket) ->
	socket.on "chat", (msg) ->
		message = msg.value
		console.log "message: " + message
		data =
			'utt': message
		options =
			uri: zatsuUrl,
			method: 'POST',
			headers: headers,
			json: true,
			body: data
		request options, (error, response, body) ->
			console.log "utt: " + body.utt
			io.sockets.emit "chat", {value: body.utt}
