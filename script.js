// ===== 스테이지 설정 (여기 숫자만 바꿔서 전체 난이도 조절) =====
const MAX_STAGE = 120;          // 화요일마다 20스테이지씩 늘어남 (EXPANSION.md 참고)
const ANIMALS = ["🐶", "🐱", "🐰", "🐻", "🐼", "🦊", "🐸"];
const POINT_PER_BLOCK = 10;     // 블록 1개당 점수

// 블록 그림 이미지: 이 경로에 그림 파일을 넣으면 이모지 대신 그 그림이 나옴 (없으면 이모지)
// 순서는 ANIMALS와 같음. 배경이 투명한 정사각형 PNG 추천
const CHARACTER_IMAGES = [
  "images/dog.png", "images/cat.png", "images/rabbit.png", "images/bear.png",
  "images/panda.png", "images/fox.png", "images/frog.png",
];

// 판 크기: 6x6에서 시작해 20스테이지마다 1줄씩 커짐, 최대 10x10
const BOARD_START = 6;
const BOARD_GROW_EVERY = 20;
const BOARD_MAX = 10;

// 판 모양: 5스테이지부터 스테이지마다 돌아가며 바뀜 (full = 네모 그대로)
const SHAPES = ["full", "corners", "cross", "donut", "diamond"];
const SHAPE_START = 5;

// 맵 테마 / 음악: 10스테이지마다 바뀜 (1~10 = 0번, 11~20 = 1번 …)
const STAGES_PER_THEME = 10;
const THEME_NAMES = [
  "Sunset Jungle", "Savanna Noon", "River Delta", "Night Jungle", "Misty Rainforest",
  "Red Canyon", "Autumn Woods", "Snowy Peaks", "Volcano Isle", "Aurora Valley",
];
// 음악 파일: music 폴더에 이 이름으로 넣으면 그 구간에서 나옴 (없으면 직접 만든 음악이 나옴)
const MUSIC_FILES = [
  "music/track01.mp3", "music/track02.mp3", "music/track03.mp3", "music/track04.mp3", "music/track05.mp3",
  "music/track06.mp3", "music/track07.mp3", "music/track08.mp3", "music/track09.mp3", "music/track10.mp3",
];
const MUSIC_VOLUME = 0.5;       // 효과음보다 음악을 얼마나 작게 (0~1)
const SYNTH_MUSIC = true;       // mp3가 없는 구간에서 직접 만든 음악 틀기 (false = 조용히)
const SYNTH_VOLUME = 0.6;       // 직접 만든 음악 크기 조절
// 배경 그림: backgrounds 폴더에 이 이름으로 넣으면 그 구간 배경이 그림으로 바뀜 (없으면 기본 배경)
const BACKGROUND_IMAGES = [
  "backgrounds/theme01.jpg", "backgrounds/theme02.jpg", "backgrounds/theme03.jpg", "backgrounds/theme04.jpg",
  "backgrounds/theme05.jpg", "backgrounds/theme06.jpg", "backgrounds/theme07.jpg", "backgrounds/theme08.jpg",
  "backgrounds/theme09.jpg", "backgrounds/theme10.jpg",
];

// 동물 종류: 5종에서 시작해 34스테이지마다 1종씩 늘어남 (35스테이지 6종, 69스테이지 7종)
const ANIMAL_START = 5;
const ANIMAL_GROW_EVERY = 34;

// 1~19스테이지: 이동 횟수 제한. 목표 점수 = 시작 점수 + (스테이지-1) x 증가량
const MOVES = 20;
const MOVE_TARGET_START = 500;
const MOVE_TARGET_STEP = 30;
const WARNING_MOVES = 5;        // 이 이하로 남으면 경고색

// 20스테이지부터: 시간제한 (이동 횟수 제한 없음)
// 제한 시간 = 300초에서 스테이지마다 3초씩 줄어듦, 최소 60초 (100스테이지 = 60초)
const TIME_STAGE = 20;
const TIME_START = 300;
const TIME_STEP = 3;
const TIME_MIN = 60;
// 시간제한 목표 점수 = 제한 시간(초) x 초당 점수 (초당 점수는 스테이지마다 조금씩 올라감)
const PPS_START = 6;
const PPS_STEP = 0.12;
// 100스테이지부터는 제한 시간이 더 줄지 않으니 초당 점수도 천천히만 올라감 (대신 트릭이 어려워짐)
const PPS_SLOW_FROM = 100;
const PPS_SLOW_STEP = 0.02;
const WARNING_TIME = 30;        // 이 초 이하로 남으면 경고색

// 30스테이지부터: ⏰ 시간 아이템 블록
const ITEM_STAGE = 30;
const ITEM_BONUS = 15;          // 맞추면 늘어나는 시간(초)
const ITEM_MAX = 3;             // 한 스테이지에 나오는 최대 개수
const ITEM_CHANCE = 0.06;       // 새 블록이 ⏰가 될 확률

// 특수 블록
// - 4개 일자      → 한 줄 폭탄 (맞춘 방향의 한 줄 전체 제거)
// - 가로+세로 동시 → 폭탄 (주변 BOMB_RADIUS칸 제거, 1이면 3x3)
// - 5개 이상 일자  → 슈퍼봄 (판 전체 제거)
// - 2x2 네모      → 4개 제거 (특수 블록은 안 생김)
// 특수 블록은 다시 맞추거나, 옆 블록과 바꾸기만 해도 터짐
const BOMB_RADIUS = 1;

// 장애물: start 스테이지부터 등장. 개수 = base + (스테이지-start)/every, 최대 max
// - shell 나뭇잎 껍질: 옆에서 매치가 터질 때마다 한 겹씩 벗겨짐. 껍질이 있는 동안 못 움직이고 못 맞춤
// - vine  덩굴: 못 움직이지만 그 자리에서 맞추면 덩굴째 사라짐
// - rock  바위: 칸을 막음. 옆 매치 ROCK_HP번 또는 특수 블록 폭발로 부서짐
// - moss  이끼: 칸을 막고, 그 이동에서 이끼를 하나도 못 없애면 옆 블록으로 한 칸 번짐
// 장애물이 있는 스테이지는 목표 점수 + 장애물 전부 부수기를 해야 클리어
const OBSTACLE_RULES = {
  shell: { start: 5,  base: 3, every: 8,  max: 10, name: "Leaf Shell" },
  vine:  { start: 15, base: 2, every: 10, max: 8,  name: "Vine" },
  rock:  { start: 25, base: 2, every: 15, max: 6,  name: "Rock" },
  moss:  { start: 40, base: 1, every: 25, max: 3,  name: "Moss" },
  // ----- 101스테이지부터: 10스테이지마다 새 트릭 (EXPANSION.md에 전체 계획) -----
  // - mud     진흙 웅덩이: 칸 바닥에 고정. 그 칸에서 블록이 터지면 닦임
  // - coconut 코코넛 폭탄: 숫자가 이동마다 1씩 줄고 0이 되면 실패. 맞춰서 없애면 해제
  mud:     { start: 101, base: 4, every: 2, max: 14, name: "Mud Puddle" },
  coconut: { start: 111, base: 1, every: 4, max: 3,  name: "Coconut Bomb" },
};
const OB_TYPES = ["shell", "vine", "rock", "moss", "mud", "coconut"];
const SHELL_LAYERS_EVERY = 20;  // 껍질 최대 겹 수: 5~24스테이지 1겹, 25~44 2겹, 45~ 3겹
const ROCK_HP = 2;
const MOSS_MAX = 12;            // 이끼가 이 개수 이상이면 더 안 번짐
const OBSTACLE_POINTS = 20;     // 장애물을 한 번 맞힐 때 점수
const COCONUT_FUSE = 10;        // 코코넛 폭탄이 터지기까지 남은 이동 수
const COCONUT_WARNING = 3;      // 이 이하로 남으면 빨갛게 깜빡임

// ===== 소리 / 효과 설정 =====
// 1) 소리 크기: 슬라이더 처음 위치 (0~100). 음악과 효과음을 따로 조절
const VOLUME_DEFAULT = 80;      // 효과음
const MUSIC_VOLUME_DEFAULT = 80; // 음악
// 2) 연쇄 문구: [번호]연쇄일 때 나오는 말 (0번은 안 씀, 마지막 말이 그 이상 연쇄에 계속 쓰임)
const COMBO_WORDS = ["", "Nice!", "Great!", "Awesome!!", "Insane!!!", "Legendary!!!"];
// 3) 터지는 조각: 개수 = 기본 + 연쇄 x 추가, 거리(px) = 기본 + 연쇄 x 추가
const PARTICLE_COUNT = 6;
const PARTICLE_COUNT_PER_COMBO = 3;
const PARTICLE_POWER = 40;
const PARTICLE_POWER_PER_COMBO = 15;
// 4) 화면 흔들림 기본값: 흔들림 스위치로 게임 중에도 끄고 켤 수 있음
const SCREEN_SHAKE_DEFAULT = true;

// 진행 기록 / 설정을 저장하는 이름 (브라우저에 저장됨)
const SAVE_KEY = "animal-match3-cleared";
const SETTINGS_KEY = "animal-match3-settings";

