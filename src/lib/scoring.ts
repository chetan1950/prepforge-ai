export function readinessScore(scores: number[]) { const active = scores.filter(Number.isFinite); return active.length ? Math.round(active.reduce((a,b)=>a+b,0)/active.length) : 0; }
