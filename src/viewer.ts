import * as pc from 'playcanvas';
import type {Scene, View, Point} from './config.ts';
export class Viewer {
  app: pc.Application; camera: pc.Entity; target = new pc.Vec3(); yaw=0; pitch=0; distance=2.5;
  ready=false; touring=false; tourIndex=0; elapsed=0; origin?: View; low=false; frames=0; seconds=0; slow=0;
  asset?: pc.Asset; entity?: pc.Entity; blob?:string; abort?:AbortController;
  points=new Map<number,{x:number,y:number}>(); cleanup: (()=>void)[]=[];
  constructor(public canvas: HTMLCanvasElement,public config:Scene,public report:(text:string)=>void,public progress:(fraction:number|null,text:string)=>void) {
    this.app=new pc.Application(canvas,{graphicsDeviceOptions:{antialias:false,alpha:false,powerPreference:'high-performance'}});
    this.camera=new pc.Entity('Camera');this.camera.addComponent('camera',{clearColor:new pc.Color().fromString(config.theme.background),nearClip:0.01,farClip:1000,fov:50});this.app.root.addChild(this.camera);
    this.low=matchMedia('(pointer: coarse)').matches;this.quality(this.low);this.setView(config.camera);
    this.app.setCanvasFillMode(pc.FILLMODE_NONE);this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    const resize=()=>{this.camera.camera!.horizontalFov=window.innerWidth<window.innerHeight;this.app.resizeCanvas(window.innerWidth,window.innerHeight);};window.addEventListener('resize',resize);this.cleanup.push(()=>window.removeEventListener('resize',resize));resize();
    const on=<K extends keyof HTMLElementEventMap>(name:K,fn:(e:HTMLElementEventMap[K])=>void,options?:AddEventListenerOptions)=>{canvas.addEventListener(name,fn,options);this.cleanup.push(()=>canvas.removeEventListener(name,fn));};
    on('contextmenu',e=>e.preventDefault());
    on('pointerdown',e=>{this.stopTour();canvas.focus();canvas.setPointerCapture(e.pointerId);this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});});
    on('pointermove',e=>{
      const old=this.points.get(e.pointerId);if(!old)return;
      const dx=e.clientX-old.x,dy=e.clientY-old.y;const other=[...this.points.entries()].find(([id])=>id!==e.pointerId)?.[1];
      if(other){const before=Math.hypot(old.x-other.x,old.y-other.y),after=Math.hypot(e.clientX-other.x,e.clientY-other.y);if(after>0)this.zoom(before/after);this.pan(dx/2,dy/2);}
      else if(e.buttons===2 || e.shiftKey)this.pan(dx,dy);else{this.yaw-=dx*.006;this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch+dy*.006));}
      this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});this.updateCamera();
    });
    const end=(e:PointerEvent)=>this.points.delete(e.pointerId);on('pointerup',end);on('pointercancel',end);on('lostpointercapture',end);
    on('wheel',e=>{e.preventDefault();this.stopTour();this.zoom(Math.exp(Math.max(-200,Math.min(200,e.deltaY))*.002));},{passive:false});
    on('keydown',e=>{const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','w','a','s','d','Home','Escape'];if(!keys.includes(e.key))return;e.preventDefault();this.stopTour();if(e.key==='Home')this.setView(config.camera);if(e.key==='ArrowLeft')this.yaw+=.08;if(e.key==='ArrowRight')this.yaw-=.08;if(e.key==='ArrowUp')this.pitch+=.06;if(e.key==='ArrowDown')this.pitch-=.06;if(['+','='].includes(e.key))this.zoom(.9);if(e.key==='-')this.zoom(1.1);if(e.key==='a')this.pan(20,0);if(e.key==='d')this.pan(-20,0);if(e.key==='w')this.pan(0,20);if(e.key==='s')this.pan(0,-20);this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch));this.updateCamera();});
    on('webglcontextlost' as keyof HTMLElementEventMap,e=>{e.preventDefault();this.ready=false;this.progress(null,'Graphics context lost. Reload the page or use a smaller scene.');});
    this.app.on('update',(dt:number)=>this.tick(dt));this.app.start();
  }
  quality(low:boolean){this.low=low;this.app.graphicsDevice.maxPixelRatio=low?1:Math.min(devicePixelRatio,1.75);this.app.resizeCanvas();}
  pan(dx:number,dy:number){this.target.add(this.camera.right.clone().mulScalar(-dx*this.distance*.0015));this.target.add(this.camera.up.clone().mulScalar(dy*this.distance*.0015));}
  zoom(f:number){this.distance=Math.max(.08,Math.min(250,this.distance*f));this.updateCamera();}
  updateCamera(){this.camera.setPosition(this.target.x+this.distance*Math.cos(this.pitch)*Math.sin(this.yaw),this.target.y+this.distance*Math.sin(this.pitch),this.target.z+this.distance*Math.cos(this.pitch)*Math.cos(this.yaw));this.camera.lookAt(this.target);}
  setView(v:View){this.target.set(...v.target);const delta=new pc.Vec3(...v.position).sub(this.target);this.distance=Math.max(.08,delta.length());this.pitch=Math.asin(delta.y/this.distance);this.yaw=Math.atan2(delta.x,delta.z);this.updateCamera();}
  snapshot():View{const p=this.camera.getPosition();return{position:[p.x,p.y,p.z],target:[this.target.x,this.target.y,this.target.z]};}
  startTour(){if(!this.ready || !this.config.tour.length)return;this.touring=true;this.tourIndex=0;this.elapsed=0;this.origin=this.snapshot();}
  stopTour(){this.touring=false;}
  tick(dt:number){
    if(this.touring&&this.origin){const end=this.config.tour[this.tourIndex];this.elapsed+=dt;const t=Math.min(1,this.elapsed/(end.duration||4));const k=matchMedia('(prefers-reduced-motion: reduce)').matches?1:t*t*(3-2*t);const mix=(a:Point,b:Point):Point=>a.map((n,i)=>n+(b[i]-n)*k) as Point;this.setView({position:mix(this.origin.position,end.position),target:mix(this.origin.target,end.target)});if(t===1){this.tourIndex++;this.elapsed=0;this.origin=this.snapshot();if(this.tourIndex===this.config.tour.length)this.stopTour();}}
    if(!this.ready || document.hidden)return;this.frames++;this.seconds+=dt;if(this.seconds>=2){const fps=this.frames/this.seconds;this.report(`${Math.round(fps)} FPS · ${this.low?'Eco':'High'} · ${this.touring?'Tour playing':'Interactive'}`);this.slow=fps<24?this.slow+1:0;if(this.slow>=3&&!this.low){this.quality(true);this.report('Eco quality enabled after sustained low frame rate');}this.frames=0;this.seconds=0;}
  }
  async load(url:string,name:string=url){
    this.abort?.abort();this.abort=new AbortController();const abort=this.abort;this.ready=false;this.stopTour();this.progress(0,'Downloading scene…');
    this.entity?.destroy();if(this.asset){this.asset.unload();this.app.assets.remove(this.asset);}if(this.blob)URL.revokeObjectURL(this.blob);
    try {
      const response=await fetch(url,{signal:AbortSignal.any([abort.signal,AbortSignal.timeout(120000)])});if(!response.ok)throw new Error(`Scene request failed (${response.status}).`);
      const total=Number(response.headers.get('content-length'));if(total>512*1024*1024)throw new Error('Scene exceeds the 512 MB safety limit. Optimise it first.');
      const reader=response.body?.getReader();if(!reader)throw new Error('This browser cannot stream the scene.');const chunks:Uint8Array<ArrayBuffer>[]=[];let bytes=0;
      while(true){const{done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>512*1024*1024){await reader.cancel();throw new Error('Scene exceeds 512 MB.');}chunks.push(value as Uint8Array<ArrayBuffer>);this.progress(total?Math.min(bytes/total,.99):null,`Downloading · ${(bytes/1048576).toFixed(1)} MB${total?' / '+(total/1048576).toFixed(1)+' MB':''}`);}
      this.progress(null,'Decoding scene and preparing graphics…');this.blob=URL.createObjectURL(new Blob(chunks));
      const filename=name.split('?')[0].split('/').pop()||'scene.sog';const asset=new pc.Asset('Scene','gsplat',{url:this.blob,filename});this.asset=asset;this.app.assets.add(asset);
      await new Promise<void>((resolve,reject)=>{
        const finish=(error?:Error)=>{clearTimeout(timer);asset.off('load',loaded);asset.off('error',failed);abort.signal.removeEventListener('abort',cancelled);error?reject(error):resolve();};
        const loaded=()=>finish();const failed=(e:unknown)=>finish(new Error(String(e)));const cancelled=()=>finish(new Error('Load cancelled'));
        const timer=setTimeout(()=>finish(new Error('Scene decoding timed out. Try a smaller SOG export.')),120000);
        asset.once('load',loaded);asset.once('error',failed);abort.signal.addEventListener('abort',cancelled,{once:true});this.app.assets.load(asset);
      });
      if(abort.signal.aborted)return;const entity=new pc.Entity('Splat');entity.setPosition(...this.config.asset.position);entity.setEulerAngles(...this.config.asset.rotation);entity.addComponent('gsplat',{asset});this.app.root.addChild(entity);this.entity=entity;this.ready=true;this.progress(1,'Ready');
    }catch(error){if(abort.signal.aborted)return;throw error;}
  }
  screen(point:Point){const world=new pc.Vec3(...point);const p=this.camera.camera!.worldToScreen(world);const view=this.camera.camera!.viewMatrix.transformPoint(world);return{x:p.x,y:p.y,behind:view.z>=0};}
  destroy(){this.abort?.abort();this.cleanup.forEach(f=>f());this.app.destroy();if(this.blob)URL.revokeObjectURL(this.blob);}
}
