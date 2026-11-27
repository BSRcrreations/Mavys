/* Trail UI: light response, glass controls and version metadata */
const trailBaseRender=render,trailBaseLogin=renderLogin;
let trailDepth=0;
function trailDecorate(){
 const root=document.getElementById('app');if(!root?.querySelectorAll)return;
 root.querySelectorAll('.card,.tile,.hero,.planner-stat').forEach(el=>el.classList.add('trail-surface'));
 root.querySelectorAll('.btn:not(.danger),.choice,.mini-day,.planner-day').forEach(el=>el.classList.add('trail-touch'));
 const h=root.querySelector('.welcome-top,.top-left');
 if(h&&!h.querySelector('.trail-release')){const badge=document.createElement('span');badge.className='trail-release';badge.textContent='Version 12';h.appendChild(badge)}
}
function trailWrap(fn){return function(...args){const outer=trailDepth++===0;try{return fn.apply(this,args)}finally{trailDepth--;if(outer)trailDecorate()}}}
render=trailWrap(trailBaseRender);renderLogin=trailWrap(trailBaseLogin);
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||motionReduced())return;const el=e.target.closest?.('.trail-surface');if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty('--trail-x',((e.clientX-r.left)/Math.max(1,r.width)*100)+'%');el.style.setProperty('--trail-y',((e.clientY-r.top)/Math.max(1,r.height)*100)+'%')},{passive:true});
document.addEventListener('pointerdown',e=>{if(motionReduced()||e.button!==0)return;const el=e.target.closest?.('.trail-touch');if(!el||el.disabled)return;const r=el.getBoundingClientRect(),dot=document.createElement('span');dot.className='trail-ripple';dot.setAttribute('aria-hidden','true');dot.style.setProperty('--rx',(e.clientX-r.left)+'px');dot.style.setProperty('--ry',(e.clientY-r.top)+'px');el.appendChild(dot);dot.addEventListener('animationend',()=>dot.remove(),{once:true});setTimeout(()=>dot.remove(),650)},{passive:true});
trailDecorate();

/* Consultation selector: native form control remains the source of truth. */
function trailConsultationPicker(){
 const select=document.getElementById('type');if(!select||!select.closest)return;
 const field=select.closest('.field');if(!field)return;
 let group=field.querySelector('.consult-picker');
 if(!group){group=document.createElement('div');group.className='consult-picker consult-checklist';group.setAttribute('role','group');group.setAttribute('aria-label',lang==='de'?'Sprechstundenart':'Consultation type');select.insertAdjacentElement('afterend',group)}
 group.innerHTML=Array.from(select.options).map(o=>{const type=o.value,k=consultationKey(type),picked=type===select.value;return '<button type="button" class="consult-checkrow consult-'+k+(picked?' selected':'')+'" data-consult-value="'+esc(type)+'" aria-pressed="'+picked+'"><span>'+esc(consultationLabel(type))+'</span><span class="consult-check" aria-hidden="true">'+(picked?I('check'):'')+'</span></button>'}).join('');
 select.classList.add('consult-native','consult-native-accessible');
}
const trailConsultBook=book;
book=function(...args){trailConsultBook(...args);trailConsultationPicker()};
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-consult-value]');if(!b)return;const select=document.getElementById('type');if(!select)return;select.value=b.dataset.consultValue;select.dispatchEvent(new Event('change',{bubbles:true}));const next=Array.from(document.querySelectorAll('[data-consult-value]')).find(el=>el.dataset.consultValue===select.value);next?.focus({preventScroll:true})});
document.addEventListener('change',e=>{if(e.target.id==='type'||e.target.id==='book-date')trailConsultationPicker();if(e.target.id==='planner-mode'){e.target.dataset.consultation=consultationKey(e.target.value)}});
