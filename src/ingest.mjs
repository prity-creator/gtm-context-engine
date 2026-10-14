// Explicit field mappings avoid silently guessing provider payloads or identities.
const read=(obj,path)=>String(path).split('.').reduce((v,k)=>v?.[k],obj);
export function mapEvents(raw,mapping,contacts){
  const rows=mapping.rowsPath?read(raw,mapping.rowsPath):raw;
  if(!Array.isArray(rows))throw new Error('rowsPath must resolve to an array');
  if(!mapping.source||!mapping.channel)throw new Error('Mapping requires source and channel');
  const events=[],rejected=[];
  for(const [index,row] of rows.entries()){
    const identifier=read(row,mapping.identity.path);
    const matches=contacts.filter(c=>String(c[mapping.identity.contactField]||'').trim().toLowerCase()===String(identifier||'').trim().toLowerCase()&&identifier);
    if(matches.length!==1){rejected.push({index,reason:'Identity missing or non-unique'});continue;}
    const id=read(row,mapping.fields.id),at=read(row,mapping.fields.at),text=read(row,mapping.fields.text),direction=mapping.directions[read(row,mapping.fields.direction)];
    if(!id||!at||typeof text!=='string'||!direction){rejected.push({index,reason:'Missing mapped field or unsupported direction'});continue;}
    events.push({id:String(id),source:mapping.source,channel:mapping.channel,contactId:matches[0].id,at,text,direction});
  }
  return {events,rejected,coverage:'not_asserted',note:'Validate timestamps and source coverage before merging; no source marked complete by this mapping.'};
}
