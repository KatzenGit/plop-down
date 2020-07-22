const socket = io();
let canvas = document.getElementById('canvas');

let ready = false;

function setup() {
    createCanvas(400, 400);
    ready = true;
}

let movement = {
    up: false,
    down: false,
    left: false,
    right: false
};

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = true;
            break;
        case 87: // W
            movement.up = true;
            break;
        case 68: // D
            movement.right = true;
            break;
        case 83: // S
            movement.down = true;
            break;
    }
});
document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = false;
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
    }
});

socket.on('state', function(players) {
    if(!ready) return;

    background(0);
    noFill();
    stroke(255);
    strokeWeight(2);
    rectMode(CENTER);

    for (const id in players) {
        let player = players[id];

        stroke(player.color[0], player.color[1], player.color[2]);
        rect(player.x, player.y, 20, 20);
    }
});

socket.emit('new player');

// Send State
setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);