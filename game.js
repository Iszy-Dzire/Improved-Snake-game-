const Snake = (() => {
  const INITIAL_TAIL = 4;
  let fps = 5, intervalID;
  const tileCount = 20, gridSize = 400 / tileCount;
  const INITIAL_PLAYER = { x:10, y:10 };
  let velocity={x:0,y:0}, player={...INITIAL_PLAYER}, tail=INITIAL_TAIL;
  let trail=[], fruit={x:5,y:5}, points=0, pointsMax=0;
  let grassImg=new Image(), snakeHead=new Image(), snakeBody=new Image(), apple=new Image();
  let eatSound=new Audio('eat.mp3'), dieSound=new Audio('die.mp3');
  let darkMode=true;

  grassImg.src='grass.png'; snakeHead.src='snake_head.png';
  snakeBody.src='snake_body.png'; apple.src='apple.png';
  if(localStorage.topScore) pointsMax=+localStorage.topScore;

  function setup() {
    const c=document.getElementById('gc');
    window.ctx=c.getContext('2d');
    reset();
  }

  function reset(){
    points=0; tail=INITIAL_TAIL;
    player={...INITIAL_PLAYER}; velocity={x:0,y:0};
    trail=[{...player}];
  }

  function RandomFruit(){
    fruit.x=Math.floor(Math.random()*tileCount);
    fruit.y=Math.floor(Math.random()*tileCount);
  }

  function loop(){
    player.x+=velocity.x; player.y+=velocity.y;
    if(player.x<0||player.x>=tileCount||player.y<0||player.y>=tileCount){
      dieSound.play(); reset(); return;
    }
    trail.push({...player});
    if(trail.length>tail) trail.shift();
    if(trail.slice(0,-1).some(p=>p.x===player.x&&p.y===player.y)){
      dieSound.play(); reset(); return;
    }
    if(player.x===fruit.x&&player.y===fruit.y){
      tail++; points++; eatSound.play();
      pointsMax=Math.max(pointsMax,points);
      localStorage.topScore=pointsMax;
      RandomFruit();
      fps = 5 + Math.floor(points/2);
      clearInterval(intervalID);
      intervalID=setInterval(loop,1000/fps);
    }
    draw();
  }

  function draw(){
    const ctx=window.ctx;
    ctx.drawImage(grassImg,0,0,400,400);
    ctx.drawImage(apple, fruit.x*gridSize, fruit.y*gridSize,gridSize,gridSize);
    trail.forEach((seg,i)=>{
      const img= i===trail.length-1 ? snakeHead : snakeBody;
      ctx.drawImage(img, seg.x*gridSize, seg.y*gridSize, gridSize, gridSize);
    });
    ctx.fillStyle=darkMode? '#fff':'#000';
    ctx.fillText(`Score: ${points}`,10,20);
    ctx.fillText(`Top: ${pointsMax}`,10,40);
  }

  function action(dir){
    const oppos = { up:'down', down:'up', left:'right', right:'left' };
    if(dir!==oppos[last]) {
      velocity = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] }[dir];
      last = dir;
    }
  }
  let last=null;

  return {
    start(){ setup(); intervalID=setInterval(loop,1000/fps); },
    action, reset,
    toggleTheme(){ darkMode=!darkMode; }
  };
})();

window.onload = () => {
  Snake.start();
  document.getElementById('upBtn').onclick = ()=>Snake.action('up');
  document.getElementById('leftBtn').onclick = ()=>Snake.action('left');
  document.getElementById('downBtn').onclick = ()=>Snake.action('down');
  document.getElementById('rightBtn').onclick = ()=>Snake.action('right');
  document.getElementById('themeToggle').onclick = ()=>Snake.toggleTheme();
};
