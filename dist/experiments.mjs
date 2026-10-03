import { Ecosystem, W, H, DAY, SPECIES, hash } from './ecosystem.mjs';

export const EXTRA_SPECIES = {
 deer: {name:'Deer',plural:'Deer',color:'#d6af78',diet:'Grass and berries',role:'Seed carrier',maxAge:480,description:'Grazes, flees wolves, and carries berry seeds to new ground.'},
 wolf: {name:'Wolf',plural:'Wolves',color:'#a7bdc8',diet:'Deer and rabbits',role:'Pack hunter',maxAge:580,description:'Hunts grazers. Sanctuary wards repel it.'},
 boar: {name:'Boar',plural:'Boars',color:'#c08d78',diet:'Roots and mushrooms',role:'Soil engineer',maxAge:460,description:'Roots up plants, enriching soil and exposing space for new growth.'},
 frog: {name:'Frog',plural:'Frogs',color:'#b3d778',diet:'Bees and fireflies',role:'Wetland hunter',maxAge:330,description:'Stays near water and hunts insects. Can reduce pollination.'},
 fish: {name:'Fish',plural:'Fish',color:'#8ad0d6',diet:'Aquatic nutrients',role:'River dweller',maxAge:350,habitat:'water',description:'Lives in water, reproduces in healthy pools, and follows floods.'},
 beetle: {name:'Beetle',plural:'Beetles',color:'#cfaa78',diet:'Decaying remains',role:'Decomposer',maxAge:300,description:'Recycles remains into fertile soil; fungi follow in its footsteps.'},
 firefly: {name:'Firefly',plural:'Fireflies',color:'#e1f89d',diet:'Mushroom spores',role:'Night pollinator',maxAge:260,habitat:'air',description:'Feeds on fungi and pollinates nearby flowers, glowing at night.'},
 slime: {name:'Slime',plural:'Slimes',color:'#91dcad',diet:'Mushrooms and remains',role:'Spore disperser',maxAge:440,fantasy:true,description:'Absorbs remains, spreads mushrooms, and divides when well fed.'},
 wisp: {name:'Wisp',plural:'Wisps',color:'#a4c7ff',diet:'Crystal resonance',role:'Arcane pollinator',maxAge:500,habitat:'air',fantasy:true,description:'Feeds at crystals and encourages luminous flowers nearby.'},
 drake: {name:'Ember drake',plural:'Drakes',color:'#ecaa76',diet:'Deer, boars and rabbits',role:'Fire predator',maxAge:700,fantasy:true,description:'Hunts large prey and ignites dry ground. Rain tames its fire.'}
};
Object.assign(SPECIES, EXTRA_SPECIES);

