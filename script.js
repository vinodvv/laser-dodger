const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");

const gameWidth = 400;
const gameHeight = 600;
const playerSize = 20;
const laserWidth = 20;
const laserHeight = 50;
const playerSpeed = 20;

let playerX = gameWidth / 2 - playerSize / 2;
let score = 0;
let lasers = [];
let gameOver = false;
let laserSpeed = 5; // Increases over time
let spawnInterval = 800; // Decreases over time
let gameLoop, laserInterval;

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

    // Increase score and difficulty over time
    score++;
    scoreDisplay.innerText = "Score: " + score;

    if (score % 100 === 0) {
        laserSpeed += 1; // Increase laser speed
        spawnInterval = Math.max(300, spawnInterval - 50); // Decrease spawn time, minimum 300ms

        clearInterval(laserInterval);
        laserInterval = setInterval(createLaser, spawnInterval);
    }

    gameLoop = requestAnimationFrame(updateGame);
}

// Function to end the game
function endGame() {
    gameOver = true;
    scoreDisplay.innerText = "Game Over! Score: " + score;
    restartButton.style.display = "block"; // Show restart button

    clearInterval(laserInterval);
    cancelAnimationFrame(gameLoop);
}

// Function to restart the game
function restartGame() {
    gameOver = false;
    score = 0;
    laserSpeed = 5;
    spawnInterval = 800;
    lasers.forEach(laser => gameContainer.removeChild(laser));
    lasers = [];
    playerX = gameWidth / 2 - playerSize / 2;
    player.style.left = playerX + "px";
    scoreDisplay.innerText = "Score: 0";
    restartButton.style.display = "none";

    // Restart game loop and lasers
    laserInterval = setInterval(createLaser, spawnInterval);
    updateGame();
}

// Start game loop
laserInterval = setInterval(createLaser, spawnInterval);
updateGame();
