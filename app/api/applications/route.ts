import { registrationDeadline } from "../../registration-deadline";


export async function POST(request:Request){
const host = request.headers.get('host');
const protocol = process.env.VERCEL ? 'https:' : new URL(request.url).protocol;
if (!host || request.headers.get('origin') !== protocol + '//' + host)return Response.json({error:'Please submit from the registration page.'},{status:403});
if(Date.now()>=Date.parse(registrationDeadline.closesAt))return Response.json({error:`Registration closed on ${registrationDeadline.date}.`},{status:410});
let d;try{const raw=await request.text();if(raw.length>10000)throw Error();d=JSON.parse(raw);if(!d||typeof d!=='object')throw Error();}catch{return Response.json({error:'Invalid application.'},{status:400});}
const limits:Record<string,number>={name:120,email:254,phone:30,studentId:60,batch:60,major:120};for(const [f,max] of Object.entries(limits)){if(typeof d[f]!=='string'||!d[f].trim()||d[f].length>max)return Response.json({error:'Please complete all required fields.'},{status:400});d[f]=d[f].trim();}d.email=d.email.toLowerCase();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)||!/^\+?[\d\s().-]{7,30}$/.test(d.phone)||d.consent!=='on')return Response.json({error:'Check your email, phone number, and consent.'},{status:400});
const linkedin=typeof d.linkedin==='string'?d.linkedin.trim():'';if(linkedin){try{const u=new URL(linkedin);if(u.protocol!=='https:'||!['linkedin.com','www.linkedin.com'].includes(u.hostname)||linkedin.length>500)throw Error();}catch{return Response.json({error:'Enter an https://www.linkedin.com profile link, or leave it empty.'},{status:400});}}
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
const id = crypto.randomUUID();
try {
  if (!url || !key) throw new Error("Supabase configuration missing");
  const response = await fetch(new URL("/rest/v1/thinkthon_applications", url), {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({
      id, name: d.name, email: d.email, phone: d.phone, student_id: d.studentId,
      batch: d.batch, major: d.major, linkedin: linkedin || null,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (response.ok) return Response.json({ reference: id }, { status: 201 });
  const error = await response.json().catch(() => null) as { code?: string } | null;
  if (response.status === 409 && error?.code === "23505") {
    return Response.json({ error: "An application with this email or student ID already exists." }, { status: 409 });
  }
  console.error("Application storage returned status", response.status);
} catch {
  console.error("Application storage unavailable");
}
return Response.json({ error: "Unable to save. Please try again shortly." }, { status: 503 });
}

