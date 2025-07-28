const contexto = new (window.AudioContext || window.webkitAudioContext)();

let buffers = {
  intro: null,
  gameplay: null,
  shoot: null,
  hit: null,
  explosion: null,
  nextLevel: null
};

let fonteAtual = null;

async function carregarAudio(url) {
  const resposta = await fetch(url);
  const arrayBuffer = await resposta.arrayBuffer();
  return await contexto.decodeAudioData(arrayBuffer);
}

function tocarBuffer(buffer, loop = false) {
  if (!buffer) return;

  const source = contexto.createBufferSource();
  source.buffer = buffer;
  source.loop = loop;
  source.connect(contexto.destination);
  source.start(0);

  if (loop) {
    if (fonteAtual) fonteAtual.stop();
    fonteAtual = source;
  }
}

export async function tocarIntro() {
  if (!buffers.intro)
    buffers.intro = await carregarAudio("./audios/SpaceIntro.wav");
  tocarBuffer(buffers.intro, true);
}

export async function tocarGameplay() {
  if (!buffers.gameplay)
    buffers.gameplay = await carregarAudio("./audios/GamePlayAudio.wav");
  tocarBuffer(buffers.gameplay, true);
}

export async function tocarShoot() {
  if (!buffers.shoot)
    buffers.shoot = await carregarAudio("./audios/shoot.mp3");
  tocarBuffer(buffers.shoot);
}

export async function tocarHitInimigo() {
  if (!buffers.hit)
    buffers.hit = await carregarAudio("./audios/hit.mp3");
  tocarBuffer(buffers.hit);
}

export async function tocarExplosionJogador() {
  if (!buffers.explosion)
    buffers.explosion = await carregarAudio("./audios/explosion.mp3");
  tocarBuffer(buffers.explosion);
}

export async function tocarNextLevel() {
  if (!buffers.nextLevel)
    buffers.nextLevel = await carregarAudio("./audios/next_level.mp3");
  tocarBuffer(buffers.nextLevel);
}

export function pararSom() {
  if (fonteAtual) {
    fonteAtual.stop();
    fonteAtual = null;
  }
}
