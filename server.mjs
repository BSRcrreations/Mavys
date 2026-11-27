import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('./index.html', import.meta.url));
const port = Number(process.env.PORT || 5173);
createServer(async (req,res)=>{
  if(req.url==='/' || req.url?.startsWith('/index.html')){
    try{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(await readFile(root));}catch{res.writeHead(500);res.end('Could not read index.html');}
  }else{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`MAVYS ready: http://localhost:${port}`));
