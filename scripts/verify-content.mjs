import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=name=>JSON.parse(fs.readFileSync(`lib/${name}.json`,'utf8'));
const events=[...read('history'),...read('annual'),...read('additional')];
assert.equal(new Set(events.map(e=>e.id)).size,events.length,'Event IDs must be unique');
for(let year=2000;year<=2026;year++)assert(events.some(e=>e.year===String(year)),`Missing annual entry: ${year}`);
for(const event of events){assert(event.title&&event.summary&&event.why&&event.people,`Incomplete article: ${event.id}`);assert.equal(new URL(event.source).protocol,'https:',`Source must use HTTPS: ${event.id}`)}
for(const id of ['permian','carboniferous','devonian','silurian','ordovician','cambrian','ediacaran','precambrian','greece','china','india','mesopotamia'])assert(events.some(e=>e.id===id),`Missing broader context: ${id}`);
for(const name of ['earth-hero.webp','egypt.webp','city.webp','forest.webp','mountains.webp','space.webp'])assert(fs.statSync(`public/images/${name}`).size>0,`Missing optimized atmosphere: ${name}`);
for(const name of ['city-candidates.glb','soldier.glb']){const b=fs.readFileSync(`public/models/${name}`);assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length);const json=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)));assert(json.meshes?.length>0);if(name==='soldier.glb'){assert(json.skins?.length>0);assert(json.animations.some(a=>a.name==='Walk'))}}
console.log(`Verified ${events.length} sourced articles, all 27 annual entries, 12 broader-context records, optimized images, GLB integrity, skins, and native walking clip.`);
