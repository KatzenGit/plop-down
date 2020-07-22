// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

// Init
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set("port", 8080);
app.use("/static", express.static(__dirname + "/static"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Game
let players = {};
io.on('connection', function(socket) {
    socket.on('new player', function() {
        console.log("New Player Registered!");

        players[socket.id] = {
            x: 200,
            y: 200,
            size: 20,
            movementSpeed: 2,
            color: [ Math.random() * 255, Math.random() * 255, Math.random() * 255 ]
        };
    });
    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        if (data.left) {
            player.x -= player.movementSpeed;
        }
        if (data.up) {
            player.y -= player.movementSpeed;
        }
        if (data.right) {
            player.x += player.movementSpeed;
        }
        if (data.down) {
            player.y += player.movementSpeed;
        }

        if (player.x - player.size / 2 < 0) player.x = player.size / 2;
        if (player.y - player.size / 2 < 0) player.y = player.size / 2;
        if (player.x - player.size / 2 > 400 - player.size) player.x = 400 - player.size / 2;
        if (player.y - player.size / 2 > 400 - player.size) player.y = 400 - player.size / 2;
    });

    socket.on("setting", function(data) {
        players[socket.id][data.key] = data.value;
    });

    socket.on("disconnect", function() {
        players[socket.id] = undefined;
    });
});

// Tick
setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 60);

server.listen(8080, function() {
    console.log("Starting Server on port 8080");
});