export const ENVIRONMENTS = {
 woodland:{name:'Woodland',description:'Mixed forest, river, and clearings.',grass:['#6d8c4c','#718f50','#6a894a','#6b8b4b','#708e4f','#6e8b4e'],water:'#397d88',shore:'#a4a36b'},
 meadow:{name:'Meadow',description:'Open grass and flowers. A grazer’s paradise.',grass:['#7b9957','#7d9b58','#789753','#7b9954','#7a9855','#7d9a58'],water:'#498b96',shore:'#b2ad75'},
 wetland:{name:'Wetland',description:'Wide channels, frogs, fish, and fertile mud.',grass:['#577c56','#5b7f58','#567b55','#577c53','#5d8058','#587c56'],water:'#386b78',shore:'#80966a'},
 desert:{name:'Dune sea',description:'Sparse oases and scarce food. Rain changes everything.',grass:['#b8a66e','#baa76f','#b7a46b','#b9a56d','#bbaa74','#b6a36a'],water:'#498f97',shore:'#d8c188'},
 tundra:{name:'Tundra',description:'Slow growth, snow, and hardy islands of green.',grass:['#9cafa7','#a0b2aa','#97ada3','#9aaea4','#a2b4aa','#9cafaa'],water:'#547f95',shore:'#bcc8bc'},
 archipelago:{name:'Archipelago',description:'Disconnected islands. Bridges make new routes.',grass:['#63936a','#66986d','#68966a','#659367','#67976d','#629268'],water:'#367f94',shore:'#d1c18a'},
 volcanic:{name:'Ashlands',description:'Hot fissures and rich ash. Rebirth follows destruction.',grass:['#706756','#746a58','#6e6553','#706756','#756b58','#706653'],water:'#516d76',shore:'#a1936f'},
 ancient:{name:'Elder forest',description:'Old growth, fungi, ruins, and hidden stories.',grass:['#527752','#567b55','#517451','#537753','#597e58','#547954'],water:'#456d7f',shore:'#8b9a74'}
};
export const THEMES={natural:{name:'Naturalist',description:'Wildlife and grounded ecology.',tint:null},fantasy:{name:'Feywild',description:'Violet woods, living spores, wisps, and ember drakes.',tint:['#726997','#796d9e','#716491','#776a99','#7a6e9e','#736693']},nocturne:{name:'Moon garden',description:'A blue-green world of luminous life.',tint:['#466f71','#4b7477','#456e71','#487174','#4c7678','#487175']},copper:{name:'Copper age',description:'Rust-coloured wilds and lost settlements.',tint:['#988357','#9c865a','#958054','#978357','#9d885d','#988255']}};
export const WEATHERS={clear:'Clear skies',rain:'Rain',storm:'Thunderstorm',fog:'Fog',snow:'Snowfall',drought:'Drought',aurora:'Aurora'};
export const SCENARIOS=[
 {id:'rewild',name:'Return of the wolves',description:'A crowded meadow, eight deer, and three wolves. Watch grazing pressure change.'},
 {id:'phoenix',name:'Life after fire',description:'Dry woodland meets a wildfire. Bring rain, then look for flowers in the ash.'},
 {id:'fey',name:'The waking forest',description:'Crystals feed wisps; remains feed slimes; fungi feed fireflies. Enter as a wanderer.'},
 {id:'flood',name:'The river remembers',description:'A wetland flood opens new water for fish. Its banks eventually return.'},
 {id:'islands',name:'The bridge keeper',description:'Explore islands, salvage timber, and connect the fragments of a lost civilisation.'}
];
const limit=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const DEFAULTS={extraLife:false,lore:false,wildfires:true,autoDisasters:false,growth:1,hunger:1,birthRate:1,populationCap:220,shadow:.6,particles:1,shake:true,sound:false,haptics:false,follow:true,fogOfWar:false};
const OLD_NAMES=['The Hollow Choir','Mosswatch','The Ninth Garden','The Glass Orchard','Lastwater','The Unwritten House','The Lantern Fold','The Ash Archive'];
const LORE=[
 ['ruin','Broken aqueduct','The people of {name} built channels before they built walls. Their last inscription reads: “Leave a little water for what comes after.”','seed'],
 ['spring','Listening spring','At {name}, the keepers judged a season by the return of frogs. Their ledger has no kings in it; only rain and absences.','vitality'],
 ['monolith','Root-bound monolith','The stone at {name} bears a fox above a rabbit above a blade of grass. One life is never written alone.','insight'],
 ['grove','Seed vault','Beneath {name}, a clay jar preserves seeds from a forest that burned. Someone planned for a world they would never see.','seed'],
 ['observatory','Fallen observatory','The astronomers of {name} called the aurora “the long flowering”. Their diagrams show crystals, moths, and a sky with roots.','crystal'],
 ['archive','Weather archive','The records at {name} show a river changing course seven times. Each map was accurate. None was permanent.','wood'],
 ['burrow','Abandoned hearth','At {name}, a tiny door opens onto a cold hearth. A scratched note says: “We moved where the berries went.”','wood'],
 ['crater','Star scar','The oldest tale of {name} begins after the ending: ash, then rain, then one impossible flower.','crystal']
];

