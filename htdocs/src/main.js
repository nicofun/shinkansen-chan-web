speechFlag = true;
if (!'SpeechSynthesisUtterance' in window) {
	alert('Web Speech API には未対応です。');
	speechFlag = false;
}

geoFlag = true;
lat = 0;
lng = 0;
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		function(position) {
			var data = position.coords;
			lat = data.latitude;
			lng = data.longitude;
			//alert(lat + ", " + lng);
		},
		function(error) {
			var code = error.code;
			var errorMsg = [
				"原因不明のエラーが発生しました...",
				"位置情報の取得が許可されませんでした...",
				"電波状況などで位置情報が取得できませんでした...",
				"位置情報の取得に時間がかかり過ぎてタイムアウトしました..."
			];
			alert(errorMsg[code]);
			geoFlag = false;
		},
		{
			"enableHighAccuracy": false,
			"timeout": 8000,
			"maximumAge": 2000,
		}
	);
} else {
	alert("現在地が取得できません。");
	geoFlag = false;
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
		document.getElementById('glcanvas').setAttribute("height", 500);
	} else {
		document.getElementById('glcanvas').setAttribute("width", 680);
		document.getElementById('glcanvas').setAttribute("height", 940);
	}
}


var speecher = new webkitSpeechRecognition();
function tweet() {
	var tweetMsg = document.getElementById('tweetMsg');
	if(tweetMsg.value !== "") {
		socketio.emit("chat", {value:tweetMsg.value, lat:lat, lng:lng});
		tweetMsg.value = "";
	} else {
		speecher.lang = "ja";
		speecher.start();
	}
}

speecher.addEventListener('result', function(e) {
	var text = e.results[0][0].transcript;
	console.log(text);
	socketio.emit("chat", {value:text, lat:lat, lng:lng});
});

function addTweet(chat) {
	if(speechFlag) {
		var msg = new SpeechSynthesisUtterance();
    	msg.volume = 1;
    	msg.rate = 1;
    	msg.pitch = 2;
		var regex = /<(.|\n)*?>/ig;
		msg.text = chat.replace(regex, "");
    	msg.lang = 'ja-JP'; // en-US or ja-UP
		speechSynthesis.speak(msg);
	}

	var tweetArea = document.getElementById('tweetArea');
	var tweet = document.createElement('p');
	tweet.innerHTML = chat;
	tweetArea.appendChild(tweet);
}
