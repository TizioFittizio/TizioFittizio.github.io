

'use strict';


var video = document.querySelector('video');
var constraints = window.constraints = {
	audio: false,
	video: true
};
var errorElement = document.querySelector('#errorMsg');

navigator.mediaDevices.getUserMedia(constraints)
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

function errorMsg(msg, error) {
	errorElement.innerHTML += '<p>' + msg + '</p>';
	if (typeof error !== 'undefined') {
		console.error(error);
	}
}

function change(){

}