// ===== 상태 =====
let stage = null;       // 지금 스테이지 정보 (getStage 결과)
// board[row][col] = null(빈칸/구멍) 또는
//   동물 블록 { a: 동물 번호, clock, special, shell: 껍질 겹 수, vine: 덩굴 }
//   막힌 칸   { ob: "rock", hp } / { ob: "moss" }
let board = [];
let holes = [];         // holes[row][col] = true면 판에 없는 칸 (판 모양)
let mud = [];           // mud[row][col] = true면 진흙 웅덩이 (블록이 움직여도 칸에 남음)
let score = 0;
let moves = 0;
let timeLeft = 0;       // 남은 시간(ms)
let timerId = null;
let timerStarted = false;
let lastTick = 0;
let lastBeepSec = -1;
let paused = false;
let clocksMade = 0;     // 이번 스테이지에 나온 ⏰ 개수
let mossBroken = false; // 이번 이동에서 이끼를 없앴는지
let selected = null;    // {r, c}
let busy = false;       // 블록 제거/낙하 중이면 입력 막기
let gameOver = false;
let cleared = 0;        // 깬 스테이지 중 가장 높은 번호
const imageReady = [];  // 캐릭터 이미지가 불러와졌는지

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const targetEl = document.getElementById("target");
const limitBox = document.getElementById("limit-box");
const limitLabel = document.getElementById("limit-label");
const limitValue = document.getElementById("limit-value");
const stageLabel = document.getElementById("stage-label");
const stageInfo = document.getElementById("stage-info");
const progressBar = document.getElementById("progress-bar");
const goalsEl = document.getElementById("goals");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const resultBox = resultEl.querySelector(".result-box");
const nextBtn = document.getElementById("next-btn");
const againBtn = document.getElementById("again-btn");
const selectEl = document.getElementById("stage-select");
const stageGrid = document.getElementById("stage-grid");
const selectCloseBtn = document.getElementById("select-close-btn");

const jungleBg = document.getElementById("jungle-bg");
const boardWrap = document.getElementById("board-wrap");
const fxLayer = document.getElementById("fx-layer");
const confettiLayer = document.getElementById("confetti-layer");
const volRows = document.querySelectorAll(".vol-row");   // 음악/효과음 조절 줄 (인트로 + 설정 창)
const introEl = document.getElementById("intro");
const shakeToggle = document.getElementById("shake-toggle");
const vibIcon = document.querySelector(".vib");
const gameEl = document.querySelector(".game");

// 동물별 파티클 색과 블록 바탕색 (ANIMALS 순서와 같음)
const COLORS = ["#c8a27a", "#ffb74d", "#f8bbd0", "#8d6e63", "#90a4ae", "#ff7043", "#81c784"];
const TILE_COLORS = ["#f3d9b1", "#ffd59e", "#fbd3e0", "#e0c2a2", "#dfe6ea", "#ffc4a3", "#cfe8b8"];
const OB_COLORS = { shell: "#6aa84f", vine: "#4a7c2a", rock: "#8a8276", moss: "#7cb342", mud: "#8d5a2b", coconut: "#6d4c2f" };

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const randomAnimal = () => Math.floor(Math.random() * stage.animals);
const key = (r, c) => r + "," + c;
const parseKey = (k) => k.split(",").map(Number);

// 블록 종류 판별
const isHole = (r, c) => holes[r][c];
const isFixed = (b) => !!(b && b.ob);                   // 바위, 이끼
const isAnimal = (b) => !!(b && !b.ob);
const canSwap = (b) => isAnimal(b) && !b.shell && !b.vine;
// 맞추기에 쓰이는 그림 번호 (껍질에 싸였거나 슈퍼봄이면 null)
const kindOf = (b) => (isAnimal(b) && !b.shell && b.special !== "super" ? b.a : null);
// 장애물이 남아 있는 칸인지 (덩굴은 블록째 사라지므로 따로 셈)
const isObstacle = (b) => !!(b && (b.ob || b.shell));

// ===== 스테이지 계산: 번호만 넣으면 판 크기, 모양, 제한, 목표, 장애물이 정해짐 =====
function obstaclePlan(n) {
  const types = OB_TYPES.filter((t) => n >= OBSTACLE_RULES[t].start);
  // 장애물 전, 그리고 새 맵 첫 스테이지(11, 21, …)는 쉬어가기
  if (!types.length) return {};
  const intro = types.find((t) => n === OBSTACLE_RULES[t].start);
  if (!intro && n % STAGES_PER_THEME === 1 && n > STAGES_PER_THEME) return {};
  const plan = {};
  types.forEach((t, i) => {
    if (intro && t !== intro) return;                         // 처음 나오는 장애물은 그것만
    if (!intro && types.length > 1 && (n + i) % 3 === 0) return; // 가끔 한 종류씩 쉬기
    const rule = OBSTACLE_RULES[t];
    plan[t] = Math.min(rule.max, rule.base + Math.floor((n - rule.start) / rule.every));
  });
  return plan;
}

function getStage(n) {
  const size = Math.min(BOARD_MAX, BOARD_START + Math.floor((n - 1) / BOARD_GROW_EVERY));
  const animals = Math.min(ANIMALS.length, ANIMAL_START + Math.floor((n - 1) / ANIMAL_GROW_EVERY));
  const timed = n >= TIME_STAGE;
  const time = timed ? Math.max(TIME_MIN, TIME_START - (n - TIME_STAGE) * TIME_STEP) : 0;
  const target = timed
    ? Math.round((time * (PPS_START + (Math.min(n, PPS_SLOW_FROM) - TIME_STAGE) * PPS_STEP +
        Math.max(0, n - PPS_SLOW_FROM) * PPS_SLOW_STEP)) / 10) * 10
    : MOVE_TARGET_START + (n - 1) * MOVE_TARGET_STEP;
  const theme = Math.floor((n - 1) / STAGES_PER_THEME) % THEME_NAMES.length; // 101부터 다시 1번 맵부터
  const shape = n < SHAPE_START ? "full" : SHAPES[n % SHAPES.length];
  const obstacles = obstaclePlan(n);
  const shellLayers = Math.min(3, 1 + Math.floor(Math.max(0, n - OBSTACLE_RULES.shell.start) / SHELL_LAYERS_EVERY));
  return {
    n, size, animals, timed, time, target, items: n >= ITEM_STAGE,
    theme, music: theme, shape, obstacles, shellLayers,
    hasObstacles: Object.keys(obstacles).length > 0,
  };
}

// 판 모양: 구멍이 될 칸 표시
function makeHoles(size, shape) {
  const mid = (size - 1) / 2;
  const grid = [];
  for (let r = 0; r < size; r++) {
    grid.push([]);
    for (let c = 0; c < size; c++) {
      const edgeR = Math.min(r, size - 1 - r);
      const edgeC = Math.min(c, size - 1 - c);
      let hole = false;
      if (shape === "corners") {
        hole = edgeR + edgeC < (size >= 8 ? 3 : 2);           // 네 귀퉁이 깎기
      } else if (shape === "cross") {
        const q = Math.floor(size / 3);
        hole = edgeR < q && edgeC < q;                         // 십자 모양
      } else if (shape === "donut") {
        hole = Math.abs(r - mid) < 1 && Math.abs(c - mid) < 1; // 가운데 구멍
      } else if (shape === "diamond") {
        hole = Math.abs(r - mid) + Math.abs(c - mid) > mid + Math.floor(size / 4); // 마름모
      }
      grid[r].push(hole);
    }
  }
  return grid;
}

function formatTime(ms) {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
}

// ===== 소리 (파일 없이 브라우저에서 바로 만들어 냄) =====
let audioCtx = null;
let sfxVolume = VOLUME_DEFAULT / 100;
let musicVolume = MUSIC_VOLUME_DEFAULT / 100;
let screenShake = SCREEN_SHAKE_DEFAULT;

// 브라우저는 사용자가 한 번 눌러야 소리를 켜 줌
function initAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}

// 음 하나 내기: 높이(Hz), 길이(초), 음색, 크기, 늦게 시작(초), 끝 높이
function tone(freq, dur = 0.12, type = "sine", vol = 0.2, delay = 0, slideTo = null) {
  if (sfxVolume <= 0 || !audioCtx) return;
  vol *= sfxVolume;
  const t = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + dur);
}

// 폭발음: 지지직거리는 잡음을 낮게 걸러서 "콰광"
function noise(dur = 0.5, vol = 0.4, cutoff = 900, delay = 0) {
  if (sfxVolume <= 0 || !audioCtx) return;
  const t = audioCtx.currentTime + delay;
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * dur, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoff, t);
  filter.frequency.exponentialRampToValueAtTime(60, t + dur);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(vol * sfxVolume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(filter).connect(gain).connect(audioCtx.destination);
  src.start(t);
}

const NOTES = [523, 587, 659, 784, 880, 1047, 1175, 1319]; // 도레미솔라도레미

const sfx = {
  select: () => tone(660, 0.08, "triangle", 0.15),
  swap: () => tone(400, 0.12, "sine", 0.15, 0, 700),
  fail: () => {
    tone(220, 0.15, "square", 0.07);
    tone(165, 0.25, "square", 0.07, 0.12);
  },
  // 연쇄가 이어질수록 음이 높아짐
  pop: (combo) => {
    const n = NOTES[Math.min(combo - 1, NOTES.length - 1)];
    tone(n, 0.18, "triangle", 0.22);
    tone(n * 1.5, 0.18, "sine", 0.12, 0.05);
  },
  // 연쇄 팡파레: 단계가 높을수록 길고 화려하게
  combo: (combo) => {
    const count = Math.min(combo + 2, 8);
    for (let i = 0; i < count; i++) {
      tone(NOTES[i], 0.12, "square", 0.08, i * 0.05);
      tone(NOTES[i] * 2, 0.1, "sine", 0.05, i * 0.05);
    }
    if (combo >= 4) tone(80, 0.5, "sawtooth", 0.15, 0, 40); // 쿵
  },
  drop: () => tone(320, 0.07, "sine", 0.08, 0, 180),
  clock: () => {
    [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.12, "triangle", 0.15, i * 0.06));
  },
  tick: () => tone(1200, 0.05, "square", 0.06),
  start: () => {
    [523, 784].forEach((f, i) => tone(f, 0.15, "triangle", 0.15, i * 0.12));
  },
  // 특수 블록이 생길 때 "띠링"
  make: () => {
    [784, 1175, 1568].forEach((f, i) => tone(f, 0.14, "sine", 0.14, i * 0.05));
  },
  laser: () => {
    tone(1800, 0.35, "sawtooth", 0.07, 0, 200);
    noise(0.25, 0.15, 3000);
  },
  boom: () => {
    noise(0.6, 0.5, 1200);
    tone(120, 0.5, "sine", 0.3, 0, 40);
  },
  superBoom: () => {
    noise(1.2, 0.6, 2000);
    tone(90, 1, "sawtooth", 0.2, 0, 30);
    NOTES.forEach((f, i) => tone(f * 2, 0.15, "triangle", 0.08, 0.2 + i * 0.05));
  },
  // 장애물 소리
  crack: () => {
    noise(0.12, 0.25, 4000);
    tone(900, 0.08, "triangle", 0.1, 0, 500);
  },
  rock: () => {
    noise(0.3, 0.4, 500);
    tone(140, 0.2, "triangle", 0.2, 0, 70);
  },
  snap: () => tone(1400, 0.08, "square", 0.08, 0, 2400),
  squish: () => tone(300, 0.15, "sine", 0.15, 0, 120),
  spread: () => tone(180, 0.3, "sine", 0.12, 0, 260),
  stuck: () => tone(200, 0.1, "square", 0.06),
  win: () => {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
      tone(f, i === 5 ? 0.6 : 0.15, "square", 0.1, i * 0.13));
  },
  lose: () => {
    [392, 349, 311, 262].forEach((f, i) => tone(f, 0.3, "triangle", 0.15, i * 0.25));
  },
};

