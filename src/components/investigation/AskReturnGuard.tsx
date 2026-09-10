import { FormEvent, useState } from 'react';
import { ArrowUp, Bot, Database, Sparkles } from 'lucide-react';
import { askReturnGuard } from '../../api/copilot';
import type { AskReturnGuardResponse } from '../../api/types';

const prompts = ['Why is this return being reviewed?', 'What are the strongest signals?', 'Does the inspection support the return claim?', 'Are there relevant network relationships?', 'What is the financial exposure?'];

export function AskReturnGuard({ returnId, assessmentAt }: { returnId: string; assessmentAt: string | null }) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AskReturnGuardResponse>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const ask = async (event?: FormEvent) => {
    event?.preventDefault(); if (!question.trim()) return;
    setBusy(true); setError(undefined);
    try { setResponse(await askReturnGuard(returnId, { question: question.trim(), ...(assessmentAt ? { assessment_at: assessmentAt } : {}) })); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to ask ReturnGuard'); }
    finally { setBusy(false); }
  };
  return <section className="copilot-card" id="ask-returnguard"><div className="copilot-heading"><span><Sparkles/></span><div><h2>Ask ReturnGuard</h2><p>Grounded investigation copilot for this return</p></div></div><div className="question-chips">{prompts.map((prompt) => <button key={prompt} onClick={() => setQuestion(prompt)}>{prompt}</button>)}</div><form onSubmit={ask} className="ask-box"><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question about this investigation…"/><button disabled={busy || !question.trim()}><ArrowUp size={17}/></button></form>{error && <div className="inline-error">{error}</div>}{busy && <div className="copilot-loading"><Bot size={18}/>Consulting available investigation data…</div>}{response && !busy && <div className="answer-card"><div className="answer-label"><Bot size={16}/>Answer <span>{response.status}</span></div><p>{response.answer}</p>{response.tools_used.length > 0 && <div className="answer-meta"><strong><Database size={13}/>Tools used</strong><div>{response.tools_used.map((tool) => <span key={tool}>{tool.replaceAll('_', ' ')}</span>)}</div></div>}{response.key_evidence.length > 0 && <div className="evidence-summary"><strong>Key evidence</strong>{response.key_evidence.map((item, i) => <div key={`${item.tool_name}-${i}`}><span>{item.data_origin}</span><code>{Object.entries(item.facts).map(([key, value]) => `${key.replaceAll('_', ' ')}: ${String(value)}`).join(' · ')}</code></div>)}</div>}{response.limitations.length > 0 && <div className="limitations-inline"><strong>Limitations</strong>{response.limitations.join(' · ')}</div>}</div>}</section>;
}
