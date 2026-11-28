/* MAVYS V12 — directory, messaging and conversational voice intake. */
const v12T=(en,de)=>tx(en,de);
const v12Regions=[
 ['Dr. Emilia Hartmann','Berlin','Specialist','Internal medicine'],
 ['Dr. Lukas Brandt','Hamburg','Generalist','General medicine'],
 ['Dr. Sofia Neumann','Munich','Gynecologist','Gynecology'],
 ['Dr. David Keller','Cologne','Specialist','Dermatology'],
 ['Dr. Hannah Vogt','Frankfurt','Gynecologist','Gynecology'],
 ['Dr. Jonas Becker','Leipzig','Generalist','General medicine'],
 ['Dr. Clara Fischer','Stuttgart','Specialist','Orthopedics'],
 ['Dr. Miriam Roth','Dresden','Gynecologist','Gynecology']
];
providers.forEach((p,i)=>{p.category='Generalist';p.city=i===0?'Gochsheim':i===2?'Schweinfurt':'Germany · remote'});
for(const [name,city,category,specialty] of v12Regions)providers.push({name,city,category,type:specialty,practice:'Sample '+city+' practice',distance:city+' · remote enquiries',guest:true,flex:true,window:'Next working day'});
const v12Available=i=>!!providers[i]&&(i!==0||(state.availability.on&&openSlots()>0&&(guestMode?state.availability.guest:state.availability.new)));
const v12CategoryLabel=k=>({all:v12T('All doctors','Alle Ärzte'),Generalist:v12T('Generalists','Hausärzte'),Specialist:v12T('Specialists','Fachärzte'),Gynecologist:v12T('Gynecologists','Gynäkologen')}[k]||k);
let v12Category='all',v12Scope='nationwide',v12Query='';
function v12Results(){return providers.map((p,i)=>({...p,i})).filter(p=>v12Available(p.i)&&(!guestMode||p.guest)&&(v12Category==='all'||p.category===v12Category)&&(filter!=='local'||!p.flex)&&(filter!=='flex'||p.flex)&&(v12Scope==='nationwide'||(!p.flex&&postal==='97469'&&directoryDistance(p)<=radiusKm))&&(!v12Query||[p.name,p.city,p.type,p.practice,p.category].join(' ').toLowerCase().includes(v12Query.toLowerCase())))}
find=function(){
 const arr=v12Results();
 return heading(v12T('DIRECTORY','ARZTSUCHE'),v12T('Find your doctor.','Finden Sie Ihren Arzt.'),v12T('Find a practice by specialty, location or name.','Suchen Sie nach Fachgebiet, Ort oder Name.'))+
 '<div class="directory-intro"><div><h2>'+v12T('Care across Germany.','Versorgung in Deutschland.')+'</h2><p>'+v12T('Explore participating sample practices, including remote consultations.','Entdecken Sie fiktive Beispielpraxen und Fernsprechstunden.')+'</p></div><a href="https://www.116117.de/de/arztsuche.php" target="_blank" rel="noopener">'+v12T('Official doctor search','Offizielle Arztsuche')+' ↗</a></div>'+
 '<section class="directory-controls"><form id="v12-directory-search" class="directory-search-row"><div class="field"><label for="v12-query">'+v12T('Name, specialty or city','Name, Fachgebiet oder Ort')+'</label><input id="v12-query" name="query" value="'+esc(v12Query)+'" placeholder="e.g. Berlin, gynecology"></div><button class="btn" type="submit">'+v12T('Search','Suchen')+'</button></form><div class="directory-tabs" role="group" aria-label="Specialty">'+['all','Generalist','Specialist','Gynecologist'].map(k=>'<button class="'+(v12Category===k?'active':'')+'" aria-pressed="'+(v12Category===k)+'" data-act="v12-category:'+k+'">'+v12CategoryLabel(k)+'</button>').join('')+'</div><div class="directory-scope"><button data-act="v12-scope:nationwide" aria-pressed="'+(v12Scope==='nationwide')+'">'+v12T('Across Germany','Deutschlandweit')+'</button><button data-act="v12-scope:nearby" aria-pressed="'+(v12Scope==='nearby')+'">'+v12T('Nearby','In der Nähe')+'</button></div>'+
 (v12Scope==='nearby'?'<form id="v12-location" class="directory-search-row"><div class="field"><label for="v12-postal">Postcode</label><input id="v12-postal" name="postal" pattern="[0-9]{5}" maxlength="5" required value="'+esc(postal)+'"></div><div class="field"><label for="radius-km">Radius: <output id="radius-value">'+radiusKm+' km</output></label><input id="radius-km" type="range" min="1" max="50" value="'+radiusKm+'"></div><button class="btn secondary" type="submit">Apply</button></form><p class="small muted">Illustrative local distances for 97469 only.</p>':'')+
 '<div class="choices">'+[['all','All practices'],['local','Local practices'],['flex','Remote / flexible']].map(([k,l])=>'<button class="choice '+(filter===k?'selected':'')+'" data-act="filter:'+k+'">'+l+'</button>').join('')+'</div></section>'+
 '<div class="directory-result-title"><h2>'+arr.length+' '+v12T('available sample doctors','verfügbare Beispielärzte')+'</h2><span>'+v12T('Fictional directory · not live availability','Fiktives Verzeichnis · keine Live-Verfügbarkeit')+'</span></div><div class="directory-list">'+(arr.length?arr.map(p=>'<article class="directory-person"><div class="directory-initials">'+esc(p.name.replace(/^Dr\\. /,'').split(' ').map(x=>x[0]).slice(-2).join(''))+'</div><div class="directory-person-info"><div class="directory-person-meta">'+esc(v12CategoryLabel(p.category))+' · '+esc(p.city)+'</div><h3>'+esc(p.name)+'</h3><p>'+esc(p.type)+' · '+esc(p.practice)+'</p><div class="consultation-options-inline">'+consultationBadge('Telephone')+consultationBadge('Video')+(!p.flex?consultationBadge('In person'):'')+'</div></div><div class="directory-person-actions"><span class="available-line"><i></i>'+v12T('Open to sample requests','Offen für Beispielanfragen')+'</span><button class="btn" data-act="book:'+p.i+'">'+v12T('Request consultation','Termin anfragen')+'</button><button class="btn outline" data-act="chat-start:'+p.i+'">'+v12T('Message doctor','Arzt kontaktieren')+'</button></div></article>').join(''):'<div class="card empty"><h3>'+v12T('No matching practices','Keine passenden Praxen')+'</h3><p>Try another specialty, location or search term.</p></div>')+'</div>';
};
const v12ChatPage=chatPage;
chatPage=function(){
 const t=currentChat(),patient=role==='patient',name=t?(patient?providers[t.provider]?.name:t.patientName):'';
 let html=v12ChatPage();
 html=html.replace(tx('Send routine administrative questions to a practice.','Senden Sie organisatorische Anfragen an eine Praxis.'),patient?v12T('Contact your chosen doctor or practice.','Kontaktieren Sie Ihre gewählte Praxis.'):v12T('Respond to patient enquiries.','Antworten Sie auf Patientenanfragen.'));
 html=html.replace(tx('Conversations','Gespräche'),patient?v12T('Your doctors','Ihre Ärzte'):v12T('Patient conversations','Patientengespräche'));
 html=html.replace(tx('Write a message…','Nachricht schreiben…'),name?v12T('Message '+name+'…','Nachricht an '+name+'…'):v12T('Write a message…','Nachricht schreiben…'));
 html=html.replace(tx('Your messages will appear here.','Ihre Nachrichten erscheinen hier.'),patient?v12T('Choose a doctor to start a conversation.','Wählen Sie einen Arzt aus.'):v12T('Patient enquiries appear here.','Patientenanfragen erscheinen hier.'));
 return html
};
const v12OldChatOpen=chatOpen;
chatOpen=function(i){if(role!=='patient'||!v12Available(i)){toast(v12T('This practice is unavailable.','Diese Praxis ist nicht verfügbar.'));return}v12OldChatOpen(i)};

