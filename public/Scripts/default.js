/// <reference path="jquery-3.3.1.min.js" />

var socket;
var fileName="";
$(document).ready(function () {
    socket = io.connect('http://localhost:8080');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    socket.on('typing', feedback);
    socket.on('imageUpload', sendDataWithImage);

    $('#send').click(sendMessage);
    $('#message').keypress(processEnterPress);
    $('#message').on('keydown', processKeyDown);
    $('#fileUpload').on('change', fileUpload);
});

function fileUpload(e){
    let file = e.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = (event) => {
        fileName = event.target.result
    };
    fileReader.readAsDataURL(file);
};

//function imageSend(username,imageUrl) {
//    if (imageUrl && username) {
//        let lable = document.createElement('label');
//        lable.innerHTML = username;
//        lable.setAttribute('id', 'userTitle');
//        let img = document.createElement('img');
//        img.setAttribute('id', 'userImg');

//        img.src = imageUrl;
//        document.querySelector('#output').appendChild(lable);
//        document.querySelector('#output').appendChild(img);
//        document.querySelector('#fileUpload').value = "";
//        $('#feedback').html('');

//    }
//};

function addUser() {
    socket.emit('adduser', prompt("What's your name?"));
}

function processMessage(username, data) {
    
    
        document.querySelector('#feedback').innerHTML = '';
        document.querySelector('#output').innerHTML += '<b>'+username + ': </b>' + data + '<br>';
 

}

function sendDataWithImage(username, data, imgurl) {
    
        document.querySelector('#feedback').innerHTML = '';
        let lable = document.createElement('label');
        let img = document.createElement('img');
        let text = document.createElement('p');

        text.innerHTML = data;
        lable.innerHTML = username;
        lable.setAttribute('id', 'userTitle');
        text.setAttribute('id', 'msg');
        img.setAttribute('id', 'userImg');
        
        img.src = imgurl;
        let br = document.createElement('br');

        document.querySelector('#output').appendChild(lable);
        document.querySelector('#output').appendChild(text);
        document.querySelector('#output').appendChild(img);
        document.querySelector('#output').appendChild(br);

        document.querySelector('#fileUpload').value = "";

        $('#feedback').html('');
}


function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<li>' + key + '</li>');
    });
}

function sendMessage() {
    var message = $('#message').val();
    if (message != "" && fileName === "") {
        $('#message').val('');
        socket.emit('sendchat', message);
        $('#message').focus();
    } else {
        sendImage(message, fileName)
        fileName = "";
        $('#message').focus();
    }
    
    
}
function sendImage(message, fileName) {
    socket.emit('imageUpload', message, fileName);
}
function processEnterPress(e) {
    if (e.which == 13) {
        sendMessage();
    }
}
function processKeyDown() {
        socket.emit('typing', '');
}

function feedback(data) {
    $('#feedback').html('<p>' + data + ' is typing a message</p>');
}
