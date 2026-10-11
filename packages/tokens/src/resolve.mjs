// Reads DTCG 2025.10 token files: resolver documents, groups, $type
// inheritance and curly-brace aliases. Saral reads the subset it uses:
// sets and modifiers with { "$ref" } sources, and whole-value aliases.
import { readFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { TokenError } from './errors.mjs';

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Later sources win. Groups and tokens merge key by key, so a mode file can
// change a $value and keep the base file's $type; a $value itself is always
// replaced whole.
export function deepMerge(target, source) {
  for (const [k, v] of Object.entries(source)) {
    if (k !== '$value' && isObj(v) && isObj(target[k])) deepMerge(target[k], v);
    else target[k] = structuredClone(v);
  }
  return target;
}

export function loadResolver(file, input = {}) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  const read = (src) => JSON.parse(readFileSync(resolvePath(dirname(file), src.$ref), 'utf8'));
  const tree = {};
  for (const set of doc.sets ?? []) for (const src of set.sources) deepMerge(tree, read(src));
  for (const [name, mod] of Object.entries(doc.modifiers ?? {})) {
    const context = input[name] ?? mod.default;
    const sources = mod.contexts?.[context];
    if (!sources) throw new TokenError(`${file}: modifier "${name}" has no context "${context}"`);
    for (const src of sources) deepMerge(tree, read(src));
  }
  return tree;
}

export function flatten(tree) {
  const out = new Map();
  const walk = (node, path, type) => {
    const t = node.$type ?? type;
    if ('$value' in node) {
      out.set(path.join('.'), { type: t, value: node.$value, extensions: node.$extensions ?? {} });
      return;
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && isObj(v)) walk(v, [...path, k], t);
  };
  walk(tree, [], undefined);
  return out;
}

const ALIAS = /^\{([^{}]+)\}$/;

export function resolveAliases(tokens) {
  const done = new Map();
  const visit = (path, chain) => {
    if (chain.includes(path)) throw new TokenError(`alias cycle: ${[...chain, path].join(' -> ')}`);
    if (done.has(path)) return done.get(path);
    const tok = tokens.get(path);
    if (!tok) throw new TokenError(`${chain.at(-1)} points to {${path}}, which does not exist`);
    const m = typeof tok.value === 'string' && tok.value.match(ALIAS);
    let out = tok;
    if (m) {
      const target = visit(m[1], [...chain, path]);
      out = { type: tok.type ?? target.type, value: target.value, extensions: { ...target.extensions, ...tok.extensions } };
    }
    done.set(path, out);
    return out;
  };
  for (const path of tokens.keys()) visit(path, []);
  return done;
}