// ===== 배경 음악 (music 폴더의 파일, 없으면 아래에서 직접 만든 음악) =====
const bgm = new Audio();
bgm.loop = true;
let bgmTrack = -1;
let musicUnlocked = false;   // 브라우저는 사용자가 한 번 눌러야 음악을 틀어 줌
const missingTracks = new Set();
bgm.addEventListener("error", () => {
  if (bgmTrack < 0) return;
  missingTracks.add(bgmTrack);
  updateMusic();
});

function updateMusic() {
  if (!stage) return;
  const track = stage.music % MUSIC_FILES.length;
  if (track !== bgmTrack) {
    bgmTrack = track;
    bgm.src = MUSIC_FILES[track];
  }
  bgm.volume = Math.min(1, musicVolume * MUSIC_VOLUME);
  const on = musicUnlocked && musicVolume > 0 && !document.hidden;
  const useSynth = SYNTH_MUSIC && missingTracks.has(track);
  if (on && !useSynth) bgm.play().catch(() => {});
  else bgm.pause();
  if (on && useSynth) startSynth(track % SONGS.length);
  else stopSynth();
  if (musicGain) musicGain.gain.value = musicVolume * MUSIC_VOLUME * SYNTH_VOLUME;
}

// ----- 직접 만든 음악 (악기 소리를 코드로 합성) -----
// 곡마다: 빠르기, 으뜸음(미디 번호), 음계, 4마디 화음, 멜로디 악기, 음 밀도, 북 패턴
const SCALES = {
  major:  [0, 2, 4, 5, 7, 9, 11],
  minor:  [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
};
// 북 패턴: 16칸 = 한 마디, x = 침
const SONGS = [
  { name: "Sunset Jungle", bpm: 112, root: 60, scale: "major", chords: [0, 5, 3, 4], lead: "marimba", density: 0.75,
    drums: { kick: "x.......x.......", hat: "..x...x...x...x.", conga: "...x..x....x.x.." } },
  { name: "Savanna Noon", bpm: 120, root: 55, scale: "major", chords: [0, 3, 0, 4], lead: "pluck", density: 0.8,
    drums: { kick: "x...x...x...x...", hat: "x.xxx.xxx.xxx.xx", conga: "......x.......x." } },
  { name: "River Delta", bpm: 100, root: 65, scale: "major", chords: [0, 2, 3, 4], lead: "flute", density: 0.55,
    drums: { kick: "x.........x.....", hat: "....x.......x...", conga: "" } },
  { name: "Night Jungle", bpm: 92, root: 57, scale: "minor", chords: [0, 5, 2, 6], lead: "bell", density: 0.45,
    drums: { kick: "x.......x.......", hat: "..x...x...x...x.", conga: "" } },
  { name: "Misty Rainforest", bpm: 84, root: 62, scale: "dorian", chords: [0, 3, 0, 6], lead: "flute", density: 0.4,
    drums: { kick: "x...............", hat: "........x.......", conga: "" } },
  { name: "Red Canyon", bpm: 104, root: 52, scale: "minor", chords: [0, 6, 5, 6], lead: "pluck", density: 0.7,
    drums: { kick: "x.....x...x.....", hat: "..x...x...x...x.", conga: "...x.x.....x..x." } },
  { name: "Autumn Woods", bpm: 96, root: 58, scale: "major", chords: [0, 5, 1, 4], lead: "marimba", density: 0.6,
    drums: { kick: "x.......x.......", hat: "....x.......x...", conga: "......x.......x." } },
  { name: "Snowy Peaks", bpm: 88, root: 64, scale: "major", chords: [0, 4, 5, 3], lead: "bell", density: 0.35,
    drums: { kick: "", hat: "x.......x.......", conga: "" } },
  { name: "Volcano Isle", bpm: 128, root: 48, scale: "minor", chords: [0, 5, 6, 0], lead: "square", density: 0.8,
    drums: { kick: "x...x...x...x...", hat: "..x...x...x...xx", conga: "x..x..x...x..x.." } },
  { name: "Aurora Valley", bpm: 76, root: 62, scale: "major", chords: [3, 0, 5, 4], lead: "bell", density: 0.3,
    drums: { kick: "", hat: "", conga: "" } },
];

let musicGain = null;
let synthSong = null;
let synthPlaying = -1;
let synthTimer = null;
let synthStep = 0;
let synthNext = 0;
let shakerBuffer = null;

function midiFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

// 같은 곡은 항상 같은 멜로디가 나오도록 고정된 난수
function seeded(seed) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 8마디 곡 만들기: 1~4마디 멜로디, 5~8마디는 따라 부르다 으뜸음으로 끝남
function buildSong(def, index) {
  const rnd = seeded(index * 7919 + 13);
  const scale = SCALES[def.scale];
  const pitch = (deg) => def.root + scale[((deg % 7) + 7) % 7] + 12 * Math.floor(deg / 7);
  const phrase = [];
  let deg = 9;
  for (let bar = 0; bar < 4; bar++) {
    const chord = def.chords[bar];
    const notes = [];
    for (let i = 0; i < 8; i++) {
      const strong = i % 2 === 0;
      if (rnd() > def.density * (strong ? 1.15 : 0.8)) { notes.push(null); continue; }
      if (strong) {
        const tones = [chord + 7, chord + 9, chord + 11];
        deg = tones.reduce((a, b) => (Math.abs(b - deg) < Math.abs(a - deg) || rnd() < 0.3 ? b : a));
      } else {
        deg += rnd() < 0.5 ? 1 : -1;
      }
      deg = Math.min(15, Math.max(5, deg));
      notes.push(deg);
    }
    phrase.push(notes);
  }
  const ending = phrase[3].slice();
  for (let i = 4; i < 8; i++) ending[i] = null;
  ending[4] = 7;
  const bars = [...phrase, phrase[0], phrase[1], phrase[2], ending];
  return {
    def,
    stepDur: 60 / def.bpm / 4,
    melody: bars.map((b) => b.map((d) => (d === null ? null : pitch(d)))),
    chords: [0, 1, 2, 3, 0, 1, 2, 3].map((b) => {
      const r = def.chords[b];
      return { bass: pitch(r) - 24, triad: [pitch(r), pitch(r + 2), pitch(r + 4)] };
    }),
  };
}

function voice(type, freq, t, vol, attack, decay, dest = musicGain) {
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  osc.connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + attack + decay + 0.05);
  return osc;
}

function playLead(kind, midi, t, len) {
  const f = midiFreq(midi);
  if (kind === "marimba") {
    voice("sine", f, t, 0.32, 0.005, 0.45);
    voice("sine", f * 4, t, 0.06, 0.002, 0.05);
  } else if (kind === "pluck") {
    voice("triangle", f, t, 0.3, 0.004, 0.3);
    voice("sine", f * 2, t, 0.08, 0.004, 0.12);
  } else if (kind === "bell") {
    voice("sine", f * 2, t, 0.2, 0.004, 1.4);
    voice("sine", f * 5.4, t, 0.03, 0.002, 0.3);
  } else if (kind === "flute") {
    const osc = voice("triangle", f, t, 0.22, 0.05, Math.max(0.25, len));
    const lfo = audioCtx.createOscillator();
    const depth = audioCtx.createGain();
    lfo.frequency.value = 5;
    depth.gain.value = f * 0.006;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + len + 0.4);
  } else {
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1600;
    filter.connect(musicGain);
    voice("square", f, t, 0.09, 0.005, 0.22, filter);
  }
}

function playPad(triad, t, len) {
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.4);
  g.gain.setValueAtTime(0.05, t + len - 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.2);
  filter.connect(g).connect(musicGain);
  triad.forEach((m) => {
    [-6, 6].forEach((cents) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = midiFreq(m);
      osc.detune.value = cents;
      osc.connect(filter);
      osc.start(t);
      osc.stop(t + len + 0.3);
    });
  });
}

