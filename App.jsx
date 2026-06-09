import { useState, useRef, useEffect, useCallback } from "react";

// ─── TRAIL DATA (from Greg's original + extended) ────────────────────────────
const TAIWAN_OUTLINE = [
  [121.432,25.183],[121.458,25.208],[121.482,25.238],[121.518,25.268],[121.537,25.298],
  [121.558,25.285],[121.588,25.262],[121.618,25.245],[121.648,25.228],[121.675,25.215],
  [121.705,25.200],[121.735,25.178],[121.760,25.152],[121.790,25.135],[121.818,25.128],
  [121.848,25.110],[121.875,25.085],[121.902,25.080],[121.922,25.122],[121.952,25.082],
  [121.972,25.038],[121.978,24.997],[121.968,24.948],[121.955,24.898],[121.940,24.845],
  [121.922,24.788],[121.905,24.732],[121.888,24.672],[121.868,24.612],[121.848,24.548],
  [121.825,24.482],[121.802,24.415],[121.778,24.348],[121.752,24.278],[121.722,24.205],
  [121.692,24.132],[121.658,24.058],[121.625,23.988],[121.598,23.918],[121.578,23.845],
  [121.558,23.775],[121.538,23.702],[121.518,23.628],[121.495,23.552],[121.468,23.472],
  [121.438,23.388],[121.405,23.302],[121.368,23.215],[121.325,23.128],[121.278,23.038],
  [121.228,22.952],[121.175,22.862],[121.118,22.775],[121.062,22.688],[121.002,22.598],
  [120.942,22.505],[120.895,22.415],[120.875,22.325],[120.870,22.238],[120.868,22.158],
  [120.872,22.078],[120.878,21.998],[120.865,21.935],[120.858,21.908],[120.845,21.942],
  [120.828,21.992],[120.808,22.048],[120.782,22.108],[120.758,22.158],[120.742,22.205],
  [120.718,22.262],[120.695,22.322],[120.670,22.382],[120.645,22.442],[120.618,22.492],
  [120.585,22.532],[120.548,22.562],[120.510,22.585],[120.470,22.605],[120.428,22.620],
  [120.380,22.638],[120.325,22.658],[120.268,22.682],[120.218,22.712],[120.170,22.758],
  [120.132,22.818],[120.100,22.888],[120.075,22.965],[120.062,23.052],[120.058,23.148],
  [120.058,23.252],[120.065,23.352],[120.080,23.448],[120.105,23.538],[120.138,23.628],
  [120.178,23.715],[120.222,23.798],[120.272,23.875],[120.328,23.948],[120.390,24.018],
  [120.455,24.085],[120.518,24.148],[120.582,24.218],[120.648,24.292],[120.715,24.368],
  [120.780,24.442],[120.842,24.508],[120.900,24.572],[120.952,24.632],[121.002,24.688],
  [121.052,24.742],[121.105,24.792],[121.158,24.838],[121.212,24.882],[121.262,24.922],
  [121.315,24.962],[121.365,25.002],[121.405,25.052],[121.422,25.112],[121.432,25.183],
];

