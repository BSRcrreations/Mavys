import { defineConfig } from 'vite';
import {openStore,createApi} from './backend/credentials.mjs';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync, cpSync, renameSync } from 'node:fs';

const classic=['app.js','experience.js','planner.js','refinement.js','motion.js','trail.js','studio.js','editorial.js','care.js','bridge.js'];
const styles=['styles.css','experience.css','planner.css','refinement.css','motion.css','trail.css','studio.css','editorial.css','care.css'];
export default defineConfig({
 base:'./',publicDir:false,
 plugins:[react(),{
  name:'mavys-compatibility-assets',
  async configureServer(server){const store=await openStore(resolve(process.env.MAVYS_DATA||'.mavys-data/credentials.json'));const api=createApi(store);server.middlewares.use(async(req,res,next)=>{const path=new URL(req.url||'/','http://localhost').pathname;if(await api(req,res,path))return;if(req.url==='/'||req.url==='/index.html')req.url='/modern.html';next()})},
  closeBundle(){
   const out=resolve('dist');mkdirSync(out,{recursive:true});
   for(const path of [...classic,...styles])copyFileSync(resolve(path),resolve(out,path));
   cpSync(resolve('assets'),resolve(out,'assets'),{recursive:true});
   copyFileSync(resolve('index.html'),resolve(out,'legacy.html'));
   renameSync(resolve(out,'modern.html'),resolve(out,'index.html'));
  }
 }],
 build:{rollupOptions:{input:resolve('modern.html')}},
 server:{host:'127.0.0.1',port:5173}
});
