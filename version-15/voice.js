/* MAVYS V15 — voice studio, cloud audio models and editable speech-to-text. */
const v15T=(en,de)=>tx(en,de);
let voice15=null,voice15Rec=null,voice15Recorder=null,voice15Stream=null,voice15Audio=null,voice15Timer=null,voice15Generation=0,voice15Abort=null;
const v15Prompt=(key)=>({
 welcome:v15T('Hello, I am MAVYS, your AI voice assistant. I can help arrange a sample appointment, callback or prescription review. What would you like to arrange?','Hallo, ich bin MAVYS, Ihr KI-Sprachassistent. Möchten Sie einen Termin, Rückruf oder eine Rezeptprüfung vereinbaren?'),
 postal:v15T('What is your five-digit postcode?','Wie lautet Ihre fünfstellige Postleitzahl?'),
 detail:v15T('What would you like the practice to know? Use fictional details only.','Was soll die Praxis wissen? Nur fiktive Angaben.'),
 review:v15T('Please review your request, select a practice and confirm before sending.','Bitte prüfen Sie die Anfrage und bestätigen Sie vor dem Senden.'),
 done:v15T('Your sample request has been saved. The practice must confirm it.','Ihre Beispielanfrage wurde gespeichert. Die Praxis muss sie bestätigen.'),
 repeat:v15T('Please choose an appointment, callback or prescription review.','Bitte wählen Sie einen Termin, Rückruf oder eine Rezeptprüfung.'),
 invalid:v15T('Please enter a five-digit postcode.','Bitte geben Sie eine fünfstellige Postleitzahl ein.')
}[key]||'');
function v15CancelAudio(){if(voice15Abort){voice15Abort.abort();voice15Abort=null}if(voice15Audio){voice15Audio.pause();URL.revokeObjectURL(voice15Audio.src);voice15Audio=null}window.speechSynthesis?.cancel()}
function v15StopCapture(){
 voice15Generation++;clearTimeout(voice15Timer);voice15Timer=null;
 if(voice15Rec){try{voice15Rec.abort()}catch{}voice15Rec=null}
 if(voice15Recorder){try{if(voice15Recorder.state!=='inactive')voice15Recorder.stop()}catch{}voice15Recorder=null}
 if(voice15Stream){voice15Stream.getTracks().forEach(t=>t.stop());voice15Stream=null}
 if(voice15){voice15.listening=false;voice15.busy=false}
}
function v15End(){v15StopCapture();v15CancelAudio();voice15=null}
function v15BrowserSpeak(text){if(!voice15?.sound||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;const u=new SpeechSynthesisUtterance(text);u.lang=lang==='de'?'de-DE':'en-GB';u.rate=.94;window.speechSynthesis.speak(u)}
async function v15Speak(key){
 const c=voice15;if(!c?.sound)return;v15CancelAudio();const text=v15Prompt(key);
 if(c.mode!=='cloud'){v15BrowserSpeak(text);return}
 const abort=new AbortController();voice15Abort=abort;
 try{const r=await fetch('/api/voice/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phrase:key,language:lang,consent:c.consent}),signal:abort.signal});if(!r.ok)throw Error('Audio unavailable');const blob=await r.blob();if(voice15!==c||abort.signal.aborted)return;const audio=new Audio(URL.createObjectURL(blob));voice15Audio=audio;audio.onended=()=>{if(voice15Audio===audio){URL.revokeObjectURL(audio.src);voice15Audio=null}};await audio.play()}
 catch{if(voice15===c&&!abort.signal.aborted)v15BrowserSpeak(text)}
}
function v15Say(key){const c=voice15;if(!c)return;c.history.push({who:'assistant',text:v15Prompt(key)});c.prompt=key;void v15Speak(key)}
function v15Open(){
 if(account?.role==='doctor')return;v15End();const c={phase:0,mode:'browser',cloud:false,checking:true,consent:false,sound:true,history:[],draft:'',intent:'',postal:'',detail:'',provider:0,listening:false,busy:false,error:'',prompt:'welcome'};voice15=c;v15Draw();
 (async()=>{try{const r=await fetch('/api/voice/status',{cache:'no-store'});if(r.ok){const d=await r.json();if(voice15===c)c.cloud=d.enabled===true}}catch{}finally{if(voice15===c){c.checking=false;v15Draw()}}})();
}
function v15PhaseName(n){return [v15T('Connect','Verbinden'),v15T('Request','Anfrage'),v15T('Location','Ort'),v15T('Details','Details'),v15T('Review','Prüfen'),v15T('Done','Fertig')][n]}
function v15Draw(){
 const c=voice15;if(!c)return;const canBrowser=!!(window.SpeechRecognition||window.webkitSpeechRecognition),canCloud=!!(window.MediaRecorder&&navigator.mediaDevices?.getUserMedia),canMic=c.mode==='cloud'?canCloud:canBrowser,choices=providers.map((p,i)=>({...p,i})).filter(p=>v12Available(p.i));if(!choices.some(p=>p.i===c.provider))c.provider=choices[0]?.i??-1;
 let body='';
 if(c.phase===0)body='<div class="v15-connect"><h2>'+v15T('A conversation starts here.','Hier beginnt ein Gespräch.')+'</h2><p>'+v15T('Speak naturally or type. Review the transcript before sending a fictional request.','Sprechen oder schreiben Sie. Prüfen Sie den Text vor dem Senden.')+'</p><form id="v15-connect" class="flow"><div class="v15-mode-options"><label><input type="radio" name="mode" value="cloud" '+(c.mode==='cloud'?'checked':'')+' '+(!c.cloud||!canCloud?'disabled':'')+'><span><strong>OpenAI voice models</strong><small>'+ (c.checking?'Checking connection…':!c.cloud?'API key not configured':!canCloud?'Recording unavailable':'AI transcription + generated speech')+'</small></span></label><label><input type="radio" name="mode" value="browser" '+(c.mode==='browser'?'checked':'')+'><span><strong>'+v15T('Browser voice','Browser-Stimme')+'</strong><small>'+v15T('Live speech-to-text where supported; typing always available','Live-Spracherkennung, sofern unterstützt; Texteingabe verfügbar')+'</small></span></label></div><label class="v13-consent"><input type="checkbox" name="consent" required><span>'+v15T('I will use fictional information only. Audio may be processed by OpenAI or my browser provider. I agree to this demo.','Nur fiktive Angaben. Audio kann von OpenAI oder meinem Browseranbieter verarbeitet werden. Ich stimme zu.')+'</span></label><button class="btn full" type="submit">'+v15T('Connect voice assistant','Sprachassistent verbinden')+'</button></form></div>';
 else if(c.phase<4)body='<div class="v15-transcript" aria-live="polite">'+c.history.map(m=>'<div class="v15-bubble '+(m.who==='you'?'you':'assistant')+'"><small>'+v15T(m.who==='you'?'You':'MAVYS',m.who==='you'?'Sie':'MAVYS')+'</small><p>'+esc(m.text)+'</p></div>').join('')+'</div><form id="v15-answer" class="flow"><div class="field"><label for="v15-draft">'+v15T('Speech-to-text · editable transcript','Sprache zu Text · bearbeitbarer Text')+'</label><textarea id="v15-draft" name="answer" rows="3" maxlength="1200" placeholder="'+v15T('Tap the microphone or type here…','Mikrofon antippen oder schreiben…')+'">'+esc(c.draft)+'</textarea></div><p id="v15-interim" class="v15-interim" aria-live="polite">'+(c.busy?v15T('Transcribing audio…','Audio wird transkribiert…'):c.listening?v15T('Listening…','Hört zu…'):'')+'</p><div class="v15-answer-actions"><button type="button" class="btn secondary" data-act="v15-mic" '+(!canMic||c.busy?'disabled':'')+'>'+I('mic')+' '+v15T(c.listening?'Stop recording':'Start microphone',c.listening?'Aufnahme stoppen':'Mikrofon starten')+'</button><button class="btn" type="submit" '+(c.listening||c.busy?'disabled':'')+'>'+v15T('Continue','Weiter')+' '+I('arrow')+'</button></div>'+(c.phase===1?'<div class="v15-quick">'+['Appointment','Telephone callback','Prescription review'].map(x=>'<button type="button" data-act="v15-quick:'+x+'">'+x+'</button>').join('')+'</div>':c.phase===3?'<button type="button" class="quiet-link" data-act="v15-skip">'+v15T('Skip optional details','Optionale Angaben überspringen')+'</button>':'')+'</form>';
 else if(c.phase===4)body='<h2>'+v15T('Review your request.','Anfrage prüfen.')+'</h2><form id="v15-confirm" class="flow"><div class="field"><label>Request type</label><select name="intent">'+['Appointment','Telephone callback','Prescription review'].map(x=>'<option '+(x===c.intent?'selected':'')+'>'+x+'</option>').join('')+'</select></div><div class="field"><label>Postcode</label><input name="postal" pattern="[0-9]{5}" required value="'+esc(c.postal)+'"></div><div class="field"><label>Details from transcript (editable)</label><textarea name="detail" maxlength="1200">'+esc(c.detail)+'</textarea></div><div class="field"><label>Sample practice</label><select name="provider">'+choices.map(p=>'<option value="'+p.i+'" '+(p.i===c.provider?'selected':'')+'>'+esc(p.name)+' · '+esc(p.city)+'</option>').join('')+'</select></div><label class="v13-consent"><input type="checkbox" required name="confirm"><span>I reviewed these fictional details and want to send this request to the selected sample practice.</span></label><button class="btn full" type="submit" '+(!choices.length?'disabled':'')+'>Send confirmed sample request</button></form>';
 else body='<div class="v15-done"><span class="v15-success">'+I('check')+'</span><h2>'+v15T('Request received.','Anfrage erhalten.')+'</h2><p>'+v15T('Saved in the local prototype. A practice still needs to confirm your request.','Im lokalen Prototyp gespeichert. Die Praxis muss die Anfrage bestätigen.')+'</p><button class="btn full" data-act="v15-end">'+v15T('Finish','Fertig')+'</button></div>';
 modal('MAVYS Voice · V15','<div class="v15-voice"><div class="v15-stage"><span class="v15-kicker">MAVYS VOICE</span><div class="v15-orb '+(c.listening?'listening':c.busy?'processing':'')+'"><span></span><span></span>'+I('mic')+'</div><div class="v15-wave '+(c.listening?'active':'')+'">'+Array.from({length:23},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div><h2>'+v15T(c.phase===0?'Your voice. Your care.':c.busy?'Transcribing…':c.listening?'Listening…':c.phase===5?'Complete':'Speak with MAVYS',c.phase===0?'Ihre Stimme. Ihre Versorgung.':c.busy?'Transkribieren…':c.listening?'Hört zu…':c.phase===5?'Fertig':'Mit MAVYS sprechen')+'</h2><p>'+v15T(c.phase===0?'Choose how to connect':c.mode==='cloud'?'OpenAI audio · push to talk':'Browser speech · editable text',c.phase===0?'Verbindung wählen':c.mode==='cloud'?'OpenAI Audio · Aufnahme':'Browser-Sprache · bearbeitbarer Text')+'</p><div class="v15-call-controls"><button class="v15-call-button" data-act="v15-sound" aria-pressed="'+c.sound+'" aria-label="Toggle audio">'+I('volume')+'</button><button class="v15-call-button end" data-act="v15-end" aria-label="End call">'+I('phone')+'</button></div></div><div class="v15-progress" aria-label="Voice request progress">'+[0,1,2,3,4,5].map(n=>'<span class="'+(n<=c.phase?'active':'')+'" '+(n===c.phase?'aria-current="step"':'')+'>'+v15PhaseName(n)+'</span>').join('')+'</div>'+body+(c.error?'<p class="auth-error" role="alert">'+esc(c.error)+'</p>':'')+'<p class="v15-safety">AI-generated voice when connected. Administrative intake only; no diagnosis, triage, or prescription. No actual telephone call. <a href="tel:112">112</a> emergency · <a href="tel:116117">116117</a> urgent care.</p></div>');
 const track=document.querySelector('.v15-transcript');if(track)track.scrollTop=track.scrollHeight
}
function v15Draft(value){if(!voice15)return;voice15.draft=value.slice(0,1200);const el=document.getElementById('v15-draft');if(el)el.value=voice15.draft}
function v15Answer(raw){const c=voice15;if(!c||c.phase<1||c.phase>3)return;const answer=String(raw||'').trim().slice(0,1200);if(!answer&&c.phase!==3)return;v15StopCapture();v15CancelAudio();c.error='';c.history.push({who:'you',text:answer||'Skipped'});c.draft='';
 if(c.phase===1){const s=answer.toLowerCase();if(/prescription|rezept/.test(s))c.intent='Prescription review';else if(/callback|call back|rückruf|telefon/.test(s))c.intent='Telephone callback';else if(/appointment|termin|book/.test(s))c.intent='Appointment';else{v15Say('repeat');v15Draw();return}c.phase=2;v15Say('postal')}
 else if(c.phase===2){const p=answer.replace(/\s/g,'');if(!/^\d{5}$/.test(p)){v15Say('invalid');v15Draw();return}c.postal=p;c.phase=3;v15Say('detail')}
 else{c.detail=answer;c.phase=4;v15Say('review')}
 v15Draw()
}
function v15BrowserMic(){
 const c=voice15,R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!c||!R)return;
 v15CancelAudio();v15StopCapture();const gen=voice15Generation,r=new R();voice15Rec=r;r.lang=lang==='de'?'de-DE':'en-GB';r.interimResults=true;r.continuous=true;const initial=c.draft;let final='',interim='';
 c.listening=true;c.error='';v15Draw();
 r.onresult=e=>{if(voice15!==c||gen!==voice15Generation)return;final='';interim='';for(let i=0;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)final+=t+' ';else interim+=t+' '}v15Draft([initial,final,interim].filter(Boolean).join(' ').trim());const live=document.getElementById('v15-interim');if(live)live.textContent=interim||'Listening…'};
 r.onerror=()=>{if(voice15===c&&gen===voice15Generation){c.error='Microphone recognition unavailable. Type your answer instead.';v15StopCapture();v15Draw()}};
 r.onend=()=>{if(voice15===c&&gen===voice15Generation){c.listening=false;voice15Rec=null;v15Draw()}};
 try{r.start()}catch{c.error='Could not start microphone.';v15StopCapture();v15Draw()}
}
async function v15CloudMic(){
 const c=voice15;if(!c)return;v15CancelAudio();v15StopCapture();const gen=voice15Generation;
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});if(voice15!==c||gen!==voice15Generation){stream.getTracks().forEach(t=>t.stop());return}voice15Stream=stream;
  const r=new MediaRecorder(stream);voice15Recorder=r;const chunks=[];c.listening=true;c.error='';v15Draw();
  r.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  r.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());if(voice15!==c||gen!==voice15Generation)return;voice15Recorder=null;voice15Stream=null;clearTimeout(voice15Timer);c.listening=false;c.busy=true;v15Draw();
   try{const blob=new Blob(chunks,{type:r.mimeType||'audio/webm'});if(blob.size>2_000_000)throw Error('Recording too large. Try a shorter answer.');const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));const resp=await fetch('/api/voice/transcribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({audio:btoa(binary),mime:blob.type,language:lang,consent:c.consent})});const data=await resp.json();if(!resp.ok)throw Error(data.error||'Transcription failed');if(voice15===c&&gen===voice15Generation)c.draft=[c.draft,data.text].filter(Boolean).join(' ').trim().slice(0,1200)}
   catch(e){if(voice15===c)c.error=e.message||'Transcription failed. Type your answer.'}finally{if(voice15===c&&gen===voice15Generation){c.busy=false;v15Draw()}}
  };
  r.start();voice15Timer=setTimeout(()=>{if(r.state==='recording')r.stop()},30_000)
 }catch{if(voice15===c){v15StopCapture();c.error='Microphone permission denied or recording unavailable.';v15Draw()}}
}
function v15Mic(){const c=voice15;if(!c||c.phase<1||c.phase>3||c.busy)return;if(c.listening){if(voice15Recorder?.state==='recording')voice15Recorder.stop();else if(voice15Rec){try{voice15Rec.stop()}catch{v15StopCapture();v15Draw()}}return}if(c.mode==='cloud')void v15CloudMic();else v15BrowserMic()}
const v15Close=closeModal,v15Action=extraAction,v15Submit=extraSubmit,v15Render=render;
closeModal=function(...args){v15End();return v15Close(...args)};
extraAction=function(k,v){
 if(k==='v12-call'||k==='v15-open'){v15Open();return true}
 if(k==='v15-mic'){v15Mic();return true}
 if(k==='v15-end'){closeModal();return true}
 if(k==='v15-sound'&&voice15){voice15.sound=!voice15.sound;if(!voice15.sound)v15CancelAudio();else if(!voice15.listening&&!voice15.busy&&voice15.phase>0)void v15Speak(voice15.prompt);v15Draw();return true}
 if(k==='v15-quick'){v15Answer(v);return true}
 if(k==='v15-skip'&&voice15?.phase===3){v15Answer('');return true}
 return v15Action(k,v)
};
document.addEventListener('input',e=>{if(voice15&&e.target.id==='v15-draft')voice15.draft=e.target.value});
extraSubmit=function(e){const f=e.target,c=voice15;
 if(f.id==='v15-connect'){e.preventDefault();if(!c||c.phase!==0)return true;const d=new FormData(f);if(!d.get('consent'))return true;c.mode=d.get('mode')==='cloud'&&c.cloud?'cloud':'browser';c.consent=true;c.phase=1;v15Say('welcome');v15Draw();return true}
 if(f.id==='v15-answer'){e.preventDefault();if(c&&!c.listening&&!c.busy)v15Answer(new FormData(f).get('answer'));return true}
 if(f.id==='v15-confirm'){e.preventDefault();if(!c||c.phase!==4||account?.role==='doctor')return true;const d=new FormData(f),i=Number(d.get('provider')),p=String(d.get('postal')||''),intent=String(d.get('intent')||'');if(!d.get('confirm')||!/^\d{5}$/.test(p)||!['Appointment','Telephone callback','Prescription review'].includes(intent)||!v12Available(i)){c.error='Check your request and practice availability.';v15Draw();return true}const provider=providers[i],detail=String(d.get('detail')||'').trim().slice(0,1200);addRequest({name:account?.name||'Voice sample patient',patientId:account?.id||null,callback:'000 000000',doctor:provider.name,type:intent==='Prescription review'?'Prescription review':'Telephone',window:i===0?state.availability.window:provider.window,reason:intent+(detail?' — '+detail:''),postal:p,source:'V15 voice intake'});c.phase=5;c.history=[];c.draft='';c.detail='';v15Say('done');v15Draw();return true}
 return v15Submit(e)
};
render=function(){v15Render();const root=document.getElementById('app');const badge=root?.querySelector?.('.trail-release');if(badge)badge.textContent='V15'};
render();
