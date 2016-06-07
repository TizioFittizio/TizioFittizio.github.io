

'use strict';

var front = false;

var video = document.querySelector('video');
var constraints = window.constraints = {
	audio: false,
	video: {
		mandatory: {
			minWidth: 1280,
			minHeight: 720
		}
	}
};

var constraints2 = window.constraints = {
	 video: { facingMode: (front ? "user" : "environment") }
}


var errorElement = document.querySelector('#errorMsg');

var startMedia = function(c){
	if (window.stream) {
		video.src = null;
		window.stream.stop();
	}
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

startMedia(constraints);

function errorMsg(msg, error) {
	errorElement.innerHTML = '<p>' + msg + '</p>';
	if (typeof error !== 'undefined') {
		console.error(error);
	}
}

function change(){
	front = !front;
	startMedia(constraints2);
}

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

function screenshot() {
	if (window.stream) {
		ctx.drawImage(video, 0, 0);
		document.querySelector('img').src = canvas.toDataURL('image/webp');
	}
}