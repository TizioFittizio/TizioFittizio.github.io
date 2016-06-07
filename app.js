/*

function hasGetUserMedia(){
		var u1 = navigator.getUserMedia;
		var u2 = navigator.webktGetUserMedia;
		var u3 = navigator.mozGetUseMedia;
		var u4 = navigator.msGetUserMedia;
		console.log(u1);
		console.log(u2);
		console.log(u3);
		console.log(u4);
		return u1 || u2 || u3 || u4;
}

var vgaConstraints = {
		  video: {
		    mandatory: {
		      maxWidth: 640,
		      maxHeight: 360
		    }
		  }
};

function init(){
	if (!hasGetUserMedia()) {
		alert("Niente camera o browser obsoleto");
		return;
	}
	navigator.getUserMedia(vgaConstraints, function(localMediaStream){
	    var video = document.querySelector('video');	//Riferito ad un tag video
	    video.src = window.URL.createObjectURL(localMediaStream);
	    video.onloadedmetadata = function(e) {
	      // Ready to go. Do some stuff.
	    };}, 
	    function(e){
		 alert(e);
	 });
}




var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;

function snapshot() {
	if (localMediaStream) {
		ctx.drawImage(video, 0, 0);
		// "image/webp" works in Chrome.
		// Other browsers will fall back to image/png.
		document.querySelector('img').src = canvas.toDataURL('image/webp');
	}
}

video.addEventListener('click', snapshot, false);

var errorCallback = function(e){
	alert(e);
}
// Not showing vendor prefixes or code that works cross-browser.
navigator.getUserMedia({video: true}, function(stream) {
	video.src = window.URL.createObjectURL(stream);
	localMediaStream = stream;
}, errorCallback);*/

/*function init(){
	var streaming = false,
		video        = document.querySelector('#video'),
		canvas       = document.querySelector('#canvas'),
		photo        = document.querySelector('#photo'),
		startbutton  = document.querySelector('#startbutton'),
		width = 800,
		height = 600;

	navigator.getMedia = ( navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);

	navigator.getMedia(
		{video: true, audio: false},
		function(stream) {
			if (navigator.mozGetUserMedia) {
				video.mozSrcObject = stream;
			} else {
				var vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL.createObjectURL(stream);
			}
			video.play();
		},
		function(err) {
			console.error("Errore cosa?");
			alert(err);
		}
	);

	video.addEventListener('canplay', function(ev){
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth/width);
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			streaming = true;
		}
	}, false);

	function takepicture() {
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		var data = canvas.toDataURL('image/png');
		//photo.setAttribute('src', data);
	}

	startbutton.addEventListener('click', function(ev){
		takepicture();
		ev.preventDefault();
	}, false);
}

init();*/

'use strict';

/*var promisifiedOldGUM = function(constraints) {

	// First get ahold of getUserMedia, if present
	var getUserMedia = (navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia);

	// Some browsers just don't implement it - return a rejected promise with an error
	// to keep a consistent interface
	if(!getUserMedia) {
		return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
	}

	// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
	return new Promise(function(resolve, reject) {
		getUserMedia.call(navigator, constraints, resolve, reject);
	});

}*/

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if(navigator.mediaDevices === undefined) {
	alert("Media devices non implementati");
	navigator.mediaDevices = {};
}
else {
	alert("Media devices implementati");
	console.log(navigator.mediaDevices);
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if(navigator.mediaDevices.getUserMedia === undefined) {
	alert("Get user media non implementato");
	//navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
}
else {
	alert("Get user media implementato");
	console.log(navigator.mediaDevices.getUserMedia);
}


// Prefer camera resolution nearest to 1280x720.
/*var constraints = { audio: false, video: { width: 1280, height: 720 } };

alert("Ora chiamero' getUserMedia");
navigator.mediaDevices.getUserMedia(constraints)
	.then(function(stream) {
		alert("OH!")
		var videoTracks = stream.getVideoTracks();
		console.log('Got stream with constraints:', constraints);
		console.log('Using video device: ' + videoTracks[0].label);
		stream.onended = function() {
			console.log('Stream ended');
		};
		window.stream = stream; // make variable available to browser console
		video.srcObject = stream;
	})
	.catch(function(error) {
		if (error.name === 'ConstraintNotSatisfiedError') {
			alert('The resolution ' + constraints.video.width.exact + 'x' +
				constraints.video.width.exact + ' px is not supported by your device.');
		} else if (error.name === 'PermissionDeniedError') {
			alert('Permissions have not been granted to use your camera and ' +
				'microphone, you need to allow the page access to your devices in ' +
				'order for the demo to work.');
		}
		alert('getUserMedia error: ' + error.name, error);
	});
	*/

var video = document.querySelector('video');
var constraints = window.constraints = {
	audio: false,
	video: true
};
var errorElement = document.querySelector('#errorMsg');

navigator.mediaDevices.getUserMedia(constraints)
	.then(function(stream) {
		alert("IO");
		var videoTracks = stream.getVideoTracks();
		console.log('Got stream with constraints:', constraints);
		console.log('Using video device: ' + videoTracks[0].label);
		stream.onended = function() {
			console.log('Stream ended');
		};
		window.stream = stream; // make variable available to browser console
		video.srcObject = stream;
	})
	.catch(function(error) {
		alert("NON CAPISCO");
		if (error.name === 'ConstraintNotSatisfiedError') {
			errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
				constraints.video.width.exact + ' px is not supported by your device.');
		} else if (error.name === 'PermissionDeniedError') {
			errorMsg('Permissions have not been granted to use your camera and ' +
				'microphone, you need to allow the page access to your devices in ' +
				'order for the demo to work.');
		}
		errorMsg('getUserMedia error: ' + error.name, error);
	});

function errorMsg(msg, error) {
	errorElement.innerHTML += '<p>' + msg + '</p>';
	if (typeof error !== 'undefined') {
		console.error(error);
	}
}