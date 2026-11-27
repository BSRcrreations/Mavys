/* Compatibility boundary: existing care workflows remain authoritative during migration. */
(function(){
  const subs=new Set();let version=0;
  const before=new Set();
  function snapshot(){
    const key=todayKey();
    const days=Array.from({length:7},(_,i)=>{
      const date=plannerShift(key,i), d=new Date(date+'T12:00:00');
      return {date,day:d.getDate(),weekday:d.toLocaleDateString(lang==='de'?'de-DE':'en-GB',{weekday:'short'}),today:date===key,appointments:plannerRequests(date).length,available:remaining(date)>0,reminder:state.reminders.includes(date)};
    });
    const next=state.requests.filter(r=>r.date>=key&&!['cancelled','redirected'].includes(r.status)).sort((a,b)=>a.date.localeCompare(b.date))[0];
    return {version,lang,screen:guestVoice?'voice':account?role+':'+route:'auth',authMode,loginRole,authError,authValues:{...authValues},days,next:next?{doctor:next.doctor,date:prettyDate(next.date),window:next.window}:null};
  }
  window.MAVYSBridge={snapshot,action:action=>onAction(action),subscribe:fn=>{subs.add(fn);return()=>subs.delete(fn)},beforeRender:fn=>{before.add(fn);return()=>before.delete(fn)}};
  const priorRender=render,priorLogin=renderLogin;let depth=0;
  function wrap(fn){return function(...args){const outer=depth++===0;if(outer)before.forEach(f=>f());try{return fn.apply(this,args)}finally{depth--;if(outer){version++;subs.forEach(f=>f())}}}}
  render=wrap(priorRender);renderLogin=wrap(priorLogin);
})();
