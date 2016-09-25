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
		latitude = msg.lat
		longitude = msg.lng
		console.log latitude + ", " + longitude
		message = msg.value
		console.log "message: " + message
		if message.match(/周辺のホテル/)
			searchHotel(latitude, longitude)
		else
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

searchHotel = (lat, lng) ->
	hotelUrl = "http://139.59.224.35:5000/api/v1/hotels?x=41.773767&y=140.726450"
	options =
		uri: hotelUrl,
		method: 'GET',
		headers: headers
	request options, (error, response, body) ->
		json = JSON.parse(body)
		hotelname = json[0].hotelname
		msg = "#{hotelname}が近くにあります"
		io.sockets.emit "chat", {value: msg}
