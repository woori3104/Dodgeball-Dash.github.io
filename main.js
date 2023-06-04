const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
let ballX = canvas.width * 0.3;
let ballY = canvas.height * 0.5;
let catX = 0.8 * canvas.width;
let catY = 0.8 * canvas.height;
let ballSize = 20;
let animalSize = 0.1 * canvas.width;
let dogWidth = 0.2 * canvas.width;
let dogHeight = 0.8 * canvas.height;
let dogScore = 0;
let catScore = 0;

let ball, cat, dog, background;

const upBtn = document.getElementsByClassName("up-button")[0];
const leftBtn = document.getElementsByClassName("left-button")[0];
const rightBtn = document.getElementsByClassName("right-button")[0];
const downBtn = document.getElementsByClassName("down-button")[0];
const keyDown = {}
/**
 * Image Load
 */
const loadImage = () => {
  ball = new Image();
  ball.src = "images/ball.png";
  cat = new Image();
  cat.src = "images/cat.png";
  dog = new Image();
  dog.src = "images/dog.png";
  background = new Image();
  background.src = "images/background.png";

  // 이미지 로드가 완료되면 게임 시작
  ball.onload = main;
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

  // 버튼 클릭 이벤트 처리
  upBtn.addEventListener("click", () => {
    if (dogHeight > 0) {
      dogHeight -= 5;
    }
  });

  downBtn.addEventListener("click", () => {
    if (dogHeight + animalSize < canvas.height) {
      dogHeight += 5;
    }
  });

  leftBtn.addEventListener("click", () => {
    if (dogWidth > 0) {
      dogWidth -= 5;
    }
  });

  rightBtn.addEventListener("click", () => {
    if (dogWidth + animalSize < canvas.width) {
      dogWidth += 5;
    }
  });
};
const update = () => {
  if (39 in keyDown) dogWidth += 5; // 오른쪽 방향키
  if (37 in keyDown) dogWidth -= 5; // 왼쪽 방향키
  if (38 in keyDown) dogHeight -= 5; // 위쪽 방향키
  if (40 in keyDown) dogHeight += 5; // 아래쪽 방향키

}
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
};

const main = () => {
  loadImage(); // 이미지 로드

  function gameLoop() {
    render();

    setupKeyboard();
    update();

    requestAnimationFrame(gameLoop);
  }

  gameLoop(); // 게임 루프 시작
};

main();
