import { W,H,SPECIES } from './ecosystem.mjs';
import { ENVIRONMENTS,THEMES } from './experiments.mjs';
import { sprite } from './pixels.mjs';

export function groundColor(c,world){
 const environment=ENVIRONMENTS[world.environment]||ENVIRONMENTS.woodland;
 if(c.lava)return '#713e35';
 if(c.terrain==='rock')return world.theme==='fantasy'?'#81758a':'#667064';
 if(c.ash>.5)return c.food>.35?'#798158':'#665f50';
 if(c.food<.25&&world.theme==='natural')return world.environment==='desert'?'#bca76d':world.environment==='tundra'?'#abb8b0':['#8b8a5b','#83825a','#898859','#858454','#8b875f','#8d875c'][c.variant];
 return (THEMES[world.theme]?.tint||environment.grass)[c.variant];
}
export function waterColor(world){return world.theme==='fantasy'?'#65638c':world.theme==='nocturne'?'#355b79':ENVIRONMENTS[world.environment]?.water||'#397d88';}
export function shoreColor(world){return world.theme==='fantasy'?'#a69ca7':ENVIRONMENTS[world.environment]?.shore||'#a4a36b';}
export function softShadow(ctx,x,y,pixel,strength=1,setting=.6){
 // A stepped, dithered oval; the underlying grass remains exactly the same.
 for(const [row,start,width,opacity] of [[10,6,5,.03],[11,4,9,.075],[12,3,11,.09],[13,4,9,.055],[14,6,5,.02]]){
  ctx.fillStyle=`rgba(16,40,28,${opacity*strength*setting})`;
  ctx.fillRect(x+start*pixel,y+row*pixel,width*pixel,pixel);
 }
 ctx.fillStyle=`rgba(16,40,28,${.025*strength*setting})`;
 for(const[dx,dy]of [[2,12],[4,10],[13,11],[12,14],[5,14]])ctx.fillRect(x+dx*pixel,y+dy*pixel,pixel,pixel);
}
function glow(ctx,x,y,r,color,opacity=.2){ctx.save();const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.globalAlpha=opacity;ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();}
export function drawDetails(ctx,world,{p,ox,oy,cssW,cssH},t,reduced,layer='front'){
 const pixel=p/16,visible=c=>ox+c.x*p>-p&&ox+c.x*p<cssW+p&&oy+c.y*p>-p&&oy+c.y*p<cssH+p;
 if(layer==='ground'){
  for(const c of world.cells){if(!visible(c))continue;const x=ox+c.x*p,y=oy+c.y*p;
   if(c.structure)sprite(ctx,c.structure,x,y,p);
   if(c.tilled){ctx.fillStyle='#634e423b';ctx.fillRect(x+4*pixel,y+10*pixel,6*pixel,pixel);ctx.fillRect(x+5*pixel,y+13*pixel,7*pixel,pixel);}
   if(c.lava){ctx.fillStyle='#e57844';ctx.fillRect(x+4*pixel,y,4*pixel,16*pixel);ctx.fillStyle='#f5bf69';ctx.fillRect(x+5*pixel,y+3*pixel,2*pixel,7*pixel);}
  }
  if(world.tweaks.lore)for(const l of world.landmarks){if(!visible(l))continue;if(world.tweaks.fogOfWar&&world.player?.enabled&&!world.seen[l.y*W+l.x])continue;const x=ox+l.x*p,y=oy+l.y*p;softShadow(ctx,x,y,pixel,1,world.tweaks.shadow);sprite(ctx,l.type==='spring'?'water':l.type==='crater'?'crystal':l.type==='monolith'?'sanctuary':'ruin',x,y,p);if(!l.found){ctx.fillStyle='#f9dda1';ctx.fillRect(x+7*pixel,y-4*pixel,2*pixel,3*pixel);ctx.fillRect(x+7*pixel,y,2*pixel,pixel);}}
  return;
 }
 for(const c of world.cells){if(!visible(c))continue;const x=ox+c.x*p,y=oy+c.y*p;
  if(c.luminous||c.plant==='crystal')glow(ctx,x+p/2,y+p/2,p*.8,c.plant==='crystal'?'#a8c3ff':'#d8b8ec',.2);
  if(c.fire>0){const flicker=reduced?0:Math.floor(t*7+c.x)%3;ctx.fillStyle='#db6b42';ctx.fillRect(x+4*pixel,y+(6+flicker)*pixel,8*pixel,(8-flicker)*pixel);ctx.fillStyle='#ffc068';ctx.fillRect(x+6*pixel,y+(3+flicker)*pixel,4*pixel,10*pixel);ctx.fillStyle='#ffe2a0';ctx.fillRect(x+7*pixel,y+8*pixel,2*pixel,5*pixel);if(!reduced&&world.tweaks.particles>0){ctx.fillStyle='#d2c9af60';ctx.fillRect(x+(6+flicker)*pixel,y-5*pixel,2*pixel,3*pixel);}}
 }
 for(const a of world.entities)if(['wisp','firefly'].includes(a.type)&&visible(a))glow(ctx,ox+(a.x+.5)*p,oy+(a.y+.4)*p,p*.8,a.type==='wisp'?'#9db9ff':'#dcf6a2',reduced?.17:.17+Math.sin(t*3+a.id)*.04);
 const player=world.player;
 if(player?.enabled){
  if(!player.render){player.render={x:player.x,y:player.y};}player.render.x+=((player.x)-player.render.x)*(reduced?1:.25);player.render.y+=((player.y)-player.render.y)*(reduced?1:.25);
  const x=ox+player.render.x*p,y=oy+player.render.y*p;
  ctx.fillStyle='#eae2b34d';ctx.fillRect(x+3*pixel,y+13*pixel,10*pixel,2*pixel);sprite(ctx,'wanderer',x,y,p,0,player.facing.x<0);
  ctx.fillStyle='#eee4ad';ctx.fillRect(x+7*pixel,y-3*pixel,2*pixel,2*pixel);
  if(player.path.length){ctx.fillStyle='#ecebc176';for(const c of player.path.slice(0,60))ctx.fillRect(ox+(c.x+.45)*p,oy+(c.y+.45)*p,2*pixel,2*pixel);}
  if(world.tweaks.fogOfWar)for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){if(!visible({x:xx,y:yy}))continue;const seen=world.seen[yy*W+xx],dist=Math.hypot(xx-player.x,yy-player.y);if(!seen||dist>6){ctx.fillStyle=!seen?'#152a2cf5':'#152a2c55';ctx.fillRect(ox+xx*p,oy+yy*p,p+.5,p+.5);}}
 }
 const weather=world.currentWeather();
 if(weather==='snow'&&!reduced){ctx.fillStyle='#eff5eab5';for(let i=0;i<70;i++){const x=(i*83+Math.sin(t+i)*8+t*5)%cssW,y=(i*47+t*22)%cssH;ctx.fillRect(x,y,2,2);}}
 if(weather==='fog'){ctx.fillStyle='#c2d2c030';ctx.fillRect(0,0,cssW,cssH);if(!reduced){for(let i=0;i<5;i++){const x=(i*193+t*5)%(cssW+200)-100;const grad=ctx.createLinearGradient(x,0,x+140,0);grad.addColorStop(0,'transparent');grad.addColorStop(.5,'#c2d2c020');grad.addColorStop(1,'transparent');ctx.fillStyle=grad;ctx.fillRect(x,0,140,cssH);}}}
 if(weather==='drought'){ctx.fillStyle='#dbaa5a13';ctx.fillRect(0,0,cssW,cssH);}
 if(weather==='aurora'){const grad=ctx.createLinearGradient(0,0,cssW,cssH);grad.addColorStop(0,'#9ea9ff26');grad.addColorStop(.5,'#8adbbb12');grad.addColorStop(1,'#d699dd26');ctx.fillStyle=grad;ctx.fillRect(0,0,cssW,cssH);if(!reduced){ctx.fillStyle='#e4d8ffaa';for(let i=0;i<25;i++){const x=(i*127.3)%cssW,y=(i*83.7+t*4)%cssH;if(Math.sin(t+i)>.3)ctx.fillRect(x,y,2,2);}}}
 if(world.flash>0&&!reduced){ctx.fillStyle=`rgba(245,228,204,${world.flash})`;ctx.fillRect(0,0,cssW,cssH);}
}