function playDrum(kind, t) {
  if (kind === "kick") {
    const osc = voice("sine", 140, t, 0.5, 0.003, 0.25);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  } else if (kind === "conga") {
    const osc = voice("sine", 330, t, 0.22, 0.003, 0.16);
    osc.frequency.exponentialRampToValueAtTime(250, t + 0.1);
  } else {
    if (!shakerBuffer) {
      shakerBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
      const d = shakerBuffer.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = shakerBuffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 6000;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    src.connect(filter).connect(g).connect(musicGain);
    src.start(t);
  }
}

function playStep(step, t) {
  const { def, melody, chords, stepDur } = synthSong;
  const bar = Math.floor(step / 16);
  const s = step % 16;
  const chord = chords[bar];
  if (s === 0) playPad(chord.triad, t, stepDur * 16);
  if (s === 0 || s === 8) voice("triangle", midiFreq(chord.bass), t, 0.35, 0.01, stepDur * 7);
  if (s === 6 || s === 14) voice("triangle", midiFreq(chord.bass + 7), t, 0.2, 0.01, stepDur * 2);
  if (s % 2 === 0) {
    const note = melody[bar][s / 2];
    if (note !== null) playLead(def.lead, note, t, stepDur * 2);
  }
  for (const kind of ["kick", "hat", "conga"]) {
    if (def.drums[kind][s] === "x") playDrum(kind, t);
  }
}

function startSynth(index) {
  if (!audioCtx) return;
  if (!musicGain) {
    musicGain = audioCtx.createGain();
    musicGain.connect(audioCtx.destination);
  }
  musicGain.gain.value = musicVolume * MUSIC_VOLUME * SYNTH_VOLUME;
  if (synthTimer && synthPlaying === index) return;
  stopSynth();
  synthSong = buildSong(SONGS[index], index);
  synthPlaying = index;
  synthStep = 0;
  synthNext = audioCtx.currentTime + 0.1;
  synthTimer = setInterval(() => {
    while (synthNext < audioCtx.currentTime + 0.25) {
      playStep(synthStep, synthNext);
      synthNext += synthSong.stepDur;
      synthStep = (synthStep + 1) % (8 * 16);
    }
  }, 50);
}

function stopSynth() {
  if (synthTimer) clearInterval(synthTimer);
  synthTimer = null;
  synthPlaying = -1;
}

document.addEventListener("pointerdown", () => {
  if (musicUnlocked) return;
  musicUnlocked = true;
  initAudio();
  updateMusic();
});
document.addEventListener("visibilitychange", updateMusic);

// 휴대폰에서 꾹 누르거나 끌 때 글자 선택(파란 막)과 길게 누르기 메뉴 막기 (슬라이더는 그대로)
const isInput = (e) => e.target.closest && e.target.closest("input");
document.addEventListener("selectstart", (e) => { if (!isInput(e)) e.preventDefault(); });
document.addEventListener("contextmenu", (e) => { if (!isInput(e)) e.preventDefault(); });
document.addEventListener("dragstart", (e) => e.preventDefault());

// ===== 배경 그림 (backgrounds 폴더의 파일, 없으면 기본 그림 배경) =====
const bgPhoto = document.getElementById("bg-photo");

function updateBackground() {
  const theme = stage.theme;
  const src = BACKGROUND_IMAGES[theme % BACKGROUND_IMAGES.length];
  bgPhoto.classList.remove("on");
  const img = new Image();
  img.onload = () => {
    if (stage.theme !== theme) return; // 불러오는 사이 테마가 바뀌었으면 무시
    bgPhoto.style.backgroundImage = `url("${src}")`;
    bgPhoto.classList.add("on");
  };
  img.src = src;
}

// ===== 설정: 음악 / 효과음 슬라이더 + 흔들림 스위치 =====
// 조절 줄은 인트로 화면과 설정 창에 하나씩 있고, 둘이 같이 움직임
const getVolume = (kind) => (kind === "music" ? musicVolume : sfxVolume);
const lastVolume = { music: MUSIC_VOLUME_DEFAULT / 100, sfx: VOLUME_DEFAULT / 100 }; // 음소거 풀 때 돌아갈 크기

function setVolume(kind, v) {
  v = Math.min(1, Math.max(0, v));
  if (kind === "music") musicVolume = v;
  else sfxVolume = v;
  if (v > 0) lastVolume[kind] = v;
  updateSettingsUi();
  updateMusic();
}

function updateSettingsUi() {
  volRows.forEach((row) => {
    const kind = row.dataset.vol;
    const v = Math.round(getVolume(kind) * 100);
    const slider = row.querySelector(".volume-slider");
    slider.value = v;
    slider.style.setProperty("--val", v + "%");
    row.querySelector(".spk").dataset.level = v === 0 ? 0 : v < 45 ? 1 : 2;
    row.querySelector(".vol-btn").setAttribute("aria-pressed", v === 0);
  });
  shakeToggle.checked = screenShake;
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ music: musicVolume, sfx: sfxVolume, shake: screenShake }));
  } catch (e) {}
}

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    const clamp = (v) => Math.min(1, Math.max(0, v));
    // 예전 기록은 소리 크기 하나(volume)만 있었음 → 음악과 효과음 둘 다 그 크기로
    if (s && typeof s.volume === "number") musicVolume = sfxVolume = clamp(s.volume);
    if (s && typeof s.music === "number") musicVolume = clamp(s.music);
    if (s && typeof s.sfx === "number") sfxVolume = clamp(s.sfx);
    if (s && typeof s.shake === "boolean") screenShake = s.shake;
    if (musicVolume > 0) lastVolume.music = musicVolume;
    if (sfxVolume > 0) lastVolume.sfx = sfxVolume;
  } catch (e) {}
}

volRows.forEach((row) => {
  const kind = row.dataset.vol;
  const slider = row.querySelector(".volume-slider");
  slider.addEventListener("input", () => {
    initAudio();
    setVolume(kind, slider.value / 100);
  });
  // 손을 뗄 때 저장 (효과음은 바뀐 크기로 한 번 들려주기)
  slider.addEventListener("change", () => {
    if (kind === "sfx") sfx.select();
    saveSettings();
  });
  // 아이콘 버튼: 누르면 끄기 / 다시 누르면 전 크기로
  row.querySelector(".vol-btn").addEventListener("click", () => {
    initAudio();
    setVolume(kind, getVolume(kind) > 0 ? 0 : lastVolume[kind]);
    if (kind === "sfx") sfx.select();
    saveSettings();
  });
});

shakeToggle.addEventListener("change", () => {
  screenShake = shakeToggle.checked;
  saveSettings();
  if (screenShake) {
    vibIcon.classList.remove("buzz");
    void vibIcon.offsetWidth;
    vibIcon.classList.add("buzz");
    shakeScreen(false); // 켰을 때 한 번 흔들어 보여주기
  }
});

// ===== 캐릭터 이미지 불러오기 (있는 것만 사용) =====
function preloadImages() {
  CHARACTER_IMAGES.forEach((src, i) => {
    const img = new Image();
    img.onload = () => {
      imageReady[i] = true;
      if (stage && !busy) render();
    };
    img.src = src;
  });
}

// ===== 화면 효과 =====
// 판 안에서 칸의 가운데 위치
function cellCenter(r, c) {
  const wrap = boardWrap.getBoundingClientRect();
  const rect = cellEl(r, c).getBoundingClientRect();
  return { x: rect.left - wrap.left + rect.width / 2, y: rect.top - wrap.top + rect.height / 2, w: rect.width };
}

function addFx(el, ms) {
  fxLayer.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

// 블록이 터지며 조각이 사방으로 튐 (한꺼번에 많이 터지면 조각 수를 줄여 버벅임 방지)
function burst(r, c, color, combo, light = false) {
  const { x, y } = cellCenter(r, c);
  const count = light ? 3 : PARTICLE_COUNT + combo * PARTICLE_COUNT_PER_COMBO;
  const power = PARTICLE_POWER + combo * PARTICLE_POWER_PER_COMBO;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const isStar = combo >= 2 && i % 3 === 0;
    p.className = "particle" + (isStar ? " star" : "");
    if (isStar) p.textContent = combo >= 3 ? "🌟" : "✨";
    const angle = Math.random() * Math.PI * 2;
    const dist = power * (0.5 + Math.random());
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.background = color;
    p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    p.style.setProperty("--rot", Math.random() * 720 + "deg");
    addFx(p, 750);
  }
}

function floatScore(x, y, text, extraClass = "") {
  const el = document.createElement("div");
  el.className = "float-score " + extraClass;
  el.textContent = text;
  el.style.left = x + "px";
  el.style.top = y + "px";
  addFx(el, 950);
}

// 판 가운데에 크게 뜨는 문구 (연쇄, 스테이지 시작)
function showBanner(big, small, lv, ms = 1150) {
  const el = document.createElement("div");
  el.className = "combo-banner lv-" + lv;
  el.innerHTML = `<span class="big">${big}</span><span class="small">${small}</span>`;
  addFx(el, ms);
}

function comboBanner(combo, count) {
  const big = combo >= 2 ? `${combo} COMBO!` : `${count} MATCH!`;
  const word = COMBO_WORDS[Math.min(combo, COMBO_WORDS.length - 1)] || "Nice!";
  showBanner(big, word, Math.min(combo, 4));
}

function flash(big = false) {
  const el = document.createElement("div");
  el.className = "flash" + (big ? " big" : "");
  addFx(el, big ? 850 : 400);
}

function shakeScreen(strong) {
  if (!screenShake) return;
  gameEl.classList.remove("shake-screen", "strong");
  void gameEl.offsetWidth; // 애니메이션 다시 시작
  gameEl.classList.add("shake-screen");
  if (strong) gameEl.classList.add("strong");
}

function setGlow(combo) {
  boardEl.classList.remove("glow-2", "glow-3", "glow-4");
  if (combo >= 2) boardEl.classList.add("glow-" + Math.min(combo, 4));
}

function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

// 화면 위에서 꽃가루가 쏟아짐
function confetti(amount) {
  const colors = ["#ff5252", "#ffb300", "#69f0ae", "#40c4ff", "#e040fb", "#f582ae"];
  for (let i = 0; i < amount; i++) {
    const p = document.createElement("div");
    p.className = "confetti";
    const dur = 1.5 + Math.random() * 1.5;
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = Math.random() * 0.5 + "s";
    p.style.setProperty("--drift", (Math.random() - 0.5) * 200 + "px");
    p.style.setProperty("--spin", Math.random() * 1080 + "deg");
    confettiLayer.appendChild(p);
    setTimeout(() => p.remove(), (dur + 0.6) * 1000);
  }
}

