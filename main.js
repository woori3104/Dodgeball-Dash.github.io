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
    return {ball, cat, dog, background };
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
  
  const main = async () => {
    const {  cat, dog, ball, background } = await init();
    const { width: canvasWidth, height: canvasHeight } = canvas;
  
    const gameLoop = () => {
      render(cat, dog, ball, background);
      requestAnimationFrame(gameLoop);
    };
  
    gameLoop();
  };
  main();
}

startGame();

