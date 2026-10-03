import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, Bell, Brain, Calculator, ChartNoAxesCombined, CircleDollarSign, Flame, Gauge, LineChart, ShieldCheck, Trophy } from "lucide-react";
import "./styles.css";
import { americanToDecimal as decimalOdds, impliedProbability, expectedValue, parlayAmerican } from "./lib/oddsMath";
import { forgeScore } from "./lib/forgeScore";

type OddsRow = { book:string; spread:string; spreadOdds:number; moneyline:number; total:string; totalOdds:number };
type Game = { id:number; sport:string; away:string; home:string; start:string; consensus:string; model:number; market:number; edge:number; signal:"Strong"|"Watch"|"Neutral"; odds:OddsRow[] };

const games: Game[] = [
  { id:1, sport:"NFL", away:"Kansas City", home:"Jacksonville", start:"Mon 7:15 PM", consensus:"KC -3.5", model:61, market:57, edge:4, signal:"Strong", odds:[
    {book:"DraftKings",spread:"KC -3.5",spreadOdds:-110,moneyline:-180,total:"47.5",totalOdds:-108},
    {book:"FanDuel",spread:"KC -3",spreadOdds:-115,moneyline:-176,total:"47.5",totalOdds:-110},
    {book:"BetMGM",spread:"KC -3.5",spreadOdds:-105,moneyline:-185,total:"48",totalOdds:-110},
    {book:"Caesars",spread:"KC -3.5",spreadOdds:-108,moneyline:-178,total:"47.5",totalOdds:-112}
  ]},
  { id:2, sport:"NBA", away:"Boston", home:"New York", start:"Tue 6:30 PM", consensus:"BOS -2.5", model:58, market:55, edge:3, signal:"Watch", odds:[
    {book:"DraftKings",spread:"BOS -2.5",spreadOdds:-108,moneyline:-140,total:"224.5",totalOdds:-110},
    {book:"FanDuel",spread:"BOS -2",spreadOdds:-115,moneyline:-138,total:"225",totalOdds:-108},
    {book:"BetMGM",spread:"BOS -2.5",spreadOdds:-105,moneyline:-142,total:"224.5",totalOdds:-112},
    {book:"Caesars",spread:"BOS -2.5",spreadOdds:-110,moneyline:-145,total:"225",totalOdds:-105}
  ]},
  { id:3, sport:"NHL", away:"Colorado", home:"Dallas", start:"Wed 8:00 PM", consensus:"DAL -115", model:52, market:53, edge:-1, signal:"Neutral", odds:[
    {book:"DraftKings",spread:"DAL -1.5",spreadOdds:185,moneyline:-115,total:"6.0",totalOdds:-105},
    {book:"FanDuel",spread:"DAL -1.5",spreadOdds:190,moneyline:-112,total:"6.0",totalOdds:-110},
    {book:"BetMGM",spread:"DAL -1.5",spreadOdds:180,moneyline:-118,total:"6.5",totalOdds:100},
    {book:"Caesars",spread:"DAL -1.5",spreadOdds:188,moneyline:-114,total:"6.0",totalOdds:-108}
  ]}
];

const nav = [
  ["Dashboard",ChartNoAxesCombined],["Games",Trophy],["Odds",LineChart],["AI Analyst",Brain],
  ["Bet Tracker",Activity],["Paper Bets",CircleDollarSign],["Alerts",Bell],["Bankroll",Gauge]
] as const;

