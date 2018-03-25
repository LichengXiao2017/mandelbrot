
/* function getColour(cx, cy, x0=0, y0=0, max=512) {
  let x = x0;
  let y = y0;
  let iteration = 0;

  while (true) {
    iteration += 1;
    if (iteration > max) return 0;

    [x, y] = [x*x - y*y + cx, 2*x*y + cy];
    if (x*x + y*y >= 4) return iteration;
  }
} */


function getColour(cx, cy, x0=0, y0=0, max=40) {
  let x = x0;
  let y = y0;
  let escape = 0;

  while (true) {
    if (escape > max) return 0;

    let abs = Math.sqrt(x*x + y*y);
    if (abs >= 4) return escape;

    [x, y] = [x*x - y*y + cx, 2*x*y + cy];
    let abs1 = Math.sqrt(x*x + y*y);
    escape += (abs1 <= 4) ? 1 : Math.log(4/abs) / Math.log(abs1/abs);
  }
}

function fractal(xMin, xMax, yMin, yMax, r, julia=null) {
  let result = [];
  let dx = (xMax - xMin) / r;
  let dy = (yMax - yMin) / r;

  for (let x = 0; x < r; x += 1) {
    let row = [];
    for (let y = 0; y < r; y += 1) {
      let px = xMin + x * dx;
      let py = yMin + y * dy;
      let c = julia ? getColour(julia[0], julia[1], px, py) : getColour(px, py);
      row.push(c);
    }
    result.push(row);
  }
  return result;
}

self.addEventListener('message', function(e) {
  let start = Date.now();
  let result = fractal(...e.data);
  console.log('computed in ' + Math.round((Date.now() - start)) + 'ms');
  self.postMessage(result);
}, false);
