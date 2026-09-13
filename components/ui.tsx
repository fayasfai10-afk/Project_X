'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Clock3, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import type { Challenge, Partner } from '@/lib/types';

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55, delay }}>{children}</motion.div>;
}

export function SiteNav() {
  return <header className="topnav"><div className="container nav-inner">
    <Link className="brand" href="/"><span className="brand-mark">J</span><span>JharSetu</span></Link>
    <nav className="nav-links"><Link href="/challenges">Challenges</Link><Link href="/report">Report</Link><Link href="/dashboard">Command Centre</Link><Link href="/projects/PR-21">Projects</Link></nav>
    <div style={{display:'flex', gap:8}}><Link className="btn btn-ghost" href="/dashboard">Explore demo</Link><Link className="btn btn-accent" href="/report">Report challenge</Link></div>
  </div></header>
}

export function PriorityBadge({ priority }: { priority: string }) {
  const cls = priority.toLowerCase();
  return <span className={`badge badge-${cls}`}>{priority}</span>;
}

export function StatKpi({ label, value, delta }: { label:string; value:string; delta:string }) {
  return <div className="card kpi"><div className="eyebrow">{label}</div><div className="num">{value}</div><div className="delta">{delta}</div></div>;
}

export function ChallengeCard({ c }: { c: Challenge }) {
  return <motion.div className="card challenge" whileHover={{ y: -5 }} transition={{ type:'spring', stiffness:250, damping:20 }}>
    <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center'}}><PriorityBadge priority={c.priority}/><span className="eyebrow">{c.id}</span></div>
    <Link href={`/challenges/${c.id}`}><h3>{c.title}</h3></Link>
    <p>{c.summary}</p>
    <div className="tiny-list"><span className="tiny"><MapPin size={11} style={{verticalAlign:'-2px'}}/> {c.district}</span><span className="tiny">Impact {c.impactScore}</span><span className="tiny">{c.reports} reports</span></div>
    <div className="foot"><span className="muted" style={{fontSize:12}}>{c.status}</span><Link href={`/challenges/${c.id}`} className="btn btn-ghost" style={{padding:'9px 12px'}}><ArrowUpRight size={15}/></Link></div>
  </motion.div>
}

export function MatchList({ items, kind }: { items: Partner[]; kind: string }) {
  return <div className="card panel"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:6}}><div><div className="eyebrow">{kind} matching</div><h3 style={{fontSize:26,letterSpacing:'-.04em',margin:'8px 0 0'}}>Best-fit partners</h3></div><Sparkles size={20}/></div>
    {items.map((p) => <div className="match-row" key={p.id}><div><strong>{p.name}</strong><div className="tiny-list">{p.capabilities.map((x:string)=><span className="tiny" key={x}>{x}</span>)}</div><p className="muted" style={{margin:'10px 0 0',fontSize:13}}>{p.reason.join(' · ')}</p></div><div style={{textAlign:'right'}}><div className="match-score">{p.match}%</div><span className="muted" style={{fontSize:11}}>match</span></div></div>)}
  </div>
}

export function Lifecycle({ active = 2 }: {active?: number}) {
  const steps = ['Submitted','Validated','Matched','Accepted','Prototype','Pilot','Impact'];
  return <div className="timeline">{steps.map((s,i)=><div className={`step ${i < active ? 'done':''} ${i===active ? 'active':''}`} key={s}>{i < active ? <Check size={14} style={{verticalAlign:'-3px'}}/>:i===active?<Clock3 size={14} style={{verticalAlign:'-3px'}}/>:null} {s}</div>)}</div>
}

export function Toast({title, detail}:{title:string;detail:string}){ return <motion.div className="toast" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}><strong>{title}</strong><span>{detail}</span></motion.div> }

export function TrustStrip(){return <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:18,color:'var(--muted)',fontSize:13}}><span><ShieldCheck size={14} style={{verticalAlign:'-3px'}}/> Human-validated AI</span><span><Users size={14} style={{verticalAlign:'-3px'}}/> Multi-stakeholder</span><span><Check size={14} style={{verticalAlign:'-3px'}}/> Outcome tracked</span></div>}
