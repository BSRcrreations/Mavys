/* Optional OpenAI audio connection. Only loopback/same-origin demo requests. */
const MAX_AUDIO=2_000_000;
const MIME={'audio/webm':'webm','audio/ogg':'ogg','audio/mp4':'mp4','audio/wav':'wav','audio/mpeg':'mp3'};
const phrases={
 en:{welcome:'Hello, I am MAVYS, your AI voice assistant. I can help arrange a sample appointment, callback or prescription review. What would you like to arrange?',postal:'What is your five-digit postcode?',detail:'What would you like the practice to know about your request? Please use fictional details only.',review:'Please review your request, select a practice and confirm before sending.',done:'Your sample request has been saved. The practice must confirm it.',repeat:'Please choose an appointment, callback or prescription review.',invalid:'Please enter a five-digit postcode.',safety:'For life-threatening emergencies call 112. For urgent non-life-threatening care call 116117. Do not wait for this demonstration.'},
 de:{welcome:'Hallo, ich bin MAVYS, Ihr KI-Sprachassistent. Ich kann eine Beispielanfrage für einen Termin, Rückruf oder eine Rezeptprüfung vorbereiten. Was möchten Sie vereinbaren?',postal:'Wie lautet Ihre fünfstellige Postleitzahl?',detail:'Was soll die Praxis über Ihre Anfrage wissen? Bitte verwenden Sie nur fiktive Angaben.',review:'Bitte prüfen Sie Ihre Anfrage, wählen Sie eine Praxis und bestätigen Sie vor dem Senden.',done:'Ihre Beispielanfrage wurde gespeichert. Die Praxis muss sie bestätigen.',repeat:'Bitte wählen Sie einen Termin, Rückruf oder eine Rezeptprüfung.',invalid:'Bitte geben Sie eine fünfstellige Postleitzahl ein.',safety:'Bei lebensbedrohlichen Notfällen wählen Sie 112. Bei dringenden, nicht lebensbedrohlichen Beschwerden wählen Sie 116117. Warten Sie nicht auf diese Demonstration.'}
};
export function createVoiceApi({key=process.env.OPENAI_API_KEY,fetcher=globalThis.fetch,origin}={}){
 const rates=new Map();let inFlight=0;
 const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};
 async function read(req){let n=0;const parts=[];for await(const p of req){n+=p.length;if(n>MAX_AUDIO*1.4+8192)throw Error('Audio payload too large');parts.push(p)}return JSON.parse(Buffer.concat(parts).toString('utf8'))}
 const request=(path,body,headers={})=>fetcher('https://api.openai.com/v1/'+path,{method:'POST',headers:{Authorization:'Bearer '+key,...headers},body,signal:AbortSignal.timeout(35_000)});
 return async function voiceApi(req,res,path){
  if(!path.startsWith('/api/voice/'))return false;
  const allowed=origin||'http://'+req.headers.host;
  if(req.headers.origin&&req.headers.origin!==allowed){send(res,403,{error:'Origin not allowed'});return true}
  if(path==='/api/voice/status'&&req.method==='GET'){send(res,200,{enabled:!!key,transcription:'gpt-4o-mini-transcribe',speech:'gpt-4o-mini-tts'});return true}
  if(!['/api/voice/transcribe','/api/voice/speak'].includes(path)||req.method!=='POST'){send(res,405,{error:'Unsupported voice operation'});return true}
  if(!key){send(res,503,{error:'AI voice is not configured. Use browser speech.'});return true}
  if(req.headers.origin!==allowed||!String(req.headers['content-type']||'').startsWith('application/json')){send(res,403,{error:'Same-origin JSON required'});return true}
  const now=Date.now(),ip=req.socket?.remoteAddress||'local',rate=rates.get(ip)||{time:now,count:0};if(now-rate.time>60_000){rate.time=now;rate.count=0}rate.count++;rates.set(ip,rate);
  if(rate.count>24||inFlight>=3){send(res,429,{error:'Voice limit reached. Try browser speech.'});return true}
  inFlight++;
  try{
   const body=await read(req),language=body.language==='de'?'de':'en';
   if(body.consent!==true){send(res,400,{error:'Consent for fictional audio required'});return true}
   if(path.endsWith('/transcribe')){
    const mime=String(body.mime||'').split(';')[0],ext=MIME[mime],b64=body.audio;
    if(!ext||typeof b64!=='string'||b64.length>MAX_AUDIO*1.4||!/^[A-Za-z0-9+/]+={0,2}$/.test(b64)){send(res,400,{error:'Invalid or oversized audio'});return true}
    const bytes=Buffer.from(b64,'base64');if(!bytes.length||bytes.length>MAX_AUDIO){send(res,400,{error:'Invalid audio size'});return true}
    const form=new FormData();form.append('file',new Blob([bytes],{type:mime}),'sample.'+ext);form.append('model','gpt-4o-mini-transcribe');form.append('language',language);
    const out=await request('audio/transcriptions',form);if(!out.ok)throw Error('Transcription provider unavailable');
    const data=await out.json();send(res,200,{text:String(data.text||'').slice(0,1200)});return true
   }
   const phrase=phrases[language][body.phrase];if(!phrase||!Object.hasOwn(phrases[language],body.phrase)){send(res,400,{error:'Unknown voice prompt'});return true}
   const out=await request('audio/speech',JSON.stringify({model:'gpt-4o-mini-tts',voice:'alloy',input:phrase,response_format:'mp3'}),{'Content-Type':'application/json'});if(!out.ok)throw Error('Speech provider unavailable');
   const audio=Buffer.from(await out.arrayBuffer());if(audio.length>MAX_AUDIO)throw Error('Speech response too large');
   res.writeHead(200,{'Content-Type':'audio/mpeg','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(audio);return true
  }catch{send(res,502,{error:'AI audio unavailable. Use browser speech or type your answer.'});return true}finally{inFlight--}
 }
}
