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
    imageSrc: './assets/background.png'
});

const shop = new Sprite({
    position: {
        x: 594,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
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
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        attack2: {
            imageSrc: './assets/samuraiMack/Attack2.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 70,
            y: 50
        },
        width: 160,
        height: 50
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
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 169
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            framesMax: 4,
        },
        attack2: {
            imageSrc: './assets/kenji/Attack2.png',
            framesMax: 4,
        }
    },
    attackBox: {
        offset: {
            x: -150,
            y: 50
        },
        width: 160,
        height: 50
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
        player.switchSprites('run');  // TODO run back - changes images to opposite
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 4;
        player.switchSprites('run');
    } else {
        player.switchSprites('idle');
    }

    // player jumping
    if (player.velocity.y < 0) {
        player.switchSprites('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprites('fall');
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -4;
        enemy.switchSprites('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 4;
        enemy.switchSprites('run');
    } else {
        enemy.switchSprites('idle');
    }

    // enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprites('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprites('fall');
    }

    // detect the collision
    if (rectCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.framesCurrent === 4
    ) {
        player.isAttacking = false;

        enemy.health -= 20;
        document.querySelector('#enemy-health').style.width = `${enemy.health}%`;

        // console.log('player attacks');
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    if (rectCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        enemy.isAttacking = false;

        player.health -= 20;
        document.querySelector('#player-health').style.width = `${player.health}%`;

        // console.log('enemy attacks');
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
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
            enemy.attack();
            // enemy.isAttacking = true;
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