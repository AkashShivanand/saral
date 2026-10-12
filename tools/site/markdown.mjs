// A small Markdown renderer for Saral's own documents: headings, paragraphs,
// bullet and numbered lists, fenced code, tables, inline code, bold and links.
// Everything is escaped first, so raw HTML in a document is shown, not run.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ESC[c]);

export const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function inline(text, link) {
  return text
    .split(/(`[^`]+`)/)
    .map((part) => {
      if (part.length > 1 && part.startsWith('`') && part.endsWith('`')) return `<code>${esc(part.slice(1, -1))}</code>`;
      return esc(part)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a data-scope="link" data-part="root" href="${esc(link(u))}">${t}</a>`);
    })
    .join('');
}

const cells = (row) =>
  row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

export function renderMarkdown(md, { link = (u) => u } = {}) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let para = [];
  const flush = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '), link)}</p>`);
    para = [];
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      flush();
      const code = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i += 1;
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flush();
      const n = h[1].length;
      out.push(`<h${n} id="${slug(h[2])}">${inline(h[2], link)}</h${n}>`);
      i += 1;
      continue;
    }
    if (/^\s*\|/.test(line) && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] ?? '')) {
      flush();
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      const th = head.map((c) => `<th>${inline(c, link)}</th>`).join('');
      const tb = rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c, link)}</td>`).join('')}</tr>`).join('');
      out.push(`<table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`);
      continue;
    }
    const bullet = /^\s*[-*]\s+(.*)$/;
    const number = /^\s*\d+\.\s+(.*)$/;
    if (bullet.test(line) || number.test(line)) {
      flush();
      const kind = bullet.test(line) ? bullet : number;
      const tag = kind === bullet ? 'ul' : 'ol';
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(kind);
        if (m) items.push(m[1]);
        else if (items.length && /^\s{2,}\S/.test(lines[i]) && !bullet.test(lines[i]) && !number.test(lines[i])) items[items.length - 1] += ` ${lines[i].trim()}`;
        else break;
        i += 1;
      }
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t, link)}</li>`).join('')}</${tag}>`);
      continue;
    }
    if (line.trim() === '') flush();
    else para.push(line.trim().replace(/^>\s?/, ''));
    i += 1;
  }
  flush();
  return out.join('\n');
}
