const V='acordes-v6';
const LOCAL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
const EXTLIBS=[
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(V);
    await c.addAll(LOCAL);
    for(const lib of EXTLIBS){
      try{await c.put(lib,await fetch(lib,{mode:'no-cors'}))}catch(_){}
    }
    self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{
    if(n&&n.ok&&new URL(e.request.url).origin===location.origin){const cp=n.clone();caches.open(V).then(c=>c.put(e.request,cp))}
    return n;
  })));
});
