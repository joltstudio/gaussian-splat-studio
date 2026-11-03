// Local review artifact only. It shares the application source, but uses a pinned CDN engine.
import {readFile,writeFile,mkdir} from 'node:fs/promises';import {stripTypeScriptTypes} from 'node:module';import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');let code='';
for(const file of ['config','ui','viewer','main']){
 let source=await readFile(resolve(root,`src/${file}.ts`),'utf8');
 source=source.replace(/^import .*?;\n/gm,'').replace('const {Viewer}=await import(\'./viewer.ts\');','').replace('const config=await loadScene();','const pc=await import("https://cdn.jsdelivr.net/npm/playcanvas@2.23.3/build/playcanvas.mjs"); globalThis.__pc=pc; const config=validateScene(JSON.parse(document.getElementById("embedded-config").textContent));');
 if(file==='viewer')source=source.replace('export class Viewer {','export class Viewer {').replace('this.app=new pc.Application','const pc=globalThis.__pc; this.app=new pc.Application');
 // Viewer methods resolve the shared module-scoped pc binding.
 source=source.replace('const pc=await import(','pc=await import(').replace('const pc=globalThis.__pc; ','');
 code+=stripTypeScriptTypes(source,{mode:'transform'}).replace(/^export /gm,'')+'\n';
}
const config=await readFile(resolve(root,'public/projects/toy-cat.json'),'utf8');const css=await readFile(resolve(root,'src/style.css'),'utf8');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gaussian Splat Studio · local review</title><style>${css}</style><body><div id="app"></div><script id="embedded-config" type="application/json">${config}</script><script type="module">let pc;\n${code.replaceAll('</script','<\\/script')}</script></body></html>`;
await mkdir(resolve(root,'.portable'),{recursive:true});await writeFile(resolve(root,'.portable/studio-preview.html'),html);console.log(resolve(root,'.portable/studio-preview.html'));