// 특수 블록이 터질 때 효과
function specialEffect(f) {
  const { x, y, w } = cellCenter(f.r, f.c);
  if (f.special === "bomb") {
    const el = document.createElement("div");
    el.className = "shockwave";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.setProperty("--d", w * (BOMB_RADIUS * 2 + 1) * 1.2 + "px");
    addFx(el, 550);
    sfx.boom();
    shakeScreen(false);
  } else if (f.special === "line-h" || f.special === "line-v") {
    const el = document.createElement("div");
    const horizontal = f.special === "line-h";
    el.className = "beam " + (horizontal ? "h" : "v");
    el.style.setProperty("--t", w * 0.8 + "px");
    if (horizontal) el.style.top = y + "px";
    else el.style.left = x + "px";
    addFx(el, 500);
    sfx.laser();
  } else if (f.special === "super") {
    const el = document.createElement("div");
    el.className = "shockwave rainbow";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.setProperty("--d", boardWrap.clientWidth * 1.4 + "px");
    addFx(el, 950);
    const banner = document.createElement("div");
    banner.className = "combo-banner lv-4 super";
    banner.innerHTML = `<span class="big">SUPER BOMB!!</span><span class="small">Clear the board!</span>`;
    addFx(banner, 1300);
    flash(true);
    shakeScreen(true);
    confetti(150);
    sfx.superBoom();
  }
}

const SPECIAL_NAMES = {
  "line-h": "↔ Line Bomb",
  "line-v": "↕ Line Bomb",
  bomb: "💣 Bomb",
  super: "🌈 Super Bomb",
};

// ===== 상태 문구 + 색 =====
function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = "status status-" + type;
}

// 남은 장애물 개수
function countObstacles() {
  const count = { shell: 0, vine: 0, rock: 0, moss: 0, mud: 0, coconut: 0 };
  board.forEach((row, r) => row.forEach((b, c) => {
    if (mud[r] && mud[r][c]) count.mud++;
    if (!b) return;
    if (b.ob) count[b.ob]++;
    else {
      if (b.shell) count.shell++;
      if (b.vine) count.vine++;
      if (b.fuse) count.coconut++;
    }
  }));
  return count;
}

const obstaclesLeft = () => Object.values(countObstacles()).reduce((s, n) => s + n, 0);

function updateGoals() {
  if (!stage.hasObstacles) {
    goalsEl.classList.add("hidden");
    return;
  }
  const count = countObstacles();
  goalsEl.innerHTML = "";
  OB_TYPES.forEach((t) => {
    if (!(t in stage.obstacles) && count[t] === 0) return;
    const el = document.createElement("span");
    el.className = "goal" + (count[t] === 0 ? " done" : "");
    el.innerHTML = `<b class="mini ob-${t}"></b>${count[t] === 0 ? "✓" : "×" + count[t]}`;
    el.title = OBSTACLE_RULES[t].name;
    goalsEl.appendChild(el);
  });
  goalsEl.classList.remove("hidden");
}

function updateHud() {
  scoreEl.textContent = score;
  targetEl.textContent = stage.target;
  if (stage.timed) {
    limitLabel.textContent = "TIME";
    limitValue.textContent = formatTime(timeLeft);
    limitBox.classList.toggle("warning", timeLeft <= WARNING_TIME * 1000);
  } else {
    limitLabel.textContent = "MOVES";
    limitValue.textContent = moves;
    limitBox.classList.toggle("warning", moves <= WARNING_MOVES);
  }
  progressBar.style.width = Math.min(100, (score / stage.target) * 100) + "%";
}

// ===== 시간제한 =====
function startTimer() {
  if (timerStarted || !stage.timed || gameOver) return;
  timerStarted = true;
  lastTick = performance.now();
  timerId = setInterval(tick, 100);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function tick() {
  const now = performance.now();
  const dt = now - lastTick;
  lastTick = now;
  // 다른 탭으로 가거나 스테이지 선택 창이 열려 있으면 시간이 멈춤
  if (gameOver || paused || document.hidden) return;

  timeLeft = Math.max(0, timeLeft - dt);
  updateHud();

  // 마지막 10초는 똑딱 소리
  const sec = Math.ceil(timeLeft / 1000);
  if (sec <= 10 && sec > 0 && sec !== lastBeepSec) {
    lastBeepSec = sec;
    sfx.tick();
  }
  // 블록이 터지는 중이면 끝난 뒤(trySwap)에 판정
  if (timeLeft <= 0 && !busy) checkEnd();
}

// ===== 판 만들기: 시작부터 맞춰진 곳이 없고, 맞출 곳은 하나 이상 있게 =====
function createBoard() {
  const size = stage.size;
  for (let tries = 0; tries < 100; tries++) {
    board = [];
    for (let r = 0; r < size; r++) {
      board.push([]);
      for (let c = 0; c < size; c++) {
        if (isHole(r, c)) {
          board[r].push(null);
          continue;
        }
        const k = (rr, cc) => (rr >= 0 && cc >= 0 && board[rr][cc] ? board[rr][cc].a : null);
        let a;
        do {
          a = randomAnimal();
        } while (
          (k(r, c - 1) === a && k(r, c - 2) === a) ||
          (k(r - 1, c) === a && k(r - 2, c) === a) ||
          (k(r - 1, c - 1) === a && k(r - 1, c) === a && k(r, c - 1) === a)
        );
        board[r].push({ a, clock: false, special: null, shell: 0, vine: false });
      }
    }
    placeObstacles();
    if (findMatches().size === 0 && hasPossibleMove()) return;
  }
}

// 장애물을 빈 동물 칸에 골고루 흩어 놓기
function placeObstacles() {
  mud = board.map((row) => row.map(() => false));
  const spots = [];
  board.forEach((row, r) => row.forEach((b, c) => {
    if (b) spots.push({ r, c });
  }));
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spots[i], spots[j]] = [spots[j], spots[i]];
  }
  const plan = stage.obstacles;
  OB_TYPES.forEach((t) => {
    for (let i = 0; i < (plan[t] || 0) && spots.length; i++) {
      const { r, c } = spots.pop();
      if (t === "shell") board[r][c].shell = 1 + Math.floor(Math.random() * stage.shellLayers);
      else if (t === "vine") board[r][c].vine = true;
      else if (t === "rock") board[r][c] = { ob: "rock", hp: ROCK_HP };
      else if (t === "moss") board[r][c] = { ob: "moss" };
      else if (t === "mud") mud[r][c] = true;
      else board[r][c].fuse = COCONUT_FUSE;
    }
  });
}

// 새로 떨어지는 블록: 아이템 스테이지면 가끔 ⏰가 붙어서 나옴
function newBlock() {
  const clock = stage.items && clocksMade < ITEM_MAX && Math.random() < ITEM_CHANCE;
  if (clock) clocksMade++;
  return { a: randomAnimal(), clock, special: null, shell: 0, vine: false };
}

// 맞출 곳이 없을 때: 움직일 수 있는 블록끼리 섞기 (장애물은 그대로)
function shuffleBoard() {
  const spots = [];
  board.forEach((row, r) => row.forEach((b, c) => {
    if (canSwap(b)) spots.push({ r, c });
  }));
  const blocks = spots.map((p) => board[p.r][p.c]);
  for (let tries = 0; tries < 200; tries++) {
    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }
    spots.forEach((p, i) => (board[p.r][p.c] = blocks[i]));
    if (findMatches().size === 0 && hasPossibleMove()) return;
  }
  // 섞어도 안 되면 그림을 새로 뽑기
  for (let tries = 0; tries < 200; tries++) {
    spots.forEach((p) => {
      if (!board[p.r][p.c].special) board[p.r][p.c].a = randomAnimal();
    });
    if (findMatches().size === 0 && hasPossibleMove()) return;
  }
}

function render(dropped = new Set(), grown = new Set()) {
  const size = stage.size;
  boardEl.innerHTML = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isHole(r, c)) {
        const hole = document.createElement("div");
        hole.className = "hole";
        boardEl.appendChild(hole);
        continue;
      }
      const block = board[r][c];
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;
      if (mud[r][c]) {
        const puddle = document.createElement("span");
        puddle.className = "ob mud";
        cell.appendChild(puddle);
      }
      if (block && block.ob === "rock") {
        cell.classList.add("rock");
        if (block.hp < ROCK_HP) cell.classList.add("cracked");
        cell.setAttribute("aria-label", "Rock");
      } else if (block && block.ob === "moss") {
        cell.classList.add("moss");
        if (grown.has(key(r, c))) cell.classList.add("grow");
        cell.setAttribute("aria-label", "Moss");
      } else if (block) {
        if (block.special === "super") {
          cell.textContent = "🌟";
        } else {
          cell.style.setProperty("--tile", TILE_COLORS[block.a]);
          if (imageReady[block.a]) {
            const img = document.createElement("img");
            img.className = "char-img";
            img.src = CHARACTER_IMAGES[block.a];
            img.alt = ANIMALS[block.a];
            cell.appendChild(img);
          } else {
            cell.textContent = ANIMALS[block.a];
          }
        }
        if (block.special) cell.classList.add("sp-" + block.special);
        if (block.clock) {
          cell.classList.add("has-clock");
          const badge = document.createElement("span");
          badge.className = "clock-badge";
          badge.textContent = "⏰";
          cell.appendChild(badge);
        }
        if (block.fuse) {
          const nut = document.createElement("span");
          nut.className = "coconut-badge" + (block.fuse <= COCONUT_WARNING ? " danger" : "");
          nut.textContent = block.fuse;
          cell.appendChild(nut);
        }
        if (block.vine) {
          const vine = document.createElement("span");
          vine.className = "ob vine";
          cell.appendChild(vine);
        }
        if (block.shell) {
          const shell = document.createElement("span");
          shell.className = "ob shell";
          shell.dataset.n = block.shell;
          cell.appendChild(shell);
        }
      }
      if (selected && selected.r === r && selected.c === c) cell.classList.add("selected");
      if (dropped.has(key(r, c))) cell.classList.add("drop");
      boardEl.appendChild(cell);
    }
  }
}

