// Pozele și albumele vin din continut/site.json, pe care Vlad îl editează din Pages CMS.

// Traducerea în engleză: cheia este textul românesc exact din pagină.
const EN={
  'Portofoliu':'Portfolio','Albume':'Albums','Servicii':'Services','Despre':'About','Programare':'Book',
  'Portrete, street':'Portraits, street','și nunți.':'and weddings.',
  'Sunt Vlad Andreev, fotograf. O ședință durează până la 2 ore, iar toate fotografiile le primești editate, pe link și pe stick USB.':"I'm Vlad Andreev, a photographer. A session lasts up to 2 hours, and you get every photo edited, by link and on a USB stick.",
  'Programează o ședință':'Book a session','Vezi portofoliul':'See the portfolio',
  'Portret':'Portrait','Modă':'Fashion','Nuntă':'Wedding','Cuplu':'Couple','Alb-negru':'Black & white','Evenimente':'Events','Voucher cadou':'Gift voucher',
  'Ședința foto':'The photo session','Prețul e flexibil. Scrie-mi ce fel de fotografii vrei și îți trimit o ofertă.':"The price is flexible. Tell me what kind of photos you want and I'll send you a quote.",
  'Ce primești':'What you get','Până la 2 ore de fotografiere':'Up to 2 hours of shooting','1 fotograf':'1 photographer','Toate imaginile editate':'All images edited','Fișiere la rezoluție mare':'High-resolution files','Pe link și pe stick USB':'By link and on a USB stick','Cere o ofertă':'Ask for a quote',
  'Voucher cadou.':'Gift voucher.','Oferă cuiva drag o ședință foto. Scrie-mi și pregătesc voucherul.':"Give someone you love a photo session. Message me and I'll prepare the voucher.",
  'Despre mine':'About me','Sunt Vlad Andreev. Fotografiez ședințe individuale, cupluri, nunți și evenimente.':"I'm Vlad Andreev. I photograph individual sessions, couples, weddings and events.",'Hai să vorbim':"Let's talk",
  'Urmărește pe Instagram':'Follow on Instagram',
  'Spune-mi ce fel de fotografii îți dorești și când. Îți răspund cu o propunere de loc, oră și preț.':"Tell me what kind of photos you'd like and when. I'll reply with a suggested place, time and price.",
  'Scrie pe WhatsApp':'Message on WhatsApp','Site realizat de':'Website by',
  'Toate albumele':'All albums','Albumul nu a fost găsit.':'Album not found.',
  'Portret alb-negru de modă pe stradă':'Black and white street fashion portrait','Vlad Andreev cu aparatul foto la un eveniment':'Vlad Andreev with his camera at an event',
  'Vlad Andreev · Fotograf':'Vlad Andreev · Photographer',
  'Vlad Andreev, fotograf: portrete, modă, nunți și cupluri. Programează o ședință foto.':'Vlad Andreev, photographer: portraits, fashion, weddings and couples. Book a photo session.'
};
const CAT={portret:['Portret','Portrait'],moda:['Modă & street','Fashion & street'],nunta:['Nuntă & cuplu','Wedding & couple'],evenimente:['Evenimente','Events']};

let limbaCurenta='ro',date=null,filtru='toate';
const $=s=>document.querySelector(s);
const tr=(ro,en)=>limbaCurenta==='en'&&en?en:ro;
const cat=c=>CAT[c]?tr(CAT[c][0],CAT[c][1]):c;
// Copia mică (800 px) e făcută de GitHub după urcare; până atunci se folosește originalul.
const mic=src=>src.replace(/^\/?img\//,'/img-mic/');
const slug=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

function el(tag,attrs,...copii){
  const e=document.createElement(tag);
  for(const k in attrs||{})k.startsWith('on')?e.addEventListener(k.slice(2),attrs[k]):e.setAttribute(k,attrs[k]);
  e.append(...copii);return e;
}
function poza(src,cls){
  const i=el('img',{src:mic(src),loading:'lazy',alt:'',class:cls||''});
  i.addEventListener('error',()=>{if(i.src!==location.origin+src)i.src=src},{once:true});
  return i;
}

// --- lightbox ---
let lista=[],pozitie=0;
const lb=$('dialog.lb');
function arata(i){pozitie=(i+lista.length)%lista.length;lb.querySelector('img').src=lista[pozitie];}
function deschide(srcs,i){lista=srcs;arata(i);lb.showModal();}
if(lb){
  lb.querySelector('.x').onclick=()=>lb.close();
  lb.querySelector('.prev').onclick=()=>arata(pozitie-1);
  lb.querySelector('.next').onclick=()=>arata(pozitie+1);
  lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='IMG')lb.close()});
  document.addEventListener('keydown',e=>{if(!lb.open)return;if(e.key==='ArrowLeft')arata(pozitie-1);if(e.key==='ArrowRight')arata(pozitie+1);});
}

