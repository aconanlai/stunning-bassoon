let previousMovements = [];
let movements = [];
var x;
var y;
var windowWidth;
var windowHeight;

const fps = 10;
let now;
let then = Date.now();
const interval = 1000 / fps;
let delta;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const cursor = document.getElementById('cursor');
let animationFrame = 0;

function executeOneFrame() {
  requestAnimationFrame(executeOneFrame);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    if (x && y && !isMobile) {
      movements.push([x, y])
    }

    if (animationFrame < (previousMovements.length - 1)) {
      const newX = (previousMovements[animationFrame][0] / 100) * windowWidth;
      const newY = (previousMovements[animationFrame][1] / 100) * windowHeight;
      cursor.style.transform = (`translate(${newX}px, ${newY}px)`)
      animationFrame++;
    }
  }
}

function getWindowSize() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

window.addEventListener('resize', () => {
  getWindowSize();
});

getWindowSize();

document.addEventListener('mousemove', (event) => {

  x = Math.floor(event.clientX / windowWidth * 100);
  y = Math.floor(event.clientY / windowHeight * 100);
})

fetch('/movements')
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    previousMovements = json;
    requestAnimationFrame(executeOneFrame);
  })

function sendMessage() {
  if (movements.length > 10) {
    fetch('/movements', {
      method: 'POST',
      body: JSON.stringify(movements),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
  }
  setTimeout(sendMessage, 10000);
}

setTimeout(sendMessage, 10000);

const aboutButton = document.getElementById('about-button');
const overlay = document.getElementById('overlay');
const aboutModal = document.getElementById('about-modal');
const closeButton = document.getElementById('close-button');
const backButton = document.getElementById('back-button');

aboutButton.addEventListener('click', () => {
  overlay.classList.add('appear');
  aboutModal.classList.add('appear');
});

closeButton.addEventListener('click', () => {
  overlay.classList.remove('appear');
  aboutModal.classList.remove('appear');
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('appear');
  aboutModal.classList.remove('appear');
});

backButton.addEventListener('click', () => {
  const back = window.history.back();
  if (!back) {
    window.location.href = 'http://www.conanlai.com';
  }
});