import test from 'node:test';
import assert from 'node:assert/strict';
import { ExperimentWorld, ENVIRONMENTS, SCENARIOS } from '../dist/experiments.mjs';
import { PIXEL_ART } from '../dist/pixels.mjs';
import { groundColor } from '../dist/world-render.mjs';
const run=(world,seconds)=>{for(let i=0;i<seconds*4;i++)world.step(.25);};

test('a seed reproduces the same world and simulation',()=>{
 const a=new ExperimentWorld('REPEAT','ancient'),b=new ExperimentWorld('REPEAT','ancient');
 a.populate();b.populate();run(a,20);run(b,20);assert.equal(a.snapshot(),b.snapshot());
});
test('trees and shrubs do not darken an entire ground tile',()=>{
 const e=new ExperimentWorld(),c=e.cells.find(c=>c.terrain==='land');
 const base=groundColor({...c,plant:null},e);
 assert.equal(groundColor({...c,plant:'tree'},e),base);assert.equal(groundColor({...c,plant:'shrub'},e),base);
});
test('every source sprite is exactly 16 by 16',()=>{
 for(const[name,rows]of Object.entries(PIXEL_ART)){assert.equal(rows.length,16,name);for(const row of rows)assert.equal(row.length,16,name);}
});
test('undo restores player, weather, tuning, random state and terrain',()=>{
 const e=new ExperimentWorld();e.scenario('fey');e.tweaks.growth=2;run(e,5);const snapshot=e.snapshot();
 e.disaster('meteor');e.player.seeds=0;e.tweaks.growth=.25;run(e,3);e.restore(snapshot);assert.equal(e.snapshot(),snapshot);
});
test('fish placement respects water habitat',()=>{
 const e=new ExperimentWorld();const water=e.cells.find(c=>c.terrain==='water'),land=e.cells.find(c=>c.terrain==='land'&&!c.plant);
 assert.equal(e.paint('fish',water.x,water.y).ok,true);assert.equal(e.paint('fish',land.x,land.y).ok,false);
});
test('rain extinguishes a fire and leaves enriched ash',()=>{
 const e=new ExperimentWorld();const c=e.cells.find(c=>c.terrain==='land'&&!c.structure);c.moisture=.1;
 assert(e.ignite(c.x,c.y));e.setWeather('rain',30);run(e,5);assert(c.fire<=0);assert.equal(c.ash,1);assert(e.milestones.includes('rain-fire'));
});
test('flood habitat recedes after its advertised duration',()=>{
 const e=new ExperimentWorld('FLOOD');const before=e.cells.filter(c=>c.terrain==='water').length;
 e.disaster('flood');assert(e.cells.filter(c=>c.terrain==='water').length>before);run(e,46);
 assert.equal(e.cells.filter(c=>c.terrain==='water').length,before);assert(!e.cells.some(c=>c.flooded));
});
test('a bridge changes pathfinding and consumes the listed resources',()=>{
 const e=new ExperimentWorld();e.enablePlayer();for(const c of e.cells){c.terrain='rock';c.plant=null;c.structure=null;}
 for(const x of [4,6])e.cell(x,4).terrain='land';e.cell(5,4).terrain='water';
 Object.assign(e.player,{x:4,y:4,camp:{x:4,y:4},wood:4,facing:{x:1,y:0}});
 assert.equal(e.pathTo(6,4).ok,false);assert.equal(e.playerAction('bridge').ok,true);assert.equal(e.player.wood,2);
 assert.equal(e.pathTo(6,4).ok,true);run(e,1);assert.equal(e.player.x,6);assert.equal(e.player.y,4);
});
test('exploration rewards each landmark once',()=>{
 const e=new ExperimentWorld();e.enablePlayer();const l=e.landmarks[0];Object.assign(e.player,{x:l.x,y:l.y});
 e.reveal();const {seeds,insight,discovered}=e.player;e.reveal();assert(l.found);
 assert.equal(e.player.seeds,seeds);assert.equal(e.player.insight,insight);assert.equal(e.player.discovered,discovered);
});
test('all environments and scenarios stay finite and bounded',()=>{
 for(const env of Object.keys(ENVIRONMENTS)){const e=new ExperimentWorld('BIOME',env);e.populate();run(e,5);assert.equal(e.cells.length,1920);assert(e.entities.every(a=>Number.isFinite(a.energy)&&e.cell(a.x,a.y)));}
 for(const scenario of SCENARIOS){const e=new ExperimentWorld();e.scenario(scenario.id);run(e,90);assert(e.entities.length<=e.tweaks.populationCap);assert(e.entities.every(a=>Number.isFinite(a.energy)&&e.cell(a.x,a.y)));assert(!e.player||Number.isFinite(e.player.hp));}
});