function App(){
  const [page,setPage]=useState("Dashboard");
  const [legs,setLegs]=useState("-110,-115,+125");
  const [paperBets,setPaperBets]=useState([{event:"Kansas City @ Jacksonville",pick:"KC -3.5",odds:-110,stake:25,status:"Open"}]);
  const parlay=useMemo(()=>{ const parsed=legs.split(",").map(v=>Number(v.trim())).filter(v=>Number.isFinite(v)&&v!==0); if(!parsed.length)return null; const american=parlayAmerican(parsed); return {american,implied:impliedProbability(american)*100,payout:100*decimalOdds(american)}; },[legs]);
  const selected=games[0];
  const kcForge = forgeScore({ edgePercent: 4, priceQuality: .92, dataQuality: .86, marketStability: .72, uncertainty: .28, bankrollRisk: .18, correlationRisk: .12 });

  const Dashboard=()=> <div className="stack">
    <section className="hero"><div><span className="eyebrow"><Flame size={15}/> BETFORGE AI</span><h1>Forge smarter decisions from the market.</h1><p>BetForge is built around decision intelligence: price shopping, explainable model edges, bankroll discipline, CLV tracking, and fast alerts.</p></div><div className="hero-card"><span className="label">Paper bankroll</span><strong>$1,000.00</strong><small>No real-money custody</small></div></section>
    <div className="metrics"><Metric label="Best model edge" value="+4.0%" note="Demo probability gap"/><Metric label="Price shop" value="-105" note="Best KC -3.5 demo"/><Metric label="Tracked ROI" value="+7.8%" note="Demo history"/><Metric label="ForgeScore" value={kcForge.score+"/100"} note="Decision-quality composite"/></div>
    <div className="grid2"><Card title="Decision feed" icon={<Brain size={18}/>}>{games.map(g=><div className="signal" key={g.id}><div><b>{g.away} @ {g.home}</b><small>{g.sport} • {g.start}</small></div><div className="right"><span className={"pill "+g.signal.toLowerCase()}>{g.signal}</span><b>{g.edge>0?"+":""}{g.edge}%</b></div></div>)}</Card>
    <Card title="Why this is different" icon={<ShieldCheck size={18}/>}><ul><li>Explainable AI shows assumptions, counter-factors, and uncertainty.</li><li>Price-first workflow compares books before showing any edge.</li><li>Bankroll Guardian flags oversized stake exposure.</li><li>Bet journal measures closing-line value, not just wins and losses.</li><li>Outbound-only sportsbook model keeps BetForge focused on intelligence.</li></ul></Card></div>
  </div>;

  const OddsBoard=()=> <div className="stack"><PageTitle title="Market & line shop" sub="Find the best available price before evaluating a wager."/>
    {games.map(game=><Card key={game.id} title={game.away+" @ "+game.home} icon={<Trophy size={18}/>}><div className="game-meta"><span>{game.sport}</span><span>{game.start}</span><span className="demo">DEMO DATA</span></div><div className="odds-table"><div className="thead"><span>Book</span><span>Spread</span><span>Moneyline</span><span>Total</span></div>{game.odds.map(o=><div className="trow" key={o.book}><b>{o.book}</b><span>{o.spread} ({o.spreadOdds>0?"+":""}{o.spreadOdds})</span><span>{o.moneyline>0?"+":""}{o.moneyline}</span><span>{o.total} ({o.totalOdds>0?"+":""}{o.totalOdds})</span></div>)}</div></Card>)}
    <div className="grid2"><Card title="+EV scanner" icon={<Gauge size={18}/>}><p className="muted">KC -3.5 @ -105 • model 61% • break-even {Math.round(impliedProbability(-105)*1000)/10}%</p><strong className="positive">Demo EV on $100: ${expectedValue(.61,-105).toFixed(2)}</strong></Card><Card title="Parlay lab" icon={<Calculator size={18}/>}><label>American odds, comma-separated</label><input value={legs} onChange={e=>setLegs(e.target.value)}/>{parlay&&<div className="calc"><span>Combined <b>{parlay.american>0?"+":""}{parlay.american}</b></span><span>Implied <b>{parlay.implied.toFixed(1)}%</b></span><span>$100 return <b>${parlay.payout.toFixed(2)}</b></span></div>}</Card></div>
  </div>;

  const Analyst=()=> <div className="stack"><PageTitle title="AI Analyst" sub="Explainable analysis instead of black-box picks."/><div className="grid2"><Card title="Model read" icon={<Gauge size={18}/>}><div className="big-number">61%</div><p className="muted">Illustrative KC cover probability</p><div className="meter"><span style={{width:"61%"}}/></div><div className="market-line"><span>Market estimate</span><b>57%</b></div><div className="market-line"><span>Estimated edge</span><b className="positive">+4%</b></div></Card><Card title="Reasoning trace" icon={<Brain size={18}/>}><ul><li>Efficiency and explosive-play profile support the favorite in this demo model.</li><li>Price sensitivity matters: -3 at a worse price can be preferable to -3.5.</li><li>Counter-factor: road variance and late injury news can erase a small edge.</li><li>Confidence stays moderate because model error is explicitly represented.</li></ul></Card></div><div className="disclaimer">No outcome is guaranteed. Model estimates are informational and may be wrong.</div></div>;

  const Tracker=()=> <div className="stack"><PageTitle title="Bet journal & paper bets" sub="Measure process quality, not just outcomes."/><Card title="Open paper bets" icon={<Activity size={18}/>}>{paperBets.map((b,i)=><div className="signal" key={i}><div><b>{b.pick}</b><small>{b.event} • Entry {b.odds>0?"+":""}{b.odds}</small></div><div className="right"><b>${b.stake}</b><span className="pill watch">{b.status}</span></div></div>)}<button className="wide" onClick={()=>setPaperBets([...paperBets,{event:"Boston @ New York",pick:"BOS -2.5",odds:-108,stake:20,status:"Open"}])}>Add demo bet</button></Card><Card title="Journal metrics" icon={<LineChart size={18}/>}><div className="market-line"><span>Average closing-line value</span><b>+1.4%</b></div><div className="market-line"><span>Average stake</span><b>1.2 units</b></div><div className="market-line"><span>Process grade</span><b>Price discipline: strong</b></div></Card></div>;

  const Alerts=()=> <div className="stack"><PageTitle title="Smart alerts" sub="Act on market changes instead of constantly refreshing odds."/><div className="grid2"><Card title="Target price" icon={<Bell size={18}/>}><p className="muted">KC -3.5 improves to -105 or better.</p><span className="pill strong">Enabled</span></Card><Card title="Market move" icon={<Bell size={18}/>}><p className="muted">Alert when a tracked line moves by 1 point or more.</p><span className="pill watch">Demo</span></Card></div></div>;

  const Bankroll=()=> <div className="stack"><PageTitle title="Bankroll Guardian" sub="Prevent a good research process from becoming bad risk management."/><div className="metrics"><Metric label="Virtual bankroll" value="$1,000" note="Paper only"/><Metric label="Base unit" value="$10" note="1% setting"/><Metric label="Max single risk" value="$25" note="2.5% cap"/><Metric label="Open exposure" value="$25" note="Within demo limit"/></div><Card title="Guardrails" icon={<ShieldCheck size={18}/>}><ul><li>Warn before a stake exceeds the configured bankroll percentage.</li><li>Track correlated exposure across parlays and same-game positions.</li><li>Cooling-off controls can disable recommendation surfaces.</li><li>Loss-chasing alerts focus on behavior, not enticing another wager.</li></ul></Card></div>;

  let content:React.ReactNode=<Dashboard/>;
  if(page==="Games"||page==="Odds") content=<OddsBoard/>;
  if(page==="AI Analyst") content=<Analyst/>;
  if(page==="Bet Tracker"||page==="Paper Bets") content=<Tracker/>;
  if(page==="Alerts") content=<Alerts/>;
  if(page==="Bankroll") content=<Bankroll/>;

  return <div className="app"><aside><div className="brand"><div className="logo">BF</div><div><b>BetForge AI</b><small>DECISION INTELLIGENCE</small></div></div><nav>{nav.map(([name,Icon])=><button key={name} className={page===name?"active":""} onClick={()=>setPage(name)}><Icon size={18}/>{name}</button>)}</nav><div className="side-note"><ShieldCheck size={18}/><div><b>Analytics, not a sportsbook</b><small>No deposits, withdrawals, or wager custody.</small></div></div></aside><main><header><div><b>{page}</b><small>BetForge AI MVP • Demo data</small></div><span className="status">● SYSTEM ONLINE</span></header>{content}</main></div>;
}

function Card({title,icon,children}:{title:string;icon?:React.ReactNode;children:React.ReactNode}){ return <section className="card"><div className="card-title">{icon}<b>{title}</b></div>{children}</section>; }
function Metric({label,value,note}:{label:string;value:string;note:string}){ return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>; }
function PageTitle({title,sub}:{title:string;sub:string}){ return <div className="page-title"><h1>{title}</h1><p>{sub}</p></div>; }

createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);