function cellEl(r, c) {
  return boardEl.children[r * stage.size + c];
}

// ===== 매치 찾기: 가로/세로 3개 이상 이어진 줄, 2x2 네모 =====
function findGroups() {
  const size = stage.size;
  const kind = (r, c) => kindOf(board[r][c]);
  const groups = [];
  for (let r = 0; r < size; r++) {
    let c = 0;
    while (c < size) {
      const a = kind(r, c);
      let k = c + 1;
      while (a !== null && k < size && kind(r, k) === a) k++;
      if (a !== null && k - c >= 3) {
        const cells = [];
        for (let i = c; i < k; i++) cells.push({ r, c: i });
        groups.push({ dir: "h", a, cells });
      }
      c = k;
    }
  }
  for (let c = 0; c < size; c++) {
    let r = 0;
    while (r < size) {
      const a = kind(r, c);
      let k = r + 1;
      while (a !== null && k < size && kind(k, c) === a) k++;
      if (a !== null && k - r >= 3) {
        const cells = [];
        for (let i = r; i < k; i++) cells.push({ r: i, c });
        groups.push({ dir: "v", a, cells });
      }
      r = k;
    }
  }
  // 2x2 네모
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const a = kind(r, c);
      if (a !== null && kind(r, c + 1) === a && kind(r + 1, c) === a && kind(r + 1, c + 1) === a) {
        groups.push({ dir: "sq", a, cells: [{ r, c }, { r, c: c + 1 }, { r: r + 1, c }, { r: r + 1, c: c + 1 }] });
      }
    }
  }
  return groups;
}

function findMatches() {
  const found = new Set();
  findGroups().forEach((g) => g.cells.forEach((p) => found.add(key(p.r, p.c))));
  return found;
}

// 맞춘 모양을 보고 특수 블록을 만들 자리 정하기 (2x2 네모는 특수 블록 없음)
// focus = 방금 바꾼 두 칸 (그 자리에 특수 블록이 생김)
function planSpecials(groups, focus) {
  const made = [];
  const used = new Set();
  const taken = new Set();
  const same = (p, q) => p.r === q.r && p.c === q.c;
  const pick = (cells) => (focus && cells.find((p) => focus.some((q) => same(p, q)))) || cells[Math.floor(cells.length / 2)];
  const add = (pos, special, a) => {
    if (taken.has(key(pos.r, pos.c))) return;
    taken.add(key(pos.r, pos.c));
    made.push({ r: pos.r, c: pos.c, block: { a: special === "super" ? -1 : a, clock: false, special, shell: 0, vine: false } });
  };
  const line = (g) => g.dir === "h" || g.dir === "v";

  // 1) 5개 이상 일자 → 슈퍼봄
  groups.forEach((g, i) => {
    if (line(g) && g.cells.length >= 5) {
      used.add(i);
      add(pick(g.cells), "super", g.a);
    }
  });
  // 2) 가로 줄과 세로 줄이 겹침 (ㄱ, ㄴ, T, + 모양) → 폭탄
  groups.forEach((g, i) => {
    if (g.dir !== "h" || used.has(i)) return;
    groups.forEach((h, j) => {
      if (h.dir !== "v" || used.has(i) || used.has(j)) return;
      const cross = g.cells.find((p) => h.cells.some((q) => same(p, q)));
      if (cross) {
        used.add(i);
        used.add(j);
        add(cross, "bomb", g.a);
      }
    });
  });
  // 3) 4개 일자 → 그 방향 한 줄 폭탄
  groups.forEach((g, i) => {
    if (line(g) && g.cells.length === 4 && !used.has(i)) {
      used.add(i);
      add(pick(g.cells), g.dir === "h" ? "line-h" : "line-v", g.a);
    }
  });
  return made;
}

// 특수 블록이 터지면 지워지는 칸 (구멍 제외)
function specialArea(r, c, special) {
  const size = stage.size;
  const cells = [];
  for (let rr = 0; rr < size; rr++) {
    for (let cc = 0; cc < size; cc++) {
      if (isHole(rr, cc)) continue;
      const hit =
        special === "super" ||
        (special === "line-h" && rr === r) ||
        (special === "line-v" && cc === c) ||
        (special === "bomb" && Math.abs(rr - r) <= BOMB_RADIUS && Math.abs(cc - c) <= BOMB_RADIUS);
      if (hit) cells.push(key(rr, cc));
    }
  }
  return cells;
}

// 지울 칸 안에 특수 블록이 있으면 그 범위까지 넓힘 (특수 블록끼리 연달아 터짐)
function expandClears(clear) {
  const fired = [];
  const done = new Set();
  const queue = [...clear];
  while (queue.length) {
    const k = queue.pop();
    const [r, c] = parseKey(k);
    const b = board[r][c];
    if (!isAnimal(b) || !b.special || done.has(k)) continue;
    done.add(k);
    fired.push({ r, c, special: b.special });
    specialArea(r, c, b.special).forEach((k2) => {
      if (!clear.has(k2)) {
        clear.add(k2);
        queue.push(k2);
      }
    });
  }
  return fired;
}

function swap(a, b) {
  const t = board[a.r][a.c];
  board[a.r][a.c] = board[b.r][b.c];
  board[b.r][b.c] = t;
}

// 바꿔서 맞춰지는 곳이 하나라도 있는지 (움직일 수 있는 특수 블록이 있으면 언제나 가능)
function hasPossibleMove() {
  const size = stage.size;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!canSwap(board[r][c])) continue;
      for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size || !canSwap(board[nr][nc])) continue;
        if (board[r][c].special) return true;
        if (dr < 0 || dc < 0) continue; // 같은 짝은 한 번만 시험
        swap({ r, c }, { r: nr, c: nc });
        const ok = findMatches().size > 0;
        swap({ r, c }, { r: nr, c: nc });
        if (ok) return true;
      }
    }
  }
  return false;
}

// ===== 장애물 맞히기 =====
// blast = 특수 블록 폭발에 맞음 (바위는 한 번에 부서짐)
function hitObstacle(r, c, blast, hits) {
  const b = board[r][c];
  if (b.ob === "rock") {
    b.hp = blast ? 0 : b.hp - 1;
    hits.push({ r, c, type: "rock", gone: b.hp <= 0 });
  } else if (b.ob === "moss") {
    hits.push({ r, c, type: "moss", gone: true });
    mossBroken = true;
  } else if (b.shell) {
    b.shell--;
    hits.push({ r, c, type: "shell", gone: b.shell === 0 });
  }
}

function obstacleEffects(hits) {
  if (!hits.length) return;
  hits.forEach((h) => burst(h.r, h.c, OB_COLORS[h.type], 1, true));
  if (hits.some((h) => h.type === "rock")) sfx.rock();
  if (hits.some((h) => h.type === "shell")) sfx.crack();
  if (hits.some((h) => h.type === "moss" || h.type === "mud")) sfx.squish();
}

// 이끼 번지기: 이번 이동에서 이끼를 하나도 못 없앴으면 옆 블록 하나가 이끼가 됨
function spreadMoss() {
  const count = countObstacles().moss;
  if (mossBroken || count === 0 || count >= MOSS_MAX) return null;
  const size = stage.size;
  const targets = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c] || board[r][c].ob !== "moss") continue;
      [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) return;
        const b = board[nr][nc];
        if (isAnimal(b) && !b.special && !b.shell && !b.fuse) targets.push({ r: nr, c: nc });
      });
    }
  }
  if (!targets.length) return null;
  const t = targets[Math.floor(Math.random() * targets.length)];
  board[t.r][t.c] = { ob: "moss" };
  return t;
}

