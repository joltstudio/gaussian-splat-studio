export const shell = `
<main><canvas id="scene" tabindex="0" aria-label="3D scene. Drag to orbit, scroll or pinch to zoom. Arrow keys orbit, WASD pan, Home resets."></canvas>
<header><a class="brand" href="/" id="brand">SPLAT / STUDIO</a><span class="pill">SPATIAL EXPLORER <i></i></span><button id="help" aria-label="Show navigation help">?</button></header>
<section class="intro"><p class="eyebrow">01 / EXAMPLE COLLECTION</p><h1 id="title">A different<br>perspective.</h1><p id="subtitle"></p><div class="scene-label"><span class="dot"></span> GAUSSIAN SPLAT EXPERIENCE</div></section>
<div id="markers" aria-label="Scene hotspots"></div>
<section id="loading" role="status" aria-live="polite"><span class="spinner"></span><h2 id="load-text">Preparing your scene…</h2><progress id="progress" max="1"></progress><p id="error-detail"></p><button id="retry" hidden>Try again</button></section>
<aside id="panel" hidden><button id="close-panel" aria-label="Close information">×</button><p class="eyebrow">IN FOCUS</p><h2 id="panel-title"></h2><p id="panel-text"></p></aside>
<nav aria-label="Viewer controls"><button id="reset" title="Reset view (Home)">↺ <span>Reset</span></button><span class="divider"></span><button id="zoom-in" aria-label="Zoom in">＋</button><button id="zoom-out" aria-label="Zoom out">−</button><span class="divider"></span><button id="tour">▷ <span>Guided tour</span></button><button id="quality" aria-label="Switch rendering quality">Eco</button><button id="fullscreen" aria-label="Toggle fullscreen">⛶</button></nav>
<footer><div><span id="credit"></span><small id="metrics">Waiting for scene</small></div><div class="footer-actions"><button id="camera-export">Save camera</button><label class="import">Open your splat<input id="file" type="file" accept=".sog,.ply" hidden></label></div></footer>
<div id="toast" role="status" aria-live="polite"></div>
<dialog id="help-dialog"><form method="dialog"><button aria-label="Close help">×</button></form><p class="eyebrow">MAKE YOURSELF AT HOME</p><h2>Look around.</h2><dl><dt>Orbit</dt><dd>Drag · one finger · arrow keys</dd><dt>Zoom</dt><dd>Scroll · pinch · + / −</dd><dt>Pan</dt><dd>Right-drag · two fingers · WASD</dd><dt>Reset</dt><dd>Home or reset button</dd></dl><p>Keyboard navigation works when the scene is focused. Dragging stops the tour. Local files stay in this browser; opening one does not upload or publish it.</p><p>Local imports inherit this project's camera and orientation. Save camera exports coordinates for your scene configuration.</p></dialog>
</main>`;
export function el<T extends HTMLElement=HTMLElement>(id:string){return document.getElementById(id) as T;}
export function toast(message:string){el('toast').textContent=message;setTimeout(()=>{el('toast').textContent='';},6000);}
