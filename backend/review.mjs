import {resolve} from 'node:path';
import {openStore,reviewProfile} from './credentials.mjs';
const [email,decision,...note]=process.argv.slice(2);
if(!email||!decision){console.error('Usage: node backend/review.mjs sample@example.com approved|changes_requested "review note"');process.exit(1)}
const store=await openStore(resolve(process.env.MAVYS_DATA||'.mavys-data/credentials.json'));
try{console.log(JSON.stringify(await reviewProfile(store,email,decision,note.join(' ')),null,2))}catch(e){console.error(e.message);process.exitCode=1}
