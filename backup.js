const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const ballSize = 25;
const animalSize = 0.1 * canvas.width + 10;
let ballX, ballY, catX, catY, dogWidth, dogHeight;
let ballSpeedX, ballSpeedY, dogScore, catScore;
let isStart = false;
let isPowerMode = false;
let isButtonPressed = false;
let isCollisionCooldown = false;
let difficulty = 0;
let lastCollisionTime = 0;

const ball = new Image();
ball.src = "images/ball.png";
const cat = new Image();
cat.src = "images/cat.png";
const dog = new Image();
dog.src = "images/dog.png";
const background = new Image();
background.src = "images/background.png";

let isMovingUp = false;
let isMovingDown = false;
let isMovingLeft = false;
let isMovingRight = false;

const upBtn = document.querySelector(".up-button");
const leftBtn = document.querySelector(".left-button");
const rightBtn = document.querySelector(".right-button");
const downBtn = document.querySelector(".down-button");
const resetBtn = document.querySelector(".reset-btn");
const stopBtn = document.querySelector(".stop-btn");
const difficultyBtn = document.querySelector(".difficulty-btn");
const musicBtn = document.querySelector(".music-btn");
const powerBtn = document.querySelector(".power-btn");

const keyDown = {};
const audio = new Audio("music/bgm.mp3");
let isMusicPlaying = false;

const playMusic = () => {
  audio.play();
  isMusicPlaying = true;
};

const stopMusic = () => {
  audio.pause();
  audio.currentTime = 0;
  isMusicPlaying = false;
};

const resetPositions = () => {
  dogWidth = canvas.width * 0.1;
  dogHeight = canvas.height * 0.8;
  isStart = false;

  ballX = canvas.width * 0.4;
  ballY = canvas.height * 0.5;
  catX = canvas.width * 0.8;
  catY = canvas.height * 0.8;

  catSpeedX = 0;
  catSpeedY = 0;
  isStart = false;
  ballSpeedX = 0;
  ballSpeedY = 0;
};

const loadImage = () => {
  ball.onload = () => {
    resetPositions();
    main();
  };
};

const handleCollision = (centerX, centerY) => {
  const ballCenterX = ballX + ballSize / 2;
  const ballCenterY = ballY + ballSize / 2;

  const deltaX = ballCenterX - centerX;
  const deltaY = ballCenterY - centerY;

  const angle = Math.atan2(deltaY, deltaX);
  const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
  const randomFactor = 2;

  const newAngle = angle + (Math.random() * randomFactor - randomFactor / 2);

  isCollisionCooldown = true;

  if (centerX < ballX) {
    ballX = centerX - ballSize;
  } else {
    ballX = centerX + animalSize;
  }

  if (centerY < ballY) {
    ballY = centerY - ballSize;
  } else {
    ballY = centerY + animalSize;
  }

  setTimeout(() => {
    isCollisionCooldown = false;
  }, collisionCooldownDuration);

  ballSpeedX = Math.cos(newAngle) * speed + 2;
  ballSpeedY = Math.sin(newAngle) * speed + 2;
};

const ballCollision = (objectX, objectY, objectSize) => {
  const objectLeft = objectX;
  const objectRight = objectX + objectSize;
  const objectTop = objectY;
  const objectBottom = objectY + objectSize;

  const ballLeft = ballX;
  const ballRight = ballX + ballSize;
  const ballTop = ballY;
  const ballBottom = ballY + ballSize;

  const distanceThreshold = 5;

  if (
    ballLeft < objectRight - distanceThreshold &&
    ballRight > objectLeft + distanceThreshold &&
    ballTop < objectBottom - distanceThreshold &&
    ballBottom > objectTop + distanceThreshold
  ) {
    const objectCenterX = objectX + objectSize / 2;
    const objectCenterY = objectY + objectSize / 2;

    const ballCenterX = ballX + ballSize / 2;
    const ballCenterY = ballY + ballSize / 2;

    const deltaX = ballCenterX - objectCenterX;
    const deltaY = ballCenterY - objectCenterY;

    ballSpeedX = Math.sign(deltaX) * Math.abs(ballSpeedX);
    ballSpeedY = Math.sign(deltaY) * Math.abs(ballSpeedY);

    const randomFactor = 0.2;
    ballSpeedX += Math.random() * randomFactor - randomFactor / 2;
    ballSpeedY += Math.random() * randomFactor - randomFactor / 2;

    return true;
  } else {
    return false;
  }
};

