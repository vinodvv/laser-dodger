const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");

const gameWidth = 400;
const gameHeight = 600;
const playerSize = 20;
const laserWidth = 20;
const laserHeight = 50;
const playerSpeed = 20;
const laserSpeed = 5;
const spawnInterval = 800; // milliseconds

let playerX = gameWidth / 2 - playerSize / 2;
let score = 0;
let lasers = [];
let gameOver = false;

// Move player with arrow keys
document.addEventListener("keydown", (event) => {
    if (gameOver) return;

    if (event.key === "ArrowLeft" && playerX > 0) {
        playerX -= playerSpeed;
    } else if (event.key === "ArrowRight" && playerX < gameWidth - playerSize) {
        playerX += playerSpeed;
    }

    player.style.left = playerX + "px";
});

// Function to create lasers
function createLaser() {
    if (gameOver) return;

    const laser = document.createElement("div");
    laser.classList.add("laser");
    laser.style.left = Math.random() * (gameWidth - laserWidth) + "px";
    laser.style.top = "0px";
    gameContainer.appendChild(laser);
    lasers.push(laser);
}

// Function to update game state
function updateGame() {
    if (gameOver) return;

    // Move lasers down
    lasers.forEach((laser, index) => {
        let laserY = parseInt(laser.style.top);
        laserY += laserSpeed;
        laser.style.top = laserY + "px";

        // Remove off-screen lasers
        if (laserY > gameHeight) {
            gameContainer.removeChild(laser);
            lasers.splice(index, 1);
        }

        // Collision detection
        const playerRect = player.getBoundingClientRect();
        const laserRect = laser.getBoundingClientRect();

        if (
            playerRect.left < laserRect.right &&
            playerRect.right > laserRect.left &&
            playerRect.top < laserRect.bottom &&
            playerRect.bottom > laserRect.top
        ) {
            endGame();
        }
    });

    // Increase score
    score++;
    scoreDisplay.innerText = "Score: " + score;

    requestAnimationFrame(updateGame);
}

// Function to end the game
function endGame() {
    gameOver = true;
    scoreDisplay.innerText = "Game Over! Score: " + score;
    clearInterval(laserInterval);
}

// Start game loop and laser spawning
const laserInterval = setInterval(createLaser, spawnInterval);
updateGame();
