/**
 * Retrieve unchanged, CC BY 4.0 Figure 1 from Schauder & Bennetto (2016).
 * DOI 10.3389/fnins.2016.00268; see docs/editorial-image-sources.md.
 * Fail closed rather than substitute, generate, or hotlink another figure.
 */
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const original='https://www.frontiersin.org/files/Articles/195879/xml-images/fnins-10-00268-g0001.webp';
const dest=path.resolve('public/images/research/verified/schauder-bennetto-2016-sensory-processing-figure-1.webp');
function valid(bytes){
  return bytes.length>14000 && bytes.length<9000000 &&
    bytes.subarray(0,4).toString('ascii')==='RIFF' &&
    bytes.subarray(8,12).toString('ascii')==='WEBP' &&
    bytes.readUInt32LE(4)+8<=bytes.length;
}
await mkdir(path.dirname(dest),{recursive:true});
let already;
try{already=await readFile(dest)}catch{}
if(valid(already||Buffer.alloc(0))){
  console.log('Verified locally hosted Schauder and Bennetto scientific figure:',already.length,'bytes');
}else{
  let error;
  for(let n=1;n<=4;n++){
    try{
      const result=await fetch(original,{
        headers:{Accept:'image/webp,image/*;q=0.9', 'User-Agent':'AutismHub academic open-access figure attribution / https://github.com/Ruslan-Kurmashev/central-asia-autism-hub'},
        signal:AbortSignal.timeout(35000)
      });
      if(!result.ok)throw Error('HTTP '+result.status);
      const bytes=Buffer.from(await result.arrayBuffer());
      if(!valid(bytes))throw Error('Original publisher Figure 1 is not a valid WebP asset');
      await writeFile(dest,bytes);
      console.log('Acquired original Schauder and Bennetto Figure 1:',bytes.length,'bytes');
      error=null;
      break;
    }catch(e){
      error=e;
      if(n<4)await new Promise(resolve=>setTimeout(resolve,3500*n));
    }
  }
  if(error)throw Error('Cannot obtain licensed original Figure 1: '+error.message);
}
