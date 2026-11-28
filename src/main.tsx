import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { MotionConfig } from 'motion/react';
import { AccountPanel } from './components/AccountPanel';
import { WeekCalendar } from './components/WeekCalendar';
import type { CareBridge } from './types';
import '../styles.css';
import '../experience.css';
import '../planner.css';
import '../refinement.css';
import '../motion.css';
import '../trail.css';
import '../studio.css';
import './modern.css';
import '../editorial.css';
import '../care.css';
import '../visual.css';
import '../voice.css';

const scripts=['app.js','experience.js','planner.js','refinement.js','motion.js','trail.js','studio.js','editorial.js','care.js','visual.js','voice.js','bridge.js'];
function loadClassic(name:string):Promise<void>{
 return new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=import.meta.env.BASE_URL+name;script.async=false;script.onload=()=>resolve();script.onerror=()=>reject(new Error('Unable to load '+name));document.head.appendChild(script);
 });
}
const roots:Root[]=[];
function clearRoots(){for(const root of roots.splice(0))root.unmount()}
function mount(bridge:CareBridge){
 const s=bridge.snapshot();
 // Replace only migrated views. All requests continue through the original shared state.
 const auth=document.querySelector('.welcome-main .auth-panel');
 if(s.screen==='auth'&&auth){const host=document.createElement('div');host.className='react-auth-host';auth.replaceWith(host);const root=createRoot(host);roots.push(root);flushSync(()=>root.render(<MotionConfig reducedMotion="user"><AccountPanel s={s}/></MotionConfig>))}
 for(const el of document.querySelectorAll('.mini-calendar')){
   const host=document.createElement('div');host.className='react-week-host';el.replaceWith(host);
   const root=createRoot(host);roots.push(root);flushSync(()=>root.render(<MotionConfig reducedMotion="user"><WeekCalendar s={s} appointmentsOnly={s.screen==='patient:appointments'}/></MotionConfig>));
 }
}
async function boot(){try{for(const script of scripts)await loadClassic(script);const bridge=window.MAVYSBridge;if(!bridge)throw new Error('Care bridge unavailable');bridge.beforeRender(clearRoots);bridge.subscribe(()=>mount(bridge));mount(bridge);document.getElementById('startup')?.remove()}catch(error){console.error(error);const el=document.getElementById('startup');if(el){el.innerHTML='<h1>MAVYS could not load</h1><p>Try the static edition or reload the page.</p><a href="./legacy.html">Open static edition</a>'}}}
void boot();
