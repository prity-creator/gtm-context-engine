import {createHash} from 'node:crypto';
import {reconcile,contextPack,validateModelBrief,DEFAULT_POLICY} from './engine.mjs';
import {BRIEF_INSTRUCTIONS} from './connectors.mjs';
export async function runPipeline(data,{policy=DEFAULT_POLICY,connectors,cache={},allowExternal=false,briefProvider='gemini'}={}){
  const result=reconcile(data,policy),ledger={requests:0,estimatedUsd:0,cacheHits:0,events:[]};
  if(!allowExternal)return {result,ledger,cache};
  if(!connectors)throw new Error('Connectors required');
  if(!['gemini','claude'].includes(briefProvider))throw new Error('Unsupported brief provider');
  const cfg={...DEFAULT_POLICY,...policy};
  if(!Number.isInteger(cfg.maxModelCalls)||cfg.maxModelCalls<0||!Number.isFinite(cfg.estimatedRunBudgetUsd)||cfg.estimatedRunBudgetUsd<0)throw new Error('Invalid run limits');
  async function call(provider,pack){
    const model=connectors.env?.[{jev:'JEV_MODEL',gemini:'GEMINI_MODEL',claude:'CLAUDE_MODEL'}[provider]]||'unspecified';
    const key=createHash('sha256').update(JSON.stringify({provider,model,pack,instructions:BRIEF_INSTRUCTIONS,policy:cfg})).digest('hex');
    if(Object.hasOwn(cache,key)){ledger.cacheHits++;return cache[key];}
    const cost=cfg.estimatedCallUsd?.[provider];
    if(!Number.isFinite(cost)||cost<=0)throw new Error('Configure a positive estimated call cost');
    if(ledger.requests>=cfg.maxModelCalls||ledger.estimatedUsd+cost>cfg.estimatedRunBudgetUsd)throw new Error('Run request/estimated cost limit reached');
    if(JSON.stringify(pack).length>cfg.maxInputChars)throw new Error('Account context exceeds configured size limit');
    ledger.requests++;ledger.estimatedUsd+=cost;
    try{const r=await connectors[provider](pack,BRIEF_INSTRUCTIONS);cache[key]=r;ledger.events.push({provider,accountId:pack.account.id,status:'returned',estimatedUsd:cost,usage:r.usage||null});return r;}
    catch(e){ledger.events.push({provider,accountId:pack.account.id,status:'failed',estimatedUsd:cost});throw e;}
  }
  for(const account of result.accounts){
    if(account.modelRoute==='code_only')continue;
    const pack=contextPack(result,account.id);
    // Minimise disclosure: source text is needed, personal addresses/profile links are not.
    const externalPack=structuredClone(pack);
    for(const c of externalPack.account.contacts){delete c.email;delete c.linkedin;}
    try{
      const decision=await call('jev',externalPack);account.modelDecision=decision;
      if(decision.confidence<cfg.modelConfidenceThreshold||decision.choice==='escalate'){
        account.modelStatus='escalation_available';
        if(briefProvider!=='claude')continue;
      } else if(['wait','research'].includes(decision.choice)){account.modelStatus='no_generation_recommended';continue;}
      const generation=await call(briefProvider,externalPack);
      account.generatedBrief=validateModelBrief(generation.brief,pack);account.modelStatus='brief_needs_review';
    }catch(e){account.modelStatus='unavailable';account.modelError=e.message;}
  }
  ledger.disclaimer='Estimated model costs only, not provider billing or a guaranteed financial cap. Request count is enforced. Paid failures remain charged in the estimate. Enrichment and subscriptions are separate.';
  return {result,ledger,cache};
}
