speechFlag = true;
if (!'SpeechSynthesisUtterance' in window) {
	console.log('Web Speech API には未対応です.');
	speechFlag = false;
}

window.onload = function() {
	resizer();
	sampleApp1();
	socketio = io.connect(document.domain + ":8000");
	socketio.on("chat", function(data) { addTweet(data.value); });
};

window.addEventListener("resize", function() {
	resizer();
});

function resizer() {
	if(window.innerWidth < 500) {
		document.getElementById('glcanvas').setAttribute("width", window.innerWidth - 16);
		document.getElementById('glcanvas').setAttribute("height", 300);
	} else {
		document.getElementById('glcanvas').setAttribute("width", 680);
		document.getElementById('glcanvas').setAttribute("height", 940);
	}
}


var speecher = new webkitSpeechRecognition();
function tweet() {
	var tweetMsg = document.getElementById('tweetMsg');
	if(tweetMsg.value !== "") {
		socketio.emit("chat", {value: tweetMsg.value});
		tweetMsg.value = "";
	} else {
		speecher.lang = "ja";
		speecher.start();
	}
}

speecher.addEventListener('result', function(e) {
	var text = e.results[0][0].transcript;
	console.log(text);
	socketio.emit("chat", {value: text});
});

function addTweet(chat) {
	if(speechFlag) {
		var msg = new SpeechSynthesisUtterance();
    	msg.volume = 1;
    	msg.rate = 1;
    	msg.pitch = 2;
    	msg.text = chat; // しゃべる内容
    	msg.lang = 'ja-JP'; // en-US or ja-UP
		speechSynthesis.speak(msg);
	}

	var tweetArea = document.getElementById('tweetArea');
	var tweet = document.createElement('p');
	tweet.innerHTML = chat;
	tweetArea.appendChild(tweet);
}
