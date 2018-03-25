
// nicer styles + resize events
// better colours and iteration count
// cleanup + performance


const resolution = 400;

const $mandelbrot = document.querySelector('#mandelbrot');
const mandelContext = $mandelbrot.getContext('2d');
const mandelBounds = [-2, 1, -1.5, 1.5];

const $julia = document.querySelector('#julia');
const juliaContext = $julia.getContext('2d');
const juliaBounds = [-1.5, 1.5, -1.5, 1.5];


let running = false;
function generateFractal(...options) {
  if (running) return Promise.reject();
  running = true;

  return new Promise((resolve, reject) => {
    const webWorker = new Worker('worker.js');
    webWorker.addEventListener('message', e => {
      running = false;
      resolve(e.data)
    });
    webWorker.postMessage(options);
  });
}



function paintFractal(data, context) {
  const image = context.createImageData(resolution, resolution);
  for (let x = 0; x < resolution; x += 1) {
    for (let y = 0; y < resolution; y += 1) {
      image.data.set(getColour(data[x][y]), (y * resolution + x) * 4);
    }
  }
  context.putImageData(image, 0, 0);   
}


const gradient = [0, 8, 12, 16, 20, 24, 28, 32, 36, 41];
const colours = [[0,0,70], [130, 215, 255], [255,255,255], [255, 190, 0], [190, 0, 0],
    [0, 0, 130], [130, 215, 255], [255,255,255], [255,190,0], [190,0,0]];

function getColour(c) {
  if (!c) return [0, 0, 0, 255];

  const i = gradient.findIndex(x => x > c);
  const p = (c - gradient[i-1]) / (gradient[i] - gradient[i-1]);

  return [
    (1-p) * colours[i-1][0] + p * colours[i][0],
    (1-p) * colours[i-1][1] + p * colours[i][1],
    (1-p) * colours[i-1][2] + p * colours[i][2],
    255
  ];
}

/*$mandelbrot.addEventListener('click', e => {
  const rect = $mandelbrot.getBoundingClientRect();
  const x = mandelBounds[0] + (e.clientX - rect.left) / rect.width * (mandelBounds[1] - mandelBounds[0]);
  const y = mandelBounds[2] + (e.clientY - rect.top) / rect.height * (mandelBounds[3] - mandelBounds[2]);

  generateFractal(...juliaBounds, resolution, [x, y]).then(data => paintFractal(data, juliaContext));
});*/

generateFractal(...mandelBounds, resolution).then(data => paintFractal(data, mandelContext));

// ----------------------------------------------------------------------------

const $knob = document.querySelector('.pointer');

function start(e) {
  document.body.addEventListener('mousemove', move);
  document.body.addEventListener('touchmove', move);
  document.body.addEventListener('mouseup', end);
  document.body.addEventListener('touchend', end);
}

function move(e) {
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const rect = $mandelbrot.getBoundingClientRect();

  $knob.style.left = x - rect.left + 'px';
  $knob.style.top = y - rect.top + 'px';

  const px = mandelBounds[0] + (x - rect.left) / rect.width * (mandelBounds[1] - mandelBounds[0]);
  const py = mandelBounds[2] + (x - rect.top) / rect.height * (mandelBounds[3] - mandelBounds[2]);

  generateFractal(...juliaBounds, resolution, [px, py])
    .then(data => paintFractal(data, juliaContext));
}

function end(e) {
  document.body.removeEventListener('mousemove', move);
  document.body.removeEventListener('touchmove', move);
  document.body.removeEventListener('mouseup', end);
  document.body.removeEventListener('touchend', end);
}

$knob.addEventListener('mousedown', start);
$knob.addEventListener('touchstart', start);

