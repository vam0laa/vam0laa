import { writeFileSync } from 'node:fs';
import { C, frame, pills, esc } from './lib.mjs';
const out = (f, s) => writeFileSync(new URL(`../assets/${f}`, import.meta.url), s);

/* ---------- banner ---------- */
{
  const W = 900, H = 260, cw = 13.2, n1 = 8, n2 = 48;
  const inner = `
<text x="40" y="98" font-size="22" textLength="${n1 * cw}" lengthAdjust="spacing" class="type1"><tspan class="a">$</tspan><tspan class="t"> whoami</tspan></text>
<text x="40" y="152" font-size="22" textLength="${n2 * cw}" lengthAdjust="spacing" class="type2"><tspan class="t" font-weight="700">vam0laa</tspan><tspan class="d"> — </tspan><tspan class="t">Full-Stack Web &amp; Linux Tools Developer</tspan></text>
<g class="cur1"><rect x="40" y="80" width="12" height="24" fill="${C.accent}"/></g>
<g class="cur2"><g class="blink"><rect x="40" y="134" width="12" height="24" fill="${C.accent}"/></g></g>
<g class="up" style="animation-delay:4.3s"><text x="40" y="214" font-size="15"><tspan class="a">↳ </tspan><tspan class="t">vamola.dev</tspan><tspan class="m">  •  </tspan><tspan class="t">karia.live</tspan><tspan class="m">  •  </tspan><tspan class="t">contact@vamola.dev</tspan></text></g>`;
  const css = `
@keyframes type{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes mv1{to{transform:translateX(${n1 * cw}px)}}
@keyframes mv2{to{transform:translateX(${n2 * cw}px)}}
@keyframes gone{to{opacity:0}}
@keyframes show{to{opacity:1}}
.type1{animation:type .9s steps(${n1},end) .5s both}
.type2{animation:type 2.4s steps(${n2},end) 1.9s both}
.cur1{animation:mv1 .9s steps(${n1},end) .5s forwards,gone .01s 1.5s forwards}
.cur2{opacity:0;animation:mv2 2.4s steps(${n2},end) 1.9s forwards,show .01s 1.9s forwards}
.blink{animation:blink 1s steps(1) 4.3s infinite}`;
  out('banner.svg', frame(W, H, 'vam0laa@archlinux: ~', inner, css));
}

/* ---------- sysinfo (fastfetch) ---------- */
{
  const W = 900, H = 330;
  const rows = [
    ['OS', 'Arch Linux (Hyprland / Wayland)'],
    ['Focus', 'Web Applications, Docs & Linux Tooling'],
    ['Stack', 'Go, Next.js, TypeScript, React, Node.js, Python'],
    ['Infra', 'Azure VM, Cloudflare WAF/CDN, Git, Bash'],
    ['Contact', 'contact@vamola.dev'],
  ];
  let r = `<text x="330" y="84" font-size="16" font-weight="700"><tspan class="a">vam0laa</tspan><tspan class="d">@</tspan><tspan class="a">archlinux</tspan></text>
<line x1="330" y1="96" x2="${330 + 17 * 9.6}" y2="96" stroke="${C.line}"/>`;
  rows.forEach(([k, v], i) => {
    r += `<g class="in" style="animation-delay:${(0.4 + i * 0.25).toFixed(2)}s"><text x="330" y="${128 + i * 30}" font-size="14" font-weight="700" class="a">${k}</text><text x="410" y="${128 + i * 30}" font-size="14" class="t">${esc(v)}</text></g>`;
  });
  const shades = ['#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', C.accent];
  const blocks = shades.map((c, i) => `<rect class="blk" style="animation-delay:${i * 0.15}s" x="${330 + i * 30}" y="${128 + 5 * 30 + 6}" width="26" height="16" rx="3" fill="${c}"/>`).join('');
  const logo = `
<g transform="translate(60 70)">
<g class="ring"><circle cx="100" cy="100" r="92" fill="none" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="3 9"/></g>
<path class="tri" d="M100 22 L168 162 Q100 132 32 162 Z" fill="none" stroke="${C.accent}" stroke-width="2.5" stroke-linejoin="round" pathLength="100"/>
<path class="tri2" d="M100 62 L132 138 Q100 124 68 138 Z" fill="none" stroke="${C.text}" stroke-width="1.5" stroke-linejoin="round" pathLength="100" opacity=".7"/>
<circle class="pulse" cx="100" cy="22" r="4" fill="${C.accent}"/>
</g>`;
  const css = `
@keyframes draw{0%{stroke-dashoffset:100}55%,100%{stroke-dashoffset:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes wave{0%,100%{opacity:.45}50%{opacity:1}}
.tri,.tri2{stroke-dasharray:100;animation:draw 6s ease-in-out infinite}
.tri2{animation-delay:.4s}
.ring{transform-box:fill-box;transform-origin:center;animation:spin 40s linear infinite}
.pulse{animation:pulse 2s ease-in-out infinite}
.blk{animation:wave 2.4s ease-in-out infinite}`;
  out('sysinfo.svg', frame(W, H, 'fastfetch', logo + r + blocks, css));
}