// ===== 블록 제거 → 떨어뜨리기 → 새 블록 채우기 (연쇄 반복) =====
// startClear = 바꾸기로 바로 터뜨린 특수 블록 칸, focus = 방금 바꾼 두 칸
async function resolveBoard(startClear = null, focus = null) {
  const size = stage.size;
  let combo = 0;
  let extra = startClear;
  while (true) {
    const groups = findGroups();
    if (groups.length === 0 && !extra) break;
    combo++;

    const clear = extra || new Set();
    extra = null;
    groups.forEach((g) => g.cells.forEach((p) => clear.add(key(p.r, p.c))));
    const made = planSpecials(groups, combo === 1 ? focus : null);
    const fired = expandClears(clear);

    // 폭발 범위에 들어간 장애물은 지우지 않고 "맞힘"으로 처리
    const hits = [];
    const hitDone = new Set();
    [...clear].forEach((k) => {
      const [r, c] = parseKey(k);
      const b = board[r][c];
      if (!b) {
        clear.delete(k);
      } else if (isObstacle(b)) {
        clear.delete(k);
        hitDone.add(k);
        hitObstacle(r, c, true, hits);
      }
    });
    made.forEach((m) => clear.delete(key(m.r, m.c))); // 특수 블록이 생기는 칸은 남김
    // 지워지는 칸 바로 옆(상하좌우)의 장애물도 한 번씩 맞음
    const near = new Set([...clear, ...made.map((m) => key(m.r, m.c))]);
    near.forEach((k) => {
      const [r, c] = parseKey(k);
      [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        const nk = key(nr, nc);
        if (nr < 0 || nc < 0 || nr >= size || nc >= size || hitDone.has(nk)) return;
        if (isObstacle(board[nr][nc])) {
          hitDone.add(nk);
          hitObstacle(nr, nc, false, hits);
        }
      });
    });
    // 블록이 터지는 칸의 진흙은 닦임 (특수 블록이 생기는 칸 포함)
    near.forEach((k) => {
      const [r, c] = parseKey(k);
      if (!mud[r][c]) return;
      mud[r][c] = false;
      hits.push({ r, c, type: "mud", gone: true });
    });

    const gained = clear.size * POINT_PER_BLOCK * combo + hits.length * OBSTACLE_POINTS;
    score += gained;
    const superFired = fired.some((f) => f.special === "super");
    setStatus(
      superFired ? `SUPER BOMB!! +${gained}` :
      fired.length ? `BOOM! Special block +${gained}` :
      combo > 1 ? `${combo} combo! +${gained}` : `${clear.size} cleared! +${gained}`,
      "busy"
    );

    // 효과: 터지는 소리, 조각, 점수 팝업
    sfx.pop(combo);
    fired.forEach(specialEffect);
    obstacleEffects(hits);
    const light = clear.size > 20;
    let sumX = 0, sumY = 0;
    let clockCount = 0;
    let vineCount = 0;
    let defused = 0;
    clear.forEach((k) => {
      const [r, c] = parseKey(k);
      const b = board[r][c];
      cellEl(r, c).classList.add("matched");
      burst(r, c, COLORS[b.a] || "#ffd54f", combo, light);
      const pos = cellCenter(r, c);
      sumX += pos.x;
      sumY += pos.y;
      if (b.vine) vineCount++;
      if (b.fuse) {
        defused++;
        floatScore(pos.x, pos.y - 20, "Defused!", "special");
      }
      // ⏰ 아이템을 맞추면 시간 추가
      if (b.clock) {
        clockCount++;
        floatScore(pos.x, pos.y - 20, `⏰ +${ITEM_BONUS}s`, "time");
      }
    });
    if (vineCount) sfx.snap();
    if (defused) sfx.make();
    if (clear.size > 0) floatScore(sumX / clear.size, sumY / clear.size, "+" + gained);

    // 특수 블록이 생기는 자리에 이름 띄우기
    made.forEach((m) => {
      const pos = cellCenter(m.r, m.c);
      floatScore(pos.x, pos.y - 24, SPECIAL_NAMES[m.block.special] + "!", "special");
    });
    if (made.length) sfx.make();

    if (clockCount > 0 && stage.timed) {
      timeLeft += clockCount * ITEM_BONUS * 1000;
      lastBeepSec = -1;
      sfx.clock();
      bump(limitValue);
    }

    // 연쇄(2단계 이상)나 한 번에 4개 이상이면 더 화려하게 (슈퍼봄은 자체 효과)
    if (!superFired && (combo >= 2 || clear.size >= 4)) {
      comboBanner(combo, clear.size);
      sfx.combo(combo);
      flash();
      shakeScreen(combo >= 3);
      setGlow(combo);
      if (combo >= 3) confetti(combo * 15);
    }
    updateHud();
    updateGoals();
    bump(scoreEl);
    await wait(superFired ? 750 : fired.length ? 500 : combo >= 2 ? 450 : 300);

    clear.forEach((k) => {
      const [r, c] = parseKey(k);
      board[r][c] = null;
    });
    // 다 부서진 바위, 이끼 칸은 비움
    hits.forEach((h) => {
      if (h.gone && (h.type === "rock" || h.type === "moss")) board[h.r][h.c] = null;
    });
    made.forEach((m) => {
      board[m.r][m.c] = m.block;
    });

    dropBlocks();
    sfx.drop();
    await wait(280);
  }
  setGlow(0);
}

// 중력: 바위/이끼는 그 자리에 고정. 고정 칸 사이 구간마다 아래로 내리고 위에서 새로 채움
// (구멍은 건너뛰고 통과)
function dropBlocks() {
  const size = stage.size;
  const dropped = new Set();
  for (let c = 0; c < size; c++) {
    const segments = [[]];
    for (let r = 0; r < size; r++) {
      if (isHole(r, c)) continue;
      if (isFixed(board[r][c])) segments.push([]);
      else segments[segments.length - 1].push(r);
    }
    segments.forEach((rows) => {
      const blocks = rows.map((r) => board[r][c]).filter(Boolean);
      const empty = rows.length - blocks.length;
      rows.forEach((r, i) => {
        const next = i < empty ? newBlock() : blocks[i - empty];
        if (next !== board[r][c]) dropped.add(key(r, c));
        board[r][c] = next;
      });
    });
  }
  render(dropped);
}

// ===== 블록 두 개 바꾸기 =====
async function trySwap(a, b) {
  if (!canSwap(board[a.r][a.c]) || !canSwap(board[b.r][b.c])) {
    stuckFeedback(canSwap(board[a.r][a.c]) ? b : a);
    return;
  }
  busy = true;
  selected = null;
  mossBroken = false;
  swap(a, b);
  render();
  sfx.swap();

  // 바꾼 블록 중 특수 블록이 있으면 맞추지 않아도 바로 터짐
  const startClear = new Set();
  [a, b].forEach((p) => {
    if (board[p.r][p.c].special) startClear.add(key(p.r, p.c));
  });

  if (findMatches().size === 0 && startClear.size === 0) {
    // 맞춰지는 게 없으면 원래대로 (이동 횟수 차감 없음)
    setStatus("No match! Try another swap", "fail");
    sfx.fail();
    cellEl(a.r, a.c).classList.add("shake");
    cellEl(b.r, b.c).classList.add("shake");
    await wait(300);
    swap(a, b);
    render();
    busy = false;
    return;
  }

  if (!stage.timed) moves--;
  updateHud();
  await resolveBoard(startClear.size ? startClear : null, [a, b]);

  // 이끼 번지기
  const grown = spreadMoss();
  if (grown) {
    render(new Set(), new Set([key(grown.r, grown.c)]));
    sfx.spread();
    setStatus("The moss is spreading! 🌱", "fail");
    updateGoals();
    await wait(450);
  }

  if (await tickCoconuts()) return;
  if (checkEnd()) return;

  if (!hasPossibleMove()) {
    setStatus("No moves left. Shuffling 🔀", "busy");
    await wait(700);
    shuffleBoard();
    render();
  }
  const hasSpecial = board.some((row) => row.some((blk) => isAnimal(blk) && blk.special));
  if (score >= stage.target && obstaclesLeft() > 0) {
    setStatus("Score reached! Now break every obstacle", "selected");
  } else if (!grown) {
    setStatus(hasSpecial ? "Swap a special block to blast it!" : "Tap a block to swap", "ready");
  }
  busy = false;
}

// 코코넛 폭탄: 이동이 끝날 때마다 숫자가 1씩 줄고, 0이 되면 실패
async function tickCoconuts() {
  let boom = null;
  board.forEach((row, r) => row.forEach((b, c) => {
    if (!isAnimal(b) || !b.fuse) return;
    b.fuse--;
    if (b.fuse <= 0 && !boom) boom = { r, c };
  }));
  if (!boom) {
    render();
    return false;
  }
  render();
  burst(boom.r, boom.c, OB_COLORS.coconut, 4, false);
  sfx.rock();
  flash();
  shakeScreen(true);
  await wait(500);
  endGame(false, "coconut");
  return true;
}

// 못 움직이는 칸을 건드렸을 때 알려주기
const STUCK_TEXT = {
  shell: "Wrapped in leaves! Match next to it to peel",
  vine: "Tied up in vines! Match it where it is",
  rock: "A rock! Match next to it or blast it",
  moss: "Moss! Match next to it to clear it",
};

function stuckFeedback(pos) {
  const b = board[pos.r][pos.c];
  if (!b) return;
  const type = b.ob || (b.shell ? "shell" : "vine");
  setStatus(STUCK_TEXT[type], "fail");
  sfx.stuck();
  const el = cellEl(pos.r, pos.c);
  el.classList.remove("locked-shake");
  void el.offsetWidth;
  el.classList.add("locked-shake");
}

// ===== 끝나는 조건 =====
function checkEnd() {
  if (gameOver) return true;
  if (score >= stage.target && obstaclesLeft() === 0) {
    endGame(true);
    return true;
  }
  if (stage.timed ? timeLeft <= 0 : moves <= 0) {
    endGame(false);
    return true;
  }
  return false;
}

function endGame(win, reason = null) {
  gameOver = true;
  busy = true;
  stopTimer();
  const n = stage.n;
  const emojiEl = document.getElementById("result-emoji");
  const titleEl = document.getElementById("result-title");
  const textEl = document.getElementById("result-text");
  const left = stage.timed ? `Time left ${formatTime(timeLeft)}` : `Moves left ${moves}`;

  if (win) {
    saveCleared(n);
    const allClear = n === MAX_STAGE;
    setStatus(allClear ? "All stages cleared! 🏆" : `Stage ${n} clear! 🎉`, "win");
    emojiEl.textContent = allClear ? "🏆" : "🎉";
    titleEl.textContent = allClear ? `ALL ${MAX_STAGE} CLEARED!` : `STAGE ${n} CLEAR!`;
    textEl.innerHTML = `Score <b>${score}</b> / Goal ${stage.target}<br>${left}`;
    nextBtn.classList.toggle("hidden", allClear);
    againBtn.textContent = "PLAY AGAIN";
    againBtn.className = allClear ? "btn btn-primary" : "btn btn-secondary";
  } else {
    const obLeft = obstaclesLeft();
    setStatus(
      reason === "coconut" ? "A coconut bomb went off… Failed" :
      stage.timed ? "Time's up… Failed" : "Out of moves… Failed", "lose");
    emojiEl.textContent = "😢";
    titleEl.textContent = `STAGE ${n} FAILED`;
    const reasons = [];
    if (reason === "coconut") reasons.push("A coconut bomb went off 💥");
    if (score < stage.target) reasons.push(`${stage.target - score} points short`);
    if (obLeft > 0) reasons.push(`${obLeft} obstacle${obLeft > 1 ? "s" : ""} left`);
    textEl.innerHTML = `Score <b>${score}</b> / Goal ${stage.target}<br>${reasons.join(" · ")}`;
    nextBtn.classList.add("hidden");
    againBtn.textContent = "PLAY AGAIN";
    againBtn.className = "btn btn-primary";
  }
  resultBox.className = "panel result-box " + (win ? "win" : "lose");
  resultEl.classList.remove("hidden");
  if (win) {
    sfx.win();
    confetti(n === MAX_STAGE ? 300 : 120);
  } else {
    sfx.lose();
  }
}