const TRAILS = [
  {id:1,name:"Yangmingshan Main Peak",chinese:"陽明山七星山",lat:25.167,lng:121.537,difficulty:"easy",elevation:"1,120m",length:"8 km",duration:"3–4 hrs",permit:false,travel:{taipei:0.5,taichung:2.5,tainan:4.0,kaohsiung:4.5,hualien:2.5,keelung:0.75,taoyuan:0.75,hsinchu:1.5},desc:"Taipei's iconic volcanic summit with hot springs, flower fields, and sweeping city views.",tags:["Hot Springs","Volcanic","Flowers","City Views"]},
  {id:2,name:"Elephant Mountain",chinese:"象山步道",lat:25.026,lng:121.577,difficulty:"easy",elevation:"183m",length:"2 km",duration:"1 hr",permit:false,travel:{taipei:0.25,taichung:2.5,tainan:4.0,kaohsiung:4.5,hualien:3.0,keelung:0.75,taoyuan:0.5,hsinchu:1.5},desc:"Taipei's famous rocky ridge with the most photographed view of Taipei 101 and the city skyline.",tags:["City Views","Iconic","Short","Taipei 101"]},
  {id:3,name:"Wulai Waterfall Trail",chinese:"烏來瀑布步道",lat:24.863,lng:121.548,difficulty:"easy",elevation:"680m",length:"4 km",duration:"2–3 hrs",permit:false,travel:{taipei:1.0,taichung:2.5,tainan:4.0,kaohsiung:4.5,hualien:2.5,keelung:1.25,taoyuan:1.25,hsinchu:2.0},desc:"Serene forested trail to a spectacular 80m waterfall through Atayal indigenous villages.",tags:["Waterfall","Indigenous Culture","Forest","Hot Springs"]},
  {id:4,name:"Hehuanshan Main Peak",chinese:"合歡山主峰",lat:24.148,lng:121.288,difficulty:"easy",elevation:"3,417m",length:"4 km",duration:"2–3 hrs",permit:false,travel:{taipei:3.5,taichung:2.0,tainan:3.5,kaohsiung:4.0,hualien:2.5,keelung:4.0,taoyuan:3.75,hsinchu:2.5},desc:"Taiwan's most accessible high-altitude summit. Drive to 3,100m and walk to the peak — magical winter snow.",tags:["Snow","High Altitude","Drive-up","Sunset"]},
  {id:5,name:"Taroko Shakadang Trail",chinese:"太魯閣砂卡礑步道",lat:24.172,lng:121.630,difficulty:"easy",elevation:"200m",length:"4.4 km",duration:"2–3 hrs",permit:false,travel:{taipei:3.0,taichung:3.5,tainan:5.0,kaohsiung:5.0,hualien:0.5,keelung:3.5,taoyuan:3.25,hsinchu:4.0},desc:"Jewel-toned turquoise river cutting through sheer marble cliffs. Taiwan's most photogenic easy trail.",tags:["Marble Gorge","River","Scenic","Easy Access"]},
  {id:6,name:"Teapot Mountain",chinese:"無耳茶壺山",lat:25.102,lng:121.845,difficulty:"moderate",elevation:"580m",length:"4 km",duration:"2–3 hrs",permit:false,travel:{taipei:1.5,taichung:3.5,tainan:5.0,kaohsiung:5.5,hualien:2.5,keelung:0.75,taoyuan:1.75,hsinchu:2.5},desc:"Jinguashi's distinctive teapot-shaped peak with gold mining history and breathtaking coastal panoramas.",tags:["Mining History","Coastal Views","Rock Scramble"]},
  {id:7,name:"Caoling Historic Trail",chinese:"草嶺古道",lat:25.013,lng:121.905,difficulty:"moderate",elevation:"950m",length:"9 km",duration:"4–5 hrs",permit:false,travel:{taipei:1.5,taichung:3.5,tainan:5.0,kaohsiung:5.5,hualien:2.0,keelung:1.0,taoyuan:1.75,hsinchu:2.5},desc:"Historic Qing Dynasty mountain path crossing from New Taipei to Yilan with sweeping Pacific views.",tags:["Historic","Ocean Views","Pampas Grass","Autumn"]},
  {id:8,name:"Taroko Baiyang Falls",chinese:"白楊瀑布步道",lat:24.208,lng:121.531,difficulty:"moderate",elevation:"540m",length:"6 km",duration:"3–4 hrs",permit:false,travel:{taipei:3.5,taichung:4.0,tainan:5.5,kaohsiung:5.5,hualien:1.0,keelung:4.0,taoyuan:3.75,hsinchu:4.5},desc:"Through hand-blasted marble tunnels to a dramatic curtain waterfall and water curtain cave.",tags:["Tunnels","Waterfall","Marble","Unique"]},
  {id:9,name:"Sun Moon Lake Trail",chinese:"日月潭步道",lat:23.862,lng:120.908,difficulty:"easy",elevation:"760m",length:"10 km",duration:"3–4 hrs",permit:false,travel:{taipei:3.0,taichung:1.0,tainan:2.5,kaohsiung:3.0,hualien:4.0,keelung:3.5,taoyuan:3.25,hsinchu:2.0},desc:"Beautiful lakeside trail around Taiwan's most famous lake with aboriginal culture and misty mountain views.",tags:["Lake","Cultural","Scenic","Popular"]},
  {id:10,name:"Xueshan (Snow Mountain)",chinese:"雪山主峰",lat:24.388,lng:121.266,difficulty:"hard",elevation:"3,886m",length:"21 km RT",duration:"2 days",permit:true,travel:{taipei:3.0,taichung:2.5,tainan:4.5,kaohsiung:5.0,hualien:3.5,keelung:3.5,taoyuan:3.25,hsinchu:2.5},desc:"Taiwan's second highest peak. The iconic black forest cirque makes this one of Taiwan's most beautiful hikes.",tags:["High Altitude","Permit Required","Cirque Lake","Star Gazing"]},
  {id:11,name:"Zhuilu Old Road",chinese:"錐麓古道",lat:24.230,lng:121.490,difficulty:"hard",elevation:"760m",length:"10 km RT",duration:"5–7 hrs",permit:true,travel:{taipei:3.5,taichung:4.0,tainan:5.5,kaohsiung:5.5,hualien:1.5,keelung:4.0,taoyuan:3.75,hsinchu:4.5},desc:"Taiwan's most dramatic cliff trail — a narrow path carved into a 500m vertical marble cliff face above Taroko Gorge.",tags:["Permit Required","Vertical Cliffs","Historic","Thrilling"]},
  {id:12,name:"Yushan (Jade Mountain)",chinese:"玉山主峰",lat:23.471,lng:120.957,difficulty:"expert",elevation:"3,952m",length:"27 km RT",duration:"2 days",permit:true,travel:{taipei:4.5,taichung:3.0,tainan:2.5,kaohsiung:3.0,hualien:4.0,keelung:5.0,taoyuan:4.75,hsinchu:3.5},desc:"Northeast Asia's highest peak. A legendary trek through alpine meadows to a summit above the clouds.",tags:["Highest Peak","Permit Required","Alpine","Summit"]},
  {id:13,name:"Qilai Ridge North",chinese:"奇萊北峰",lat:24.194,lng:121.337,difficulty:"expert",elevation:"3,607m",length:"22 km RT",duration:"2 days",permit:true,travel:{taipei:3.5,taichung:2.5,tainan:4.5,kaohsiung:5.0,hualien:2.5,keelung:4.0,taoyuan:3.75,hsinchu:3.0},desc:"Taiwan's most notorious black peaks — dramatic mist-shrouded ridgelines with a reputation for sudden weather.",tags:["Technical","Exposed Ridge","Mist","Dangerous"]},
  {id:14,name:"Nanhu Mountain",chinese:"南湖大山",lat:24.362,lng:121.468,difficulty:"expert",elevation:"3,742m",length:"38 km RT",duration:"3–4 days",permit:true,travel:{taipei:3.0,taichung:3.5,tainan:5.5,kaohsiung:6.0,hualien:3.0,keelung:3.5,taoyuan:3.25,hsinchu:2.5},desc:"Taiwan's 'King of the North' — a royal cirque basin with alpine lakes, tundra flowers and Taiwan's most beautiful high camp.",tags:["Top 100 Peak","Cirque","Alpine Lake","Multi-day"]},
  {id:15,name:"Alishan Forest Trail",chinese:"阿里山森林步道",lat:23.511,lng:120.803,difficulty:"easy",elevation:"2,200m",length:"6–12 km",duration:"2–4 hrs",permit:false,travel:{taipei:4.0,taichung:2.5,tainan:1.5,kaohsiung:2.0,hualien:5.0,keelung:4.5,taoyuan:4.25,hsinchu:3.0},desc:"Ancient red cypress forests draped in moss, a sacred sunrise above the sea of clouds and a historic mountain train.",tags:["Ancient Trees","Sea of Clouds","Sunrise","Train Access"]},
  {id:16,name:"Dabajianshan",chinese:"大霸尖山",lat:24.448,lng:121.185,difficulty:"expert",elevation:"3,492m",length:"32 km RT",duration:"3 days",permit:true,travel:{taipei:3.5,taichung:3.0,tainan:5.0,kaohsiung:5.5,hualien:4.0,keelung:4.0,taoyuan:3.75,hsinchu:2.5},desc:"The majestic 'Battleship Peak' with its sheer vertical walls — one of Taiwan's most iconic and photographed summits.",tags:["Iconic","Permit Required","Multi-day","Sheer Cliffs"]},
];

