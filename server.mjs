import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {openStore,createApi} from './backend/credentials.mjs';
const port=Number(process.env.PORT||5173);
const store=await openStore(resolve(process.env.MAVYS_DATA||'.mavys-data/credentials.json'));
const api=createApi(store,{secure:process.env.MAVYS_HTTPS==='1',origin:process.env.MAVYS_ORIGIN});
const root=resolve(process.env.MAVYS_STATIC_DIR||'.');
const classic=new Set(['index.html','legacy.html','styles.css','app.js','experience.js','experience.css','planner.js','planner.css','refinement.js','refinement.css','motion.js','motion.css','trail.js','trail.css','studio.js','studio.css','assets/sketch.jpg']);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
createServer(async(req,res)=>{try{
 const path=new URL(req.url,'http://localhost').pathname;if(await api(req,res,path))return;
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end()}
 const rel=path==='/'?'index.html':decodeURIComponent(path.slice(1));
 const full=resolve(root,rel), isDist=root===resolve('dist');
 if(!full.startsWith(root+sep)||(!classic.has(rel)&&!(isDist&&rel.startsWith('assets/')))){res.writeHead(404);return res.end('Not found')}
 if(!(await stat(full)).isFile()){res.writeHead(404);return res.end('Not found')}
 const bytes=await readFile(full);res.writeHead(200,{'Content-Type':mime[extname(full)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch(e){res.writeHead(e.code==='ENOENT'?404:500);res.end(e.code==='ENOENT'?'Not found':'Server error')}
}).listen(port,'127.0.0.1',()=>console.log('MAVYS 11: http://127.0.0.1:'+port));
