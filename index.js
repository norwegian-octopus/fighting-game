const canvas = document.querySelector('.canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './assets/background.png'
});

const shop = new Sprite({
    position: {
        x: 594,
        y: 128
    },
    imgSrc: './assets/shop.png',
    scale: 2.75,
    frames: 6
});


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
});


const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}



decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -4;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 4;
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -4;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 4;
    }

    // detect the collision
    if (rectCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking) {
        player.isAttacking = false;

        enemy.health -= 20;
        document.querySelector('#enemy-health').style.width = `${enemy.health}%`;

        // console.log('player attacks');
    }

    if (rectCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking) {
        enemy.isAttacking = false;

        player.health -= 20;
        document.querySelector('#player-health').style.width = `${player.health}%`;

        // console.log('enemy attacks');
    }

    // end game conditions
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

window.addEventListener('keydown', event => {

    console.log(event.key);

    switch (event.key) {
        // player
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -15;
            break;
        case ' ':
            player.attack();
            break;

        // enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -15;
            break;
        case 'ArrowDown':
            enemy.isAttacking = true;
            break;
    }
})

window.addEventListener('keyup', event => {
    switch (event.key) {
        // player
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        // enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
})