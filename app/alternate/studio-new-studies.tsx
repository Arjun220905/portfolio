'use client';

import { useState } from 'react';
import { ArrowDown, Check, FileText, GitBranch, ShieldCheck } from 'lucide-react';
import s from './studio.module.css';

const traceSteps = [
  { label: 'Evidence', title: 'Start with the source.', text: 'Decisions stay linked to the transcript turns that support them.', icon: FileText },
  { label: 'Review', title: 'Keep a human in the loop.', text: 'Review the rationale, confirm the owner, and approve the next step.', icon: Check },
  { label: 'Publish', title: 'Carry the decision forward.', text: 'Approved ADRs and tasks leave with a record of where they went.', icon: GitBranch },
];

export function TraceStudy() {
  const [step, setStep] = useState(0);
  const active = traceSteps[step];
  const Icon = active.icon;
  return <div className={s.traceStudy}>
    <div className={s.studyBar}><span><GitBranch size={15}/> Trace / decision trail</span><span>↗</span></div>
    <div className={s.traceSteps} aria-label="Trace workflow">{traceSteps.map((item, index) =>
      <button key={item.label} type="button" aria-pressed={step === index} onClick={() => setStep(index)}><span>0{index + 1}</span>{item.label}</button>
    )}</div>
    <div className={s.tracePaper}>
      <Icon size={30} aria-hidden="true"/>
      <h4>{active.title}</h4><p>{active.text}</p>
      <div className={s.traceLines} aria-hidden="true"><i/><i/><i/></div>
    </div>
    <span className={s.studyNote}>Workflow study · select a step</span>
  </div>;
}

export function WalletStudy() {
  return <div className={s.walletStudy}>
    <div className={s.studyBar}><span><ShieldCheck size={16}/> DWTS / evidence to risk</span></div>
    <div className={s.chainBlocks} aria-hidden="true">{[0, 1, 2].map(n => <span key={n}><i/><i/><i/></span>)}</div>
    <div className={s.walletFlow}><span>Confirmed activity</span><ArrowDown size={18}/><span>Wallet history + XGBoost</span><ArrowDown size={18}/></div>
    <div className={s.walletDecision}><ShieldCheck size={27}/><div><small>Dynamic wallet trust score</small><p>Evidence for a closer look.</p></div></div>
    <span className={s.studyNote}>Architecture study · advisory wallet-risk assessment</span>
  </div>;
}
