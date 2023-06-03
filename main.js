const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;
document.body.appendChild(canvas);

const loadImage = () => {
  ball = new Image();
  ball.src = "images/ball.png";
  cat = new Image();
  cat.src = "images/cat.png";
  dog = new Image();
  dog.src = "images/dog.png";
  background = new Image();
  background.src = "images/background.png";
};

let dogWidth = canvas.width * 0.1;
let dogHeight = canvas.height * 0.7;
let isStart = false;

let ballX = canvas.width * 0.4;
let ballY = canvas.height * 0.4;
let catX = canvas.width * 0.8;
let catY = canvas.height * 0.7;
let ballSize = canvas.width * 0.1;
let animalSize = canvas.width * 0.3;

let catSpeedX = 0;
let catSpeedY = 0;

let dogScore = 0;
let catScore = 0;
// HTML에 미리 재시작과 난이도 변경 버튼을 추가해놓고 필요할 때만 표시되도록 합니다.
let restartButton = document.getElementById("restart");
let difficultyButton = document.getElementById("difficulty");

// 캔버스에 그려질 난이도 표시와 게임 중단 버튼 관련 코드를 추가합니다.
let isPaused = false; // 게임 중단 상태인지를 확인하는 플래그입니다.
let difficulty = 1;
// 난이도를 캔버스 상단에 표시합니다.
const drawDifficulty = () => {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(
    "Difficulty: " + ["Easy", "Medium", "Hard"][difficulty - 1],
    10,
    60
  );
};

// 게임 중단 버튼을 캔버스 하단에 표시합니다.
const drawPauseButton = () => {
  if (!isPaused) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Click here to pause", 10, canvas.height - 10);
  } else {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Click here to start", 10, canvas.height - 10);
  }
};
const drawRestartButton = () => {
  // 초기에는 버튼들을 숨겨놓습니다.
  restartButton.style.display = "none";
  difficultyButton.style.display = "none";

  // 버튼의 위치를 캔버스 오른쪽 하단에 위치하도록 변경합니다.
  restartButton.style.position = "absolute";
  restartButton.style.bottom = "10px";
  restartButton.style.right = "10px";

  difficultyButton.style.position = "absolute";
  difficultyButton.style.bottom = "40px";
  difficultyButton.style.right = "10px";
};

const onClickEvent = () => {
  canvas.addEventListener("click", function (e) {
    // 마우스 포인터의 y 좌표를 가져옵니다.
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;

    // 사용자가 canvas의 하단을 클릭한 경우 게임을 일시 중지합니다.
    if (mouseY > canvas.height - 40) {
      isPaused = !isPaused;
      if (isPaused) {
        restartButton.style.display = "block";
        difficultyButton.style.display = "block";
      } else {
        restartButton.style.display = "none";
        difficultyButton.style.display = "none";
      }
    }
  });

  // 버튼을 클릭하면 게임을 재시작하거나 난이도를 변경하는 로직을 추가합니다.
  restartButton.addEventListener("click", function () {
    // 점수를 0으로 초기화합니다.
    dogScore = 0;
    catScore = 0;

    // 공과 플레이어의 위치를 초기화합니다.
    resetPositions();

    // 게임 일시 중지 상태를 해제합니다.
    isPaused = false;

    // 버튼들을 다시 숨깁니다.
    restartButton.style.display = "none";
    difficultyButton.style.display = "none";
  });

  difficultyButton.addEventListener("click", function () {
    // 난이도를 변경합니다. 이 경우에는 난이도가 3단계라고 가정하겠습니다.
    difficulty = (difficulty % 3) + 1;

    // 버튼의 텍스트를 업데이트하여 현재 난이도를 표시합니다.
    difficultyButton.textContent =
      "Difficulty: " + ["Easy", "Medium", "Hard"][difficulty - 1];
  });
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(ball, ballX, ballY, ballSize, ballSize);
  ctx.drawImage(dog, dogWidth, dogHeight, animalSize, animalSize);
  ctx.drawImage(cat, catX, catY, animalSize, animalSize);

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Dog: " + dogScore, 10, 30);
  ctx.fillText("Cat: " + catScore, canvas.width - 80, 30);
  drawDifficulty();
  drawPauseButton();
  drawRestartButton();
};

const keyDown = {};
// 터치패드 화살표 관련 변수
let touchArrow = {
  up: false,
  down: false,
  left: false,
  right: false,
};

