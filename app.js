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

function init(){
	alert("Io vengo chiamato?")
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
			console.error(err);
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

init();