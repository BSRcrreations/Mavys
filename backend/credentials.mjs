import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { dirname } from 'node:path';

const statuses=['draft','pending','approved','changes_requested'];
const text=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const cleanEmail=v=>text(v,120).toLowerCase();
const profileFields={name:80,specialty:100,practice:120,city:100,qualification:150,institution:150,licenceAuthority:120,reference:100,experience:100,languages:120,bio:700};
const hash=(password,salt)=>scryptSync(password,salt,64).toString('hex');
const token=()=>randomBytes(32).toString('hex');
export async function openStore(file){
 await mkdir(dirname(file),{recursive:true,mode:0o700});
 let data;try{data=JSON.parse(await readFile(file,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e;data={accounts:[]}}
 let queue=Promise.resolve();
 const save=()=>{const snapshot=JSON.stringify(data,null,2);queue=queue.catch(()=>{}).then(async()=>{const tmp=file+'.tmp';await writeFile(tmp,snapshot,{mode:0o600});await rename(tmp,file)});return queue};
 return {data,save};
}
export function publicProfile(a){return {email:a.email,profile:a.profile||{},status:statuses.includes(a.status)?a.status:'draft',submittedAt:a.submittedAt||null,reviewedAt:a.reviewedAt||null,reviewNote:a.reviewNote||''}}
export function validateProfile(body){
 const p=Object.fromEntries(Object.entries(profileFields).map(([k,n])=>[k,text(body?.[k],n)]));
 if(!p.name||!p.specialty||!p.practice||!p.city||!p.qualification||!p.licenceAuthority||!p.reference)throw Error('Complete name, specialty, practice, city, qualification, licence authority and sample reference.');
 return p;
}
export function makeAccount(email,password){
 email=cleanEmail(email);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=='string'||password.length<8||password.length>128)throw Error('Use a sample email and a password of 8–128 characters.');
 const salt=randomBytes(16).toString('hex');
 return {id:token(),email,salt,hash:hash(password,salt),profile:{},status:'draft'};
}
export function checkPassword(a,password){return !!a&&typeof password==='string'&&password.length<=128&&timingSafeEqual(Buffer.from(a.hash,'hex'),Buffer.from(hash(password,a.salt),'hex'))}
export async function reviewProfile(store,email,decision,note){
 const a=store.data.accounts.find(a=>a.email===cleanEmail(email));
 if(!a||a.status!=='pending')throw Error('No pending application for this sample email.');
 if(!['approved','changes_requested'].includes(decision))throw Error('Decision must be approved or changes_requested.');
 a.status=decision;a.reviewNote=text(note,500);a.reviewedAt=new Date().toISOString();await store.save();return publicProfile(a);
}
export function createApi(store,{secure=false,origin}={}){
 const sessions=new Map(), attempts=new Map();
 const send=(res,status,data,headers={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});res.end(JSON.stringify(data))};
 const cookie=(id,age)=>'mavys_credential='+id+'; HttpOnly; SameSite=Strict; Path=/; Max-Age='+age+(secure?'; Secure':'');
 const session=req=>{const id=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('mavys_credential='))?.slice(17);const s=sessions.get(id);if(!s||s.expires<Date.now()){if(id)sessions.delete(id);return null}return {id,a:store.data.accounts.find(a=>a.id===s.account)}};
 async function json(req){let size=0, chunks=[];for await(const part of req){size+=part.length;if(size>16384)throw Error('Request is too large.');chunks.push(part)}return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}')}
 return async function api(req,res,path){
  if(!path.startsWith('/api/'))return false;
  const method=req.method;
  if(!['GET','POST','PUT'].includes(method)){send(res,405,{error:'Method not allowed'});return true}
  if(method!=='GET'){
   const allowed=origin||'http://'+req.headers.host;
   if(req.headers.origin&&req.headers.origin!==allowed){send(res,403,{error:'Origin not allowed'});return true}
   if(!String(req.headers['content-type']||'').startsWith('application/json')){send(res,415,{error:'JSON required'});return true}
  }
  try{
   if(path==='/api/health'&&method==='GET'){send(res,200,{ok:true,version:'11.0.0',scope:'fictional credential workflow'});return true}
   if(path==='/api/doctor/session'&&method==='GET'){const s=session(req);send(res,200,{account:s?.a?publicProfile(s.a):null});return true}
   if(path==='/api/doctor/auth'&&method==='POST'){
    const body=await json(req),email=cleanEmail(body.email),key=req.socket.remoteAddress||'local',now=Date.now(),bucket=attempts.get(key)||{start:now,count:0};
    if(now-bucket.start>60000){bucket.start=now;bucket.count=0}bucket.count++;attempts.set(key,bucket);
    if(bucket.count>15){send(res,429,{error:'Too many attempts. Try again in a minute.'});return true}
    let a=store.data.accounts.find(x=>x.email===email);
    if(body.mode==='signup'){if(a){send(res,409,{error:'Profile account already exists. Connect instead.'});return true}a=makeAccount(email,body.password);store.data.accounts.push(a);await store.save()}
    else if(!checkPassword(a,body.password)){send(res,401,{error:'Email or password is incorrect.'});return true}
    const old=session(req);if(old)sessions.delete(old.id);const id=token();sessions.set(id,{account:a.id,expires:now+8*3600000});send(res,200,{account:publicProfile(a)},{'Set-Cookie':cookie(id,8*3600)});return true
   }
   if(path==='/api/doctor/logout'&&method==='POST'){const s=session(req);if(s)sessions.delete(s.id);send(res,200,{ok:true},{'Set-Cookie':cookie('',0)});return true}
   if(path==='/api/doctor/profile'&&method==='PUT'){
    const s=session(req);if(!s?.a){send(res,401,{error:'Connect your profile account first.'});return true}
    const body=await json(req),a=s.a;if(a.status==='pending'){send(res,409,{error:'Application is awaiting review.'});return true}
    a.profile=validateProfile(body.profile);a.status=body.submit?'pending':'draft';a.submittedAt=body.submit?new Date().toISOString():null;a.reviewedAt=null;a.reviewNote='';await store.save();send(res,200,{account:publicProfile(a)});return true
   }
   send(res,404,{error:'Not found'});return true;
  }catch(e){send(res,400,{error:e instanceof SyntaxError?'Invalid JSON':e.message||'Request failed'});return true}
 }
}
