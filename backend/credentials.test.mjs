import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'node:http';
import {openStore,createApi,reviewProfile,checkPassword} from './credentials.mjs';

test('doctor credential flow: auth, draft, submission, reviewer decision and access control',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'mavys-test-'));
 const store=await openStore(join(dir,'data.json'));
 const api=createApi(store);
 const server=createServer((req,res)=>api(req,res,new URL(req.url,'http://localhost').pathname));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 let cookie='';
 async function request(path,method='GET',body,useCookie=true){
  const res=await fetch(base+'/api/'+path,{method,headers:{...(method==='GET'?{}:{'Content-Type':'application/json'}),...(useCookie&&cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
  if(res.headers.get('set-cookie'))cookie=res.headers.get('set-cookie').split(';')[0];
  return {status:res.status,data:await res.json()};
 }
 try{
  const p={name:'Sample Doctor',specialty:'Family medicine',practice:'Sample practice',city:'Gochsheim',qualification:'Sample degree',licenceAuthority:'Sample authority',reference:'TEST-123'};
  assert.equal((await request('doctor/profile','PUT',{profile:p},false)).status,401);
  assert.equal((await request('doctor/auth','POST',{email:'doctor@example.com',password:'sample-only-123',mode:'signup'})).status,200);
  assert.notEqual(store.data.accounts[0].hash,'sample-only-123');
  assert.ok(checkPassword(store.data.accounts[0],'sample-only-123'));
  assert.equal((await request('doctor/profile','PUT',{profile:{},submit:true})).status,400);
  assert.equal((await request('doctor/profile','PUT',{profile:p,status:'approved',submit:false})).data.account.status,'draft');
  assert.equal((await request('doctor/profile','PUT',{profile:p,submit:true})).data.account.status,'pending');
  assert.equal((await request('doctor/profile','PUT',{profile:p,submit:true})).status,409);
  await reviewProfile(store,'doctor@example.com','approved','Fictional evidence reviewed.');
  assert.equal((await request('doctor/session')).data.account.status,'approved');
  await request('doctor/logout','POST',{});
  assert.equal((await request('doctor/session')).data.account,null);
  assert.equal((await request('doctor/auth','POST',{email:'doctor@example.com',password:'wrong-password',mode:'signin'})).status,401);
  assert.equal((await request('doctor/auth','POST',{email:'doctor@example.com',password:'sample-only-123',mode:'signin'})).data.account.status,'approved');
  assert.equal((await openStore(join(dir,'data.json'))).data.accounts[0].status,'approved');
 }finally{await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true})}
});
