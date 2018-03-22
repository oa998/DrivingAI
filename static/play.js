let lastSpeed = 0 ;
let speed = 0.2;
let pos = {x: 50, y: 50};
let dir = 3.14;  //angle
let dirChange = 0; //direction player trying to move car
let keysDown = [];
let steering = false;
let steeringDirection = '';
let trainingPoints = [];

document.addEventListener('keydown',(e)=>{
  keysDown.push(e.key);
  if(e.key == 'ArrowRight'){
    steeringDirection = "right";
    steering = true;
  }else if(e.key == 'ArrowLeft'){
    steeringDirection = "left";
    steering = true;
  }else if(e.key == 'ArrowUp'){
    speed += 0.03;
  }else if(e.key == 'ArrowDown'){
    speed -= 0.03;
  }else if(e.key == ' '){
    let temp = speed;
    speed = lastSpeed;
    lastSpeed = temp;
  }
});
document.addEventListener('keyup',(e)=>{
  keysDown = keysDown.filter(k=>k!==e.key);
  if(!keysDown.includes('ArrowLeft') && !keysDown.includes('ArrowRight')){
    steering = false;
  }
});

const turn = () => {
  if(steering){ //full left
    if(steeringDirection == 'right'){
      dirChange += 0.1;
    }else if(steeringDirection == 'left'){
      dirChange -= 0.1;
    }
    if(Math.abs(dirChange)>1){
      dirChange = dirChange/Math.abs(dirChange);
    }
  }else{
    dirChange *= 0.98;
  }
  let d = dir + (dirChange/8 * speed) || 0;
  if(d > 2* Math.PI || d < -2*Math.PI){
    return d%(2*Math.PI);
  }else{
    return d;
  }
}

const snapshot = (dataCollection, range = 1) => {
  const x = Math.floor(pos.x/sqSize)*sqSize;
  const y = Math.floor(pos.y/sqSize)*sqSize;
  let snap = {};
  if( !pathMapX[x] || !pathMapX[x].includes(y) ){ //off track
    ctx.beginPath();
    ctx.fillStyle = 'rgba(200,20,20,0.4)';
    can.style.border = 'red dotted 3px';
    ctx.fillRect(x,y,sqSize,sqSize);
    ctx.closePath();
    return;
  }else{
    can.style.border = 'blue solid 3px';
    let index = 0;
    for(let j = y - (range * sqSize); j <= y + (range * sqSize); j += sqSize){
      for(let i = x - (range * sqSize); i <= x + (range * sqSize); i += sqSize){
        const neighbor = { x: i, y: j };
        if(j < 0 || j >= maxXY || i < 0 || i >= maxXY || speed < 0.05){
          return;
        }
        if(pathMapX[neighbor.x] && pathMapX[neighbor.x].includes(neighbor.y)){
          snap['i'+index] = 1;
        }else{
          snap['i'+index] = 0;
        }
        index++;
      }
    }
  }
  snap.d = dir;
  snap.s = speed;
  snap.DC = dirChange;
  if(Math.random()<0.05){
    fetch("/saveSnapshot",
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(snap)
    }).then(console.log);
    //console.log(Date.now(), snap);
  }
}

const getNewPos = (pos, dirR, spd) => {
  dirR -= Math.PI/2;
  let x = Math.cos(dirR) * spd + pos.x;
  let y = Math.sin(dirR) * spd + pos.y;
  if(x < 0) x = 0;
  else if(x > maxXY) x = maxXY;
  if(y < 0) y = 0;
  else if(y > maxXY) y = maxXY;
  return {x, y};
}

const draw = () => {
  ctx.clearRect(0, 0, can.width, can.height);
  drawGrid();
  drawPath(path);
  dir = turn();
  pos = getNewPos(pos, dir, speed);
  snapshot(trainingPoints);
  drawCar(pos, 10, dir);
  requestAnimationFrame(draw)
}



requestAnimationFrame(draw)
