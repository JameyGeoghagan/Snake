const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

document.getElementById('highScore').innerText = highScore;

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function spawnFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        document.getElementById('score').innerText = score;
        spawnFood();
    } else {
        snake.pop(); // Remove the last segment if no food is eaten
    }

    // Add the new head to the snake
    snake.unshift(head);
}

function checkCollision() {
    const head = snake[0];

    // Check collision with walls
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function gameLoop() {
    if (checkCollision()) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerText = highScore;
            alert('New High Score! Your score was: ' + score);
        } else {
            alert('Game Over! Your score was: ' + score);
        }
        document.location.reload();
        return;
    }

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateSnake();
        drawRect(food.x, food.y, 'red');

        snake.forEach(segment => drawRect(segment.x, segment.y, 'green'));

        requestAnimationFrame(gameLoop);
    }, 100);
}

function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

// Event listener for keyboard controls
document.addEventListener('keydown', changeDirection);

// Initialize game
spawnFood();
gameLoop();