const PERMIT_INFO = [
  {mountain:"玉山 (Yushan)",type:"國家公園入園許可 + 入山許可",days:"30–90天前申請",url:"https://npm.cpami.gov.tw",note:"名額有限，建議提早申請"},
  {mountain:"雪山 (Xueshan)",type:"國家公園入園許可 + 入山許可",days:"30天前申請",url:"https://np.cpami.gov.tw",note:"需透過雪霸國家公園官網"},
  {mountain:"奇萊 (Qilai)",type:"入山許可",days:"7天前申請",url:"https://hipa.cpami.gov.tw",note:"可線上申請"},
  {mountain:"南湖大山 (Nanhu)",type:"國家公園入園許可 + 入山許可",days:"30天前申請",url:"https://np.cpami.gov.tw",note:"太魯閣國家公園管轄"},
  {mountain:"錐麓古道 (Zhuilu)",type:"步道特別入園許可",days:"7–30天前申請",url:"https://www.taroko.gov.tw",note:"每日名額限制，需網路預約"},
  {mountain:"大霸尖山 (Dabajian)",type:"國家公園入園許可 + 入山許可",days:"30天前申請",url:"https://np.cpami.gov.tw",note:"雪霸國家公園管轄"},
];

const DIFF_COLORS = { easy:"#4ade80", moderate:"#fbbf24", hard:"#f97316", expert:"#ef4444" };
const DIFF_LABELS = { easy:"Easy", moderate:"Moderate", hard:"Hard", expert:"Expert" };