/* ---------- project cards ---------- */
function project(file, { path, name, desc, arch, tags, link }) {
  const W = 440, H = 300;
  const lines = desc.map((l, i) => `<text x="28" y="${128 + i * 22}" font-size="13" class="d">${esc(l)}</text>`).join('');
  const p = pills(tags, 28, 206, 0.3, 0.1);
  const inner = `
<text x="28" y="72" font-size="12" class="m">${esc(path)}</text>
<text x="28" y="104" font-size="24" font-weight="700" class="t">${esc(name)}<tspan class="a">_</tspan></text>
${lines}
<text x="28" y="188" font-size="12" class="a">⌘ <tspan class="m">${esc(arch)}</tspan></text>
${p.svg}
<line x1="28" y1="252" x2="${W - 28}" y2="252" stroke="${C.border}"/>
<text x="28" y="277" font-size="13" class="t">↗ <tspan class="a">${esc(link)}</tspan></text>`;
  out(file, frame(W, H, name, inner, ''));
}
project('project-vamola.svg', {
  path: '~/projects/vamola.dev', name: 'vamola.dev',
  desc: ['Bilingual (TR/EN) project portfolio and', 'documentation platform.'],
  arch: 'App Router · MDX pipeline · i18n routing',
  tags: ['Next.js', 'TypeScript', 'MDX', 'i18n'], link: 'vamola.dev',
});
project('project-karia.svg', {
  path: '~/projects/Karia', name: 'Karia',
  desc: ['High-performance multi-purpose Discord bot', 'with a custom web management dashboard.'],
  arch: 'Bot core ⇄ API ⇄ web dashboard',
  tags: ['Node.js', 'Discord API', 'Dashboard'], link: 'karia.live',
});

/* ---------- tech stack ---------- */
{
  const W = 900, H = 250;
  const groups = [
    ['frontend', ['Next.js', 'React', 'TypeScript', 'MDX', 'HTML / CSS']],
    ['backend & tools', ['Go', 'Node.js', 'Python', 'Discord API', 'REST', 'Bash']],
    ['cloud & linux', ['Azure VM', 'Cloudflare WAF/CDN', 'Git', 'Arch Linux', 'Hyprland']],
  ];
  let s = '';
  groups.forEach(([g, items], i) => {
    const y = 66 + i * 58;
    s += `<text x="32" y="${y}" font-size="13" class="m"># ${esc(g)}</text>`;
    s += pills(items, 32, y + 10, i * 0.3, 0.08).svg;
  });
  out('stack.svg', frame(W, H, 'stack.toml', s, ''));
}
console.log('static assets written');
