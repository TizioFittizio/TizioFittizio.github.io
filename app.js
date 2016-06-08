

'use strict';

var width = 1280;
var height = 720;
var front = false;

var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var camerasId = [];
var currentCamera = 0;

video.addEventListener('canplay', function(ev){
	//canvas.setAttribute('width', 800);
	//canvas.setAttribute('height', 600);
}, false);

var constraints = { video: { width: 3840, height: 2160 } };

var constraints2 = {
	video: {
		optional: [{sourceId: camerasId[currentCamera]}]
	}
}

var errorElement = document.querySelector('#errorMsg');
var images = document.querySelector('#images');

var startMedia = function(c){
	navigator.mediaDevices.getUserMedia(c)
		.then(function(stream) {
			var videoTracks = stream.getVideoTracks();
			console.log('Requisiti:', constraints);
			console.log('Device usato: ' + videoTracks[0].label);
			stream.onended = function() {
				console.log('Fine stream');
			};
			window.stream = stream;
			video.srcObject = stream;
		})
		.catch(function(error) {
			if (error.name === 'ConstraintNotSatisfiedError') {
				errorMsg('Risoluzione non supportata');
			} else if (error.name === 'PermissionDeniedError') {
				errorMsg('Non hai i permessi necessari');
			}
			errorMsg(error.name, error);
		});
}

function errorMsg(msg, error) {
	errorElement.innerHTML = '<p>' + msg + '</p>';
	alert(msg);
	if (typeof error !== 'undefined') {
		console.error(error);
	}
}

function change(){
	front = !front;
	alert(camerasId[currentCamera]);
	currentCamera ++;
	alert("-----");
	alert(camerasId[currentCamera]);
	startMedia(constraints2);
}

function takeScreenshot(){
	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = imgData.data;
	ctx.fillStyle = "white";
	for (var y = 0; y < canvas.height; y++) {
		for (var x = 0; x < canvas.width; x++) {
			var red = data[((canvas.width * y) + x) * 4];
			var green = data[((canvas.width * y) + x) * 4 + 1];
			var blue = data[((canvas.width * y) + x) * 4 + 2];
			var alpha = data[((canvas.width * y) + x) * 4 + 3];
			if (green + blue + red > 250 && false) ctx.globalAlpha = 1;
			else ctx.globalAlpha = 0;
			ctx.fillRect(x, y, 1, 1);
		}
	}
	images.innerHTML += "<img src=" + canvas.toDataURL('image/png') + ">";
	//document.querySelector('img').src = canvas.toDataURL('image/png');
}

function screenshot() {
	canvas.width = 1280;
	canvas.height = 720;
	if (window.stream) {
		ctx.globalAlpha = 1;
		ctx.drawImage(video, 0, 0);
		/*for (var i=0; i <data.length; i+=4) {
			var red = data[i];
			var green = data[i+1];
			var blue = data[i+2];
			var alpha = data[i+3];
		}*/
		if (flicker){
			ctx.globalAlpha = 1;
			ctx.style = "yellow";
			ctx.fillRect(0, 0, 30, 30);
		}
		flicker = !flicker;
		//document.querySelector('img').src = canvas.toDataURL('image/webp');
	}
}

var flicker = false;

function loop() {
	screenshot();
	//console.log("Rendering!");
	window.requestAnimationFrame(loop);

}

function init(){

	startMedia(constraints);
	loop();
}

if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
	alert("Impossibile enumerare i dispositivi");
}
else {

	navigator.mediaDevices.enumerateDevices()
			.then(function(devices) {
				devices.forEach(function(device) {
					console.log(device.kind + ": " + device.label +
							" id = " + device.deviceId);
					if (device.kind == "videoinput") camerasId.push(device.deviceId);
				});
				//for (var i = 0; i < camerasId.length; i++) alert(camerasId[i]);
			})
			.catch(function(err) {
				//alert(err.name + ": " + error.message);
			});
}

MediaStreamTrack.getSources(function(sourceInfos) {
	var videoSourceId;
	for (var i = 0; i != sourceInfos.length; ++i) {
		var sourceInfo = sourceInfos[i];
		if(sourceInfo.kind == "video" && sourceInfo.facing == "environment") {
			videoSourceId = sourceInfo.id;
		}
	}
	constraints2 = {
		audio: false,
		video: {
			optional: [{sourceId: videoSourceId}]
		}
	};
});


init();