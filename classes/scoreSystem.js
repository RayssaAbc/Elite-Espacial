export let score = 0;
export let level = 1;
export let highScore = localStorage.getItem("highScore") || 0;

export function resetScoreSystem() {
  score = 0;
  level = 1;
  updateUI();
}

export function addScore(points) {
  score += points;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  updateUI();
}

export function nextLevel() {
  level++;
  updateUI();
}

export function updateUI() {
 
  const scoreSpan = document.querySelector(".score");
  const levelSpan = document.querySelector(".level");
  const highSpan = document.querySelector(".high");

  if (scoreSpan) scoreSpan.textContent = `score: ${score}`;
  if (levelSpan) levelSpan.textContent = `level: ${level}`;
  if (highSpan) highSpan.textContent = `high: ${highScore}`;
}

