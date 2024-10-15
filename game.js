
// Configuración del canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color; // Color de la pelota
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, color, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        // Pelotas con diferentes tamaños, colores y velocidades
        this.balls = [
            new Ball(100, 100, 10, 3, 3, 'blue'),
            new Ball(200, 200, 20, 2, 2, 'red'),
            new Ball(300, 300, 15, 4, 4, 'yellow'),
            new Ball(400, 100, 12, 5, 2, 'green'),
            new Ball(500, 400, 8, 3, 5, 'purple')
        ];
        
        // Paletas: la del jugador es más grande
        this.paddle1 = new Paddle(10, canvas.height / 2 - 75, 10, 150, 'orange', true); // Paleta más grande
        this.paddle2 = new Paddle(canvas.width - 20, canvas.height / 2 - 50, 10, 100, 'white'); // Paleta estándar

        this.keys = {}; // Para capturar las teclas
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);   

        // Dibujar las pelotas
        this.balls.forEach(ball => ball.draw());

        // Dibujar las paletas
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        // Mover las pelotas
        this.balls.forEach(ball => ball.move());

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (Controlada por IA) siguiendo la primera pelota
        this.paddle2.autoMove(this.balls[0]);

        // Colisiones con las paletas
        this.balls.forEach(ball => this.checkCollisions(ball));

        // Reset de las pelotas cuando salen de los bordes
        this.balls.forEach(ball => {
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });
    }

    checkCollisions(ball) {
        if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
            ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
            ball.speedX = -ball.speedX;
        }

        if (ball.x + ball.radius >= this.paddle2.x &&
            ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
            ball.speedX = -ball.speedX;
        }
    }

    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();


