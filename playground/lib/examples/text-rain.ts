import { ShowcaseExample } from './types';

export const textRainExample: ShowcaseExample = {
  id: 'text-rain',
  title: 'text-rain',
  description: 'Warp-based melting text effect without any font library',
  category: 'text',
  useDarkCanvas: false,
  code: `
import { init } from '@thorvg/webcanvas';

const W=600;
const H=600;
const FONT_SIZE = 32;
const GRAVITY = 9.8; 

const TVG = await init({
  renderer: 'gl',
  locateFile: (path) => '/webcanvas/' + path.split('/').pop()
});

class Drop{
  constructor(TVG, char){
     this.text=new TVG.Text();
     this.text.font('default')
      .text(char)
      .fontSize(FONT_SIZE)
      .fill(255,255,255)
      .outline(2,0,0,0);
     this.respawn(true);
  }

  respawn(randomY) {
    this.x = Math.random() * (W - FONT_SIZE);
    this.y=randomY ? Math.random() * H : -FONT_SIZE;
    this.vy = 60+Math.random()*200;
  }
  
  update(dt) {
    this.vy += GRAVITY * dt;
    this.y += this.vy * dt;
    if (this.y > H) {
      this.respawn(false);
    }
    this.text.translate(this.x, this.y);
  }

}

const canvas = new TVG.Canvas('#canvas', {
  width: W,
  height: H,
});


const drops='THORVG'.repeat(3).split('').map(char=>(new Drop(TVG,char)))
for (const d of drops) canvas.add(d.text);

const start = Date.now();

let interval=1000/60;
let now,delta;
let then=Date.now()

function animate() {
  requestAnimationFrame(animate)

  now=Date.now()
  delta=now-then;
  if(delta<interval) return


  for (const d of drops) d.update(interval/1000);

  canvas.update();
  canvas.render();

  then=now-(delta%interval)

}
animate()

`,
};
