const gameArea = document.querySelector(".game-area");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const newHighScore =
    document.getElementById("newHighScore");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const finalScore = document.getElementById("finalScore");

const box = 20;
const gridSize = canvas.width / box;
let audioContext;

function playSound(frequency, duration) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = "square";

    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}
let snake = [];
let food;

let direction = "RIGHT";

let score = 0;

let highScore =
    Number(localStorage.getItem("snakeHighScore")) || 0;

let game;
let gameSpeed = 120;

let gameRunning = false;
let paused = false;

highScoreElement.textContent = highScore;


// =========================
// START GAME
// =========================
const mobileButtons =
    document.querySelectorAll(
        ".mobile-controls button"
    );

mobileButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (!gameRunning || paused) return;

        const newDirection =
            button.dataset.direction;

        if (
            newDirection === "UP" &&
            direction !== "DOWN"
        ) {
            direction = "UP";
        }

        if (
            newDirection === "DOWN" &&
            direction !== "UP"
        ) {
            direction = "DOWN";
        }

        if (
            newDirection === "LEFT" &&
            direction !== "RIGHT"
        ) {
            direction = "LEFT";
        }

        if (
            newDirection === "RIGHT" &&
            direction !== "LEFT"
        ) {
            direction = "RIGHT";
        }

    });

});
function startGame() {

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "RIGHT";

    score = 0;
newHighScore.classList.add("hidden");
    gameSpeed = 120;

    gameRunning = true;

    paused = false;

    scoreElement.textContent = score;

    pauseBtn.textContent = "⏸ Pause";

    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    food = createFood();

    clearInterval(game);

    game = setInterval(drawGame, gameSpeed);
}


// =========================
// CREATE FOOD
// =========================

function createFood() {

    let newFood;

    do {

        newFood = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        };

    } while (
        snake.some(
            part =>
                part.x === newFood.x &&
                part.y === newFood.y
        )
    );

    return newFood;
}


// =========================
// KEYBOARD
// =========================

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {

    if (!gameRunning || paused) return;

    if (
        event.key === "ArrowUp" &&
        direction !== "DOWN"
    ) {
        direction = "UP";
    }

    if (
        event.key === "ArrowDown" &&
        direction !== "UP"
    ) {
        direction = "DOWN";
    }

    if (
        event.key === "ArrowLeft" &&
        direction !== "RIGHT"
    ) {
        direction = "LEFT";
    }

    if (
        event.key === "ArrowRight" &&
        direction !== "LEFT"
    ) {
        direction = "RIGHT";
    }
}


// =========================
// DRAW GAME
// =========================

function drawGame() {

    if (paused) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

ctx.strokeStyle = "rgba(100, 200, 120, 0.06)";
ctx.lineWidth = 1;

for (let x = 0; x <= canvas.width; x += box) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
}

for (let y = 0; y <= canvas.height; y += box) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
}
    // FOOD
const appleX = food.x + box / 2;
const appleY = food.y + box / 2;

// Apple shadow
ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
ctx.beginPath();
ctx.ellipse(
    appleX,
    appleY + 8,
    9,
    4,
    0,
    0,
    Math.PI * 2
);
ctx.fill();

// Apple
const appleGradient = ctx.createRadialGradient(
    appleX - 4,
    appleY - 5,
    2,
    appleX,
    appleY,
    11
);

appleGradient.addColorStop(0, "#ff7777");
appleGradient.addColorStop(0.5, "#e52f3f");
appleGradient.addColorStop(1, "#8f1420");

ctx.fillStyle = appleGradient;

ctx.beginPath();
ctx.arc(
    appleX,
    appleY + 1,
    9,
    0,
    Math.PI * 2
);
ctx.fill();

// Stem
ctx.strokeStyle = "#633b20";
ctx.lineWidth = 2;

ctx.beginPath();
ctx.moveTo(appleX, appleY - 7);
ctx.lineTo(appleX + 2, appleY - 12);
ctx.stroke();

// Leaf
ctx.fillStyle = "#55b85a";

ctx.beginPath();
ctx.ellipse(
    appleX + 5,
    appleY - 10,
    5,
    2.5,
    -0.4,
    0,
    Math.PI * 2
);
ctx.fill();
    
// 🐍 REALISTIC SNAKE DRAWING

