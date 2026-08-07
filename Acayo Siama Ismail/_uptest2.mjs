import { readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
const file = join(tmpdir(), "big.mp4");
import { writeFileSync } from "fs";
writeFileSync(file, Buffer.alloc(45*1024*1024, 7));
const buf = readFileSync(file);
const fd = new FormData();
fd.append("title","Large Upload Test");
fd.append("description","Large file timing");
fd.append("quality","1080p");
fd.append("category","Test");
fd.append("tags","2026-08-07");
fd.append("video", new Blob([buf],{type:"video/mp4"}), "big.mp4");
fd.append("thumbnail", new Blob([new Uint8Array([137,80,78,71,13,10,26,10])],{type:"image/png"}), "thumb.png");
const t0=Date.now();
try{ const r=await fetch("https://videx-spv0.onrender.com/api/upload",{method:"POST",body:fd}); const txt=await r.text(); console.log("HTTP "+r.status+" in "+((Date.now()-t0)/1000).toFixed(1)+"s; body="+txt.slice(0,160)); }
catch(e){ console.log("NETWORK/FAIl in "+((Date.now()-t0)/1000).toFixed(1)+"s: "+e.message); }
