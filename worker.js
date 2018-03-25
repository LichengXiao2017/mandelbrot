const maxEscape = 40;
const maxSquare = 16;

function getColour(cx, cy, x0=0, y0=0) {
  let x = x0;
  let y = y0;
  let escape = 0;

  while (true) {
    if (escape > maxEscape) return 0;

    let squares = x * x + y * y;
    if (squares >= maxSquare) return escape;

    [x, y] = [x*x - y*y + cx, 2*x*y + cy];

    let squares1 = x * x + y * y;
    escape += (squares1 <= maxSquare) ? 1 :
        Math.log(maxSquare/squares) / Math.log(squares1/squares);
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
