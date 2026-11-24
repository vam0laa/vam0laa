// Shared SVG helpers. Pure CSS animation only (GitHub strips <script>).
export const C = {
  bg: '#0d1117', deep: '#09090b', panel: '#161b22', border: '#27272a', line: '#30363d',
  text: '#e6edf3', dim: '#8b949e', mute: '#6e7681', accent: '#4ade80',
};
export const FONT = "'JetBrains Mono','Fira Code','SF Mono',Consolas,'DejaVu Sans Mono',monospace";
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function frame(w, h, title, inner, css = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<defs>
<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#161b22" stroke-width="1"/></pattern>
<linearGradient id="sweep" x1="0" x2="1"><stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset=".5" stop-color="${C.accent}" stop-opacity=".9"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>
<clipPath id="card"><rect width="${w}" height="${h}" rx="12"/></clipPath>
</defs>
<style>
text{font-family:${FONT}}
.d{fill:${C.dim}} .t{fill:${C.text}} .a{fill:${C.accent}} .m{fill:${C.mute}}
@keyframes fade{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes scan{from{transform:translateX(-300px)}to{transform:translateX(${w + 300}px)}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.in{opacity:0;animation:fade .5s ease-out forwards}
.up{opacity:0;animation:fadeUp .5s ease-out forwards}
.grow{transform-box:fill-box;transform-origin:left;animation:grow 1.2s cubic-bezier(.2,.8,.2,1) both}
.scan{animation:scan 5s linear infinite}
@media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important}}
${css}
</style>
<g clip-path="url(#card)">
<rect width="${w}" height="${h}" fill="${C.bg}"/>
<rect width="${w}" height="${h}" fill="url(#grid)"/>
<rect class="scan" x="0" y="36" width="300" height="1.5" fill="url(#sweep)"/>
<rect width="${w}" height="36" fill="${C.deep}"/>
<line x1="0" y1="36" x2="${w}" y2="36" stroke="${C.border}"/>
<circle cx="22" cy="18" r="5.5" fill="#3f3f46"/><circle cx="42" cy="18" r="5.5" fill="#3f3f46"/><circle cx="62" cy="18" r="5.5" fill="${C.accent}" opacity=".85"/>
<text x="${w / 2}" y="22" text-anchor="middle" font-size="12" class="m">${esc(title)}</text>
${inner}
</g>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="12" fill="none" stroke="${C.line}"/>
</svg>
`;
}

// pill row; ~7.4px per char at 12px monospace
export function pills(items, x, y, delay = 0, step = 0.08) {
  let cx = x, out = '';
  items.forEach((t, i) => {
    const w = Math.round(t.length * 7.4 + 30);
    out += `<g class="up" style="animation-delay:${(delay + i * step).toFixed(2)}s"><rect x="${cx}" y="${y}" width="${w}" height="26" rx="13" fill="${C.panel}" stroke="${C.line}"/><circle cx="${cx + 13}" cy="${y + 13}" r="2.5" fill="${C.accent}"/><text x="${cx + 23}" y="${y + 17}" font-size="12" class="t">${esc(t)}</text></g>`;
    cx += w + 8;
  });
  return { svg: out, width: cx - x };
}