const checkCollision = () => {
  if (ballCollision(dogWidth, dogHeight, animalSize)) {
    const { centerX, centerY } = getAnimalCenter(dogWidth, dogHeight);
    handleAnimalCollision(centerX, centerY);
  } 
  if (ballCollision(catX, catY, animalSize)) {
    const { centerX, centerY } = getAnimalCenter(catX, catY);
    handleAnimalCollision(centerX, centerY);
  }
};

const handleAnimalCollision = (centerX, centerY) => {
  const animalCenterX = centerX + 30;
  const animalCenterY = centerY + 30;

  handleCollision(animalCenterX, animalCenterY);

  if (centerX < ballX) {
    if (ballSpeedX < 0) {
      ballSpeedX = -ballSpeedX;
    }
  } else {
    if (ballSpeedX > 0) {
      ballSpeedX = -ballSpeedX;
    }
  }

  if (centerY < ballY) {
    if (ballSpeedY < 0) {
      ballSpeedY = -ballSpeedY;
    }
  } else {
    if (ballSpeedY > 0) {
      ballSpeedY = -ballSpeedY;
    }
  }
};

const getAnimalCenter = (x, y) => {
  const centerX = x + animalSize / 2;
  const centerY = y + animalSize / 2;
  return { centerX, centerY };
};

const update = () => {
  checkCollision();

  if (39 in keyDown) dogWidth += 5;
  if (37 in keyDown) dogWidth -= 5;
  if (38 in keyDown) dogHeight -= 5;
  if (40 in keyDown) dogHeight += 5;

  if (isMovingUp && dogHeight > 0) {
    dogHeight -= 5;
  }

  if (isMovingDown && dogHeight + animalSize < canvas.height) {
    dogHeight += 5;
  }

  if (isMovingLeft && dogWidth > 0) {
    dogWidth -= 5;
  }

  if (isMovingRight && dogWidth + animalSize < canvas.width / 2) {
    dogWidth += 5;
  }

  if (isCollisionCooldown) {
    const currentTime = Date.now();
    const elapsed = currentTime - lastCollisionTime;

    if (elapsed >= collisionCooldownDuration) {
      isCollisionCooldown = false;
    }
  } else {
    if (ballCollision(dogWidth, dogHeight, animalSize)) {
      const { centerX, centerY } = getAnimalCenter(dogWidth, dogHeight);
      handleAnimalCollision(centerX, centerY);
      isCollisionCooldown = true;
      dogWidth -= 10;
      dogHeight -= 10;
      lastCollisionTime = Date.now();
    } 
    if (ballCollision(catX, catY, animalSize)) {
      const { centerX, centerY } = getAnimalCenter(catX, catY);
      handleAnimalCollision(centerX, centerY);
      isCollisionCooldown = true;
      catX += 10;
      catY += 10;
      lastCollisionTime = Date.now();
    }
  }

  catMovement();

  ballX -= ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= ballSize || ballY >= canvas.height - ballSize) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX <= ballSize) {
    catScore += 5;
    resetPositions();
  } else if (ballX >= canvas.width - ballSize) {
    dogScore += 5;
    resetPositions();
  }
};

const catMovement = () => {
  if (!isStart) {
    return;
  }

  const targetX = ballX;
  const targetY = ballY;

  const dx = targetX - catX;
  const dy = targetY - catY;

  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = Math.min(distance, difficulty * 2 + 1);

  const vx = (speed * dx) / distance;
  const vy = (speed * dy) / distance;

  let newCatX = catX + vx;
  let newCatY = catY + vy;

  if (newCatX <= canvas.width / 2) {
    newCatX = canvas.width / 2;
  } else if (newCatX >= canvas.width - 80) {
    newCatX = canvas.width - 80;
  }

  if (newCatY <= 0) {
    newCatY = 0;
  } else if (newCatY >= canvas.height - 80) {
    newCatY = canvas.height - 80;
  }

  catX = newCatX;
  catY = newCatY;
};

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = isButtonPressed && isPowerMode ? "red" : "black";
  ctx.fill();
  ctx.closePath();
};

