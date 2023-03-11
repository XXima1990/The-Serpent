


//  Sounds 
const foodSound = new Audio('Food.mp3');
const deathSound = new Audio('Dead.mp3');
const passingWallSound = new Audio('Dead.mp3');
const firstBackgroundSound = new Audio('Background_1.mp3');
const secondBackgroundSound = new Audio('Background_2.mp3');


// Score Variables
const currentScoreVar = document.querySelector('.current-score');
const highScoreVar = document.querySelector('.high-score');


//  GameOver Variables
const gameOverVar = document.querySelector('.game-over');
const restartGameButton = document.querySelector('.play-again');


// Canvas Settings
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;


// Snake Speed
let speed = 200;
let snakeSpeed;


// Square Measures
const squareSize = 20;
let horizontalSq = width / squareSize;
let verticalSq = height / squareSize;


// GameLoop
let gameLoop;
let gameStarted = false;


// Colors
const boardColor = '#000000';
let headColor = 'yellowgreen'; // headColor changing by eating food
let bodyColor = '#99cd32BD'; // bodyColor changing by eating Food


// snakeBody Settings
let snakeBody = [
  { x: Math.floor(horizontalSq / 2) - 1, y: Math.floor(verticalSq / 2) }, // Head
  { x: Math.floor(horizontalSq / 2), y: Math.floor(verticalSq / 2) }, // Body
  { x: Math.floor(horizontalSq / 2) + 1, y: Math.floor(verticalSq / 2) }, // Body
  { x: Math.floor(horizontalSq / 2) + 2, y: Math.floor(verticalSq / 2) } // Tail
];

const initialSnakeBodysnakeBodyLength = snakeBody.length;


// Foods
let placeholder;
let food;
let deadlyFood1;
let deadlyFood2;



// Directions
let currentDirection = '';
let directionsQueue = [];
let directions = {
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown'
};


// Score Variables
let score = 0;
let highScore = localStorage.getItem('high-score') || 0;


const drawBoard = () => {
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, width, height);
}


const drawSquare = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x * squareSize + squareSize / 2, y * squareSize + squareSize / 2, squareSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = boardColor;
  ctx.beginPath();
  ctx.arc(x * squareSize + squareSize / 2, y * squareSize + squareSize / 2, squareSize / 2, 0, Math.PI * 2);
  ctx.stroke();
}


const drawSnake = () => {
  snakeBody.forEach((square, index) => {
    const color = index === 0 ? headColor : bodyColor;
    drawSquare(square.x, square.y, color);
  });
}


const createFood = () => {
  food = {
    x: Math.floor(Math.random() * horizontalSq),
    y: Math.floor(Math.random() * verticalSq),
  };

  while (
    snakeBody.some((square) => square.x === food.x && square.y === food.y)
  ) {
    food = {
      x: Math.floor(Math.random() * horizontalSq),
      y: Math.floor(Math.random() * verticalSq),
    };

  }
  return food;
}


const createDeadlyFood1 = () => {
  deadlyFood1 = {
    x: Math.floor(Math.random() * horizontalSq),
    y: Math.floor(Math.random() * verticalSq),
  };

  while (
    snakeBody.some((square) => square.x === deadlyFood1.x && square.y === deadlyFood1.y)
  ) {
    deadlyFood1 = {
      x: Math.floor(Math.random() * horizontalSq),
      y: Math.floor(Math.random() * verticalSq),
    };

  }
  return deadlyFood1;
}


const createDeadlyFood2 = () => {
  deadlyFood2 = {
    x: Math.floor(Math.random() * horizontalSq),
    y: Math.floor(Math.random() * verticalSq),
  };

  while (
    snakeBody.some((square) => square.x === deadlyFood2.x && square.y === deadlyFood2.y)
  ) {
    deadlyFood2 = {
      x: Math.floor(Math.random() * horizontalSq),
      y: Math.floor(Math.random() * verticalSq),
    };

  }
  return deadlyFood2;
}


food = createFood();
deadlyFood1 = createDeadlyFood1();
deadlyFood2 = createDeadlyFood2();




const drawFood = () => {
  drawSquare(food.x, food.y, getRandomColor());
}

const drawDeadlyFood1 = () => {
  drawSquare(deadlyFood1.x, deadlyFood1.y, 'yellowgreen');
}
const drawDeadlyFood2 = () => {
  drawSquare(deadlyFood2.x, deadlyFood2.y, 'yellowgreen');
}



const getRandomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//  Speed Up or Speed Down by Using Space Bar

// const speedUp = (speedKey) => {
//   if (speedKey.keyCode == 32) {
//     speed = 100;
//     firstBackgroundSound.pause();
//     firstBackgroundSound.currentTime = 0;
//     secondBackgroundSound.play();
//   }
// };

// document.addEventListener('keydown', speedUp);

// const speedDown = (speedKey) => {
//   if (speedKey.keyCode == 32) {
//     speed = 200;
//     secondBackgroundSound.pause();
//     secondBackgroundSound.currentTime = 0;
//     firstBackgroundSound.play();
//   }
// };

// document.addEventListener('keyup', speedDown);


