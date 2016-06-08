

'use strict';

var width = 1280;
var height = 720;
var front = false;

var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

video.addEventListener('canplay', function(ev){
	video.setAttribute('width', width);
	video.setAttribute('height', height);
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
}, false);

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

function screenshot() {
	canvas.width = width;
	canvas.height = height;
	if (window.stream) {
		ctx.drawImage(video, 0, 0);
		document.querySelector('img').src = canvas.toDataURL('image/webp');
	}
}

function gameLoop() {
	window.setTimeout(gameLoop, 20);
	screenshot();
}

function init(){
	startMedia(constraints);
	gameLoop();
}

init();