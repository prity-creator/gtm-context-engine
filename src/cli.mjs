import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {reconcile,DEFAULT_POLICY} from './engine.mjs';
import {Connectors} from './connectors.mjs';
import {runPipeline} from './pipeline.mjs';
import {mapEvents} from './ingest.mjs';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
async function save(path,data){await mkdir(dirname(resolve(path)),{recursive:true,mode:0o700});await writeFile(path,JSON.stringify(data,null,2)+'\n',{mode:0o600});console.log(`Saved ${path}`);}
const [cmd,...args]=process.argv.slice(2);
try{
  const c=new Connectors();
  if(cmd==='analyze'){const d=await read(args[0]||'data/demo.json'),r=reconcile(d,args[1]?await read(args[1]):DEFAULT_POLICY);console.log(JSON.stringify(r,null,2));}
  else if(cmd==='check'){
    const groups={jev:['TYPESAFE_API_KEY'],gemini:['GEMINI_API_KEY','GEMINI_MODEL'],claude:['ANTHROPIC_API_KEY','CLAUDE_MODEL'],hubspot:['HUBSPOT_ACCESS_TOKEN'],smartlead:['SMARTLEAD_API_KEY'],apollo:['APOLLO_API_KEY'],google:['GOOGLE_ACCESS_TOKEN']};
    for(const [name,keys]of Object.entries(groups))console.log(`${name}: ${keys.every(k=>process.env[k])?'configured (not authenticated/tested)':'missing '+keys.filter(k=>!process.env[k]).join(', ')}`);
  }
  else if(cmd==='live'){
    if(!args.includes('--allow-external'))throw new Error('Live inference requires --allow-external. Selected account content will go to configured model providers.');
    const input=args[0],provider=args.includes('--claude')?'claude':'gemini';
    const policyIndex=args.indexOf('--policy');const policy=policyIndex>=0?await read(args[policyIndex+1]):DEFAULT_POLICY;
    let cache={};try{cache=await read('private/model-cache.json');}catch{}
    const output=await runPipeline(await read(input),{policy,connectors:c,cache,allowExternal:true,briefProvider:provider});
    await save('private/model-cache.json',output.cache);delete output.cache;await save('private/result.json',output);
  }
  else if(cmd==='pull'){
    if(!args.includes('--allow-external'))throw new Error('Use --allow-external for source API calls');
    const [provider,...p]=args;let value;
    if(provider==='hubspot')value=await c.hubspotContacts();
    else if(provider==='smartlead')value=await c.smartleadHistory(p[0],p[1]);
    else if(provider==='sheets')value=await c.sheetsValues(p[0],p[1]);
    else if(provider==='calendar')value=await c.calendarEvents(p[0],p[1],p[2]);
    else throw new Error('Supported pulls: hubspot, smartlead, sheets, calendar');
    await save(`private/${provider}-raw.json`,value);
  }
  else if(cmd==='enrich'){
    if(!args.includes('--allow-paid'))throw new Error('Apollo enrichment can consume credits. Add --allow-paid.');
    await save('private/apollo-person.json',await c.apolloPerson(args[0]));
  }
  else if(cmd==='map')await save('private/mapped-events.json',mapEvents(await read(args[0]),await read(args[1]),(await read(args[2])).contacts));
  else throw new Error('Commands: analyze [dataset] [policy] | check | live DATA --allow-external [--claude] [--policy FILE] | pull PROVIDER ... --allow-external | enrich EMAIL --allow-paid | map RAW MAPPING DATASET');
}catch(e){console.error(e.message);process.exitCode=1;}
