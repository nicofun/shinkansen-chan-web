io = require("socket.io").listen 8000;

io.sockets.on "connection", (socket) ->
	socket.on "connected", (msg) ->
		io.sockets.emit "connected", {value: msg.value}
