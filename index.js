/*jshint esversion: 6 */

const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');


canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x += this.speed.x * 4;
        this.y += this.speed.y * 4;
    }
}


class Enemy {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
}



const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, 'blue');






const projectile = new Projectile(
    canvas.width / 2,
    canvas.height / 2,
    5,
    'red', {
        x: 1,
        y: 1
    }
);

const projectile2 = new Projectile(
    canvas.width / 2,
    canvas.height / 2,
    5,
    'green', {
        x: -1,
        y: -1
    }
);

const projectiles = [];

const enemies = [];

function spawnEnemy() {
    setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10;

        let x;
        let y;

        if (Math.random() > 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = 'green';

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x);

        const speed = {
            x: Math.cos(angle),
            y: Math.sin(angle)

        };

        enemies.push(new Enemy(x, y, radius, color, speed));
    }, 1000);
}

let animationID;

function animate() {
    animationID = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();

        //remove projectile if it goes out of bounds
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }

    });
    enemies.forEach((enemy, index) => {
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if (dist - enemy.radius - player.radius < -2) {
            cancelAnimationFrame(animationID);
            alert('Game Over');
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            //objects touch
            if (dist - enemy.radius - projectile.radius < 1) {
                setTimeout(() => {
                    enemies.splice(index, 1);
                    projectiles.splice(projectileIndex, 1);
                }, 0);
            }
        });
    });
}

window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);

    const speed = {
        x: Math.cos(angle),
        y: Math.sin(angle)

    };

    projectiles.push(
        new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            5,
            'red', speed)
    );
});

animate();
spawnEnemy();