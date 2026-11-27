import { useState } from 'react';
import { motion } from 'motion/react';
import type { CareSnapshot } from '../types';
import { ArrowRight, Eye, EyeOff, Stethoscope, UserRound } from 'lucide-react';

export function AccountPanel({s}:{s:CareSnapshot}) {
 const de=s.lang==='de', t=(en:string,german:string)=>de?german:en;
 const signup=s.authMode==='signup';
 const [show,setShow]=useState(false);
 return <motion.div className="auth-panel react-auth" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:290,damping:27}}>
  <div className="auth-heading">
   <span className="welcome-kicker">{signup?t('JOIN MAVYS','BEI MAVYS REGISTRIEREN'):t('YOUR CARE ACCOUNT','IHR KONTO')}</span>
   <h2>{signup?t('Create your account.','Konto erstellen.'):t('Welcome back.','Willkommen zurück.')}</h2>
   <p>{signup?t('Choose how you want to use MAVYS.','Wählen Sie, wie Sie MAVYS nutzen möchten.'):t('Sign in to continue to your care.','Melden Sie sich an, um fortzufahren.')}</p>
  </div>
  <div className="auth-role trail-react-role" role="group" aria-label={t('Account type','Kontotyp')}>
   {(['patient','doctor'] as const).map(r=><button key={r} type="button" className={s.loginRole===r?'is-active':''} data-act={'login-role:'+r} aria-pressed={s.loginRole===r}>{s.loginRole===r&&<motion.span className="trail-react-pill" layoutId="trail-account-role" transition={{type:"spring",stiffness:360,damping:30}}/>}{r==='patient'?<UserRound size={19}/>:<Stethoscope size={19}/>} {r==='patient'?'Patient':t('Doctor','Arzt')}</button>)}
  </div>
  <form id="account-form" className="auth-fields">
   {signup&&<div className="field"><label htmlFor="auth-name">{t('Your name','Ihr Name')}</label><input id="auth-name" name="name" autoComplete="nickname" required maxLength={60} defaultValue={s.authValues.name}/></div>}
   <div className="field"><label htmlFor="auth-email">{t('Email address','E-Mail-Adresse')}</label><input id="auth-email" name="email" type="email" autoComplete="username" required maxLength={120} defaultValue={s.authValues.email} placeholder="you@example.com"/></div>
   <div className="field"><label htmlFor="auth-password">{t('Password','Passwort')}</label><div className="password-field"><input id="auth-password" name="password" type={show?'text':'password'} autoComplete={signup?'new-password':'current-password'} minLength={8} maxLength={128} required defaultValue={s.authValues.password}/><button type="button" onClick={()=>setShow(v=>!v)} className="quiet-link" aria-label={show?t('Hide password','Passwort ausblenden'):t('Show password','Passwort anzeigen')}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></div>
   {s.authError&&<p className="auth-error" role="alert">{s.authError}</p>}
   <motion.button type="submit" className="btn auth-primary" whileTap={{scale:.98}} transition={{type:'spring',stiffness:450,damping:26}}>{signup?t('Create account','Konto erstellen'):t('Sign in','Anmelden')}<ArrowRight size={20}/></motion.button>
  </form>
  <p className="auth-switch">{signup?t('Already have an account?','Schon ein Konto?'):t('New to MAVYS?','Neu bei MAVYS?')} <button type="button" data-act={'auth-mode:'+(signup?'signin':'signup')} className="quiet-link">{signup?t('Sign in','Anmelden'):t('Create an account','Konto erstellen')}</button></p>
  <div className="auth-safety"><span>{t('Urgent medical help?','Dringende medizinische Hilfe?')} <a href="tel:116117">116117</a> · {t('Emergency','Notfall')} <a href="tel:112">112</a></span><small>{t('Local prototype. Use fictional account details and a unique sample password. No verified doctor accounts.','Lokaler Prototyp. Nutzen Sie fiktive Angaben und ein eigenes Testpasswort. Keine verifizierten Arztkonten.')}</small></div>
 </motion.div>
}
