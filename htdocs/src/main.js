window.onload = function() {
	sampleApp1();
};

var socketio = io.connect(document.domain + ":8000")

socketio.on("chat", function(data) { addTweet(">> " + data.value); });

function tweet() {
	var tweetMsg = document.getElementById('tweetMsg');
	if(tweetMsg.value !== "") {
		addTweet("<< " + tweetMsg.value);
		socketio.emit("chat", {value: tweetMsg.value});
		tweetMsg.value = "";
	}
}

function addTweet(chat) {
	var tweetArea = document.getElementById('tweetArea');
	var tweet = document.createElement('p');
	tweet.innerHTML = chat;
	tweetArea.appendChild(tweet);
}
