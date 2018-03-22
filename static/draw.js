const can = document.querySelector('#c');
const ctx = can.getContext('2d');

const sqSize = 30;
const sqCount = 20;
const maxXY = sqSize * sqCount;
can.width=sqSize * sqCount;
can.height=sqSize * sqCount;

const drawGrid = () => {
  ctx.lineWidth=1;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  for(let y = 0; y < sqCount; y++){
    for(let x = 0; x < sqCount; x++){
      ctx.rect(x*sqSize, y*sqSize, sqSize, sqSize);
    }
  }
  ctx.stroke();
  ctx.closePath();
}

const drawPath = (path) => {
  ctx.fillStyle = 'rgb(100,100,200)';
  ctx.beginPath();
  path.forEach(p => ctx.fillRect(p.x, p.y, sqSize, sqSize));
  ctx.closePath();
}

const drawCar = (loc, width, angle, color) => {
  ctx.fillStyle = color || 'crimson';
  ctx.strokeStyle = color || 'yellow';
  ctx.lineWidth = 1;
  //loc == center
  const dx = width/2; //half as wide as tall
  ctx.save();
  ctx.translate(loc.x, loc.y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -width);
  ctx.lineTo(dx, width);
  ctx.lineTo(-dx, width);
  ctx.stroke();
  ctx.fill();
  ctx.closePath(0, -width);
  ctx.restore();
}

//initialize
drawGrid()
drawPath(path);
