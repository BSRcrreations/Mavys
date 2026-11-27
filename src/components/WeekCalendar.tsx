import { motion } from 'motion/react';
import { CalendarDays, ChevronRight } from 'lucide-react';
import type { CareSnapshot } from '../types';

export function WeekCalendar({s,appointmentsOnly=false}:{s:CareSnapshot;appointmentsOnly?:boolean}){
 const de=s.lang==='de', t=(en:string,german:string)=>de?german:en;
 return <motion.section className="card mini-calendar react-week" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:300,damping:29}}>
  <div className="section-head"><div><div className="eyebrow">{t('YOUR SCHEDULE','IHR ZEITPLAN')}</div><h2>{appointmentsOnly?t('Appointment calendar','Terminkalender'):t('Your week','Ihre Woche')}</h2></div><button className="quiet-link" data-act={appointmentsOnly?'appt-view:calendar':'nav:calendar'}>{t('Open calendar','Kalender öffnen')}<ChevronRight size={18}/></button></div>
  <div className="mini-week">{s.days.map((d,i)=><motion.button key={d.date} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:380,damping:28,delay:i*.035}} whileTap={{scale:.94}} className={'mini-day '+(d.today?'today':'')} data-act={'mini-date:'+d.date} aria-label={d.date}>
   <small>{d.weekday}</small><strong>{d.day}</strong><span className="mini-dots">{!!d.appointments&&<i className="appt-dot"/>}{!appointmentsOnly&&d.available&&<i className="slot-dot"/>}{!appointmentsOnly&&d.reminder&&<i className="rem-dot"/>}</span>
  </motion.button>)}</div>
  <div className="mini-next">{s.next?<><span className="float-icon"><CalendarDays size={20}/></span><div><strong>{s.next.doctor}</strong><p className="small muted">{s.next.date} · {s.next.window}</p></div></>:<p className="small muted">{t('No upcoming appointments. Select a day to plan your care.','Keine anstehenden Termine. Wählen Sie einen Tag für Ihre Planung.')}</p>}</div>
 </motion.section>
}