function grila(container,poze,categorii){
  container.replaceChildren(...poze.map((src,i)=>{
    const f=el('figure',{'data-c':categorii?categorii[i]:'',onclick:()=>deschide(poze,i)},poza(src));
    if(filtru!=='toate'&&categorii&&categorii[i]!==filtru)f.classList.add('hide');
    return f;
  }));
}

// --- prima pagină ---
function filtreaza(f){
  filtru=f;
  document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('on',b.dataset.f===f));
  document.querySelectorAll('.grid figure').forEach(x=>x.classList.toggle('hide',f!=='toate'&&x.dataset.c!==f));
}
function randeazaAcasa(){
  const port=date.portofoliu||[],albume=date.albume||[];
  const prezente=Object.keys(CAT).filter(c=>port.some(p=>p.categorie===c));
  $('.filters').replaceChildren(...['toate',...prezente].map(c=>el('button',{'data-f':c,class:c===filtru?'on':'',onclick:()=>filtreaza(c)},c==='toate'?tr('Toate','All'):cat(c))));
  grila($('.grid'),port.map(p=>p.imagine),port.map(p=>p.categorie));
  $('.albums').replaceChildren(...albume.map(a=>el('a',{class:'album',href:'album.html?a='+slug(a.titlu)},
    poza(a.coperta||(a.poze||[])[0]||''),
    el('div',{},el('b',{},tr(a.titlu,a.titlu_en)),el('span',{},cat(a.categorie)+' · '+(a.poze||[]).length+tr(' fotografii',' photos'))))));
  $('.ig').replaceChildren(...port.slice(0,6).map(p=>el('a',{href:'https://www.instagram.com/vlad_photograf/',target:'_blank',rel:'noopener'},poza(p.imagine))));
}

// --- pagina de album ---
function randeazaAlbum(){
  const a=(date.albume||[]).find(x=>slug(x.titlu)===new URLSearchParams(location.search).get('a'));
  if(!a){$('.album-head h1').textContent=tr('Albumul nu a fost găsit.','Album not found.');return;}
  const titlu=tr(a.titlu,a.titlu_en);
  $('.album-head h1').textContent=titlu;
  $('.album-head p').textContent=cat(a.categorie)+' · '+(a.poze||[]).length+tr(' fotografii',' photos');
  document.title=titlu+' · Vlad Andreev';
  grila($('.grid'),a.poze||[]);
}
const randeaza=()=>date&&($('.album-head')?randeazaAlbum():randeazaAcasa());

// --- limba ---
const desc=document.querySelector('meta[name=description]'),texte=[];
const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
while(w.nextNode()){const n=w.currentNode,k=n.nodeValue.trim();if(EN[k])texte.push([n,n.nodeValue,n.nodeValue.replace(k,EN[k])]);}
const alturi=[...document.querySelectorAll('img[alt]')].filter(i=>EN[i.alt]).map(i=>[i,i.alt,EN[i.alt]]);
const titlu=[document.title,EN[document.title]||document.title],descriere=desc?[desc.content,EN[desc.content]||desc.content]:null;
function limba(l){
  limbaCurenta=l;const e=l==='en'?2:1;
  texte.forEach(x=>x[0].nodeValue=x[e]);
  alturi.forEach(x=>x[0].alt=x[e]);
  document.title=titlu[e-1];if(descriere)desc.content=descriere[e-1];
  document.documentElement.lang=l;
  document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.l===l));
  randeaza();
}
document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>{limba(b.dataset.l);try{localStorage.setItem('limba',b.dataset.l)}catch(e){}});
let salvata=null;try{salvata=localStorage.getItem('limba')}catch(e){}
// ?lang=en din link se ține minte, ca albumele să se deschidă tot în engleză.
const ceruta=new URLSearchParams(location.search).get('lang');
if(ceruta==='en'||ceruta==='ro'){salvata=ceruta;try{localStorage.setItem('limba',ceruta)}catch(e){}}
limba(salvata==='en'?'en':'ro');

document.querySelectorAll('.tags a[data-f]').forEach(a=>a.addEventListener('click',()=>filtreaza(a.dataset.f)));
fetch('continut/site.json',{cache:'no-cache'}).then(r=>r.json()).then(d=>{date=d;limba(limbaCurenta);});
