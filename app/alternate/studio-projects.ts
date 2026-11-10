import { projects as previousProjects } from './content';

// Public READMEs checked 10 November 2026. Keep the archived portfolio unchanged.
const existing = previousProjects.map((project, study) => ({
  ...project,
  study,
  category: study === 0 ? 'MeetStream / multilingual accessibility'
    : study === 1 ? 'MeetStream / agent infrastructure' : project.category.toLowerCase(),
}));

export const studioProjects = [
  ...existing.slice(0, 2),
  {
    title: 'Trace',
    category: 'Personal build / agent workflows',
    text: 'Turns meeting transcripts into evidence-linked architecture decisions, ADR drafts, and owned action items. A review-before-publish workflow connects approved outputs to Linear, GitHub, Slack, and Notion, with a delivery ledger that guards against duplicate writes.',
    stack: 'TypeScript · React · Cloudflare D1 · Claude',
    href: 'https://github.com/Arjun220905/engineering-decision-agent',
    signal: 'Reference app · evidence, human review, and delivery tracking',
    linkLabel: 'Explore project',
    study: 5,
  },
  {
    title: 'Dynamic Wallet Trust Scoring',
    category: 'College project / blockchain & machine learning',
    text: 'Combines XGBoost wallet-risk estimates with stateful trust scores and a React investigation console. Tracks confirmed Ethereum activity with persistent history, duplicate-safe updates, and chain-reorganisation recovery.',
    stack: 'Python · FastAPI · XGBoost · Web3.py · React',
    href: 'https://github.com/Arjun220905/ai-powered-fraud-detection-layer-dwts',
    signal: 'Research prototype · historical wallet data · advisory risk decisions',
    linkLabel: 'Explore project',
    study: 6,
  },
  existing[4],
];
