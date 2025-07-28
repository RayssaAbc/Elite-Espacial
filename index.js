
import Player from "./classes/Player.js";
import Invader from "./classes/invader.js";
import Projectile from "./classes/Projectile.js";
import Grid from "./classes/Grid.js";
import Particle from "./classes/Particle.js";
import { GameState } from "./utils/constants.js";
import { score, level, highScore, resetScoreSystem, addScore, nextLevel, updateUI } from "./classes/scoreSystem.js";
import { tocarIntro, tocarGameplay, tocarShoot, tocarHitInimigo, tocarExplosionJogador, tocarNextLevel, pararSom} from './classes/audios.js';

let invaderShootIntervalId;
let animationId;
let introAnimationId;
let currentState = GameState.START;
let player, grid, playerProjectiles, invaderProjectiles, particles;
let lastHordeTime = 0;

const startScreen = document.querySelector(".start-screen");
const scoreUI = document.querySelector(".score-ui");
const playButton = document.querySelector(".button-play");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

ctx.imageSmoothingEnabled = false;

const hordeCooldown = 2000;

function initGame() {
  clearInterval(invaderShootIntervalId);
  resetScoreSystem();
  updateUI();
  player = new Player(canvas.width, canvas.height);
  grid = new Grid(3, 6);
  playerProjectiles = [];
  invaderProjectiles = [];
  particles = [];
  lastHordeTime = Date.now();
}

const keys = {
  left: false,
  right: false,
  shoot: { pressed: false, released: true },
};

playButton.addEventListener("click", async () => {
  cancelAnimationFrame(introAnimationId);
  await pararSom();
  await tocarGameplay();

  if (animationId) cancelAnimationFrame(animationId);

  startScreen.style.display = "none";
  scoreUI.style.display = "block";
  document.getElementById("creditos").style.display =
    playButton.textContent === "Jogar" ? "block" : "none";

  initGame();
  currentState = GameState.PLAYING;
  gameLoop();
  startInvaderShooting();
});

function showRestartScreen() {
  startScreen.style.display = "flex";
  playButton.textContent = "Jogar Novamente";
  scoreUI.style.display = "none";
  document.getElementById("creditos").style.display = "none";

  pararSom();
  tocarIntro();
  introLoop();
}

const clearProjectiles = () => {
  playerProjectiles = playerProjectiles.filter(p => p.position.y > 0);
};

const clearInvaderProjectiles = () => {
  invaderProjectiles = invaderProjectiles.filter(p => p.position.y < canvas.height);
};

const checkInvaderTouchPlayer = () => {
  for (const invader of grid.invaders) {
    if (invader.position.y + invader.height >= player.position.y) {
      createPlayerExplosion(player.position.x + player.width / 2, player.position.y + player.height / 2);
      currentState = GameState.GAME_OVER;
      showRestartScreen();
      break;
    }
  }
};

const checkShootPlayer = () => {
  for (let i = invaderProjectiles.length - 1; i >= 0; i--) {
    const p = invaderProjectiles[i];
    if (p && p.position && player.hit(p)) {
      invaderProjectiles.splice(i, 1);
      createPlayerExplosion(player.position.x + player.width / 2, player.position.y + player.height / 2);
      
      currentState = GameState.GAME_OVER;
      showRestartScreen();

      tocarExplosionJogador();
      clearProjectiles();
      clearInvaderProjectiles();
    }
  }
};

const handlePlayerShooting = () => {
  if (keys.shoot.pressed && keys.shoot.released) {
    player.shoot(playerProjectiles);
    keys.shoot.released = false;

      tocarShoot();
  }
};

const checkShootInvaders = () => {
  grid.invaders.forEach((inv, i) => {
    playerProjectiles.forEach((proj, j) => {
      const hit =
        proj.position.x < inv.position.x + inv.width &&
        proj.position.x + proj.width > inv.position.x &&
        proj.position.y < inv.position.y + inv.height &&
        proj.position.y + proj.height > inv.position.y;

      if (hit) {
        createExplosion(inv.position.x + inv.width / 2, inv.position.y + inv.height / 2);
        grid.invaders.splice(i, 1);
        playerProjectiles.splice(j, 1);
        addScore(10);
        updateUI();

        tocarHitInimigo();
      }
    });
  });
};

const spawnGrid = () => {
  if (grid.invaders.length === 0 && Date.now() - lastHordeTime > hordeCooldown) {
    grid.rows = Math.floor(Math.random() * 3) + 3;
    grid.cols = Math.floor(Math.random() * 4) + 5;
    grid.restart();
    nextLevel();
    lastHordeTime = Date.now();
    updateUI();
    tocarNextLevel();
  }
};

const createExplosion = (x, y) => {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle({ x, y }, {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    }, Math.random() * 1.5 + 0.5, "purple"));
  }
};

const createPlayerExplosion = (x, y) => {
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle({ x, y }, {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4
    }, Math.random() * 2 + 1, "red"));
  }
};

const drawParticles = () => {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(ctx);
    if (particles[i].alpha <= 0) particles.splice(i, 1);
  }
};

const stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.2 + 0.3,
    speed: Math.random() * 0.4 + 0.1
  });
}

const drawStars = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  for (const star of stars) {
    star.y += star.speed;

    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
};

function introLoop() {
  introAnimationId = requestAnimationFrame(introLoop);
  drawStars();
}

let rotation = 0;
const gameLoop = () => {
  animationId = requestAnimationFrame(gameLoop);
  drawStars();
  if (currentState === GameState.GAME_OVER) {
    drawParticles();
    return;
  }

  grid.draw(ctx);
  grid.update();
  spawnGrid();
  checkShootInvaders();
  checkShootPlayer();
  checkInvaderTouchPlayer();
  handlePlayerShooting();
  drawParticles();

  playerProjectiles.forEach(p => { p.update(); p.draw(ctx); });
  invaderProjectiles.forEach(p => { p.update(); p.draw(ctx); });

  if (keys.left && player.position.x >= 0) {
    player.moveLeft();
    rotation = -0.15;
  } else if (keys.right && player.position.x + player.width <= canvas.width) {
    player.moveRight();
    rotation = 0.15;
  } else {
    rotation = 0;
  }

  ctx.save();
  ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);
  ctx.rotate(rotation);
  ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);
  player.draw(ctx);
  ctx.restore();
};

addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "a") keys.left = true;
  if (key === "d") keys.right = true;
  if (key === "enter") keys.shoot.pressed = true;

  if (e.code === "Space" && currentState === GameState.GAME_OVER) {
    if (animationId) cancelAnimationFrame(animationId);

    startScreen.style.display = "none";
    scoreUI.style.display = "block";
    initGame();
    currentState = GameState.PLAYING;
    gameLoop();
    startInvaderShooting();
  }
});

addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key === "a") keys.left = false;
  if (key === "d") keys.right = false;
  if (key === "enter") {
    keys.shoot.pressed = false;
    keys.shoot.released = true;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  introLoop();
  tocarIntro().catch(() => {
    console.error("Erro ao tocar a introdução");
    document.addEventListener("click", () => {
      tocarIntro();
    }, { once: true });
  });
});

function startInvaderShooting() {
  if (invaderShootIntervalId) clearInterval(invaderShootIntervalId);

  invaderShootIntervalId = setInterval(() => {
    if (currentState !== GameState.PLAYING) return;
    const invader = grid.getRandomInvader();
    if (invader) invader.shoot(invaderProjectiles);
     tocarShoot();
  }, 1000);
   
}