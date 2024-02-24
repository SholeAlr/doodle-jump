document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector(".start-btn");
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("platform");
  const scoreDiv = document.querySelector(".score");
  let startPoint = 150;
  let doodlerLeftSpace = 50;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
  }

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 215;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";

        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove("platform");
          platforms.shift();
          console.log(platforms);
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 5;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace > startPoint + 150) {
        fall();
      } else if (doodlerBottomSpace >= 515) {
        fall();
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 8;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          console.log("landed");
          startPoint = doodlerBottomSpace;
          score++;
          jump();
        }
      });
    }, 30);
  }

  function gameOver() {
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    scoreDiv.style.display = "block";
    startButton.style.display = "block";
    scoreDiv.innerHTML = "your score: " + score;

    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    startButton.addEventListener("click", start);
  }

  function control(e) {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveStraight();
    }
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 2;
        doodler.style.left = doodlerLeftSpace + "px";
      } else moveRight();
    }, 30);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (doodlerLeftSpace <= 240) {
        doodlerLeftSpace += 2;
        doodler.style.left = doodlerLeftSpace + "px";
      } else moveLeft();
    }, 30);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function start() {
    if (!isGameOver) {
      startButton.style.display = "none";
      scoreDiv.style.display = "none";
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener("keydown", control);
    }
  }
  startButton.addEventListener("click", start);
});