// ===== 입력: 탭 2번 또는 스와이프 =====
function isAdjacent(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

function handleTap(pos) {
  if (busy || gameOver) return;
  if (!canSwap(board[pos.r][pos.c])) {
    stuckFeedback(pos);
    return;
  }
  if (!selected) {
    selected = pos;
    sfx.select();
    setStatus("Tap a neighbor (up/down/left/right)", "selected");
    render();
  } else if (selected.r === pos.r && selected.c === pos.c) {
    selected = null;
    setStatus("Selection canceled", "ready");
    render();
  } else if (isAdjacent(selected, pos)) {
    trySwap(selected, pos);
  } else {
    selected = pos;
    sfx.select();
    setStatus("Tap a neighbor (up/down/left/right)", "selected");
    render();
  }
}

let touchStart = null;

boardEl.addEventListener("pointerdown", (e) => {
  initAudio();
  const cell = e.target.closest(".cell");
  if (!cell) return;
  startTimer(); // 시간제한 스테이지는 처음 블록을 누를 때부터 시간이 흐름
  touchStart = { x: e.clientX, y: e.clientY, r: +cell.dataset.r, c: +cell.dataset.c };
});

boardEl.addEventListener("pointerup", (e) => {
  if (!touchStart) return;
  const size = stage.size;
  const dx = e.clientX - touchStart.x;
  const dy = e.clientY - touchStart.y;
  const start = { r: touchStart.r, c: touchStart.c };
  touchStart = null;

  const minSwipe = boardEl.clientWidth / size / 3;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < minSwipe) {
    handleTap(start); // 짧게 누름 = 탭
    return;
  }
  if (busy || gameOver) return;
  // 스와이프 방향의 옆 블록과 바로 바꾸기
  const target = Math.abs(dx) > Math.abs(dy)
    ? { r: start.r, c: start.c + Math.sign(dx) }
    : { r: start.r + Math.sign(dy), c: start.c };
  if (target.r < 0 || target.r >= size || target.c < 0 || target.c >= size || isHole(target.r, target.c)) return;
  trySwap(start, target);
});

// ===== 진행 기록 저장 =====
function loadCleared() {
  try {
    return Math.min(MAX_STAGE, parseInt(localStorage.getItem(SAVE_KEY), 10) || 0);
  } catch (e) {
    return 0;
  }
}

function saveCleared(n) {
  cleared = Math.max(cleared, n);
  try {
    localStorage.setItem(SAVE_KEY, cleared);
  } catch (e) {
    // 저장이 막힌 브라우저면 이번 접속 동안만 기억
  }
}

const unlockedStage = () => Math.min(MAX_STAGE, cleared + 1);

// ===== 스테이지 선택 화면 =====
function renderStageSelect() {
  stageGrid.innerHTML = "";
  const open = unlockedStage();
  for (let n = 1; n <= MAX_STAGE; n++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "stage-btn";
    btn.dataset.n = n;
    if (n <= cleared) {
      btn.classList.add("cleared");
      btn.innerHTML = `${n}<small>⭐</small>`;
    } else if (n === open) {
      btn.classList.add("open");
      btn.innerHTML = `${n}<small>PLAY</small>`;
    } else {
      btn.classList.add("locked");
      btn.disabled = true;
      btn.innerHTML = `${n}<small>🔒</small>`;
    }
    if (stage && n === stage.n) btn.classList.add("current");
    stageGrid.appendChild(btn);
  }
  document.getElementById("select-progress").textContent = `${cleared} / ${MAX_STAGE} CLEARED`;
}

function openStageSelect() {
  paused = true;
  renderStageSelect();
  // 게임 중이면 닫기 버튼으로 돌아갈 수 있음
  selectCloseBtn.classList.toggle("hidden", gameOver);
  selectEl.classList.remove("hidden");
  const cur = stageGrid.querySelector(".open") || stageGrid.querySelector(".current");
  if (cur) cur.scrollIntoView({ block: "center" });
}

function closeStageSelect() {
  selectEl.classList.add("hidden");
  paused = false;
}

stageGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".stage-btn");
  if (!btn || btn.disabled) return;
  initAudio();
  closeStageSelect();
  startStage(+btn.dataset.n);
});

selectCloseBtn.addEventListener("click", closeStageSelect);

document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("Erase all progress and start again from stage 1?")) return;
  cleared = 0;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {}
  closeStageSelect();
  startStage(1);
});

// ===== 스테이지 시작 =====
const OB_INTRO = {
  shell: "New! 🍃 Leaf Shells — match next to them",
  vine: "New! 🌿 Vines — match the tied block",
  rock: "New! 🪨 Rocks — hit them twice or blast",
  moss: "New! 🌱 Moss spreads — clear it fast",
  mud: "New trick! 🟤 Mud — pop blocks on it to clean",
  coconut: "New trick! 🥥 Coconut Bomb — match it before 0",
};

function stageIntro(prev) {
  const s = stage;
  const introOb = OB_TYPES.find((t) => s.n === OBSTACLE_RULES[t].start);
  if (introOb) return OB_INTRO[introOb];
  if (s.n === TIME_STAGE) return "Time limit starts now! ⏱";
  if (s.n === ITEM_STAGE) return `Match ⏰ blocks for +${ITEM_BONUS}s!`;
  if (prev && s.size > prev.size) return `Board grew to ${s.size}×${s.size}!`;
  if (prev && s.animals > prev.animals) return `New animal ${ANIMALS[s.animals - 1]} joins!`;
  if (prev && s.theme !== prev.theme) return `Welcome to ${THEME_NAMES[s.theme]}!`;
  const goal = s.timed ? `${s.target} pts in ${formatTime(s.time * 1000)}` : `${s.target} pts in ${MOVES} moves`;
  return s.hasObstacles ? `${goal} + break all obstacles!` : goal + "!";
}

function startStage(n) {
  stopTimer();
  const prev = n > 1 ? getStage(n - 1) : null;
  stage = getStage(n);
  score = 0;
  moves = MOVES;
  timeLeft = stage.time * 1000;
  timerStarted = false;
  lastBeepSec = -1;
  paused = false;
  clocksMade = 0;
  selected = null;
  busy = false;
  gameOver = false;
  resultEl.classList.add("hidden");
  fxLayer.innerHTML = "";
  confettiLayer.innerHTML = "";
  setGlow(0);

  // 맵 테마와 음악
  if (jungleBg.dataset.theme !== String(stage.theme) || !bgPhoto.classList.contains("on")) {
    jungleBg.dataset.theme = stage.theme;
    updateBackground();
  }
  updateMusic();

  // 판 크기와 모양에 맞게 칸 수와 글자 크기 조절
  holes = makeHoles(stage.size, stage.shape);
  boardEl.style.gridTemplateColumns = `repeat(${stage.size}, 1fr)`;
  boardEl.style.setProperty("--size", stage.size);

  createBoard();
  if (stage.items) {
    // 아이템 스테이지는 ⏰ 하나를 처음부터 보여줌
    const spots = [];
    board.forEach((row, r) => row.forEach((b, c) => {
      if (canSwap(b)) spots.push({ r, c });
    }));
    const p = spots[Math.floor(Math.random() * spots.length)];
    if (p) board[p.r][p.c].clock = true;
    clocksMade = 1;
  }
  render();
  updateHud();
  updateGoals();

  stageLabel.textContent = `STAGE ${n}`;
  const tags = [THEME_NAMES[stage.theme], `${stage.size}×${stage.size}`];
  if (stage.timed) tags.push("⏱");
  if (stage.items) tags.push("⏰");
  stageInfo.textContent = tags.join(" · ");

  const intro = stageIntro(prev);
  setStatus(stage.timed ? `${intro} Timer starts on first tap` : intro, "ready");
  showBanner(`STAGE ${n}`, intro, 2, 1600);
  sfx.start();
}

// ===== 설정 창 (⚙): 열려 있는 동안 시간이 멈춤 =====
const settingsEl = document.getElementById("settings");

function openSettings() {
  paused = true;
  settingsEl.classList.remove("hidden");
}

function closeSettings() {
  settingsEl.classList.add("hidden");
  paused = false;
}

document.getElementById("settings-btn").addEventListener("click", openSettings);
document.getElementById("settings-close-btn").addEventListener("click", closeSettings);
document.getElementById("resume-btn").addEventListener("click", closeSettings);
document.getElementById("restart-btn").addEventListener("click", () => {
  closeSettings();
  startStage(stage.n);
});
document.getElementById("menu-btn").addEventListener("click", openStageSelect);
document.getElementById("result-menu-btn").addEventListener("click", openStageSelect);
againBtn.addEventListener("click", () => startStage(stage.n));
nextBtn.addEventListener("click", () => startStage(Math.min(MAX_STAGE, stage.n + 1)));

// ===== 처음 열었을 때 =====
loadSettings();
updateSettingsUi();
preloadImages();
cleared = loadCleared();
// 테스트용: 주소 뒤에 ?stage=50 처럼 붙이면 인트로 없이 그 스테이지로 바로 시작
const testStage = parseInt(new URLSearchParams(location.search).get("stage"), 10);
if (testStage >= 1 && testStage <= MAX_STAGE) {
  startStage(testStage);
} else {
  // 인트로 화면: 뒤에서 판을 미리 준비해 두고(음악 구간도 정해짐), START NOW를 누르면 보여줌
  startStage(unlockedStage());
  document.body.classList.add("intro-on");
  introEl.classList.remove("hidden");
}

document.getElementById("start-btn").addEventListener("click", () => {
  musicUnlocked = true;
  initAudio();
  introEl.classList.add("hidden");
  document.body.classList.remove("intro-on");
  startStage(stage.n); // 시작 안내와 소리를 지금 다시 보여주기
});