const drawDifficulty = () => {
  ctx.fillStyle = "black";
  ctx.font = "15px Arial";
  ctx.fillText("Difficulty: " + ["Easy", "Medium", "Hard"][difficulty], 10, 40);
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(ball, ballX, ballY, ballSize, ballSize);
  ctx.drawImage(dog, dogWidth, dogHeight, animalSize, animalSize);
  ctx.drawImage(cat, catX, catY, animalSize, animalSize);
  drawDifficulty();
  ctx.fillStyle = "black";
  ctx.font = "15px Arial";
  ctx.fillText("Dog: " + dogScore, 10, 20);
  ctx.fillText("Cat: " + catScore, canvas.width - 80, 20);
};

const main = () => {
  loadImage();
  const gameLoop = () => {
    if (!isGamePaused) render();
    requestAnimationFrame(gameLoop);
  };

  update();
  gameLoop();
};

main();

const setupKeyboard = () => {
  document.addEventListener("keydown", (e) => {
    keyDown[e.keyCode] = true;
    if (
      !isStart &&
      (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
    ) {
      isGamePaused = true;
    }
    isStart = false;
  });

  document.addEventListener("keyup", (e) => {
    delete keyDown[e.keyCode];
  });

  stopBtn.addEventListener("click", () => {
    if (!isGamePaused) {
      backUpBallSpeedX = ballSpeedX;
      backUpBallSpeedY = ballSpeedY;
      ballSpeedX = 0;
      ballSpeedY = 0;
      isGamePaused = true;
      isStart = false;
    }
  });

  stopBtn.addEventListener("touchend", () => {
    if (!isGamePaused) {
      backUpBallSpeedX = ballSpeedX;
      backUpBallSpeedY = ballSpeedY;
      ballSpeedX = 0;
      ballSpeedY = 0;
      isGamePaused = true;
      isStart = false;
    }
  });

  difficultyBtn.addEventListener("mouseup", () => {
    difficulty++;
    ballSpeedX++;
    if (difficulty > 2) {
      difficulty = 0;
      ballSpeedX = 2;
    }
  });

  difficultyBtn.addEventListener("touchend", () => {
    difficulty++;
    ballSpeedX++;
    if (difficulty > 2) {
      difficulty = 0;
      ballSpeedX = 2;
    }
  });

  difficultyBtn.addEventListener("click", () => {
    difficulty++;
    ballSpeedX++;
    if (difficulty > 2) {
      difficulty = 0;
      ballSpeedX = 2;
    }
  });

  resetBtn.addEventListener("mousedown", () => {
    dogScore = 0;
    catScore = 0;
    resetPositions();
    isStart = false;
  });

  resetBtn.addEventListener("touchstart", () => {
    dogScore = 0;
    catScore = 0;
    resetPositions();
    isStart = false;
  });

  upBtn.addEventListener("mousedown", () => {
    isMovingUp = true;
    isStart = true;
    isGamePaused = false;
  });

  downBtn.addEventListener("mousedown", () => {
    isMovingDown = true;
    isStart = true;
    isGamePaused = false;
  });

  leftBtn.addEventListener("mousedown", () => {
    isMovingLeft = true;
    isStart = true;
    isGamePaused = false;
  });

  rightBtn.addEventListener("mousedown", () => {
    isMovingRight = true;
    isStart = true;
    isGamePaused = false;
  });

  upBtn.addEventListener("mouseup", () => {
    isMovingUp = false;
  });

  downBtn.addEventListener("mouseup", () => {
    isMovingDown = false;
  });

  leftBtn.addEventListener("mouseup", () => {
    isMovingLeft = false;
  });

  rightBtn.addEventListener("mouseup", () => {
    isMovingRight = false;
  });

  powerBtn.addEventListener("mousedown", () => {
    isButtonPressed = true;
    isPowerMode = true;
  });

  powerBtn.addEventListener("mouseup", () => {
    isButtonPressed = false;
    isPowerMode = false;
  });

  powerBtn.addEventListener("touchstart", () => {
    isButtonPressed = true;
    isPowerMode = true;
  });

  powerBtn.addEventListener("touchend", () => {
    isButtonPressed = false;
    isPowerMode = false;
  });

  musicBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      playMusic();
    }
  });

  musicBtn.addEventListener("touchend", () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      playMusic();
    }
  });
};

setupKeyboard();
