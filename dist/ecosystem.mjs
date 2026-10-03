export const W=48,H=40,DAY=30;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const SPECIES={rabbit:{name:'Rabbit',plural:'Rabbits',color:'#ece3c4',diet:'Grass, flowers & berries',role:'Grazer',maxAge:350},fox:{name:'Fox',plural:'Foxes',color:'#e99958',diet:'Rabbits',role:'Predator',maxAge:560},bee:{name:'Bee',plural:'Bees',color:'#f6d86d',diet:'Flower nectar',role:'Pollinator',maxAge:260}};
export function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function noise(x,y,seed){let n=Math.imul(x+seed,374761393)+Math.imul(y,668265263);n=(n^(n>>>13));n=Math.imul(n,1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function smooth(x,y,seed,scale){x/=scale;y/=scale;let ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);let a=noise(ix,iy,seed),b=noise(ix+1,iy,seed),c=noise(ix,iy+1,seed),d=noise(ix+1,iy+1,seed);return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v;}
export class Ecosystem{
 constructor(seed='FERN-204',preset='woodland'){this.reset(seed,preset);}
 random(){let t=this.rng=(this.rng+0x6D2B79F5)>>>0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}
 reset(seed,preset='woodland'){
  this.seed=seed;this.preset=preset;this.rng=hash(seed);this.time=0;this.weather='clear';this.weatherLeft=45;this.nextId=1;this.entities=[];this.cells=[];this.events=[];this.effects=[];this.history=[];this.revision=0;this.plantClock=0;this.historyClock=0;this.rainBoost=0;this.births=0;this.deaths=0;this.pollinations=0;
  const s=hash(seed),shift=(s%200)/31;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   const n=smooth(x,y,s,7),m=smooth(x+32,y+11,s,5),river=W*.56+Math.sin(y*.17+shift)*4+Math.sin(y*.36+shift)*1.7;
   let water=Math.abs(x-river)<(preset==='wetland'?2.4:1.25)||(n<.22&&x>6&&y>6);
   let terrain=water?'water':n>.78&&m>.6?'rock':'land';
   let plant=null;if(terrain==='land'&&preset!=='meadow'&&n>.47&&this.random()<.48)plant='tree';else if(terrain==='land'&&this.random()<.07)plant='shrub';else if(terrain==='land'&&m>.40&&this.random()<.11)plant='flower';
   this.cells.push({x,y,terrain,plant,food:terrain==='land'?.45+this.random()*.55:0,growth:plant?.5+this.random()*.5:0,moisture:water?1:.45+this.random()*.3,fertility:.4+this.random()*.5,pollen:0,decay:0,variant:Math.floor(this.random()*6)});
  }
  this.refreshWater();
  for(const [type,count]of [['rabbit',28],['fox',4],['bee',12]])for(let i=0;i<count;i++){let c;for(let k=0;k<200;k++){c=this.cells[Math.floor(this.random()*this.cells.length)];if(c.terrain==='land'&&c.plant!=='tree')break;}this.spawn(type,c.x,c.y);}
  this.event('A little world begins. What will grow here?','sprout');this.record();
 }
 cell(x,y){return x>=0&&y>=0&&x<W&&y<H?this.cells[Math.floor(y)*W+Math.floor(x)]:null;}
 day(){return Math.floor(this.time/DAY)+1;}
 season(){return ['Spring','Summer','Autumn','Winter'][Math.floor(this.time/(DAY*6))%4];}
 spawn(type,x,y,born=false){if(!SPECIES[type]||this.entities.length>=(this.tweaks?.populationCap||220))return null;const a={id:this.nextId++,type,x,y,px:x,py:y,age:born?0:15+this.random()*60,energy:born?60:65+this.random()*25,cooldown:born?35:15+this.random()*25,moveIn:this.random(),state:'Exploring',facing:this.random()>.5?1:-1,life:1,nectar:0,flight:this.random()*6};this.entities.push(a);if(born){this.births++;this.effects.push({x,y,type:'heart',ttl:1.3});}return a;}
 event(text,type='leaf'){if(this.events[0]?.text===text)return;this.events.unshift({text,type,time:this.time,day:this.day()});this.events=this.events.slice(0,24);}
 refreshWater(){const water=this.cells.filter(c=>c.terrain==='water');for(const c of this.cells){c.nearWater=water.some(w=>Math.abs(c.x-w.x)+Math.abs(c.y-w.y)<4);}}
 counts(){const o={rabbit:0,fox:0,bee:0,tree:0,flower:0,shrub:0,green:0,land:0};for(const a of this.entities)o[a.type]=(o[a.type]||0)+1;for(const c of this.cells){if(c.plant)o[c.plant]=(o[c.plant]||0)+1;if(c.terrain==='land'){o.land++;if(c.food>.3)o.green++;}}o.coverage=Math.round(100*o.green/Math.max(1,o.land));return o;}
 record(){this.history.push({time:this.time,...this.counts()});if(this.history.length>100)this.history.shift();}
 step(dt=.25){
  this.time+=dt;this.weatherLeft-=dt;this.rainBoost=Math.max(0,this.rainBoost-dt);
  if(this.weatherLeft<=0){this.weather=this.random()<.26?'rain':'clear';this.weatherLeft=35+this.random()*65;if(this.weather==='rain')this.event('Rain is replenishing the soil.','rain');}
  const raining=this.weather==='rain'||this.rainBoost>0;let total=this.counts();
  for(const a of [...this.entities]){
   if(a.dead)continue;if(!['rabbit','fox','bee'].includes(a.type)){this.stepExtra?.(a,dt,total);continue;}a.age+=dt;a.cooldown=Math.max(0,a.cooldown-dt);a.moveIn-=dt;
   a.energy-=dt*(a.type==='rabbit'?.54:a.type==='fox'?.18:.19)*(this.tweaks?.hunger||1);
   if(a.energy<=0||a.age>SPECIES[a.type].maxAge){this.remove(a,'natural');continue;}
   if(a.moveIn>0)continue;
   const c=this.cell(a.x,a.y);if(!c)continue;
   if(a.type==='rabbit'){
    const predator=this.nearest(a,this.entities.filter(e=>['fox','wolf','drake'].includes(e.type)&&!e.dead),5);
    if(predator){a.state='Fleeing a fox';this.move(a,predator.x,predator.y,true);a.moveIn=.42;}
    else if(c.food>.18&&a.energy<94){a.state=c.plant==='shrub'?'Eating berries':'Grazing';let food=Math.min(c.food,.14);c.food-=food;a.energy=clamp(a.energy+food*115,0,100);a.moveIn=1.2;if(c.plant==='flower'&&this.random()<.1){c.plant=null;c.growth=0;}}
    else{a.state=a.energy<60?'Looking for food':'Exploring';const target=this.bestCell(a,5,t=>t.terrain==='land'?t.food+(t.plant==='shrub'?.6:0)-(t.plant==='tree'?.6:0):-100);this.move(a,target?.x,target?.y);a.moveIn=.8+this.random()*.3;}
    if(a.energy>78&&a.age>26&&a.cooldown===0&&total.rabbit<Math.min(130,total.land/14)&&this.random()<.17*(this.tweaks?.birthRate??1)){this.spawn('rabbit',a.x,a.y,true);a.energy-=22;a.cooldown=32;total.rabbit++;if(this.random()<.35)this.event('A rabbit was born. More mouths in the meadow.','rabbit');}
   }else if(a.type==='fox'){
    const prey=this.nearest(a,this.entities.filter(e=>e.type==='rabbit'&&!e.dead),10);
    if(prey&&a.energy<89){a.state='Hunting a rabbit';if(Math.hypot(a.x-prey.x,a.y-prey.y)<1.6&&this.random()<.6){this.remove(prey,'hunted');a.energy=clamp(a.energy+32,0,100);a.state='Resting after a meal';a.moveIn=4;this.event('A fox caught a rabbit. The food web shifts.','fox');}else{this.move(a,prey.x,prey.y);a.moveIn=.55;}}
    else{a.state=a.energy>85?'Resting':'Searching for prey';if(a.energy<85||this.random()<.25)this.move(a);a.moveIn=1.4;}
    if(a.energy>83&&a.age>70&&a.cooldown===0&&total.fox<14&&total.rabbit>total.fox*7&&this.random()<.08*(this.tweaks?.birthRate??1)){this.spawn('fox',a.x,a.y,true);a.energy-=28;a.cooldown=90;total.fox++;this.event('A fox cub joins the woodland.','fox');}
   }else{
    if(c.plant==='flower'&&c.growth>.35){a.state='Pollinating';a.energy=clamp(a.energy+10,0,100);if(c.pollen<2){this.pollinations++;this.effects.push({x:a.x,y:a.y,type:'pollen',ttl:1});}c.pollen=18;a.nectar++;a.moveIn=1.7;this.move(a);}
    else{a.state='Seeking flowers';const target=this.bestCell(a,9,t=>t.plant==='flower'?(t.pollen<2?9:2):-1);this.move(a,target?.x,target?.y);a.moveIn=.48;}
    if(a.nectar>15&&a.energy>80&&a.cooldown===0&&total.bee<Math.min(35,total.flower/2)&&this.random()<Math.min(1,this.tweaks?.birthRate??1)){this.spawn('bee',a.x,a.y,true);a.cooldown=50;a.nectar=0;total.bee++;this.event('Flowers are supporting a new bee.','bee');}
   }
  }
  this.entities=this.entities.filter(a=>!a.dead);this.plantClock+=dt;this.historyClock+=dt;
  if(this.plantClock>=2){this.plantClock=0;this.grow(raining);this.revision++;}
  if(this.historyClock>=3){this.historyClock=0;this.record();}
  for(const e of this.effects)e.ttl-=dt;this.effects=this.effects.filter(e=>e.ttl>0).slice(-80);
 }
 nearest(a,list,range){let best=null,dist=range;for(const e of list){const d=Math.hypot(a.x-e.x,a.y-e.y);if(d<dist){dist=d;best=e;}}return best;}
 bestCell(a,range,score){let best=null,val=-Infinity;for(let i=0;i<28;i++){let x=Math.round(a.x+(this.random()*2-1)*range),y=Math.round(a.y+(this.random()*2-1)*range),c=this.cell(x,y);if(!c)continue;let s=score(c)-Math.hypot(a.x-x,a.y-y)*.09+this.random()*.2;if(s>val){val=s;best=c;}}return val>-.5?best:null;}
 move(a,tx,ty,away=false){
  let choices=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const c=this.cell(a.x+dx,a.y+dy);if(!c)continue;const habitat=SPECIES[a.type]?.habitat;if(habitat==='water'?c.terrain!=='water':habitat!=='air'&&a.type!=='bee'&&((c.terrain!=='land'&&c.structure!=='bridge')||c.plant==='tree'||c.lava))continue;if(this.tweaks?.wildfires&&c.fire>0&&habitat!=='air')continue;let s=this.random()*1.7;if(tx!==undefined)s+=(away?1:-1)*Math.hypot(c.x-tx,c.y-ty);choices.push({c,s});}
  choices.sort((a,b)=>b.s-a.s);if(choices[0]){a.px=a.x;a.py=a.y;a.x=choices[0].c.x;a.y=choices[0].c.y;if(a.x!==a.px)a.facing=a.x>a.px?1:-1;}
 }
 remove(a,reason){a.dead=true;this.deaths++;const c=this.cell(a.x,a.y);if(c?.terrain==='land'){c.fertility=clamp(c.fertility+.2);c.decay=18;}if(reason==='natural'&&this.random()<.3)this.event(`${SPECIES[a.type].name} remains return nutrients to the soil.`,'soil');}
 grow(raining){
  const season=this.season(),seasonRate=season==='Winter'?.32:season==='Spring'?1.3:season==='Summer'?.8:1;
  for(const c of this.cells){if(c.terrain!=='land')continue;
   c.moisture=clamp(c.moisture+(raining?.075:c.nearWater?.005:-.009),.08,1);c.pollen=Math.max(0,c.pollen-2);c.decay=Math.max(0,c.decay-2);
   const growth=(.01+c.fertility*.022)*c.moisture*seasonRate*(c.plant==='tree'?.3:1)*(this.tweaks?.growth??1);c.food=clamp(c.food+growth);c.growth=clamp(c.growth+growth*.6);
   if(c.moisture<.16)c.food=Math.max(0,c.food-.014);
   if(c.plant&&c.plant!=='crystal'&&c.growth>.6&&this.random()<(c.plant==='tree'?.013:c.pollen>0?.2:.024)*seasonRate){let t=this.cell(c.x+Math.floor(this.random()*5)-2,c.y+Math.floor(this.random()*5)-2);if(t?.terrain==='land'&&!t.plant&&!t.structure&&t.moisture>.2&&(c.plant!=='tree'||!this.entities.some(a=>a.x===t.x&&a.y===t.y))){t.plant=c.plant;t.growth=.12;t.food=Math.max(t.food,.3);}}
   if(c.plant==='flower'&&c.moisture<.13&&this.random()<.08)c.plant=null;
   if(!c.plant&&!c.structure&&c.fertility>.65&&c.moisture>.5&&this.random()<.0008){c.plant='flower';c.growth=.2;}
  }
 }
 snapshot(){return JSON.stringify({seed:this.seed,preset:this.preset,rng:this.rng,time:this.time,weather:this.weather,weatherLeft:this.weatherLeft,nextId:this.nextId,entities:this.entities,cells:this.cells,events:this.events,history:this.history,rainBoost:this.rainBoost,births:this.births,deaths:this.deaths,pollinations:this.pollinations});}
 restore(data){const state=typeof data==='string'?JSON.parse(data):data;if(!Array.isArray(state.cells)||state.cells.length!==W*H||!Array.isArray(state.entities)||state.entities.length>400||!Number.isFinite(state.time))throw new Error('This world could not be opened.');Object.assign(this,state);this.effects=[];this.plantClock=0;this.historyClock=0;this.revision++;}
 paint(tool,x,y,size=1){
  if(SPECIES[tool]){const c=this.cell(x,y);const habitat=SPECIES[tool].habitat;if(!c||(habitat==='water'?c.terrain!=='water':c.terrain!=='land'&&habitat!=='air')||(habitat!=='air'&&tool!=='bee'&&c.plant==='tree')||c.lava)return {ok:false,message:habitat==='water'?'Fish need water. Choose a river or pond.':'Place this creature on open ground.'};if(this.entities.length>=(this.tweaks?.populationCap||220))return{ok:false,message:'This world is full. Remove some animals first.'};this.spawn(tool,x,y);this.effects.push({x,y,type:'ring',ttl:.8});return{ok:true};}
  let changed=0;for(let dy=-(size-1);dy<=size-1;dy++)for(let dx=-(size-1);dx<=size-1;dx++){if(dx*dx+dy*dy>(size-1)*(size-1)+.3)continue;let c=this.cell(x+dx,y+dy);if(!c)continue;
   if(tool==='water'){if(this.entities.some(a=>a.type!=='bee'&&a.x===c.x&&a.y===c.y))continue;c.terrain='water';c.plant=null;c.food=0;c.moisture=1;changed++;}
   else if(tool==='grass'){c.terrain='land';c.food=1;c.moisture=Math.max(c.moisture,.5);if(c.plant===null)c.growth=0;changed++;}
   else if(tool==='erase'){this.entities=this.entities.filter(a=>a.x!==c.x||a.y!==c.y);c.plant=null;if(c.terrain==='rock')c.terrain='land';changed++;}
   else if(['tree','flower','shrub','mushroom','crystal'].includes(tool)&&c.terrain==='land'){if(tool==='tree'&&this.entities.some(a=>a.type!=='bee'&&a.x===c.x&&a.y===c.y))continue;c.plant=tool;c.growth=.8;c.food=Math.max(c.food,.7);c.moisture=Math.max(.45,c.moisture);changed++;}
  }if(changed){this.revision++;return{ok:true};}return{ok:false,message:tool==='water'?'Animals need dry ground. Try an empty tile.':'Choose open land for plants.'};
 }
 rain(){this.rainBoost=24;this.event('You brought rain. Watch the meadow recover.','rain');}
}
