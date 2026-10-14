import {readFile,writeFile} from 'node:fs/promises';
const text=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const embed=s=>s.replace(/<\/script/gi,'<\\/script');
const engine=(await text('src/engine.mjs')).replace(/^export /gm,'');
const data=await text('data/demo.json'),workflow=await text('workflows/context-review.json');
const html=(await text('src/ui.html')).replace('/* ENGINE */',()=>engine).replace('/* DATA */',()=>embed(data)).replace('/* WORKFLOW */',()=>embed(workflow));
await writeFile(new URL('../index.html',import.meta.url),html);
console.log('Built index.html');