snake.forEach((part, index) => {

    const cx = part.x + box / 2;
    const cy = part.y + box / 2;

    // BODY
    if (index !== 0) {

        const gradient = ctx.createRadialGradient(
            cx - 5,
            cy - 5,
            2,
            cx,
            cy,
            11
        );

        gradient.addColorStop(0, "#79d66f");
        gradient.addColorStop(0.55, "#3d9f48");
        gradient.addColorStop(1, "#155d2c");

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            box / 2 - 1,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Small scale pattern
        ctx.strokeStyle = "rgba(10,60,25,0.35)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(
            cx,
            cy,
            6,
            0,
            Math.PI
        );

        ctx.stroke();

    } else {

        // HEAD
        const gradient = ctx.createRadialGradient(
            cx - 6,
            cy - 7,
            2,
            cx,
            cy,
            13
        );

        gradient.addColorStop(0, "#9be879");
        gradient.addColorStop(0.45, "#4db653");
        gradient.addColorStop(1, "#164f29");

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            box / 2 + 2,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // EYES
        let eyeOffsetX = 5;
        let eyeOffsetY = 5;

        if (direction === "UP") {
            eyeOffsetX = 5;
            eyeOffsetY = -5;
        }

        if (direction === "DOWN") {
            eyeOffsetX = 5;
            eyeOffsetY = 5;
        }

        if (direction === "LEFT") {
            eyeOffsetX = -5;
            eyeOffsetY = 5;
        }

        if (direction === "RIGHT") {
            eyeOffsetX = 5;
            eyeOffsetY = 5;
        }


        // Left eye
        ctx.fillStyle = "white";

        ctx.beginPath();

        ctx.arc(
            cx - eyeOffsetX,
            cy - eyeOffsetY,
            3.5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Right eye
        ctx.beginPath();

        ctx.arc(
            cx + eyeOffsetX,
            cy - eyeOffsetY,
            3.5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Pupils
        ctx.fillStyle = "black";

        ctx.beginPath();

        ctx.arc(
            cx - eyeOffsetX,
            cy - eyeOffsetY,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            cx + eyeOffsetX,
            cy - eyeOffsetY,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // 👅 Forked tongue
        ctx.strokeStyle = "#e84b5a";
        ctx.lineWidth = 1.5;

        ctx.beginPath();

        if (direction === "RIGHT") {

            ctx.moveTo(cx + 9, cy);
            ctx.lineTo(cx + 15, cy);
            ctx.lineTo(cx + 19, cy - 3);

            ctx.moveTo(cx + 15, cy);
            ctx.lineTo(cx + 19, cy + 3);

        } else if (direction === "LEFT") {

            ctx.moveTo(cx - 9, cy);
            ctx.lineTo(cx - 15, cy);
            ctx.lineTo(cx - 19, cy - 3);

            ctx.moveTo(cx - 15, cy);
            ctx.lineTo(cx - 19, cy + 3);

        } else if (direction === "UP") {

            ctx.moveTo(cx, cy - 9);
            ctx.lineTo(cx, cy - 15);
            ctx.lineTo(cx - 3, cy - 19);

            ctx.moveTo(cx, cy - 15);
            ctx.lineTo(cx + 3, cy - 19);

        } else {

            ctx.moveTo(cx, cy + 9);
            ctx.lineTo(cx, cy + 15);
            ctx.lineTo(cx - 3, cy + 19);

            ctx.moveTo(cx, cy + 15);
            ctx.lineTo(cx + 3, cy + 19);
        }

        ctx.stroke();
    }
});   

    // NEW HEAD

    const head = {
        x: snake[0].x,
        y: snake[0].y
    };


    if (direction === "UP")
        head.y -= box;

    if (direction === "DOWN")
        head.y += box;

    if (direction === "LEFT")
        head.x -= box;

    if (direction === "RIGHT")
        head.x += box;


    // WALL COLLISION

    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {

        endGame();

        return;
    }


    // SELF COLLISION

    if (
        snake.some(
            part =>
                part.x === head.x &&
                part.y === head.y
        )
    ) {

        endGame();

        return;
    }


    // FOOD

    if (
        head.x === food.x &&
        head.y === food.y
    ) {
        playSound(600, 0.1);
        score++;

        scoreElement.textContent = score;


        // HIGH SCORE

        if (score > highScore) {

            highScore = score;

            highScoreElement.textContent =
                highScore;

            localStorage.setItem(
                "snakeHighScore",
                highScore
            );
        }


        // SPEED

        if (gameSpeed > 50) {

            gameSpeed -= 5;

            clearInterval(game);

            game = setInterval(
                drawGame,
                gameSpeed
            );
        }


        food = createFood();

    } else {

        snake.pop();
    }


    snake.unshift(head);
}


// =========================
// GAME OVER
// =========================

function endGame() {

    gameRunning = false;

    clearInterval(game);

    gameArea.classList.remove("hit");

    void gameArea.offsetWidth;

    gameArea.classList.add("hit");

    setTimeout(() => {

        finalScore.textContent = score;

        if (
            score > 0 &&
            score >= highScore
        ) {
            newHighScore.classList.remove("hidden");
            playSound(800, 0.15);

            setTimeout(() => {
                playSound(1000, 0.2);
            }, 150);
        } else {
            newHighScore.classList.add("hidden");
        }

        gameOverScreen.classList.remove("hidden");

    }, 300);
}

// =========================
// RESTART
// =========================

restartBtn.addEventListener(
    "click",
    startGame
);


// =========================
// PLAY AGAIN
// =========================

playAgainBtn.addEventListener(
    "click",
    startGame
);


// =========================
// START BUTTON
// =========================

startBtn.addEventListener(
    "click",
    startGame
);