// ─── MAP HELPERS ─────────────────────────────────────────────────────────────
const MAP_W = 320, MAP_H = 520, PAD_X = 20, PAD_Y = 20;
const LNG_MIN=120.05,LNG_MAX=122.0,LAT_MIN=21.85,LAT_MAX=25.35;
function project(lng,lat){
  const x=PAD_X+(lng-LNG_MIN)/(LNG_MAX-LNG_MIN)*(MAP_W-2*PAD_X);
  const y=PAD_Y+(LAT_MAX-lat)/(LAT_MAX-LAT_MIN)*(MAP_H-2*PAD_Y);
  return[x,y];
}
function outlineToPath(pts){
  return pts.map(([lng,lat],i)=>{const[x,y]=project(lng,lat);return`${i===0?'M':'L'}${x},${y}`;}).join(' ')+'Z';
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app:{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0a1a0f",minHeight:"100vh",color:"#e8f0e9"},
  nav:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:56,background:"rgba(10,26,15,0.95)",borderBottom:"1px solid rgba(74,222,128,0.12)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:100},
  logo:{display:"flex",alignItems:"center",gap:10,fontSize:17,fontWeight:700,letterSpacing:"-0.5px",color:"#4ade80"},
  logoIcon:{width:28,height:28,background:"linear-gradient(135deg,#4ade80,#22c55e)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14},
  tabs:{display:"flex",gap:4},
  tab:{padding:"6px 16px",borderRadius:20,fontSize:13,fontWeight:500,border:"1px solid transparent",background:"transparent",color:"#6b8a6e",cursor:"pointer",transition:"all 0.2s"},
  tabActive:{background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.25)",color:"#4ade80"},
  page:{padding:"28px 24px",maxWidth:1100,margin:"0 auto"},

  // Advisor
  advisorHero:{background:"linear-gradient(135deg,rgba(20,50,25,0.8),rgba(10,26,15,0.9))",border:"1px solid rgba(74,222,128,0.15)",borderRadius:16,padding:"28px 32px",marginBottom:24},
  heroTitle:{fontSize:26,fontWeight:700,letterSpacing:"-0.5px",marginBottom:6,background:"linear-gradient(135deg,#4ade80,#86efac)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  heroSub:{fontSize:14,color:"#6b8a6e",lineHeight:1.7},
  formCard:{background:"rgba(15,35,20,0.8)",border:"1px solid rgba(74,222,128,0.1)",borderRadius:14,padding:"24px"},
  formGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16},
  formGroup:{display:"flex",flexDirection:"column",gap:6},
  label:{fontSize:11,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",color:"#4ade80"},
  select:{background:"rgba(10,26,15,0.9)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:8,padding:"10px 12px",color:"#e8f0e9",fontSize:13,outline:"none"},
  generateBtn:{width:"100%",padding:"13px",fontSize:14,fontWeight:700,letterSpacing:"0.5px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s"},

  // Agent steps
  agentStep:{border:"1px solid rgba(74,222,128,0.1)",borderRadius:14,marginBottom:14,overflow:"hidden"},
  agentHeader:{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"rgba(15,35,20,0.6)",borderBottom:"1px solid rgba(74,222,128,0.08)"},
  agentBody:{padding:"16px 18px",fontSize:13,lineHeight:1.8,color:"#c8dcc9"},
  badge:{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,letterSpacing:"0.3px"},
  warnBox:{display:"flex",gap:10,padding:"10px 12px",background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:8,marginBottom:8},
  okBox:{display:"flex",gap:10,padding:"10px 12px",background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:8,marginBottom:8},
  infoBox:{padding:"12px 14px",background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,fontSize:13,color:"#7dd3fc",marginTop:12},

  // Trail Explorer
  explorerLayout:{display:"grid",gridTemplateColumns:"240px 1fr",gap:20},
  sidebar:{background:"rgba(15,35,20,0.6)",border:"1px solid rgba(74,222,128,0.1)",borderRadius:14,padding:"20px",height:"fit-content"},
  sidebarSection:{marginBottom:20},
  sidebarLabel:{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#4ade80",marginBottom:10},
  diffBtn:{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:"1px solid transparent",background:"transparent",color:"#6b8a6e",cursor:"pointer",fontSize:13,width:"100%",marginBottom:4,transition:"all 0.15s"},
  diffBtnActive:{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.2)",color:"#e8f0e9"},
  dot:{width:10,height:10,borderRadius:"50%",flexShrink:0},
  trailGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14},
  trailCard:{background:"rgba(15,35,20,0.7)",border:"1px solid rgba(74,222,128,0.1)",borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all 0.2s"},
  trailCardHover:{border:"1px solid rgba(74,222,128,0.35)",transform:"translateY(-2px)"},
  trailImg:{height:110,background:"linear-gradient(135deg,#0f2515,#1a3a20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,position:"relative"},
  trailInfo:{padding:"12px 14px"},
  trailName:{fontSize:13,fontWeight:600,marginBottom:2,color:"#e8f0e9"},
  trailSub:{fontSize:11,color:"#6b8a6e",marginBottom:8},
  diffPill:{display:"inline-block",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,letterSpacing:"0.5px"},

  // Permits
  permitCard:{background:"rgba(15,35,20,0.7)",border:"1px solid rgba(74,222,128,0.1)",borderRadius:12,padding:"18px 20px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16},
  permitLeft:{flex:1},
  permitName:{fontSize:14,fontWeight:600,color:"#e8f0e9",marginBottom:4},
  permitMeta:{fontSize:12,color:"#6b8a6e",marginBottom:4},
  permitUrl:{fontSize:12,color:"#4ade80",textDecoration:"none"},
  requiredTag:{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:"rgba(239,68,68,0.12)",color:"#f87171",border:"1px solid rgba(239,68,68,0.25)",whiteSpace:"nowrap"},

  // Map
  mapWrap:{background:"rgba(15,35,20,0.5)",border:"1px solid rgba(74,222,128,0.1)",borderRadius:14,padding:16,display:"flex",justifyContent:"center"},

  // Loading
  loadingWrap:{textAlign:"center",padding:"40px 20px"},
  spinner:{width:32,height:32,border:"3px solid rgba(74,222,128,0.15)",borderTopColor:"#4ade80",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"},
};

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────
function AgentStep({ icon, title, badgeText, badgeColor, children, delay=0 }) {
  return (
    <div style={{...S.agentStep, animation:`fadeUp 0.4s ease ${delay}s both`}}>
      <div style={S.agentHeader}>
        <span style={{fontSize:20}}>{icon}</span>
        <span style={{fontSize:13,fontWeight:600,color:"#c8dcc9"}}>{title}</span>
        <span style={{...S.badge, background:`rgba(${badgeColor},0.12)`, color:`rgb(${badgeColor})`, border:`1px solid rgba(${badgeColor},0.3)`}}>{badgeText}</span>
      </div>
      <div style={S.agentBody}>{children}</div>
    </div>
  );
}

function LoadingStep({ messages, currentStep }) {
  return (
    <div style={S.loadingWrap}>
      <div style={S.spinner}/>
      <div style={{fontSize:13,color:"#4ade80",fontWeight:500}}>{messages[currentStep] || messages[messages.length-1]}</div>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:12}}>
        {messages.map((_,i)=>(
          <div key={i} style={{width:6,height:6,borderRadius:"50%",background:i<=currentStep?"#4ade80":"rgba(74,222,128,0.2)",transition:"background 0.3s"}}/>
        ))}
      </div>
    </div>
  );
}

// ─── AI ADVISOR PAGE ──────────────────────────────────────────────────────────
function AdvisorPage() {
  const [form, setForm] = useState({mountain:"Yushan (玉山) — 3,952m",level:"Beginner",days:"2 days / 1 night",group:"2–3 people",from:"Taipei"});
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const LOAD_MSGS = [
    "Generator Agent is building your hiking plan...",
    "Critic Agent is reviewing safety & permit requirements...",
    "Finalizing your verified plan...",
  ];

  async function callClaude(prompt, maxTokens=900) {
    const key = apiKey || localStorage.getItem("st_api_key") || "";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})
    });
    if(!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    return data.content[0].text;
  }

  async function generate() {
    const key = apiKey || localStorage.getItem("st_api_key") || "";
    if(!key){ setShowKeyInput(true); return; }
    localStorage.setItem("st_api_key", key);
    setStatus("loading"); setLoadStep(0); setResult(null);

    try {
      // Step 1: Generator
      const genPrompt = `You are an expert Taiwan mountain hiking guide. Generate a detailed, practical hiking plan in English.

Mountain: ${form.mountain}
Experience Level: ${form.level}
Trip Duration: ${form.days}
Group Size: ${form.group}
Departing From: ${form.from}

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "itinerary": [{"day": 1, "title": "Day title", "items": ["item1", "item2"]}],
  "gear": ["item1", "item2", "item3"],
  "transport": "How to get there from ${form.from}"
}`;

      const genRaw = await callClaude(genPrompt, 800);
      const genData = JSON.parse(genRaw.replace(/```json|```/g,"").trim());
      setLoadStep(1);

      // Step 2: Critic
      const criticPrompt = `You are a Taiwan mountain safety and legal compliance reviewer.

Review this hiking plan for: ${form.mountain}, ${form.level} hiker, ${form.days}, group: ${form.group}

Return ONLY a JSON object (no markdown):
{
  "warnings": ["warning1", "warning2"],
  "permits": ["permit info 1", "permit info 2"],
  "approvals": ["safe aspect 1", "safe aspect 2"],
  "overall_safe": true or false,
  "safety_note": "one sentence summary"
}`;

      const criticRaw = await callClaude(criticPrompt, 600);
      const criticData = JSON.parse(criticRaw.replace(/```json|```/g,"").trim());
      setLoadStep(2);

      await new Promise(r=>setTimeout(r,800));
      setResult({gen:genData, critic:criticData});
      setStatus("done");
    } catch(e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div style={S.page}>
      <div style={S.advisorHero}>
        <div style={S.heroTitle}>SafeTrail AI Advisor</div>
        <div style={S.heroSub}>
          Tell us your hiking goal. Our <strong style={{color:"#4ade80"}}>Generator Agent</strong> builds a personalised plan,
          then the <strong style={{color:"#fbbf24"}}>Critic Agent</strong> checks every detail for safety and legal compliance — before you see it.
        </div>
      </div>

      {showKeyInput && (
        <div style={{background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:12,padding:"16px 20px",marginBottom:20}}>
          <div style={{fontSize:13,color:"#fbbf24",fontWeight:600,marginBottom:8}}>🔑 Enter your Anthropic API Key to activate AI</div>
          <div style={{display:"flex",gap:8}}>
            <input value={apiKey} onChange={e=>setApiKey(e.target.value)} type="password" placeholder="sk-ant-..." style={{...S.select,flex:1}}/>
            <button onClick={()=>{localStorage.setItem("st_api_key",apiKey);setShowKeyInput(false);generate();}} style={{...S.generateBtn,width:"auto",padding:"10px 18px"}}>Activate</button>
          </div>
          <div style={{fontSize:11,color:"#6b8a6e",marginTop:6}}>Your key is stored locally in your browser only.</div>
        </div>
      )}

      <div style={S.formCard}>
        <div style={S.formGrid}>
          {[
            {label:"Target Mountain",key:"mountain",opts:["Yushan (玉山) — 3,952m","Xueshan (雪山) — 3,886m","Hehuanshan (合歡山) — 3,417m","Qilai Ridge (奇萊) — 3,607m","Nanhu Mountain (南湖) — 3,742m","Alishan (阿里山) — 2,200m","Yangmingshan (陽明山) — 1,120m"]},
            {label:"Experience Level",key:"level",opts:["Beginner","Intermediate","Advanced","Expert"]},
            {label:"Trip Duration",key:"days",opts:["1 day","2 days / 1 night","3 days / 2 nights","4+ days"]},
            {label:"Group Size",key:"group",opts:["Solo","2–3 people","4–8 people","9+ people"]},
          ].map(f=>(
            <div key={f.key} style={S.formGroup}>
              <label style={S.label}>{f.label}</label>
              <select style={S.select} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}>
                {f.opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{...S.formGroup,gridColumn:"1/-1"}}>
            <label style={S.label}>Depart From</label>
            <select style={S.select} value={form.from} onChange={e=>setForm(p=>({...p,from:e.target.value}))}>
              {["Taipei","Taichung","Tainan","Kaohsiung","Hualien","Keelung","Taoyuan","Hsinchu"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button style={S.generateBtn} onClick={generate} disabled={status==="loading"}>
          {status==="loading" ? "⏳ Generating..." : "🏔 Generate Safe Hiking Plan"}
        </button>
      </div>

      {status==="loading" && <LoadingStep messages={LOAD_MSGS} currentStep={loadStep}/>}

      {status==="error" && (
        <div style={{...S.infoBox,borderColor:"rgba(239,68,68,0.3)",color:"#f87171",marginTop:16}}>
          ⚠ Could not connect to AI. Please check your API key and try again.
        </div>
      )}

      {status==="done" && result && (
        <div style={{marginTop:20,animation:"fadeUp 0.4s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,fontSize:12,color:"#6b8a6e",letterSpacing:"1px",textTransform:"uppercase"}}>
            <span style={{width:24,height:1,background:"rgba(74,222,128,0.3)"}}/>Generator Agent
            <span style={{color:"rgba(74,222,128,0.3)"}}>→</span>Critic Agent
            <span style={{color:"rgba(74,222,128,0.3)"}}>→</span>Verified Plan
            <span style={{width:24,height:1,background:"rgba(74,222,128,0.3)"}}/>
          </div>

          {/* Generator */}
          <AgentStep icon="✍️" title="Generator Agent" badgeText="Plan created" badgeColor="74,222,128" delay={0}>
            {result.gen.itinerary?.map((day,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{fontWeight:600,color:"#4ade80",marginBottom:4}}>Day {day.day}: {day.title}</div>
                <ul style={{paddingLeft:18,margin:0}}>
                  {day.items?.map((item,j)=><li key={j} style={{marginBottom:3}}>{item}</li>)}
                </ul>
              </div>
            ))}
            {result.gen.gear && (
              <div style={{marginTop:12,padding:"10px 14px",background:"rgba(74,222,128,0.05)",borderRadius:8}}>
                <div style={{fontWeight:600,color:"#4ade80",marginBottom:6,fontSize:12}}>RECOMMENDED GEAR</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {result.gen.gear.map((g,i)=><span key={i} style={{fontSize:12,padding:"2px 8px",background:"rgba(74,222,128,0.08)",borderRadius:20,border:"1px solid rgba(74,222,128,0.15)"}}>{g}</span>)}
                </div>
              </div>
            )}
            {result.gen.transport && (
              <div style={{marginTop:10,fontSize:12,color:"#6b8a6e"}}>🚗 {result.gen.transport}</div>
            )}
          </AgentStep>

          {/* Critic */}
          <AgentStep icon="🛡" title="Critic Agent" badgeText={`${result.critic.warnings?.length||0} issue${result.critic.warnings?.length===1?"":"s"} flagged`} badgeColor="251,191,36" delay={0.1}>
            {result.critic.warnings?.map((w,i)=>(
              <div key={i} style={S.warnBox}>
                <span style={{color:"#fbbf24",flexShrink:0}}>⚠</span>
                <span>{w}</span>
              </div>
            ))}
            {result.critic.permits?.map((p,i)=>(
              <div key={i} style={{...S.warnBox,borderColor:"rgba(251,191,36,0.15)"}}>
                <span style={{color:"#fbbf24",flexShrink:0}}>📋</span>
                <span>{p}</span>
              </div>
            ))}
            {result.critic.approvals?.map((a,i)=>(
              <div key={i} style={S.okBox}>
                <span style={{color:"#4ade80",flexShrink:0}}>✓</span>
                <span>{a}</span>
              </div>
            ))}
          </AgentStep>

          {/* Final */}
          <AgentStep icon="✅" title="Verified Plan" badgeText={result.critic.overall_safe?"Safe to proceed":"Proceed with caution"} badgeColor={result.critic.overall_safe?"74,222,128":"251,191,36"} delay={0.2}>
            <div style={S.infoBox}>{result.critic.safety_note}</div>
            <div style={{marginTop:12,fontSize:12,color:"#6b8a6e"}}>
              Always file a mountain registration (山岳登記) with your local police station before departure. Emergency: 119
            </div>
          </AgentStep>
        </div>
      )}
    </div>
  );
}

// ─── TRAIL EXPLORER PAGE ──────────────────────────────────────────────────────
function ExplorerPage() {
  const [activeDiffs, setActiveDiffs] = useState(new Set(["easy","moderate","hard","expert"]));
  const [activeCity, setActiveCity] = useState("taipei");
  const [maxHours, setMaxHours] = useState(6);
  const [hidePermit, setHidePermit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const isVisible = t => {
    if(!activeDiffs.has(t.difficulty)) return false;
    if((t.travel[activeCity]||99)>maxHours) return false;
    if(hidePermit && t.permit) return false;
    return true;
  };
  const visible = TRAILS.filter(isVisible);

  return (
    <div style={S.page}>
      <div style={S.explorerLayout}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.sidebarSection}>
            <div style={S.sidebarLabel}>Difficulty</div>
            {["easy","moderate","hard","expert"].map(d=>(
              <button key={d} style={activeDiffs.has(d)?{...S.diffBtn,...S.diffBtnActive}:S.diffBtn}
                onClick={()=>setActiveDiffs(p=>{const n=new Set(p);n.has(d)?n.size>1&&n.delete(d):n.add(d);return n;})}>
                <div style={{...S.dot,background:DIFF_COLORS[d]}}/>
                {DIFF_LABELS[d]}
              </button>
            ))}
          </div>
          <div style={S.sidebarSection}>
            <div style={S.sidebarLabel}>Depart From</div>
            <select style={{...S.select,width:"100%"}} value={activeCity} onChange={e=>setActiveCity(e.target.value)}>
              {["taipei","taichung","tainan","kaohsiung","hualien","keelung","taoyuan","hsinchu"].map(c=>(
                <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={S.sidebarSection}>
            <div style={S.sidebarLabel}>Max Travel Time: {maxHours}h</div>
            <input type="range" min={0.5} max={6} step={0.5} value={maxHours} onChange={e=>setMaxHours(+e.target.value)}
              style={{width:"100%",accentColor:"#4ade80"}}/>
          </div>
          <div style={S.sidebarSection}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:"#6b8a6e"}}>
              <input type="checkbox" checked={hidePermit} onChange={e=>setHidePermit(e.target.checked)} style={{accentColor:"#4ade80"}}/>
              Hide permit-required trails
            </label>
          </div>
          <div style={{fontSize:12,color:"#4ade80",fontWeight:600}}>{visible.length} trails shown</div>
        </div>

        {/* Right: map + grid */}
        <div>
          <div style={S.mapWrap}>
            <svg width={MAP_W} height={MAP_H} style={{display:"block"}}>
              <defs>
                <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d={outlineToPath(TAIWAN_OUTLINE)} fill="#0f2515" stroke="#2d5a3a" strokeWidth={1.5}/>
              {[{name:"Taipei",lat:25.04,lng:121.52},{name:"Taichung",lat:24.15,lng:120.65},{name:"Kaohsiung",lat:22.62,lng:120.28},{name:"Hualien",lat:23.98,lng:121.58}].map(c=>{
                const[cx,cy]=project(c.lng,c.lat);
                return <g key={c.name}><circle cx={cx} cy={cy} r={2.5} fill="#c9a84c" opacity={0.6}/><text x={cx+5} y={cy+4} fontSize={9} fill="#c9a84c" opacity={0.6} fontFamily="DM Sans,sans-serif">{c.name}</text></g>;
              })}
              {TRAILS.map(t=>{
                const vis=isVisible(t);
                const[mx,my]=project(t.lng,t.lat);
                const isH=hovered?.id===t.id, isS=selected?.id===t.id;
                return (
                  <g key={t.id} opacity={vis?1:0.1} style={{cursor:vis?"pointer":"default"}}
                    onMouseEnter={vis?()=>setHovered(t):undefined}
                    onMouseLeave={()=>setHovered(null)}
                    onClick={vis?()=>setSelected(isS?null:t):undefined}>
                    {(isH||isS)&&<circle cx={mx} cy={my} r={12} fill={DIFF_COLORS[t.difficulty]} opacity={0.15}/>}
                    <circle cx={mx} cy={my} r={isH||isS?7:5} fill={DIFF_COLORS[t.difficulty]} stroke="#0a1a0f" strokeWidth={1.5} filter={isH||isS?"url(#glow)":undefined}/>
                  </g>
                );
              })}
            </svg>
          </div>

          {selected && (
            <div style={{...S.agentStep,margin:"16px 0",border:"1px solid rgba(74,222,128,0.3)"}}>
              <div style={S.agentHeader}>
                <span style={{fontWeight:600,color:"#e8f0e9"}}>{selected.name}</span>
                <span style={{color:"#6b8a6e",fontSize:12}}>{selected.chinese}</span>
                <span style={{...S.diffPill,background:`rgba(${selected.difficulty==="easy"?"74,222,128":selected.difficulty==="moderate"?"251,191,36":selected.difficulty==="hard"?"249,115,22":"239,68,68"},0.12)`,color:DIFF_COLORS[selected.difficulty]}}>{DIFF_LABELS[selected.difficulty]}</span>
              </div>
              <div style={{...S.agentBody,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div><span style={{color:"#6b8a6e"}}>Elevation: </span>{selected.elevation}</div>
                <div><span style={{color:"#6b8a6e"}}>Length: </span>{selected.length}</div>
                <div><span style={{color:"#6b8a6e"}}>Duration: </span>{selected.duration}</div>
                <div><span style={{color:"#6b8a6e"}}>Permit: </span><span style={{color:selected.permit?"#f87171":"#4ade80"}}>{selected.permit?"Required":"Not required"}</span></div>
                <div style={{gridColumn:"1/-1",color:"#a0b8a2",marginTop:4}}>{selected.desc}</div>
                <div style={{gridColumn:"1/-1",display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
                  {selected.tags.map(tag=><span key={tag} style={{fontSize:11,padding:"2px 8px",background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.12)",borderRadius:20,color:"#6b8a6e"}}>{tag}</span>)}
                </div>
              </div>
            </div>
          )}

          <div style={{...S.trailGrid,marginTop:16}}>
            {visible.map(t=>(
              <div key={t.id} style={selected?.id===t.id?{...S.trailCard,...S.trailCardHover}:S.trailCard}
                onClick={()=>setSelected(selected?.id===t.id?null:t)}
                onMouseEnter={()=>setHovered(t)} onMouseLeave={()=>setHovered(null)}>
                <div style={S.trailImg}>
                  {t.difficulty==="easy"?"🌿":t.difficulty==="moderate"?"⛰":"🏔"}
                  {t.permit&&<div style={{position:"absolute",top:8,right:8,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:"rgba(239,68,68,0.85)",color:"#fff"}}>PERMIT</div>}
                </div>
                <div style={S.trailInfo}>
                  <div style={S.trailName}>{t.name}</div>
                  <div style={S.trailSub}>{t.chinese} · {t.elevation} · {t.duration}</div>
                  <span style={{...S.diffPill,background:`rgba(${t.difficulty==="easy"?"74,222,128":t.difficulty==="moderate"?"251,191,36":t.difficulty==="hard"?"249,115,22":"239,68,68"},0.1)`,color:DIFF_COLORS[t.difficulty]}}>
                    {DIFF_LABELS[t.difficulty]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PERMITS PAGE ─────────────────────────────────────────────────────────────
function PermitsPage() {
  return (
    <div style={S.page}>
      <div style={S.advisorHero}>
        <div style={S.heroTitle}>入山許可指南 Permit Guide</div>
        <div style={S.heroSub}>
          台灣高山登山需要兩種許可證：<strong style={{color:"#4ade80"}}>國家公園入園許可</strong>（特定山岳）和
          <strong style={{color:"#4ade80"}}> 入山許可證</strong>（所有3,000m以上山峰）。
          The AI Advisor will automatically remind you of what's required for your chosen mountain.
        </div>
      </div>

      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#4ade80",marginBottom:14}}>Mountains Requiring Permits</div>
        {PERMIT_INFO.map((p,i)=>(
          <div key={i} style={S.permitCard}>
            <div style={S.permitLeft}>
              <div style={S.permitName}>{p.mountain}</div>
              <div style={S.permitMeta}>📋 {p.type}</div>
              <div style={S.permitMeta}>⏱ Apply: {p.days}</div>
              <div style={S.permitMeta}>ℹ {p.note}</div>
              <a href={p.url} target="_blank" rel="noopener noreferrer" style={S.permitUrl}>🔗 {p.url}</a>
            </div>
            <span style={S.requiredTag}>REQUIRED</span>
          </div>
        ))}
      </div>

      <div style={{background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.12)",borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#4ade80",marginBottom:12}}>General Rules for All High Mountains</div>
        {[
          "🏔 入山許可證 (Mountain Entry Permit) — Required for ALL peaks above 3,000m. Apply at local police stations or online at nhi.gov.tw, at least 3–7 days before departure.",
          "📞 Mountain Registration (山岳登記) — Always file with your nearest police station before any high-altitude hike, regardless of permit requirements.",
          "👥 Group Requirement — Solo hiking above 3,000m is strongly discouraged and may be refused at checkpoints. Minimum 2 people recommended.",
          "🆘 Emergency Numbers — Mountain rescue: 119 | Police: 110 | Forestry Bureau trail report hotline: 0800-000-930",
        ].map((r,i)=>(
          <div key={i} style={{fontSize:13,color:"#a0b8a2",lineHeight:1.7,marginBottom:8,paddingLeft:4}}>{r}</div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SafeTrailAI() {
  const [page, setPage] = useState("advisor");

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        select option { background: #0f2515; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a1a0f; }
        ::-webkit-scrollbar-thumb { background: #2d5a3a; border-radius: 3px; }
      `}</style>

      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.logo}>
          <div style={S.logoIcon}>🏔</div>
          SafeTrail AI
        </div>
        <div style={S.tabs}>
          {[
            {id:"advisor",label:"🤖 AI Advisor"},
            {id:"explorer",label:"🗺 Trail Explorer"},
            {id:"permits",label:"📋 Permits"},
          ].map(t=>(
            <button key={t.id} style={page===t.id?{...S.tab,...S.tabActive}:S.tab} onClick={()=>setPage(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Pages */}
      {page==="advisor" && <AdvisorPage/>}
      {page==="explorer" && <ExplorerPage/>}
      {page==="permits" && <PermitsPage/>}
    </div>
  );
}
