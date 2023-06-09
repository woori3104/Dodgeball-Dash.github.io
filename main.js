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

  const render = (cat, dog, ball, background) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(ball, ballX, ballY, ballSize, ballSize);
    ctx.drawImage(dog, dogX, dogY, animalSize, animalSize);
    ctx.drawImage(cat, catX, catY, animalSize, animalSize);
  };

  const moveState = {
    isMovingUp: false,
    isMovingDown: false,
    isMovingLeft: false,
    isMovingRight: false,
  };

  const handleMoveStart = (direction) => {
    moveState[direction] = true;
    console.log(moveState);
  };

  const handleMoveEnd = (direction) => {
    moveState[direction] = false;
    console.log(moveState);
  };

  const setupMoveEvent = () => {
    const moveButtons = {
      up: document.querySelector(".up-button"),
      down: document.querySelector(".down-button"),
      left: document.querySelector(".left-button"),
      right: document.querySelector(".right-button"),
    };

    moveButtons.up.addEventListener("mousedown", () => handleMoveStart("isMovingUp"));
    moveButtons.up.addEventListener("mouseup", () => handleMoveEnd("isMovingUp"));
    moveButtons.up.addEventListener("touchstart", () => handleMoveStart("isMovingUp"));
    moveButtons.up.addEventListener("touchend", () => handleMoveEnd("isMovingUp"));

    moveButtons.down.addEventListener("mousedown", () => handleMoveStart("isMovingDown"));
    moveButtons.down.addEventListener("mouseup", () => handleMoveEnd("isMovingDown"));
    moveButtons.down.addEventListener("touchstart", () => handleMoveStart("isMovingDown"));
    moveButtons.down.addEventListener("touchend", () => handleMoveEnd("isMovingDown"));

    moveButtons.left.addEventListener("mousedown", () => handleMoveStart("isMovingLeft"));
    moveButtons.left.addEventListener("mouseup", () => handleMoveEnd("isMovingLeft"));
    moveButtons.left.addEventListener("touchstart", () => handleMoveStart("isMovingLeft"));
    moveButtons.left.addEventListener("touchend", () => handleMoveEnd("isMovingLeft"));

    moveButtons.right.addEventListener("mousedown", () => handleMoveStart("isMovingRight"));
    moveButtons.right.addEventListener("mouseup", () => handleMoveEnd("isMovingRight"));
    moveButtons.right.addEventListener("touchstart", () => handleMoveStart("isMovingRight"));
    moveButtons.right.addEventListener("touchend", () => handleMoveEnd("isMovingRight"));
  };

  const updateDogCord = () => {
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

  const main = async () => {
    const { cat, dog, ball, background } = await init();
    const { width: canvasWidth, height: canvasHeight } = canvas;

    const gameLoop = () => {
      updateDogCord();
      render(cat, dog, ball, background);
      requestAnimationFrame(gameLoop);
    };

    setupMoveEvent();
    gameLoop();
  };

  main();
};

startGame();