const touchPadCanvas = document.createElement("canvas");
const touchPadCtx = touchPadCanvas.getContext("2d");
touchPadCanvas.width = 200;
touchPadCanvas.height = 200;
touchPadCanvas.style.position = "absolute";
touchPadCanvas.style.bottom = "20px";
touchPadCanvas.style.left = "20px";
document.body.appendChild(touchPadCanvas);

// 터치패드 스타일 설정
touchPadCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
touchPadCtx.fillRect(0, 0, touchPadCanvas.width, touchPadCanvas.height);
touchPadCtx.strokeStyle = "black";
touchPadCtx.lineWidth = 2;
touchPadCtx.strokeRect(0, 0, touchPadCanvas.width, touchPadCanvas.height);

// 터치패드 이벤트 처리
const handleTouchPad = (e) => {
  const rect = touchPadCanvas.getBoundingClientRect();
  let touchX, touchY;

  // 터치 이벤트인 경우
  if (event.touches) {
    touchX = event.changedTouches[0].clientX - rect.left;
    touchY = event.changedTouches[0].clientY - rect.top;
  }
  // 마우스 클릭 이벤트인 경우
  else {
    touchX = event.clientX - rect.left;
    touchY = event.clientY - rect.top;
  }
  // 터치패드 영역 내에서 화살표 이벤트 처리
  if (
    touchX > 0 &&
    touchX < touchPadCanvas.width &&
    touchY > 0 &&
    touchY < touchPadCanvas.height
  ) {
    touchArrow.up = touchY < touchPadCanvas.height / 3;
    touchArrow.down = touchY > (touchPadCanvas.height / 3) * 2;
    touchArrow.left = touchX < touchPadCanvas.width / 3;
    touchArrow.right = touchX > (touchPadCanvas.width / 3) * 2;
  }
};

// 터치패드 화살표 이벤트 처리
const handleTouchArrow = (arrow, value) => {
  touchArrow[arrow] = value;
};
const setupKeyboard = () => {
  document.addEventListener("keydown", function (e) {
    keyDown[e.keyCode] = true;
    if (
      !isStart &&
      (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
    )
      isStart = true;
  });
  document.addEventListener("keyup", function (e) {
    delete keyDown[e.keyCode];
  });

  // 터치패드 이벤트 리스너 등록
  touchPadCanvas.addEventListener("mousedown", (e) => {
    handleTouchPad(e);
    touchPadCanvas.addEventListener("mousemove", handleTouchPad);
  });

  // 터치패드 이벤트 리스너 해제
  touchPadCanvas.addEventListener("mouseup", () => {
    touchPadCanvas.removeEventListener("mousemove", handleTouchPad);
    touchArrow.up = false;
    touchArrow.down = false;
    touchArrow.left = false;
    touchArrow.right = false;
  });

  touchPadCanvas.addEventListener("touchstart", (e) => {
    handleTouchPad(e);
    touchPadCanvas.addEventListener("touchmove", handleTouchPad);
  });

  // 터치패드 이벤트 리스너 해제
  touchPadCanvas.addEventListener("touchend", () => {
    touchPadCanvas.removeEventListener("touchmove", handleTouchPad);
    touchArrow.up = false;
    touchArrow.down = false;
    touchArrow.left = false;
    touchArrow.right = false;
  });
};

let ballSpeedX = 0;
let ballSpeedY = 0;

const ballCollisionWithCat = () => {
  const catLeft = catX;
  const catRight = catX + 80;
  const catTop = catY;
  const catBottom = catY + 80;

  const ballLeft = ballX;
  const ballRight = ballX + 40;
  const ballTop = ballY;
  const ballBottom = ballY + 40;

  if (
    ballLeft < catRight &&
    ballRight > catLeft &&
    ballTop < catBottom &&
    ballBottom > catTop
  ) {
    return true; // 충돌 발생
  } else {
    return false; // 충돌 없음
  }
};

// 화살표 이동에 따른 개체 위치 업데이트
const updatePosition = () => {
  if (touchArrow.up && dogHeight > 0) dogHeight -= 5;
  if (touchArrow.down && dogHeight < canvas.height - 100) dogHeight += 5;
  if (touchArrow.left && dogWidth > 0) dogWidth -= 5;
  if (touchArrow.right && dogWidth < canvas.width / 2 - 100) dogWidth += 5;
};

const update = () => {
  if (39 in keyDown) dogWidth += 5; // 오른쪽 방향키
  if (37 in keyDown) dogWidth -= 5; // 왼쪽 방향키
  if (38 in keyDown) dogHeight -= 5; // 위쪽 방향키
  if (40 in keyDown) dogHeight += 5; // 아래쪽 방향키
  updatePosition();
  if (dogWidth <= 0) dogWidth = 0;
  if (dogWidth >= canvas.width / 2 - 50) dogWidth = canvas.width / 2 - 50;
  if (dogHeight <= 0) dogHeight = 0;
  if (dogHeight <= canvas.height / 2 - 50) dogHeight = canvas.height / 2 - 50;
  if (ballCollisionWithDog()) {
    ballSpeedX = Math.random() < 0.5 ? -2 : 2;
    ballSpeedY = Math.random() < 0.5 ? -2 : 2;

    const dogCenterX = dogWidth + 40;
    const dogCenterY = dogHeight + 40;

    const ballCenterX = ballX + 20;
    const ballCenterY = ballY + 20;

    const deltaX = dogCenterX - ballCenterX;
    const deltaY = dogCenterY - ballCenterY;

    ballSpeedX = Math.sign(deltaX) * Math.abs(ballSpeedX);
    ballSpeedY = Math.sign(deltaY) * Math.abs(ballSpeedY);
  }

  if (ballCollisionWithCat()) {
    ballSpeedX = Math.random() < 0.5 ? 2 : -2;
    ballSpeedY = Math.random() < 0.5 ? 2 : -2;

    const catCenterX = catX + 40;
    const catCenterY = catY + 40;

    const ballCenterX = ballX + 20;
    const ballCenterY = ballY + 20;

    const deltaX = catCenterX - ballCenterX;
    const deltaY = catCenterY - ballCenterY;

    ballSpeedX = Math.sign(deltaX) * Math.abs(ballSpeedX);
    ballSpeedY = Math.sign(deltaY) * Math.abs(ballSpeedY);
  }
  catMovement();

  ballX -= ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height - 40) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX <= 0) {
    catScore += 5;
    resetPositions();
  } else if (ballX >= canvas.width - 40) {
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
  // 고양이의 속도를 약간 줄여서 공을 덜 잘 칠 수 있게 합니다.
  const speed = Math.min(distance, difficulty + 1);

  const vx = (speed * dx) / distance;
  const vy = (speed * dy) / distance;

  // 고양이의 새로운 위치를 계산합니다.
  let newCatX = catX + vx;
  let newCatY = catY + vy;

  // 고양이가 화면의 오른쪽 절반을 벗어나지 않도록 합니다.
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

  // 고양이의 위치를 업데이트합니다.
  catX = newCatX;
  catY = newCatY;
};

