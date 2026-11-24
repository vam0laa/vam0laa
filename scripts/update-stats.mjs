// Fetches live stats from the GitHub API and renders assets/stats.svg.
// Usage: GH_TOKEN=... node scripts/update-stats.mjs   (or --demo for placeholder data)
import { writeFileSync } from 'node:fs';
import { C, frame, esc } from './lib.mjs';

const USER = process.env.GH_USER || 'vam0laa';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const headers = { 'User-Agent': 'profile-stats', Accept: 'application/vnd.github+json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) };
const api = async (path) => {
  const r = await fetch(`https://api.github.com${path}`, { headers });
  if (!r.ok) throw new Error(`${path} -> ${r.status}`);
  return r.json();
};

async function collect() {
  if (process.argv.includes('--demo')) {
    return { repos: 12, commits: 480, stars: 24, followers: 9, langs: [['TypeScript', 52e4], ['JavaScript', 21e4], ['Python', 12e4], ['CSS', 6e4], ['Shell', 3e4]] };
  }
  const user = await api(`/users/${USER}`);
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await api(`/users/${USER}/repos?per_page=100&type=owner&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((s, r) => s + r.stargazers_count, 0);
  const bytes = {};
  for (const r of own) {
    try {
      const l = await api(`/repos/${USER}/${r.name}/languages`);
      for (const [k, v] of Object.entries(l)) bytes[k] = (bytes[k] || 0) + v;
    } catch { /* skip unreadable repo */ }
  }
  let commits = 0;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST', headers,
      body: JSON.stringify({ query: `query($l:String!){user(login:$l){contributionsCollection{totalCommitContributions restrictedContributionsCount}}}`, variables: { l: USER } }),
    });
    const c = (await res.json()).data.user.contributionsCollection;
    commits = c.totalCommitContributions + c.restrictedContributionsCount;
  } catch { /* leave 0 */ }
  const langs = Object.entries(bytes).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return { repos: user.public_repos, commits, stars, followers: user.followers, langs };
}

function render({ repos, commits, stars, followers, langs }) {
  const W = 900, H = 230;
  const metrics = [['repos', repos], ['commits · 1y', commits], ['stars', stars], ['followers', followers]];
  let s = `<text x="32" y="64" font-size="13" class="m"><tspan class="a">$</tspan> gh-stats --user ${USER}</text>`;
  metrics.forEach(([k, v], i) => {
    const x = 32 + i * 215;
    s += `<g class="up" style="animation-delay:${(i * 0.12).toFixed(2)}s"><text x="${x}" y="108" font-size="34" font-weight="700" class="t">${Number(v).toLocaleString('en-US')}</text><text x="${x}" y="128" font-size="12" class="d">${esc(k)}</text></g>`;
  });
  const total = langs.reduce((t, [, b]) => t + b, 0) || 1;
  const shades = [C.accent, '#22c55e', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'];
  const BW = W - 64;
  s += `<clipPath id="bar"><rect x="32" y="150" width="${BW}" height="10" rx="5"/></clipPath><g clip-path="url(#bar)"><rect x="32" y="150" width="${BW}" height="10" fill="${C.panel}"/><g class="grow">`;
  let x = 32;
  langs.forEach(([, b], i) => {
    const w = (b / total) * BW;
    s += `<rect x="${x.toFixed(1)}" y="150" width="${Math.max(w - 1, 1).toFixed(1)}" height="10" fill="${shades[i]}"/>`;
    x += w;
  });
  s += `</g></g>`;
  let lx = 32;
  langs.forEach(([name, b], i) => {
    const label = `${name} ${((b / total) * 100).toFixed(1)}%`;
    s += `<g class="up" style="animation-delay:${(0.6 + i * 0.1).toFixed(2)}s"><circle cx="${lx + 4}" cy="190" r="4" fill="${shades[i]}"/><text x="${lx + 14}" y="194" font-size="12" class="d">${esc(label)}</text></g>`;
    lx += label.length * 7.3 + 34;
  });
  return frame(W, H, `github stats — ${USER}`, s, '');
}

const data = await collect();
writeFileSync(new URL('../assets/stats.svg', import.meta.url), render(data));
console.log('stats.svg updated', JSON.stringify({ ...data, langs: data.langs.length }));
