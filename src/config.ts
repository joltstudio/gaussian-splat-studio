export type Point = [number, number, number];
export type View = { position: Point; target: Point; duration?: number };
export type Scene = {
  version: 1; id: string; title: string; subtitle: string;
  asset: { url: string; lowUrl?: string; rotation: Point; position: Point; credit: string; licence: string; source: string };
  camera: View; theme: { brand: string; accent: string; background: string; font: string; logo?: string; navigation: 'bottom'|'side' };
  hotspots: { label: string; text: string; position: Point; camera?: View }[];
  tour: (View & { label: string })[];
};
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
function assert(ok: unknown, msg: string): asserts ok { if (!ok) throw new Error(`Scene configuration: ${msg}`); }
const point = (v: unknown) => Array.isArray(v) && v.length === 3 && v.every(n => typeof n === 'number' && Number.isFinite(n));
export function safeUrl(value: string) { const u = new URL(value, 'https://local.invalid'); return ['https:', 'http:'].includes(u.protocol); }
export function validateScene(v: unknown): Scene {
  assert(object(v), 'expected an object');
  assert(v.version === 1, 'unsupported version');
  for (const k of ['id','title','subtitle']) assert(typeof v[k] === 'string', `${k} must be text`);
  assert(/^[a-z0-9-]+$/.test(v.id as string), 'invalid id');
  assert(object(v.asset), 'missing asset');
  for (const k of ['url','credit','licence','source']) assert(typeof v.asset[k] === 'string', `asset.${k} required`);
  assert(safeUrl(v.asset.url as string), 'asset URL must be HTTP(S) or relative');
  assert(/\.(sog|ply)(\?.*)?$/i.test(v.asset.url as string), 'use bundled SOG or Gaussian PLY');
  if(v.asset.lowUrl) assert(typeof v.asset.lowUrl === 'string' && safeUrl(v.asset.lowUrl) && /\.(sog|ply)(\?.*)?$/i.test(v.asset.lowUrl), 'invalid lowUrl');
  assert(point(v.asset.rotation) && point(v.asset.position), 'asset transforms need three finite numbers');
  const view = (p: unknown) => { assert(object(p) && point(p.position) && point(p.target), 'invalid camera'); assert(JSON.stringify(p.position)!==JSON.stringify(p.target),'camera cannot equal target'); if(p.duration !== undefined) assert(typeof p.duration==='number' && p.duration>0 && p.duration<=120,'duration must be 0–120 seconds'); };
  view(v.camera);
  assert(object(v.theme), 'missing theme');
  for (const k of ['brand','font']) assert(typeof v.theme[k] === 'string', `theme.${k} required`);
  for (const k of ['accent','background']) assert(typeof v.theme[k] === 'string' && /^#[0-9a-f]{6}$/i.test(v.theme[k] as string), `theme.${k} needs a six-digit hex colour`);
  assert(['bottom','side'].includes(v.theme.navigation as string),'navigation must be bottom or side');
  if(v.theme.logo) assert(typeof v.theme.logo==='string' && safeUrl(v.theme.logo),'invalid logo URL');
  assert(Array.isArray(v.hotspots) && v.hotspots.length<=100, 'hotspots must be an array (max 100)');
  for(const h of v.hotspots) { assert(object(h) && typeof h.label==='string' && typeof h.text==='string' && point(h.position),'invalid hotspot'); if(h.camera) view(h.camera); }
  assert(Array.isArray(v.tour) && v.tour.length<=100, 'tour must be an array (max 100)');
  for(const t of v.tour) { view(t); assert(typeof t.label==='string','tour label required'); }
  return v as Scene;
}
export async function loadScene(): Promise<Scene> {
  const id = new URLSearchParams(location.search).get('project') || 'toy-cat';
  if(!/^[a-z0-9-]+$/.test(id)) throw new Error('Invalid project name.');
  const base = (import.meta as ImportMeta & {env?: Record<string,string>}).env?.VITE_PROJECT_BASE || '/projects';
  const response = await fetch(`${base}/${id}.json`, {cache:'no-cache', signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw new Error(`Project unavailable (${response.status}). Check the project URL.`);
  return validateScene(await response.json());
}
