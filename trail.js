/* Trail UI: light response, glass controls and version metadata */
const trailBaseRender=render,trailBaseLogin=renderLogin;
let trailDepth=0;
function trailDecorate(){
 const root=document.getElementById('app');if(!root?.querySelectorAll)return;
 root.querySelectorAll('.card,.tile,.hero,.planner-stat').forEach(el=>el.classList.add('trail-surface'));
 root.querySelectorAll('.btn:not(.danger),.choice,.mini-day,.planner-day').forEach(el=>el.classList.add('trail-touch'));
 const h=root.querySelector('.welcome-top,.top-left');
 if(h&&!h.querySelector('.trail-release')){const badge=document.createElement('span');badge.className='trail-release';badge.textContent='Version 8 · Trail UI';h.appendChild(badge)}
}
function trailWrap(fn){return function(...args){const outer=trailDepth++===0;try{return fn.apply(this,args)}finally{trailDepth--;if(outer)trailDecorate()}}}
render=trailWrap(trailBaseRender);renderLogin=trailWrap(trailBaseLogin);
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||motionReduced())return;const el=e.target.closest?.('.trail-surface');if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty('--trail-x',((e.clientX-r.left)/Math.max(1,r.width)*100)+'%');el.style.setProperty('--trail-y',((e.clientY-r.top)/Math.max(1,r.height)*100)+'%')},{passive:true});
document.addEventListener('pointerdown',e=>{if(motionReduced()||e.button!==0)return;const el=e.target.closest?.('.trail-touch');if(!el||el.disabled)return;const r=el.getBoundingClientRect(),dot=document.createElement('span');dot.className='trail-ripple';dot.setAttribute('aria-hidden','true');dot.style.setProperty('--rx',(e.clientX-r.left)+'px');dot.style.setProperty('--ry',(e.clientY-r.top)+'px');el.appendChild(dot);dot.addEventListener('animationend',()=>dot.remove(),{once:true});setTimeout(()=>dot.remove(),650)},{passive:true});
trailDecorate();
