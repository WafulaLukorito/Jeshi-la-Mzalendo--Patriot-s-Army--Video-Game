/*jshint esversion: 6 */


const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

const scoreEl = document.querySelector('#scoreEl');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');
let viceList = ["Ufisadi", "Ubinafsi", "Ukabila", "Ulanguzi", "Magendo", "Uzembe", "Uganda", "Ujinga", "Propaganda", "Siasa chafu", "Mabadiliko ya tabianchi", "Gesi joto", "Ubaguzi", "Kisukuku", "Polio", "Vita", "Kiburi", "Ukiritimba", "Ubaguzi wa rangi", "Dhulma", "Kutesa Wanyama", "Usherati", "Hujuma", "Ulafi", "Uhaini"];

canvas.width = innerWidth;
canvas.height = innerHeight;
const img = new Image();
img.src = "Assets/Kenya-flag.jpg";
c.drawImage(img, 0, 0, canvas.width, canvas.height);

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
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
}


const mtext = c.fillText('Hello world', 10, 50);




class Enemy {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.vice = viceList[Math.floor(Math.random() * viceList.length)];
    }
    draw() {
        c.beginPath();
        c.font = "20px sans-serif";
        c.fillText(`    <= ${this.vice}`, this.x, this.y);
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        c.fillStyle = this.color;
        c.fill();



        //c.fillText("gggg", white);
        //c.strokeText("Ufisadi");
    }
    update() {
        this.draw();
        this.x += this.speed.x;
        this.y += this.speed.y;

    }
}

const friction = 0.99;
class Particle {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.alpha = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
    update() {
        this.draw();
        this.x += this.speed.x * friction;
        this.y += this.speed.y * friction;
        this.alpha -= 0.01;
    }
}

class Vices {
    constructor(x, y, colour, speed) {
        this.x = x;
        this.y = y;
        this.color = colour;
        this.speed = speed;

    }
    draw() {
        //var ctx = canvas.getContext('2d');
        c.beginPath();
        c.fillText('Ufisadi', this.x, this.y);
        c.font = "20px Arial";
        // c.moveTo(this.x, this.y);
        // c.lineTo(this.x, this.y);
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


let projectiles = [];

let enemies = [];

let particles = [];

let badVices = [];



function init() {
    player = new Player(x, y, 10, 'white');

    projectiles = [];

    enemies = [];

    particles = [];

    badVices = [];



    score = 0;

    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;

}

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

        const color = `hsla(${Math.random() * 360}, 50%, 50%, 1)`;

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x);

        const speed = {
            x: Math.cos(angle),
            y: Math.sin(angle)

        };

        enemies.push(new Enemy(x, y, radius, color, speed));
        badVices.push(new Vices(x, y, color, speed));
    }, 2000);
}

let animationID;
let score = 0;


function animate() {
    animationID = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.3)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = "Assets/linda-nchi.png";
    c.drawImage(img,
        canvas.width / 2 - img.width / 2,
        canvas.height / 2 - img.height / 2
    );
    player.draw();

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });

    //might edit this
    projectiles.forEach((projectile, index) => {
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
        //vice.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        //end game if player is hit
        if (dist - enemy.radius - player.radius < -2) {
            cancelAnimationFrame(animationID);
            modalEl.style.display = 'flex';
            bigScoreEl.innerHTML = score;
        }


        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);


            //When projectiles collide with enemies
            if (dist - enemy.radius - projectile.radius < 1) {



                //Create explosion particles
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(projectile.x, projectile.y,
                            Math.random() * 2,
                            enemy.color, {
                                x: (Math.random() - 0.5) * (Math.random() * 8),
                                y: (Math.random() - 0.5) * (Math.random() * 8)
                            }));


                }


                if (enemy.radius - 10 > 5) {

                    //Increase score
                    score += 50;
                    scoreEl.innerHTML = score;



                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);

                } else {
                    //remove enemy from scene altogether
                    score += 125;


                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);

                }

            }
        });
    });
}

window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);

    const speed = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5

    };

    projectiles.push(
        new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            5,
            'white', speed)
    );
});

let vice = new Vices(100, 200, 'green', { x: 1, y: 1 });

startGameButton.addEventListener('click', () => {
    init();
    animate();
    spawnEnemy();
    vice.update();

    modalEl.style.display = 'none';
});