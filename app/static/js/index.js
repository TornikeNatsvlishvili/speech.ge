navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


var mediaRecorder;
var chunks = [];
var count = 0;
var recording = false;
var soundBlob;

var downloadLink = document.querySelector('a#downloadLink'),
    recordingStatusSpan = document.querySelector('#RecordingStatus'),
    audioControls = document.querySelector("#AudioControls");

if (getBrowser() == "Chrome") {
    var constraints = {"audio": true, "video": false};
} else if (getBrowser() == "Firefox") {
    var constraints = {audio: true, video: false};
}

$('#Record').click(function () {
    if(!recording){
        initiateRecording();
        recording = true;
    } else {
        endRecording();
        recording = false;
    }
});

$('#uploadRecording').click(function(){
    var fd = new FormData();
    fd.append('fname', 'test.wav');
    fd.append('file', soundBlob);

    $.ajax({
        type: 'POST',
        url: '/upload',
        data: fd,
        processData: false,
        contentType: false
    }).done(function(data) {
       console.log(data);
    });
})

function initiateRecording() {
    if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
        alert('Sorry! This demo requires Firefox 30 and up or Chrome 47 and up.');
    } else {
        $('#Record span').removeClass('icon-record').addClass('icon-stop');
        recordingStatusSpan.className = "";
        navigator.getUserMedia(constraints, startRecording, errorCallback);
    }
}

function endRecording(){
    mediaRecorder.stop()
    $('#Record span').removeClass('icon-stop').addClass('icon-record');
    recordingStatusSpan.className = "gone";
    audioControls.className = "";
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

        soundBlob = new Blob(chunks, {type: "audio/mp4"});
        chunks = [];

        var videoURL = window.URL.createObjectURL(soundBlob);

        downloadLink.href = videoURL;
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


/* PLAYER FUNCTIONALITY */
var audio_playback;
var $play = $('#Play'),
    $pause = $("#Pause"),
    $delete = $("#Delete");
    //$seek = $("#Seek");

$play.click(function(){
    if(audio_playback){
        audio_playback.play();
    } else {

        audio_playback = new Audio(window.URL.createObjectURL(soundBlob));

        //TODO: Bug with durationchange

        //audio_playback.addEventListener('durationchange', function() {
        //    $seek.attr("max", audio_playback.duration);
        //    console.log(audio_playback.duration);
        //});
        //audio_playback.addEventListener('timeupdate',function (){
        //    curtime = parseInt(audio_playback.currentTime, 10);
        //    console.log(curtime)
        //    $seek.attr("value", curtime);
        //});

        audio_playback.load();
        audio_playback.play();
    }
});

$pause.click(function(){
    audio_playback.pause();
})

$delete.click(function(){
    audio_playback.pause();
    audio_playback = null;
    audioControls.className = "gone";
})

//$seek.bind("change", function(){
//    audio_playback.currentTime = $(this).val();
//    $seek.attr("max", audio_playback.duration);
//})
