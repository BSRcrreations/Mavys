/* V14 — photographic storytelling and readable, accessible clinical UI. */
const v14T=(en,de)=>tx(en,de);
const v14Assets={
 clinic:{id:'4266936',alt:'A clinician and patient discussing care with a tablet',credit:'Pexels',slug:'a-doctor-talking-to-a-patient-while-holding-a-tablet-4266936'},
 virtual:{id:'8376266',alt:'A clinician explaining medication in a remote consultation',credit:'Pexels',slug:'a-doctor-doing-online-consultation-8376266'},
 senior:{id:'8413336',alt:'A nurse and an older patient sharing a conversation',credit:'Pexels',slug:'a-person-having-conversation-8413336'},
 routine:{id:'5214997',alt:'A doctor measuring a patient’s blood pressure',credit:'Pexels',slug:'a-patient-having-a-consultation-with-her-doctor-5214997'},
 results:{id:'5327864',alt:'A medical professional discussing results with a patient',credit:'Pexels',slug:'medical-professional-sitting-on-a-chair-holding-a-tablet-while-talking-5327864'},
 home:{id:'8376212',alt:'A tablet set up for an online consultation at home',credit:'Pexels',slug:'a-doctor-doing-online-consultation-8376212'}
};
const v14Src=(key,w=1000)=>'https://images.pexels.com/photos/'+v14Assets[key].id+'/pexels-photo-'+v14Assets[key].id+'.jpeg?auto=compress&cs=tinysrgb&w='+w;
function v14Image(key,extra='',eager=false){
 const p=v14Assets[key];
 return '<figure class="v14-photo '+extra+'"><img src="'+v14Src(key)+'" srcset="'+v14Src(key,600)+' 600w, '+v14Src(key,1000)+' 1000w, '+v14Src(key,1600)+' 1600w" sizes="(max-width: 750px) 95vw, (max-width: 1200px) 60vw, 42vw" alt="'+esc(p.alt)+'" loading="'+(eager?'eager':'lazy')+'" decoding="async" referrerpolicy="no-referrer"><figcaption><a href="https://www.pexels.com/photo/'+p.slug+'/" target="_blank" rel="noopener noreferrer">Photo: '+p.credit+'</a></figcaption></figure>'
}
document.addEventListener('error',e=>{if(e.target?.matches?.('.v14-photo img'))e.target.closest('.v14-photo')?.classList.add('v14-photo-failed')},true);
const v14Stories=[
 {key:'senior',en:'Care that comes closer.',de:'Versorgung ganz nah.',desc:'Find a participating practice, even when travel is difficult.',descDe:'Finden Sie eine teilnehmende Praxis, auch wenn die Anreise schwierig ist.',cta:'Find a doctor',ctaDe:'Arzt finden',action:'nav:find',kicker:'LOCAL CARE',kickerDe:'VERSORGUNG VOR ORT'},
 {key:'virtual',en:'A conversation away.',de:'Ein Gespräch entfernt.',desc:'Arrange a callback or start a voice-assisted request.',descDe:'Vereinbaren Sie einen Rückruf oder starten Sie eine Sprachanfrage.',cta:'Talk to MAVYS',ctaDe:'Mit MAVYS sprechen',action:'v12-call',kicker:'REMOTE CARE',kickerDe:'FERNVERSORGUNG'},
 {key:'routine',en:'Make time for your health.',de:'Zeit für Ihre Gesundheit.',desc:'See upcoming visits, appointments and reminders.',descDe:'Sehen Sie kommende Termine und Erinnerungen.',cta:'Open calendar',ctaDe:'Kalender öffnen',action:'nav:calendar',kicker:'YOUR SCHEDULE',kickerDe:'IHR ZEITPLAN'},
 {key:'results',en:'Be heard. Get reviewed.',de:'Gehört werden.',desc:'Share a sample concern for a clinician to review.',descDe:'Teilen Sie eine fiktive Beschwerde zur ärztlichen Prüfung.',cta:'Share symptoms',ctaDe:'Symptome mitteilen',action:'nav:symptoms',kicker:'CLINICIAN REVIEW',kickerDe:'ÄRZTLICHE PRÜFUNG'},
 {key:'home',en:'Your care, at home.',de:'Versorgung zu Hause.',desc:'Follow your simulated prescription and pharmacy handover.',descDe:'Verfolgen Sie Ihr Beispielrezept und die Übergabe an die Apotheke.',cta:'Medication',ctaDe:'Medikation',action:'nav:medication',kicker:'CONTINUITY OF CARE',kickerDe:'WEITERBEHANDLUNG'}
];
function v14Showcase(){
 return '<section class="v14-showcase" aria-label="'+v14T('Explore your care','Versorgung entdecken')+'"><div class="v14-section-title"><div><p class="v14-kicker">'+v14T('EXPLORE MAVYS','MAVYS ENTDECKEN')+'</p><h2>'+v14T('Care, on your terms.','Versorgung nach Ihren Wünschen.')+'</h2></div><div class="v14-slide-controls"><button class="v14-slide-arrow" data-act="v14-slide:prev" aria-label="'+v14T('Previous story','Vorherige Karte')+'">‹</button><button class="v14-slide-arrow" data-act="v14-slide:next" aria-label="'+v14T('Next story','Nächste Karte')+'">›</button></div></div><div class="v14-slide-track" tabindex="0" aria-label="'+v14T('Scrollable healthcare stories','Scrollbare Versorgungskarten')+'">'+v14Stories.map((s,i)=>'<article class="v14-story" data-story="'+i+'">'+v14Image(s.key,'v14-story-photo')+'<div class="v14-story-copy"><p class="v14-kicker">'+v14T(s.kicker,s.kickerDe)+'</p><h3>'+v14T(s.en,s.de)+'</h3><p>'+v14T(s.desc,s.descDe)+'</p><button class="v14-action-link" data-act="'+s.action+'">'+v14T(s.cta,s.ctaDe)+' '+I('chevron')+'</button></div></article>').join('')+'</div><div class="v14-slide-footer"><div class="v14-slide-dots" aria-label="'+v14T('Choose story','Karte wählen')+'">'+v14Stories.map((s,i)=>'<button class="'+(i===0?'active':'')+'" data-act="v14-slide:'+i+'" aria-label="'+esc(v14T(s.en,s.de))+'" aria-current="'+(i===0?'true':'false')+'"></button>').join('')+'</div><span>'+v14T('Swipe or use arrows','Wischen oder Pfeile nutzen')+'</span></div></section>'
}
let v14Index=0;
function v14UpdateDots(track){
 if(!track?.querySelectorAll)return;const children=Array.from(track.querySelectorAll('.v14-story'));if(!children.length)return;
 const left=track.scrollLeft,base=children[0].offsetLeft;
 v14Index=children.reduce((best,el,i)=>Math.abs(el.offsetLeft-base-left)<Math.abs(children[best].offsetLeft-base-left)?i:best,0);
 if(track.scrollWidth-track.clientWidth-left<6&&left>0)v14Index=children.length-1;
 const section=track.closest('.v14-showcase');section?.querySelectorAll('.v14-slide-dots button').forEach((el,i)=>{el.classList.toggle('active',i===v14Index);el.setAttribute('aria-current',String(i===v14Index))});
 const prev=section?.querySelector('[data-act="v14-slide:prev"]'),next=section?.querySelector('[data-act="v14-slide:next"]');if(prev)prev.disabled=left<5;if(next)next.disabled=track.scrollWidth-track.clientWidth-left<5;
}
function v14Slide(value){
 const track=document.querySelector('.v14-slide-track');if(!track)return;const slides=Array.from(track.querySelectorAll('.v14-story'));if(!slides.length)return;
 const index=Math.max(0,Math.min(slides.length-1,value==='prev'?v14Index-1:value==='next'?v14Index+1:Number(value)||0));const behavior=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
 track.scrollTo({left:slides[index].offsetLeft-slides[0].offsetLeft,behavior});
}
const v14BaseHome=home;
home=function(){
 let html=v14BaseHome();
 // Keep all existing dashboard widgets; replace only the decorative hero and redundant feature panel.
 const hero='<section class="v14-hero"><div class="v14-hero-copy"><p class="v14-kicker">'+v14T('HEALTHCARE, MADE HUMAN','MENSCHLICHE VERSORGUNG')+'</p><h2>'+v14T('Good care.<br><span>Closer to you.</span>','Gute Versorgung.<br><span>Ganz nah.</span>')+'</h2><p>'+v14T('A simpler way to connect with a practice, arrange your care and stay in touch.','Ein einfacherer Weg, eine Praxis zu kontaktieren und Ihre Versorgung zu planen.')+'</p><div class="v14-hero-actions"><button class="btn" data-act="nav:find">'+v14T('Find a doctor','Arzt finden')+' '+I('chevron')+'</button><button class="v14-action-link" data-act="nav:symptoms">'+v14T('Share symptoms','Symptome mitteilen')+' '+I('chevron')+'</button></div><button class="v14-action-link v14-voice-link" data-act="v12-call">'+I('mic')+' '+v14T('Start a voice request','Sprachanfrage starten')+'</button></div><div class="v14-photo-composition">'+v14Image('clinic','v14-main-image',true)+v14Image('senior','v14-float-image',true)+'<div class="v14-photo-glass"><span class="v14-photo-dot"></span><div><strong>'+v14T('29 sample practices','29 Beispielpraxen')+'</strong><span>'+v14T('Across Germany','Deutschlandweit')+'</span></div></div></div></section>';
 html=html.replace(/<section class="hero v13-hero">[\s\S]*?<\/section>/,hero);
 html=html.replace(/<section class="v13-feature">[\s\S]*?<\/section>/,'');
 // A full-width carousel sits below the care dashboard, not inside a narrow side column.
 return html+v14Showcase();
};
const v14Render=render,v14Action=extraAction;
extraAction=function(k,v){if(k==='v14-slide'&&role==='patient'){v14Slide(v);return true}return v14Action(k,v)};
render=function(){v14Render();const root=document.getElementById('app');if(!root?.querySelector)return;
 const badge=root.querySelector('.trail-release');if(badge)badge.textContent='V14';
 if(!account&&!guestVoice){const panel=root.querySelector('.welcome-art'),photo=panel?.querySelector('.v13-login-photo');if(photo){photo.outerHTML='<div class="v14-login-composition">'+v14Image('clinic','v14-login-main',true)+v14Image('virtual','v14-login-float',true)+'</div>';panel.classList.add('v14-welcome')}}
 const track=root.querySelector('.v14-slide-track');if(track){track.addEventListener('scroll',()=>v14UpdateDots(track),{passive:true});track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();v14Slide(e.key==='ArrowRight'?'next':'prev')}});const slides=track.querySelectorAll('.v14-story');if(slides.length&&v14Index>0)track.scrollLeft=slides[Math.min(v14Index,slides.length-1)].offsetLeft-slides[0].offsetLeft;v14UpdateDots(track)}
};
render();
