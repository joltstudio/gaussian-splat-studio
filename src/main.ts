import {loadScene} from './config.ts';
import {shell,el,toast} from './ui.ts';
import type {Viewer} from './viewer.ts';
el('app').innerHTML=shell;
let viewer:Viewer|undefined;
let currentUrl='', currentName='',localUrl='';
function error(e:unknown){el('loading').hidden=false;el('load-text').textContent='We couldn’t open this scene.';el('error-detail').textContent=e instanceof Error?e.message:String(e);el('progress').hidden=true;el('retry').hidden=false;el('loading').classList.add('failed');}
function progress(value:number|null,message:string){el('loading').hidden=value===1;el('load-text').textContent=message;el('error-detail').textContent='';el('retry').hidden=true;el('progress').hidden=false;el('loading').classList.remove('failed');if(value===null)el('progress').removeAttribute('value');else(el('progress') as HTMLProgressElement).value=value;}
async function load(){try{await viewer?.load(currentUrl,currentName);}catch(e){error(e);}}
el('help').onclick=()=>el<HTMLDialogElement>('help-dialog').showModal();
el('close-panel').onclick=()=>el('panel').hidden=true;
el('retry').onclick=()=>viewer?void load():location.reload();
try{
  const config=await loadScene();document.title=`${config.title} | Gaussian Splat Studio`;
  el('title').textContent=config.title;el('subtitle').textContent=config.subtitle;el('brand').textContent=config.theme.brand;el('credit').textContent=config.asset.credit;
  document.documentElement.style.setProperty('--accent',config.theme.accent);document.documentElement.style.setProperty('--bg',config.theme.background);document.body.style.fontFamily=config.theme.font;document.body.dataset.navigation=config.theme.navigation;
  if(config.theme.logo){const img=new Image();img.src=config.theme.logo;img.alt=config.theme.brand;el('brand').replaceChildren(img);}
  const {Viewer}=await import('./viewer.ts');
  viewer=new Viewer(el<HTMLCanvasElement>('scene'),config,t=>el('metrics').textContent=t,progress);
  currentUrl=viewer.low&&config.asset.lowUrl?config.asset.lowUrl:config.asset.url;currentName=currentUrl;
  el('quality').textContent=viewer.low?'Eco':'High';
  el('reset').onclick=()=>{viewer!.stopTour();viewer!.setView(config.camera);};
  el('zoom-in').onclick=()=>{viewer!.stopTour();viewer!.zoom(.85);};el('zoom-out').onclick=()=>{viewer!.stopTour();viewer!.zoom(1.15);};
  el('tour').hidden=!config.tour.length;el('tour').onclick=()=>{if(viewer!.touring)viewer!.stopTour();else viewer!.startTour();};
  el('quality').onclick=()=>{viewer!.quality(!viewer!.low);el('quality').textContent=viewer!.low?'Eco':'High';};
  el('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Fullscreen is not supported by this browser.');}catch{toast('Fullscreen is unavailable in this browser or embedded preview.');}};
  el('camera-export').onclick=()=>{const data=JSON.stringify(viewer!.snapshot(),null,2);const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='camera.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Camera saved. Use these values in your project configuration.');};
  el<HTMLInputElement>('file').onchange=async e=>{const file=(e.target as HTMLInputElement).files?.[0];if(!file)return;if(!/\.(ply|sog)$/i.test(file.name)){toast('Export a Gaussian PLY or bundled SOG first.');return;}if(file.size>512*1048576){toast('This file exceeds 512 MB. Optimise it in SuperSplat first.');return;}if(localUrl)URL.revokeObjectURL(localUrl);localUrl=URL.createObjectURL(file);currentUrl=localUrl;currentName=file.name;el('title').textContent=file.name;el('subtitle').textContent='Local preview · your file has not been uploaded.';el('credit').textContent='Private local file';el('markers').hidden=true;el('tour').hidden=true;el('panel').hidden=true;await load();};
  for(const [i,h] of config.hotspots.entries()){const b=document.createElement('button');b.className='hotspot';b.textContent=String(i+1).padStart(2,'0');b.title=h.label;b.setAttribute('aria-label',h.label);b.onclick=()=>{el('panel-title').textContent=h.label;el('panel-text').textContent=h.text;el('panel').hidden=false;viewer!.stopTour();if(h.camera)viewer!.setView(h.camera);};el('markers').append(b);viewer.app.on('update',()=>{if(!viewer?.ready){b.hidden=true;return;}const p=viewer.screen(h.position);const x=p.x,y=p.y;b.hidden=p.behind||x<0||x>innerWidth||y<0||y>innerHeight;b.style.transform=`translate(${x}px,${y}px)`;});}
  viewer.app.on('update',()=>{el('tour').setAttribute('aria-pressed',String(viewer!.touring));el('tour').innerHTML=viewer!.touring?'Ⅱ <span>Stop tour</span>':'▷ <span>Guided tour</span>';el('quality').textContent=viewer!.low?'Eco':'High';});
  await load();
}catch(e){error(e);}
window.addEventListener('pagehide',()=>viewer?.destroy());