const increaseSpeedByContact = () => {

  clearInterval(gameLoop);

  if (speed <= 80) {
    speed = 80;
    firstBackgroundSound.pause();
    firstBackgroundSound.currentTime = 0;
    secondBackgroundSound.play();
  }
  else {
    speed -= 10;
  }
  gameLoop = setInterval(frame, speed);
}


const moveSnakeBodysnakeBody = () => {
  if (!gameStarted) return;

  // get head position
  const head = { ...snakeBody[0] };

  // consume the directions
  if (directionsQueue.length) {
    currentDirection = directionsQueue.shift();
  }


  // change head postion
  switch (currentDirection) {
    case directions.RIGHT:
      head.x += 1;
      break;
    case directions.LEFT:
      head.x -= 1;
      break;
    case directions.UP:
      head.y -= 1;
      break;
    case directions.DOWN:
      head.y += 1;
      break;
  }


  if (hasEatenFood()) {
    food = createFood();
    deadlyFood1 = createDeadlyFood1();
    deadlyFood2 = createDeadlyFood2();
    headColor = getRandomColor();
    bodyColor = getRandomColor();
    firstBackgroundSound.play();
    increaseSpeedByContact();
    foodSound.play();
  } else {
    // remove tail
    snakeBody.pop();
  }

  // unshift new head
  snakeBody.unshift(head);
}


const hasEatenFood = () => {
  const head = snakeBody[0];

  return head.x === food.x && head.y === food.y;
}

const hasEatenDeadlyFood1 = () => {
  const deadHead = snakeBody[0];
  return deadHead.x === deadlyFood1.x && deadHead.y === deadlyFood1.y;
}

const hasEatenDeadlyFood2 = () => {
  const deadHead = snakeBody[0];
  return deadHead.x === deadlyFood2.x && deadHead.y === deadlyFood2.y;
}



// keyup event lisenter
const setDirection = (event) => {
  const newDirection = event.key;
  const oldDirection = currentDirection;

  if (
    (newDirection === directions.LEFT &&
      oldDirection !== directions.RIGHT) ||
    (newDirection === directions.RIGHT &&
      oldDirection !== directions.LEFT) ||
    (newDirection === directions.UP &&
      oldDirection !== directions.DOWN) ||
    (newDirection === directions.DOWN &&
      oldDirection !== directions.UP)
  ) {
    if (!gameStarted) {
      gameStarted = true;
      gameLoop = setInterval(frame, speed);
    }
    directionsQueue.push(newDirection);
  }
}

document.addEventListener('keyup', setDirection);


// score

const renderScore = () => {
  score = snakeBody.length - initialSnakeBodysnakeBodyLength;
  currentScoreVar.innerHTML = `Current-Score ${score}`;
  highScoreVar.innerHTML = `High-Score ${highScore}`;
}


// hit wall
const hitWall = () => {
  const head = snakeBody[0];

  return (
    head.x < 0 ||
    head.x >= horizontalSq ||
    head.y < 0 ||
    head.y >= verticalSq
  );
}


// hit self
const hitSelf = () => {
  const snakeBodyBody = [...snakeBody];
  const head = snakeBodyBody.shift();

  return snakeBodyBody.some(
    (square) => square.x === head.x && square.y === head.y
  );
}


// game over
const gameOver = () => {
  // select score and high score el
  const currentScoreVar = document.querySelector('.game-over-score .current');
  const highScoreVar = document.querySelector('.game-over-score .high');

  // calculate the high score
  highScore = Math.max(score, highScore);
  localStorage.setItem('high-score', highScore);

  // update the score and high score el
  currentScoreVar.innerHTML = `Current-Score ${score}`;
  highScoreVar.innerHTML = `High-Score ${highScore}`;

  // show game over el
  gameOverVar.classList.remove('hide');

  // death Sound
  deathSound.play();
}


// loop
const frame = () => {
  drawBoard();
  drawFood();
  drawDeadlyFood1();
  drawDeadlyFood2();
  moveSnakeBodysnakeBody();
  drawSnake();
  renderScore();
  if (hitWall() || hitSelf() || hasEatenDeadlyFood1() || hasEatenDeadlyFood2()) {
    clearInterval(gameLoop);
    gameOver();
  }
}

frame();


// restart the game

const restartGame = () => {
  // reset snakeBody length and position
  snakeBody = [
    { x: Math.floor(horizontalSq / 2) - 1, y: Math.floor(verticalSq / 2) }, // Head
    { x: Math.floor(horizontalSq / 2), y: Math.floor(verticalSq / 2) }, // Body
    { x: Math.floor(horizontalSq / 2) + 1, y: Math.floor(verticalSq / 2) }, // Body
    { x: Math.floor(horizontalSq / 2) + 2, y: Math.floor(verticalSq / 2) } // Tail
  ];

  // reset snakeBody Colors
  headColor = 'yellowgreen';
  bodyColor = '#99cd32BD';

  // reset Sound
  firstBackgroundSound.pause();
  secondBackgroundSound.pause();
  firstBackgroundSound.currentTime = 0;
  secondBackgroundSound.currentTime = 0;

  // reset SnakeSpeed
  speed = 200;

  // reset directions
  currentDirection = '';
  directionsQueue = [];

  // hide the game over screen
  gameOverVar.classList.add('hide');

  // reset the gameStarted state to false
  gameStarted = false;

  // re-draw everything
  frame();
}

restartGameButton.addEventListener('click', restartGame);
