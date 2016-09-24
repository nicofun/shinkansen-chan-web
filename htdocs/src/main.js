var socketio = io.connect(document.domain + ":8000")

socketio.on("connected", function(data) { console.log(data.value) });

function tweet() {
	var tweetMsg = document.getElementById('tweetMsg');
	if(tweetMsg.value !== "") {
		socketio.emit("connected", {value: tweetMsg.value});
		tweetMsg.value = "";
	}
}
