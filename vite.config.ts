import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync, cpSync, renameSync } from 'node:fs';

const classic=['app.js','experience.js','planner.js','refinement.js','motion.js','trail.js','bridge.js'];
const styles=['styles.css','experience.css','planner.css','refinement.css','motion.css','trail.css'];
export default defineConfig({
 base:'./',publicDir:false,
 plugins:[react(),{
  name:'mavys-compatibility-assets',
  configureServer(server){server.middlewares.use((req,_res,next)=>{if(req.url==='/'||req.url==='/index.html')req.url='/modern.html';next()})},
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
