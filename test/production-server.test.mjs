import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtemp,readFile,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const requiredScripts=[
 'app.js','experience.js','planner.js','refinement.js','motion.js','trail.js',
 'studio.js','editorial.js','care.js','visual.js','bridge.js'
];

async function availablePort(){
 const server=createServer();
 await new Promise(resolveListen=>server.listen(0,'127.0.0.1',resolveListen));
 const {port}=server.address();
 await new Promise(resolveClose=>server.close(resolveClose));
 return port;
}

async function waitForServer(url,child){
 for(let attempt=0;attempt<50;attempt+=1){
  if(child.exitCode!==null)throw new Error(`Production server exited with ${child.exitCode}`);
  try{const response=await fetch(url);if(response.ok)return}catch{}
  await new Promise(resolveWait=>setTimeout(resolveWait,50));
 }
 throw new Error('Timed out waiting for production server');
}

test('built application starts through the restrictive production server',async()=>{
 await stat(resolve('dist/index.html'));
 const dir=await mkdtemp(join(tmpdir(),'mavys-production-test-'));
 const port=await availablePort();
 const base=`http://127.0.0.1:${port}`;
 const child=spawn(process.execPath,['server.mjs'],{
  cwd:resolve('.'),
  env:{...process.env,PORT:String(port),MAVYS_STATIC_DIR:'dist',MAVYS_DATA:join(dir,'credentials.json')},
  stdio:['ignore','pipe','pipe']
 });
 try{
  await waitForServer(base+'/',child);
  for(const path of ['/', '/']){
   const response=await fetch(base+path);
   assert.equal(response.status,200);
   assert.match(response.headers.get('content-type')||'',/^text\/html/);
   assert.match(await response.text(),/<div id="startup">/);
  }
  const index=await (await fetch(base+'/')).text();
  const modulePath=index.match(/<script[^>]+src="([^"]+)"/)?.[1];
  assert.ok(modulePath,'built module entry is present');
  const startupScripts=[modulePath,...requiredScripts.map(name=>'/'+name)];
  for(const path of startupScripts){
   const response=await fetch(new URL(path,base));
   const body=await response.text();
   assert.equal(response.status,200,`${path} should be served`);
   assert.match(response.headers.get('content-type')||'',/javascript/,`${path} should be JavaScript`);
   assert.doesNotMatch(body,/^\s*<!doctype html/i,`${path} must not be an HTML fallback`);
   assert.ok(body.length>20,`${path} should contain JavaScript`);
   if(path==='/bridge.js')assert.match(body,/window\.MAVYSBridge=/);
  }
  const legacy=await fetch(base+'/legacy.html');
  assert.equal(legacy.status,200);
  assert.match(legacy.headers.get('content-type')||'',/^text\/html/);
  for(const path of ['/.env','/.mavys-data/credentials.json','/package.json','/server.mjs']){
   assert.equal((await fetch(base+path)).status,404,`${path} must stay private`);
  }
 }finally{
  child.kill('SIGTERM');
  await new Promise(resolveExit=>child.once('exit',resolveExit));
  await rm(dir,{recursive:true,force:true});
 }
});

test('Pages artifact resolves its assets below the /Mavys/ project path',async()=>{
 const root=resolve('version-14');
 const index=await readFile(join(root,'index.html'),'utf8');
 const references=[...index.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"#]*)?"/g)].map(match=>match[1]);
 assert.ok(references.length>0);
 for(const reference of references){
  assert.ok(!reference.startsWith('/'),`${reference} must remain relative for /Mavys/`);
  const file=resolve(root,reference);
  assert.ok(file.startsWith(root+'/'));
  assert.ok((await stat(file)).isFile(),`${reference} must exist in the Pages artifact`);
 }
 assert.equal(await stat(join(root,'app.js')).then(()=>true),true);
});