const ballCollisionWithDog = () => {
  const dogLeft = dogWidth;
  const dogRight = dogWidth + 80;
  const dogTop = dogHeight;
  const dogBottom = dogHeight + 80;

  const ballLeft = ballX;
  const ballRight = ballX + 40;
  const ballTop = ballY;
  const ballBottom = ballY + 40;

  if (
    ballLeft < dogRight &&
    ballRight > dogLeft &&
    ballTop < dogBottom &&
    ballBottom > dogTop
  ) {
    return true; // 충돌 발생
  } else {
    return false; // 충돌 없음
  }
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
// 캔버스 크기 조정 함수
const resizeCanvas = () => {
  const browserWidth = window.innerWidth;
  const browserHeight = window.innerHeight;

  // 캔버스 너비와 높이 비율을 유지하며 가로 크기에 맞춰 조정
  const canvasAspectRatio = canvas.width / canvas.height;
  const targetWidth = browserWidth;
  const targetHeight = browserWidth / canvasAspectRatio;

  // 캔버스 스타일 크기 조정
  canvas.style.width = `${targetWidth}px`;
  canvas.style.height = `${targetHeight}px`;

  // 캔버스 실제 픽셀 크기 조정
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  dogWidth = canvas.width * 0.1;
  dogHeight = canvas.height * 0.8;
  ballX = canvas.width * 0.4;
  ballY = canvas.height * 0.4;
  catX = canvas.width * 0.8;
  catY = canvas.height * 0.8;

  ballSize = canvas.width * 0.04;
  animalSize = canvas.width * 0.1;
};

// 창 크기 변경 이벤트 리스너 등록
window.addEventListener("resize", resizeCanvas);

// 초기 캔버스 크기 설정
resizeCanvas();
const main = () => {
  if (!isPaused) {
    update();
    render();
  }
  requestAnimationFrame(main);
};

loadImage();
setupKeyboard();
onClickEvent();
main();