export class ExperimentWorld extends Ecosystem {
 reset(seed,preset='woodland'){
  const tweaks={...DEFAULTS,...this.tweaks},theme=this.theme||'natural';
  super.reset(seed,preset);this.tweaks=tweaks;this.theme=theme;this.environment=preset in ENVIRONMENTS?preset:'woodland';
  this.climate=null;this.weatherClock=0;this.hazardClock=0;this.shake=0;this.flash=0;this.journal=[];this.milestones=[];this.landmarks=[];this.structures=[];this.player=null;this.seen=Array(W*H).fill(false);this.notice=null;this.noticeId=0;this.biomeAdjusted=false;
  this.adaptEnvironment();this.createLandmarks();
  if(tweaks.extraLife)this.populate();
  this.history=[];this.record();
 }
 adaptEnvironment(){
  const env=this.environment;
  for(const c of this.cells){c.fire=0;c.ash=0;c.lava=false;c.structure=null;c.resonance=0;
   if(env==='desert'&&c.terrain==='land'){c.moisture=.12;c.food=.12;if(c.plant&&this.random()<.92)c.plant=null;if(c.nearWater){c.moisture=.7;c.food=.7;if(this.random()<.09)c.plant='shrub';}}
   if(env==='tundra'&&c.terrain==='land'){c.moisture=.45;c.food=.35;if(c.plant==='flower'&&this.random()<.7)c.plant=null;}
   if(env==='archipelago'){const n=Math.sin(c.x*.43)+Math.cos(c.y*.43)+Math.sin((c.x+c.y)*.23);if(n<.35){c.terrain='water';c.plant=null;c.food=0;c.moisture=1;}else if(c.terrain==='water'){c.terrain='land';c.food=.8;c.moisture=.7;}}
   if(env==='volcanic'&&c.terrain==='land'){c.moisture=.18;c.food=.3;c.fertility=.95;if(this.random()<.7)c.plant=null;if((c.x*3+c.y*7)%43<2){c.lava=true;c.plant=null;c.food=0;}}
   if(env==='ancient'&&c.terrain==='land'){c.moisture=.8;if(!c.plant&&this.random()<.15){c.plant='mushroom';c.growth=.8;}}
  }
  this.refreshWater();for(const a of this.entities)if(!this.validHabitat(a.type,this.cell(a.x,a.y)))this.relocate(a);this.revision++;
 }
 validHabitat(type,c){if(!c||c.lava)return false;const habitat=SPECIES[type]?.habitat;return habitat==='water'?c.terrain==='water':habitat==='air'?true:c.terrain==='land'&&c.plant!=='tree';}
 relocate(a){const cells=this.cells.filter(c=>this.validHabitat(a.type,c));if(!cells.length){a.dead=true;return;}cells.sort((u,v)=>distance(a,u)-distance(a,v));a.x=cells[0].x;a.y=cells[0].y;a.px=a.x;a.py=a.y;}
 addSpecies(type,count=1,near=null){if(!SPECIES[type])return 0;let spots=this.cells.filter(c=>this.validHabitat(type,c));if(near)spots=spots.filter(c=>distance(c,near)<9);if(!spots.length)return 0;let n=0;for(let i=0;i<count;i++){const c=spots[Math.floor(this.random()*spots.length)];if(this.spawn(type,c.x,c.y))n++;}return n;}
 populate(){
  for(const[type,n]of [['deer',8],['wolf',3],['boar',4],['frog',8],['fish',14],['beetle',9],['firefly',10]])this.addSpecies(type,n);
  for(const c of this.cells)if(c.terrain==='land'&&!c.plant&&c.moisture>.4&&this.random()<.07){c.plant='mushroom';c.growth=.8;}
  if(this.theme==='fantasy')this.addMagic();this.revision++;
 }
 addMagic(){for(const c of this.cells)if(c.terrain==='land'&&!c.plant&&this.random()<.03){c.plant='crystal';c.growth=.8;c.resonance=1;}for(const[type,n]of [['wisp',7],['slime',6],['drake',2]])this.addSpecies(type,n);this.revision++;}
 nearest(a,list,range){return super.nearest(a,list,this.currentWeather()==='fog'?range*.65:range);}
 currentWeather(){return this.rainBoost>0?'rain':this.climate?.type||this.weather;}
 setWeather(type,duration=45){if(!(type in WEATHERS))return{ok:false,message:'Choose a weather condition from the menu.'};this.climate={type,remaining:duration};this.rainBoost=0;this.event(`${WEATHERS[type]} settles over the ${ENVIRONMENTS[this.environment].name.toLowerCase()}.`,'rain');return{ok:true};}
 grow(raining){
  const weather=this.currentWeather();super.grow(raining||['rain','storm'].includes(weather));
  for(const c of this.cells){if(c.terrain!=='land')continue;
   if(weather==='drought'){c.moisture=Math.max(.02,c.moisture-.045);c.food=Math.max(0,c.food-.025);}
   if(weather==='snow'){c.food=Math.max(0,c.food-.018);c.moisture=limit(c.moisture+.015);}
   if(c.plant==='mushroom'&&c.decay>0){c.growth=limit(c.growth+.1);c.food=limit(c.food+.1);}
   if(c.plant==='crystal')c.resonance=limit((c.resonance||0)+(weather==='aurora'?.12:.01));
   if(c.ash>0&&!c.fire){c.fertility=limit(c.fertility+.008);if(c.moisture>.4&&!c.plant&&this.random()<.018){c.plant='flower';c.growth=.25;c.luminous=weather==='aurora';this.milestone('ash-bloom','The ash garden','Flowers have returned to burned ground. Rain and enriched soil made room for recovery.');}}
   if(c.structure==='sanctuary'){for(const n of this.cells)if(distance(c,n)<3&&n.terrain==='land'){n.moisture=limit(n.moisture+.06);n.food=limit(n.food+.04);}}
  }
 }
 stepExtra(a,dt,total){
  a.age+=dt;a.moveIn-=dt;a.cooldown=Math.max(0,a.cooldown-dt);a.energy-=dt*.25*this.tweaks.hunger;
  const c=this.cell(a.x,a.y);if(!c)return;if(a.energy<=0||a.age>SPECIES[a.type].maxAge){this.remove(a,'natural');return;}
  if(a.type==='fish'&&c.terrain!=='water'){this.relocate(a);return;}if(a.moveIn>0)return;a.moveIn=.8;
  if(a.type==='deer'){
   const enemy=this.nearest(a,this.entities.filter(v=>['wolf','drake'].includes(v.type)&&!v.dead),7);
   if(enemy){this.move(a,enemy.x,enemy.y,true);a.state='Fleeing a predator';a.moveIn=.45;}
   else if(c.food>.25&&a.energy<90){c.food-=.12;a.energy=limit(a.energy+15,0,100);a.state='Grazing';if(c.plant==='shrub')a.carryingSeed=true;}
   else{this.move(a);a.state='Carrying seeds';if(a.carryingSeed&&!c.plant&&c.moisture>.35&&this.random()<.2){c.plant='shrub';c.growth=.2;a.carryingSeed=false;this.revision++;this.milestone('seed-traveller','The travelling orchard','A deer carried a berry seed into a new clearing. Grazers also help a forest travel.');}}
  }else if(['wolf','drake'].includes(a.type)){
   const ward=this.cells.find(v=>v.structure==='sanctuary'&&distance(v,a)<5);
   const prey=this.nearest(a,this.entities.filter(v=>['rabbit','deer',...(a.type==='drake'?['boar']:[])].includes(v.type)&&!v.dead),11);
   if(ward){this.move(a,ward.x,ward.y,true);a.state='Avoiding a sanctuary';}
   else if(prey&&a.energy<90){if(distance(a,prey)<1.6){this.remove(prey,'hunted');a.energy=limit(a.energy+34,0,100);a.moveIn=3;this.event(`${SPECIES[a.type].name} caught a ${SPECIES[prey.type].name.toLowerCase()}.`,'leaf');}else{this.move(a,prey.x,prey.y);a.moveIn=.5;}a.state='Stalking prey';}
   else{this.move(a);a.state='Patrolling';}
   if(a.type==='drake'&&c.moisture<.38&&this.random()<.08&&this.tweaks.wildfires)this.ignite(c.x,c.y);
  }else if(a.type==='boar'){
   if(c.food>.25&&a.energy<94){c.food-=.15;c.fertility=limit(c.fertility+.08);a.energy=limit(a.energy+17,0,100);if(c.plant!=='tree'&&c.plant!=='crystal')c.plant=null;c.tilled=true;a.state='Rooting up soil';this.revision++;}else{this.move(a);a.state='Foraging';}
  }else if(a.type==='frog'){
   const prey=this.nearest(a,this.entities.filter(v=>['bee','firefly'].includes(v.type)&&!v.dead),4);
   if(prey&&c.nearWater&&a.energy<90){if(distance(a,prey)<1.6){this.remove(prey,'hunted');a.energy=limit(a.energy+26,0,100);}else this.move(a,prey.x,prey.y);a.state='Hunting insects';}
   else{const spot=this.bestCell(a,5,n=>n.nearWater?5:-1);this.move(a,spot?.x,spot?.y);a.state='Seeking a riverbank';if(c.nearWater)a.energy=limit(a.energy+1,0,100);}
  }else if(a.type==='fish'){this.move(a);a.state='Feeding in the current';a.energy=limit(a.energy+(this.currentWeather()==='drought'?.2:2),0,100);a.moveIn=.65;}
  else if(['beetle','slime'].includes(a.type)){
   if(c.decay>0||c.plant==='mushroom'){c.decay=Math.max(0,c.decay-4);c.fertility=limit(c.fertility+.06);a.energy=limit(a.energy+14,0,100);a.state='Recycling nutrients';if(!c.plant&&c.moisture>.25){c.plant='mushroom';c.growth=.3;}else if(a.type==='slime'&&this.random()<.3)c.plant=null;this.revision++;}
   else{const target=this.bestCell(a,7,n=>n.decay>0?12:n.plant==='mushroom'?9:-1);this.move(a,target?.x,target?.y);a.state='Seeking fallen life';}
  }else if(a.type==='firefly'){
   if(c.plant==='mushroom'){a.energy=limit(a.energy+12,0,100);a.state='Drifting through spores';for(const n of this.cells)if(n.plant==='flower'&&distance(a,n)<2){n.pollen=20;this.pollinations++;}}
   else{const target=this.bestCell(a,8,n=>n.plant==='mushroom'?10:-1);this.move(a,target?.x,target?.y);a.state='Seeking fungi';}a.moveIn=.65;
  }else if(a.type==='wisp'){
   if(c.plant==='crystal'){a.energy=limit(a.energy+12,0,100);c.resonance=Math.max(0,(c.resonance||0)-.1);a.state='Drinking starlight';const n=this.cell(a.x+Math.floor(this.random()*5)-2,a.y+Math.floor(this.random()*5)-2);if(n?.terrain==='land'&&!n.plant){n.plant='flower';n.luminous=true;n.growth=.3;this.revision++;this.milestone('star-garden','A garden of borrowed stars','A wisp carried a crystal’s resonance into living flowers. The grove now glows after dark.');}this.move(a);}
   else{const target=this.bestCell(a,10,n=>n.plant==='crystal'?12:-1);this.move(a,target?.x,target?.y);a.state='Seeking resonance';}
  }
  const caps={deer:35,wolf:12,boar:18,frog:22,fish:45,beetle:30,firefly:30,slime:25,wisp:20,drake:5};
  if(a.energy>85&&a.age>30&&a.cooldown===0&&(total[a.type]||0)<caps[a.type]&&this.random()<.08*this.tweaks.birthRate){const child=this.spawn(a.type,a.x,a.y,true);if(child){a.energy-=25;a.cooldown=45;total[a.type]=(total[a.type]||0)+1;}}
 }
 step(dt=.25){
  if(this.climate){this.climate.remaining-=dt;if(this.climate.remaining<=0){this.event('The weather passes. Its effects remain.','sun');this.climate=null;}}
  super.step(dt);this.shake=Math.max(0,this.shake-dt*10);this.flash=Math.max(0,this.flash-dt*2);
  this.hazardClock+=dt;
  if(this.hazardClock>=1){this.hazardClock=0;this.hazards();}
  if(this.tweaks.autoDisasters&&this.random()<dt*.0015)this.disaster(['fire','flood','meteor'][Math.floor(this.random()*3)]);
  if(this.currentWeather()==='storm'&&this.random()<dt*.04){const c=this.cells[Math.floor(this.random()*this.cells.length)];this.flash=.1;this.shake=1;if(c.terrain==='land'&&c.moisture<.65)this.ignite(c.x,c.y);}
  if(this.player?.enabled)this.stepPlayer(dt);
 }
 ignite(x,y){const c=this.cell(x,y);if(!c||c.terrain!=='land'||c.moisture>.8||c.structure==='sanctuary')return false;c.fire=7+this.random()*5;this.revision++;return true;}
 hazards(){
  const rain=['rain','storm'].includes(this.currentWeather());let waterChanged=false;
  for(const c of this.cells){if(c.flooded){c.flooded.remaining--;if(c.flooded.remaining<=0){c.terrain='land';c.moisture=1;c.fertility=limit(c.fertility+.15);c.food=.35;c.plant=null;delete c.flooded;waterChanged=true;}}
   if(c.fire>0){c.fire-=rain?3:1;c.ash=1;c.food=0;c.plant=null;c.moisture=Math.max(0,c.moisture-.1);c.fertility=limit(c.fertility+.01);
    for(const a of this.entities)if(distance(c,a)<1.3&&a.type!=='drake'&&SPECIES[a.type]?.habitat!=='air'){a.energy-=12;a.state='Escaping fire';this.move(a);}
    if(!rain&&this.tweaks.wildfires)for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const n=this.cell(c.x+dx,c.y+dy);if(n?.terrain==='water')this.milestone('firebreak','The river held','A fire reached the river and could not cross. Water protected the far bank.');if(n?.terrain==='land'&&n.fire<=0&&n.ash<.5&&n.moisture<.55&&this.random()<.17)this.ignite(n.x,n.y);}
    if(rain&&c.fire<=0)this.milestone('rain-fire','Rain over embers','Rain extinguished a living fire. The enriched ash is waiting for seeds.');this.revision++;
   }
  }
  if(waterChanged){this.refreshWater();this.revision++;}
  this.entities=this.entities.filter(a=>!a.dead);
 }
 disaster(type,position=null){
  const land=this.cells.filter(c=>c.terrain==='land'&&!c.lava);const center=position&&this.cell(position.x,position.y)?.terrain==='land'?this.cell(position.x,position.y):land[Math.floor(this.random()*land.length)];if(!center)return{ok:false,message:'This event needs some land.'};
  if(type==='fire'){for(const c of land)if(distance(c,center)<2.5){c.moisture=.15;this.ignite(c.x,c.y);}this.log('Wildfire','A dry patch ignited. Moisture and water will decide how far it travels.','fire');}
  else if(type==='flood'){for(const c of land)if(c.nearWater&&this.random()<.4){c.flooded={remaining:45};c.terrain='water';c.plant=null;c.food=0;}this.setWeather('storm',32);this.refreshWater();for(const a of this.entities)if(!this.validHabitat(a.type,this.cell(a.x,a.y)))this.relocate(a);this.addSpecies('fish',8);this.log('The banks disappear','Floodwater opens new routes for fish. The banks will return in 45 world seconds.','rain');}
  else if(type==='meteor'){for(const c of this.cells)if(distance(c,center)<3){c.terrain='land';c.food=0;c.plant=null;c.ash=1;c.fertility=.95;this.ignite(c.x,c.y);}center.plant='crystal';center.growth=1;center.fire=0;center.resonance=1;this.landmarks.push({id:`meteor-${this.time}`,x:center.x,y:center.y,type:'crater',name:'The New Star',text:'You saw this history happen. The stone is still warm; already the world is finding a use for it.',reward:'crystal',found:false});this.shake=5;this.flash=.12;this.log('A new star falls','A meteor left a crystal, fertile ash, and a new place to discover.','meteor');}
  else if(type==='quake'){for(const c of land)if(distance(c,center)<7&&this.random()<.2){c.plant=null;c.structure=null;c.terrain=this.random()<.4?'rock':'land';c.fertility=.8;}for(const a of this.entities)if(!this.validHabitat(a.type,this.cell(a.x,a.y)))this.relocate(a);this.shake=7;this.log('The ground remembers','An earthquake broke vegetation and structures, exposing new stone.','quake');}
  else if(type==='spores'){for(const c of land)if(distance(c,center)<8&&!c.plant&&this.random()<.4){c.plant='mushroom';c.moisture=.8;c.growth=.7;}this.addSpecies('firefly',8,center);this.addSpecies('beetle',5,center);this.log('A thousand small lanterns','A spore bloom feeds fungi, decomposers, and fireflies.','spores');}
  else return{ok:false,message:'Choose an event from the dev menu.'};
  this.revision++;return{ok:true,x:center.x,y:center.y};
 }
 log(title,text,kind='discovery'){const entry={title,text,kind,day:this.day(),time:this.time};this.journal.unshift(entry);this.journal=this.journal.slice(0,80);this.notice={...entry,id:++this.noticeId};this.event(`${title}. ${text}`,'leaf');}
 milestone(id,title,text){if(this.milestones.includes(id))return;this.milestones.push(id);this.log(title,text,'outcome');if(this.player){this.player.insight++;this.player.seeds+=2;}}
 createLandmarks(){
  const points=[[7,7],[23,6],[39,8],[8,20],[36,22],[10,34],[26,32],[41,34]];
  points.forEach(([x,y],i)=>{const candidates=this.cells.filter(c=>c.terrain==='land'&&!c.lava).sort((a,b)=>distance(a,{x,y})-distance(b,{x,y}));const c=candidates[0];if(!c)return;c.plant=null;c.food=Math.max(.4,c.food);const [type,label,text,reward]=LORE[i];const name=OLD_NAMES[(i+hash(this.seed))%OLD_NAMES.length];this.landmarks.push({id:`landmark-${i}`,x:c.x,y:c.y,type,name:`${name} · ${label}`,text:text.replaceAll('{name}',name),reward,found:false});});
 }
 enablePlayer(){if(!this.player){const c=this.cells.filter(c=>this.walkable(c)).sort((a,b)=>distance(a,{x:W*.45,y:H*.5})-distance(b,{x:W*.45,y:H*.5}))[0];if(!c)return{ok:false,message:'The wanderer needs a safe patch of land.'};this.player={enabled:true,x:c.x,y:c.y,px:c.x,py:c.y,facing:{x:0,y:1},hp:100,energy:100,seeds:8,wood:6,stone:4,crystals:0,insight:0,discovered:0,path:[],moveClock:0,camp:{x:c.x,y:c.y}};c.structure='camp';c.plant=null;this.log('A footprint in the grass','You arrived with a few seeds and a question: what kind of neighbour will you be?');}else this.player.enabled=true;this.tweaks.lore=true;this.reveal();this.revision++;return{ok:true};}
 walkable(c){return c&&!c.lava&&c.terrain!=='rock'&&c.plant!=='tree'&&(c.terrain==='land'||c.structure==='bridge');}
 pathTo(x,y){const p=this.player,target=this.cell(x,y);if(!p||!this.walkable(target)){if(p&&target?.terrain==='water'&&Math.abs(x-p.x)+Math.abs(y-p.y)===1){p.facing={x:x-p.x,y:y-p.y};return{ok:false,message:'Facing water. Tap Bridge to build here for 2 wood.'};}return{ok:false,message:'Choose open land, or build a bridge across water.'};}const start=p.y*W+p.x,goal=y*W+x,queue=[start],parents=new Map([[start,null]]);for(let i=0;i<queue.length&&!parents.has(goal);i++){const n=queue[i],cx=n%W,cy=Math.floor(n/W);for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const c=this.cell(cx+dx,cy+dy);if(!this.walkable(c))continue;const id=c.y*W+c.x;if(!parents.has(id)){parents.set(id,n);queue.push(id);}}}if(!parents.has(goal))return{ok:false,message:'No walkable route. Explore another way or build a bridge.'};const path=[];for(let at=goal;at!==start;at=parents.get(at))path.unshift({x:at%W,y:Math.floor(at/W)});p.path=path;return{ok:true};}
 movePlayer(dx,dy){const p=this.player;if(!p?.enabled)return{ok:false,message:'Enter the world first.'};p.facing={x:dx,y:dy};p.path=[];const c=this.cell(p.x+dx,p.y+dy);if(!this.walkable(c))return{ok:false,message:c?.terrain==='water'?'Water ahead. A bridge needs 2 wood.':'The way is blocked.'};p.px=p.x;p.py=p.y;p.x=c.x;p.y=c.y;p.energy=Math.max(0,p.energy-.35);this.reveal();return{ok:true};}
 reveal(){const p=this.player;for(let y=p.y-5;y<=p.y+5;y++)for(let x=p.x-5;x<=p.x+5;x++)if(this.cell(x,y)&&distance(p,{x,y})<=5)this.seen[y*W+x]=true;
  for(const l of this.landmarks)if(!l.found&&distance(p,l)<2.4){l.found=true;p.discovered++;p.insight+=2;p.seeds+=4;if(l.reward==='wood')p.wood+=4;if(l.reward==='crystal')p.crystals++;if(l.reward==='vitality')p.hp=Math.min(100,p.hp+25);this.log(l.name,`${l.text} Found: 4 seeds, 2 insight${l.reward==='wood'?', 4 wood':l.reward==='crystal'?', 1 crystal':''}.`);if(p.discovered===3)this.log('A practiced hand','Three places discovered. Tending now plants three neighbouring tiles.','reward');if(p.discovered===6)this.log('The world knows your name','Six places discovered. You now take half damage from hazards.','reward');}
 }
 stepPlayer(dt){const p=this.player;p.moveClock-=dt;if(p.path.length&&p.moveClock<=0){const next=p.path.shift(),remaining=p.path;this.movePlayer(next.x-p.x,next.y-p.y);p.path=remaining;p.moveClock=p.energy>15?.18:.35;}
  const c=this.cell(p.x,p.y);if(!this.walkable(c)){p.x=p.camp.x;p.y=p.camp.y;this.cell(p.x,p.y).fire=0;this.cell(p.x,p.y).plant=null;this.cell(p.x,p.y).terrain='land';this.cell(p.x,p.y).lava=false;p.path=[];this.log('Back to the hearth','The ground changed beneath you. You found your way back to camp.');}
  const safe=distance(p,p.camp)<2||this.cells.some(c=>c.structure==='sanctuary'&&distance(c,p)<3);
  p.energy=limit(p.energy+dt*(safe?5:1),0,100);if(safe)p.hp=limit(p.hp+dt*3,0,100);
  const threat=this.entities.some(a=>['wolf','drake'].includes(a.type)&&distance(a,p)<1.5);const hurt=c?.fire>0?12:threat&&!safe?4:0;p.hp-=dt*hurt*(p.discovered>=6?.5:1);
  if(p.hp<=0){p.hp=70;p.energy=60;p.wood=Math.floor(p.wood*.75);p.x=p.camp.x;p.y=p.camp.y;p.path=[];this.cell(p.x,p.y).fire=0;this.log('A second morning','You woke at camp, a little lighter on timber. Your discoveries remain.','reward');}
 }
 playerAction(action){const p=this.player;if(!p?.enabled)return{ok:false,message:'Enter the world from Dev tweaks → Wanderer.'};
  const near=this.cells.filter(c=>distance(c,p)<1.6).sort((a,b)=>distance(a,p)-distance(b,p));
  if(action==='gather'){const c=near.find(c=>!c.harvestUntil||c.harvestUntil<this.time);const resource=[...near].sort((a,b)=>(b.plant||b.terrain==='rock'?1:0)-(a.plant||a.terrain==='rock'?1:0)).find(c=>(!c.harvestUntil||c.harvestUntil<this.time)&&(c.plant||c.terrain==='rock'||c.food>.55));if(!resource)return{ok:false,message:'Nothing ready nearby. Try a tree, berries, rock, or tall grass.'};let found='';if(resource.plant==='tree'){p.wood+=3;resource.plant=null;found='3 wood';}else if(resource.terrain==='rock'){p.stone+=2;resource.ore=(resource.ore??3)-1;if(resource.ore<=0)resource.terrain='land';found='2 stone';}else if(resource.plant==='crystal'){p.crystals++;resource.plant=null;found='1 crystal';}else if(['shrub','mushroom'].includes(resource.plant)){p.energy=100;p.hp=Math.min(100,p.hp+10);p.seeds+=2;resource.food=Math.max(0,resource.food-.3);if(resource.plant==='mushroom')resource.plant=null;found='2 seeds and a meal';}else{p.seeds+=2;resource.food=Math.max(0,resource.food-.35);if(resource.plant==='flower')resource.plant=null;found='2 seeds';}resource.harvestUntil=this.time+6;this.revision++;return{ok:true,message:`Gathered ${found}.`};}
  if(action==='tend'){if(p.seeds<1)return{ok:false,message:'You need seeds. Gather grass, berries, or flowers.'};const targets=near.filter(c=>c.terrain==='land'&&!c.plant&&!c.lava).slice(0,Math.min(p.seeds,p.discovered>=3?3:1));if(!targets.length)return{ok:false,message:'Find an empty patch of land to plant.'};for(const c of targets){c.plant=this.theme==='fantasy'?'mushroom':'flower';c.growth=.4;c.moisture=.75;c.food=.75;c.fire=0;p.seeds--;}this.revision++;this.effects.push({x:p.x,y:p.y,type:'pollen',ttl:1.3});return{ok:true,message:`Tended ${targets.length} patch${targets.length>1?'es':''}. Moist soil helps it grow.`};}
  if(action==='rest'){if(distance(p,p.camp)>2&&!near.some(c=>c.structure==='sanctuary'))return{ok:false,message:'Return to your camp or a sanctuary to rest.'};p.hp=100;p.energy=100;return{ok:true,message:'Rested. Health and energy restored.'};}
  if(action==='interact'){const l=this.landmarks.find(l=>distance(l,p)<3);return l?{ok:true,message:l.text}:{ok:false,message:'Look for old stones, ruins, and springs. Discover them by walking nearby.'};}
  const costs={bridge:{wood:2},camp:{wood:3,stone:2},sanctuary:{wood:5,seeds:4}};
  if(action in costs){for(const[k,v]of Object.entries(costs[action]))if(p[k]<v)return{ok:false,message:`Needs ${Object.entries(costs[action]).map(([k,v])=>`${v} ${k}`).join(' + ')}.`};let c=action==='bridge'?this.cell(p.x+p.facing.x,p.y+p.facing.y):this.cell(p.x,p.y);if(action==='bridge'&&(c?.terrain!=='water'||c?.structure==='bridge'))return{ok:false,message:'Face an unbridged water tile first.'};if(action!=='bridge'&&c.structure)return{ok:false,message:'This tile already has a structure. Step onto an empty tile.'};for(const[k,v]of Object.entries(costs[action]))p[k]-=v;c.structure=action;if(action==='camp')p.camp={x:p.x,y:p.y};this.revision++;this.log(action==='sanctuary'?'A gentler neighbourhood':action==='bridge'?'One less divide':'A place to return',action==='sanctuary'?'The sanctuary nourishes nearby plants and keeps wolves away.':action==='bridge'?'A bridge opens a route across the water.': 'Your new camp restores health and energy.','build');return{ok:true,message:`Built a ${action}.`};}
  return{ok:false,message:'Choose one of the available actions.'};
 }
 scenario(id){const s=SCENARIOS.find(s=>s.id===id);if(!s)return{ok:false,message:'Choose a scenario.'};this.tweaks.extraLife=true;this.tweaks.lore=true;this.theme=id==='fey'?'fantasy':'natural';this.reset(`STORY-${id.toUpperCase()}`,id==='rewild'?'meadow':id==='flood'?'wetland':id==='islands'?'archipelago':id==='fey'?'ancient':'woodland');
  if(id==='rewild')this.addSpecies('rabbit',35);
  if(id==='phoenix'){this.setWeather('drought',45);this.disaster('fire');}
  if(id==='fey'){this.setWeather('aurora',70);this.enablePlayer();}
  if(id==='flood')this.disaster('flood');
  if(id==='islands'){this.enablePlayer();this.player.wood=20;this.player.stone=10;}
  this.log(s.name,s.description,'scenario');return{ok:true};
 }
 snapshot(){const base=JSON.parse(super.snapshot());return JSON.stringify({...base,tweaks:this.tweaks,theme:this.theme,environment:this.environment,climate:this.climate,journal:this.journal,milestones:this.milestones,landmarks:this.landmarks,structures:this.structures,player:this.player,seen:this.seen,notice:this.notice,noticeId:this.noticeId});}
 restore(data){super.restore(data);this.tweaks={...DEFAULTS,...this.tweaks};this.hazardClock=0;this.shake=0;this.flash=0;}
}
