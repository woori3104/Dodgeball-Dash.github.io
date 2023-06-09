const startGame = () => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", reject);
      image.src = src;
    });
  };

  const init = async () => {
    const [ball, cat, dog, background] = await Promise.all([
      loadImage("images/ball.png"),
      loadImage("images/cat.png"),
      loadImage("images/dog.png"),
      loadImage("images/background.png"),
    ]);
    return { ball, cat, dog, background };
  };

  let ballX = 80;
  let ballY = 50;
  let catX = 250;
  let catY = 100;
  let ballSize = 25;
  let animalSize = 30;
  let dogX = 30;
  let dogY = 100;

  const drawDifficulty = () => {
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText(
      "Difficulty: " + ["Easy", "Medium", "Hard"][difficulty],
      10,
      25
    );
  };
  let dogScore = 0;
  let catScore = 0;
  let isGameEnded = false;
  let isStart = false;

  const handelEndGame = () => {
    if (ballX <= ballSize) {
      catScore += 5;
      resetPositions();
    } else if (ballX >= canvas.width - ballSize) {
      dogScore += 5;
      resetPositions();
    }
  };

  const resetPositions = () => {
    ballX = 80;
    ballY = 50;
    catX = 250;
    catY = 100;
    dogX = 30;
    dogY = 100;
    ballSize = 25;
    animalSize = 30;
    ballYSpeed = 0;
    ballXSpeed = 0;
    isGameEnded = false;
    isStart = false;
  };

  const render = (cat, dog, ball, background) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(ball, ballX, ballY, ballSize, ballSize);
    ctx.drawImage(dog, dogX, dogY, animalSize, animalSize);
    ctx.drawImage(cat, catX, catY, animalSize, animalSize);
    drawDifficulty();

    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText("Dog: " + dogScore, 10, 10);
    ctx.fillText("Cat: " + catScore, canvas.width - 80, 10);
  };

  const moveState = {
    isMovingUp: false,
    isMovingDown: false,
    isMovingLeft: false,
    isMovingRight: false,
  };

  let ballXSpeed = 0;
  let ballYSpeed = 0;

  const isBallCollision = (objectX, objectY, objectSize) => {
    if (!isStart) {
      return;
    }
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
      // 충돌 감지를 위한 계산을 최소화할 수 있도록 수정
      return true; // 충돌 발생
    } else {
      return false; // 충돌 없음
    }
  };
  const randomizeBallAngle = () => {
    // 랜덤한 각도 생성 (0 이상 2π 미만)
    const randomAngle = Math.random() * Math.PI;
    // 반대 방향에 해당하는 각도 계산 (랜덤 각도에 π를 더해줌)
    const oppositeAngle = randomAngle + Math.PI;
    return { randomAngle, oppositeAngle };
  };

  const updateBallCoordinates = () => {
    if (!isStart) {
      return;
    }
    ballX += ballXSpeed;
    ballY += ballYSpeed;

    if (isBallCollision(dogX, dogY, animalSize)) {
      const { randomAngle, oppositeAngle } = randomizeBallAngle();
      const angle = Math.random() < 0.5 ? randomAngle : oppositeAngle;

      // 공의 초기 각도 설정
      ballXSpeed = Math.cos(angle) * 5;
      ballYSpeed = Math.sin(angle) * 5;
    }
    if (isBallCollision(catX, catY, animalSize)) {
      const { randomAngle, oppositeAngle } = randomizeBallAngle();
      const angle = Math.random() < 0.5 ? randomAngle : oppositeAngle;

      // 공의 초기 각도 설정
      ballXSpeed = Math.cos(angle) * 6;
      ballYSpeed = Math.sin(angle) * 6;
    }

    if (ballX < 0 || ballX + ballSize > canvas.width) {
      ballXSpeed = -ballXSpeed;
    }
    if (ballY < 0 || ballY + ballSize > canvas.height) {
      ballYSpeed = -ballYSpeed;
    }

    if (isGameEnded) {
      ballXSpeed = 0;
      ballYSpeed = 0;
    }
  };

  let difficulty = 1;
  const catMovement = () => {
    if (!isStart || isGameEnded) {
      return;
    }
    const targetX = ballX;
    const targetY = ballY;

    const dx = targetX - catX - 10;
    const dy = targetY - catY - 10;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = Math.min(distance, difficulty * 2 + 1);

    const vx = (speed * dx) / distance;
    const vy = (speed * dy) / distance;

    let newCatX = catX + vx;
    let newCatY = catY + vy;

    if (newCatX <= canvas.width / 2) {
      newCatX = canvas.width / 2;
    } else if (newCatX >= canvas.width - 40) {
      newCatX = canvas.width - 40;
    }

    if (newCatY <= 0) {
      newCatY = 0;
    } else if (newCatY >= canvas.height - 40) {
      newCatY = canvas.height - 40;
    }

    catX = newCatX;
    catY = newCatY;
  };

  const handleDifficulty = () => {
    const difficultyBtn = document.querySelector(".difficulty-btn");

    difficultyBtn.addEventListener("mouseup", function () {
      difficulty++;

      if (difficulty > 2) {
        difficulty = 0;
      }
    });
    difficultyBtn.addEventListener("touchend", function () {
      difficulty++;

      if (difficulty > 2) {
        difficulty = 0;
      }
    });
  };
  let isGamePaused = false;
  let backUpBallXSpeed = 0;
  let backUpBallYSpeed = 0;

  const handlePauseEvent = () => {
    const stopBtn = document.querySelector(".stop-btn");

    const gamePausedEvent = () => {
      if (!isGamePaused) {
        // 게임이 진행 중인 상태에서 버튼을 터치하면 일시정지
        backUpBallXSpeed = ballXSpeed;
        backUpBallYSpeed = ballYSpeed;
        ballXSpeed = 0;
        ballYSpeed = 0;
        isGamePaused = true;
        isStart = false;
      } else {
        ballXSpeed = backUpBallXSpeed;
        ballYSpeed = backUpBallYSpeed;
        isGamePaused = false;
        isStart = true;
      }
    };
    stopBtn.addEventListener("mouseup", function () {
      gamePausedEvent();
    });
    stopBtn.addEventListener("touchend", function () {
      gamePausedEvent();
    });
  };

  const setupMoveEvent = () => {
    const moveButtons = {
      up: document.querySelector(".up-button"),
      down: document.querySelector(".down-button"),
      left: document.querySelector(".left-button"),
      right: document.querySelector(".right-button"),
    };

    const directions = ["Up", "Down", "Left", "Right"];

    const handleMoveStart = (direction) => () => {
      handleMove(direction, true);
    };

    const handleMoveEnd = (direction) => () => {
      handleMove(direction, false);
    };

    const handleMove = (direction, isMoving) => {
      const moveFlag = `isMoving${direction}`;
      moveState[moveFlag] = isMoving;
      isStart = true;
    };

    directions.forEach((direction) => {
      moveButtons[direction.toLowerCase()].addEventListener(
        "mousedown",
        handleMoveStart(direction)
      );
      moveButtons[direction.toLowerCase()].addEventListener(
        "mouseup",
        handleMoveEnd(direction)
      );
      moveButtons[direction.toLowerCase()].addEventListener(
        "touchstart",
        handleMoveStart(direction)
      );
      moveButtons[direction.toLowerCase()].addEventListener(
        "touchend",
        handleMoveEnd(direction)
      );
    });
  };

  const handleResetEvent = () => {
    const resetData = () => {
      dogScore = 0;
      catScore = 0;
      resetPositions();
      isStart = false;
    }
    const resetBtn = document.querySelector(".reset-btn");
    resetBtn.addEventListener("mousedown", function () {
      resetData()
    });
    // 버튼을 클릭하면 게임을 재시작하거나 난이도를 변경
    resetBtn.addEventListener("touchstart", function () {
      resetData()
    });
  };

  const handleEvent = () => {
    handleDifficulty();
    setupMoveEvent();
    handlePauseEvent();
    handleResetEvent()
  };

  const updateDogCoordinate = () => {
    if (moveState.isMovingUp && dogY > 0) {
      dogY -= 5;
    }
    if (moveState.isMovingDown && dogY + animalSize < canvas.height) {
      dogY += 5;
    }

    if (moveState.isMovingLeft && dogX > 0) {
      dogX -= 5;
    }

    if (moveState.isMovingRight && dogX + animalSize < canvas.width / 2) {
      dogX += 5;
    }
  };

  const update = () => {
    handelEndGame();
    updateDogCoordinate();
    updateBallCoordinates();
    catMovement();
  };

  const main = async () => {
    const { cat, dog, ball, background } = await init();

    const gameLoop = () => {
      update();
      render(cat, dog, ball, background);
      requestAnimationFrame(gameLoop);
    };
    handleEvent();
    gameLoop();
  };

  main();
};

startGame();
