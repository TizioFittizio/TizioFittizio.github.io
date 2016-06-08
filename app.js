

'use strict';

var width = 320;
var height = 200;
var front = false;

var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

video.addEventListener('canplay', function(ev){
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
}, false);

var constraints = { video: { width: 1280, height: 720 } };

var constraints2 = window.constraints = {
	 video: { facingMode: (front ? "user" : "environment") }
}

var errorElement = document.querySelector('#errorMsg');

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
	startMedia(constraints2);
}

function takeScreenshot(){
	document.querySelector('img').src = canvas.toDataURL('image/webp');
}

function screenshot() {
	canvas.width = width;
	canvas.height = height;
	if (window.stream) {
		ctx.globalAlpha = 1;
		ctx.drawImage(video, 0, 0);
		ctx.fillStyle = "red";
		/*for (var i=0; i <data.length; i+=4) {
			var red = data[i];
			var green = data[i+1];
			var blue = data[i+2];
			var alpha = data[i+3];

		}*/
		var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = imgData.data;
		for (var y = 0; y < canvas.height; y++) {
			for(var x = 0; x < canvas.width; x++) {
				var red = data[((canvas.width * y) + x) * 4];
				var green = data[((canvas.width * y) + x) * 4 + 1];
				var blue = data[((canvas.width * y) + x) * 4 + 2];
				var alpha = data[((canvas.width * y) + x) * 4 + 3];
				if (green + blue + red <= 250) ctx.globalAlpha = 1;
				else ctx.globalAlpha = 0;
				ctx.fillRect(x, y, 1, 1);
			}
		}
		if (flicker){
			ctx.globalAlpha = 1;
			ctx.style = "yellow";
			ctx.fillRect(0, 0, 10, 10);
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

init();