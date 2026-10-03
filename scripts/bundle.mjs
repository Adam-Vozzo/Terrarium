import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const order=['ecosystem.mjs','experiments.mjs','pixels.mjs','world-render.mjs','dev-menu.mjs','app.mjs'];
const parts=[];
for(const name of order){let source=await readFile(resolve(root,'dist',name),'utf8');source=source.replace(/^import.*\n/gm,'').replace(/\bexport /g,'');if(name==='app.mjs')source=source.replaceAll('new Ecosystem(','new ExperimentWorld(');parts.push(source);}
const css=(await readFile(resolve(root,'dist/style.css'),'utf8')).replace(/^@import[^\n]*\n/gm,'');
const html=(await readFile(resolve(root,'dist/index.html'),'utf8')).replace('<link rel="stylesheet" href="./style.css">',()=>`<style>\n${css}\n</style>`).replace('<script type="module" src="./app.mjs"></script>',()=>`<script>\n(function(){\n${parts.join('\n')}\n})();\n</script>`);
await mkdir(resolve(root,'build'),{recursive:true});await writeFile(resolve(root,'build/Terrarium.html'),html);
console.log('Built build/Terrarium.html — self-contained, works offline.');
