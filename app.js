

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

init();