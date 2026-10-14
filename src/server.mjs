import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const allow={'/':['index.html','text/html; charset=utf-8'],'/index.html':['index.html','text/html; charset=utf-8'],'/workflows/context-review.json':['workflows/context-review.json','application/json'],'/data/demo.json':['data/demo.json','application/json']};
const server=createServer(async(req,res)=>{
  const path=new URL(req.url,'http://127.0.0.1').pathname,entry=allow[path];
  if(req.method!=='GET'||!entry){res.writeHead(404);res.end('Not found');return;}
  try{res.writeHead(200,{'Content-Type':entry[1],'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(await readFile(root+entry[0]));}catch{res.writeHead(500);res.end('Build the demo first: npm run build');}
});
server.listen(4174,'127.0.0.1',()=>console.log('GTM Context Engine: http://127.0.0.1:4174'));
