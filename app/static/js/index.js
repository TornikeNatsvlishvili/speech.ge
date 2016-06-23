navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


var mediaRecorder;
var chunks = [];
var count = 0;

var recordedAudio = document.querySelector('audio#recordedAudio');
var downloadLink = document.querySelector('a#downloadLink');

if (getBrowser() == "Chrome") {
    var constraints = {"audio": true, "video": false};
} else if (getBrowser() == "Firefox") {
    var constraints = {audio: true, video: false};
}

$('#startRecord').click(function () {
    onBtnRecordClicked();
});

$('#endRecord').click(function () {
    mediaRecorder.stop();
});

function onBtnRecordClicked() {
    if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
        alert('Sorry! This demo requires Firefox 30 and up or Chrome 47 and up.');
    } else {
        navigator.getUserMedia(constraints, startRecording, errorCallback);
    }
}

function errorCallback(error){
  console.log('navigator.getUserMedia error: ', error);
}

function startRecording(stream) {
    console.log('Starting...');
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();

    //var url = window.URL || window.webkitURL;
    //videoElement.src = url ? url.createObjectURL(stream) : stream;
    //videoElement.play();

    mediaRecorder.ondataavailable = function (e) {
        //log('Data available...');
        //console.log(e.data);
        //console.log(e);

        chunks.push(e.data);
    };

    mediaRecorder.onerror = function (e) {
        console.log('Error: ' + e);
        console.log('Error: ', e);
    };


    mediaRecorder.onstart = function () {
        console.log('Started, state = ' + mediaRecorder.state);
    };

    mediaRecorder.onstop = function () {
        console.log('Stopped, state = ' + mediaRecorder.state);

        var blob = new Blob(chunks, {type: "audio/mp4"});
        chunks = [];

        var videoURL = window.URL.createObjectURL(blob);

        downloadLink.href = videoURL;
        recordedAudio.src = videoURL;
        downloadLink.innerHTML = 'Download video file';

        var rand = Math.floor((Math.random() * 10000000));
        var name = "audio_" + rand + ".mp4";

        downloadLink.setAttribute("download", name);
        downloadLink.setAttribute("name", name);

    };

    mediaRecorder.onwarning = function (e) {
        console.log('Warning: ' + e);
    };
}


//browser ID
function getBrowser() {

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }


    return browserName;

}