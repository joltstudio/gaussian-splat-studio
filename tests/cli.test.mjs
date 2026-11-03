import test from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
test('project lifecycle preserves original and refuses out-of-order checkpoints',async()=>{
 const root=await mkdtemp(join(tmpdir(),'splat-studio-test-'));
 try{
  for(const path of ['scripts','src','public','package.json'])await cp(new URL('../'+path,import.meta.url),join(root,path),{recursive:true});
  const run=(...args)=>spawnSync(process.execPath,[join(root,'scripts/studio.mjs'),...args],{encoding:'utf8'});
  assert.equal(run('new','test-scene','Test scene').status,0);
  assert.notEqual(run('checkpoint','test-scene','publish','APPROVED: test').status,0);
  assert.notEqual(run('new','../outside').status,0);
  const props=['x','y','z','opacity','scale_0','scale_1','scale_2','rot_0','rot_1','rot_2','rot_3','f_dc_0','f_dc_1','f_dc_2'];
  const data=Buffer.concat([Buffer.from('ply\nformat binary_little_endian 1.0\nelement vertex 1\n'+props.map(p=>'property float '+p+'\n').join('')+'end_header\n'),Buffer.alloc(56)]);const path=join(root,'fixture.ply');await writeFile(path,data);
  assert.equal(run('import','test-scene',path).status,0);
  assert.deepEqual(await readFile(join(root,'assets-private/test-scene/original/fixture.ply')),data);
  assert.notEqual(run('import','test-scene',path).status,0);
  const status=JSON.parse(await readFile(join(root,'projects/test-scene/status.json'),'utf8'));assert.equal(status.stages.inspect,'complete');assert.equal(status.original.sha256.length,64);assert.equal(status.stages.publish,'pending');
  assert.equal(run('checkpoint','test-scene','cleanup','Manual review completed for test').status,0);
  assert.notEqual(run('checkpoint','test-scene','review','Skip ahead').status,0);
 }finally{await rm(root,{recursive:true,force:true});}
});