/* Voice is an administrative conversational assistant, not clinical AI or a telephone service. */
let call12=null,recognition12=null,voice12Generation=0;
const call12Prompt=()=>{const c=call12;if(!c)return '';return c.step===0?v12T('What would you like to arrange: an appointment, a callback, or a prescription review?','Was möchten Sie vereinbaren: einen Termin, einen Rückruf oder eine Rezeptprüfung?'):c.step===1?v12T('Which five-digit postcode should the practice use?','Welche fünfstellige Postleitzahl soll die Praxis verwenden?'):c.step===2?v12T('Choose a sample practice, then confirm your request.','Wählen Sie eine Beispielpraxis und bestätigen Sie die Anfrage.'):v12T('Your request was saved. The practice must confirm it.','Ihre Anfrage wurde gespeichert. Die Praxis muss sie bestätigen.')};
function stop12Speech(){voice12Generation++;if(recognition12){try{recognition12.abort()}catch{}recognition12=null}if(window.speechSynthesis)window.speechSynthesis.cancel();if(call12)call12.listening=false}
function speak12(text){if(!call12?.audio||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang==='de'?'de-DE':'en-GB';u.rate=.95;window.speechSynthesis.speak(u)}
function voice12Say(text){call12.history.push({who:'assistant',text});speak12(text)}
function voice12Open(){if(account?.role==='doctor')return;stop12Speech();call12={step:0,intent:'',postal:'',history:[],audio:true,listening:false,error:'',provider:0};voice12Say(call12Prompt());voice12Draw()}
function voice12Draw(){if(!call12)return;const c=call12,canMic=!!(window.SpeechRecognition||window.webkitSpeechRecognition),arr=providers.map((p,i)=>({...p,i})).filter(p=>v12Available(p.i));if(!arr.some(p=>p.i===c.provider))c.provider=arr[0]?.i??-1;
 modal(v12T('MAVYS Voice','MAVYS Stimme'),'<div class="call12"><div class="call12-stage"><span class="call12-label">'+v12T('VOICE INTAKE','SPRACHANFRAGE')+'</span><div class="call12-orb '+(c.listening?'listening':'')+'">'+I('mic')+'</div><div class="call12-waves '+(c.listening?'listening':'')+'">'+Array.from({length:19},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div><h2>'+v12T(c.step===3?'Request saved':c.listening?'Listening…':'Speak with MAVYS',c.step===3?'Anfrage gespeichert':c.listening?'Hört zu…':'Mit MAVYS sprechen')+'</h2><p>'+v12T('Browser voice assistant · administrative intake only','Browser-Sprachassistent · nur organisatorische Anfragen')+'</p><div class="call12-controls"><button class="call12-control" data-act="v12-mic" '+(!canMic||c.step>1?'disabled':'')+' aria-label="Microphone">'+I('mic')+'</button><button class="call12-control" data-act="v12-audio" aria-pressed="'+c.audio+'" aria-label="Audio">'+I('volume')+'</button><button class="call12-control hangup" data-act="v12-hangup" aria-label="End call">'+I('phone')+'</button></div></div><div class="call12-body"><h3>'+v12T('Conversation','Gespräch')+'</h3><div class="call12-transcript" aria-live="polite">'+c.history.map(m=>'<p class="'+(m.who==='you'?'you':'assistant')+'"><small>'+v12T(m.who==='you'?'You':'MAVYS',m.who==='you'?'Sie':'MAVYS')+'</small>'+esc(m.text)+'</p>').join('')+'</div>'+
 (c.step<2?'<form id="v12-voice-text" class="flow"><label for="v12-voice-input">'+v12T('Speak or type your answer','Sprechen oder schreiben')+'</label><div class="directory-search-row"><input id="v12-voice-input" name="text" required maxlength="100" autocomplete="off" placeholder="'+(c.step===0?'Appointment / callback / prescription':'97469')+'"><button class="btn" type="submit">'+v12T('Continue','Weiter')+'</button></div></form>':c.step===2?'<form id="v12-voice-confirm" class="flow"><div class="summary"><strong>'+esc(c.intent)+'</strong><p>Postcode: '+esc(c.postal)+'</p></div><div class="field"><label for="v12-voice-provider">'+v12T('Choose practice','Praxis wählen')+'</label><select name="provider" id="v12-voice-provider">'+arr.map(p=>'<option value="'+p.i+'" '+(p.i===c.provider?'selected':'')+'>'+esc(p.name)+' · '+esc(p.city)+'</option>').join('')+'</select></div><button class="btn full" type="submit" '+(!arr.length?'disabled':'')+'>'+v12T('Confirm sample request','Beispielanfrage bestätigen')+'</button></form>':'<button class="btn full" data-act="v12-hangup">'+v12T('Done','Fertig')+'</button>')+
 (c.error?'<p class="auth-error" role="alert">'+esc(c.error)+'</p>':'')+'<p class="small muted">'+v12T('Use fictional details only. Speech recognition may use your browser vendor’s service. No actual call or medical advice. For emergencies call 112; urgent care 116117.','Nur fiktive Angaben. Spracherkennung kann den Browserdienst verwenden. Kein echter Anruf oder medizinischer Rat. Notruf 112; dringende Hilfe 116117.')+'</p></div></div>');
 const history=document.querySelector('.call12-transcript');if(history)history.scrollTop=history.scrollHeight
}
function voice12Input(raw){if(!call12||call12.step>1)return;const s=String(raw||'').trim().slice(0,100);if(!s)return;const c=call12;stop12Speech();c.history.push({who:'you',text:s});c.error='';
 if(c.step===0){const t=s.toLowerCase();if(/prescription|rezept/.test(t))c.intent='Prescription review';else if(/callback|call back|rückruf|telefon/.test(t))c.intent='Telephone callback';else if(/appointment|termin|book/.test(t))c.intent='Appointment';else{voice12Say(v12T('I can help arrange a callback, appointment or prescription review. Which would you prefer?','Ich kann einen Rückruf, Termin oder eine Rezeptprüfung organisieren. Was möchten Sie?'));voice12Draw();return}c.step=1}
 else{const p=s.replace(/\s/g,'');if(!/^\d{5}$/.test(p)){voice12Say(v12T('Please enter five postcode digits, or type them below.','Bitte geben Sie fünf Ziffern ein.'));voice12Draw();return}c.postal=p;c.step=2}
 voice12Say(call12Prompt());voice12Draw()
}
function voice12Mic(){if(!call12||call12.step>1)return;if(call12.listening){stop12Speech();voice12Draw();return}const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){call12.error='Microphone recognition is not supported here. Type your answer instead.';voice12Draw();return}stop12Speech();const gen=voice12Generation,r=new R();recognition12=r;r.lang=lang==='de'?'de-DE':'en-GB';r.interimResults=false;r.maxAlternatives=1;call12.listening=true;voice12Draw();
 r.onresult=e=>{if(gen===voice12Generation&&call12)voice12Input(e.results[0][0].transcript)};
 r.onerror=()=>{if(gen===voice12Generation&&call12){call12.error='Microphone unavailable. You can type your answer.';stop12Speech();voice12Draw()}};
 r.onend=()=>{if(gen===voice12Generation&&call12){call12.listening=false;recognition12=null;voice12Draw()}};
 try{r.start()}catch{call12.error='Could not start microphone. Type your answer.';stop12Speech();voice12Draw()}
}
const v12Close=closeModal;
closeModal=function(...args){if(call12){stop12Speech();call12=null}return v12Close(...args)};
const v12Action=extraAction,v12Submit=extraSubmit;
extraAction=function(k,v){
 if(k==='v12-category'){v12Category=v;render();return true}
 if(k==='v12-scope'){v12Scope=v;filter='all';render();return true}
 if(k==='v12-call'){voice12Open();return true}
 if(k==='v12-mic'){voice12Mic();return true}
 if(k==='v12-audio'&&call12){call12.audio=!call12.audio;if(!call12.audio)stop12Speech();else speak12(call12Prompt());voice12Draw();return true}
 if(k==='v12-hangup'){closeModal();return true}
 return v12Action(k,v)
};
extraSubmit=function(e){const f=e.target;
 if(f.id==='v12-directory-search'){e.preventDefault();v12Query=String(new FormData(f).get('query')||'').trim();render();return true}
 if(f.id==='v12-location'){e.preventDefault();postal=String(new FormData(f).get('postal'));render();return true}
 if(f.id==='v12-voice-text'){e.preventDefault();voice12Input(new FormData(f).get('text'));return true}
 if(f.id==='v12-voice-confirm'){e.preventDefault();if(!call12||call12.step!==2||account?.role==='doctor')return true;const i=Number(new FormData(f).get('provider'));if(!v12Available(i)){call12.error='Practice availability changed. Choose another practice.';voice12Draw();return true}const c=call12;const p=providers[i];addRequest({name:account?.name||'Voice sample patient',callback:'000 000000',doctor:p.name,type:c.intent==='Prescription review'?'Prescription review':'Telephone',window:i===0?state.availability.window:p.window,reason:c.intent,postal:c.postal,source:'Interactive voice intake'});c.step=3;voice12Say(call12Prompt());voice12Draw();return true}
 return v12Submit(e)
};
const v12Render=render;
render=function(){v12Render();const root=document.getElementById('app');if(!root?.querySelector)return;
 const top=root.querySelector('.welcome-top,.top-left');const badge=top?.querySelector('.trail-release');if(badge)badge.textContent='V12';
 if(account?.role==='patient'&&!guestVoice){const actions=root.querySelector('.top-right');if(actions&&!actions.querySelector('[data-act="v12-call"]'))actions.insertAdjacentHTML('afterbegin','<button class="voice12-launch" data-act="v12-call">'+I('mic')+' <span>'+v12T('Voice call','Sprachanruf')+'</span></button>');if(route==='home'){const hero=root.querySelector('.hero-copy');if(hero&&!hero.querySelector('[data-act="v12-call"]'))hero.insertAdjacentHTML('beforeend','<button class="v12-inline-link" data-act="v12-call">'+I('mic')+' '+v12T('Talk to MAVYS','Mit MAVYS sprechen')+' ↗</button>')}}
 if(!account&&!guestVoice){const panel=root.querySelector('.welcome-main,.auth-panel');if(panel&&!panel.querySelector('[data-act="v12-call"]'))panel.insertAdjacentHTML('beforeend','<button class="v12-inline-link" data-act="v12-call">'+I('mic')+' '+v12T('Start a voice call without signing in','Sprachanruf ohne Anmeldung')+'</button>')}
};
render();
