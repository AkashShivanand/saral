import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, Link, Notice, Field, Form } from '../src/index.mjs';

const html = (el) => renderToStaticMarkup(el);

test('Button renders the markup contract with a type and a variant', () => {
  const out = html(h(Button, null, 'Send'));
  assert.match(out, /^<button type="button" data-scope="button" data-part="root" data-variant="primary">Send<\/button>$/);
  assert.match(html(h(Button, { variant: 'accent', type: 'submit' }, 'Go')), /type="submit".*data-variant="accent"/);
});

test('a pending Button is marked and announced as unavailable', () => {
  const out = html(h(Button, { pending: true }, 'Sending'));
  assert.match(out, /data-pending=""/);
  assert.match(out, /aria-disabled="true"/);
});

test('render puts Button props on another element, without a button type', () => {
  const out = html(h(Button, { render: (p) => h('a', { ...p, href: '/work' }) }, 'Work'));
  assert.match(out, /^<a data-scope="button" data-part="root" data-variant="primary" href="\/work">Work<\/a>$/);
});

test('Link renders an anchor with the contract, or another element through render', () => {
  assert.equal(html(h(Link, { href: '/' }, 'Home')), '<a href="/" data-scope="link" data-part="root">Home</a>');
  assert.match(html(h(Link, { href: '/', render: (p) => h('a', { ...p, 'data-router': '' }) }, 'Home')), /data-router=""/);
});

test('Notice sets tone and the role: status by default, alert when urgent', () => {
  assert.match(html(h(Notice, { tone: 'success' }, 'Sent')), /^<div role="status" data-scope="notice" data-part="root" data-tone="success">Sent<\/div>$/);
  assert.match(html(h(Notice, { urgent: true }, 'Failed')), /role="alert"/);
});

test('Field links label, hint and error, and carries the messages', () => {
  const out = html(h(Field, { id: 'email', label: 'Email', name: 'email', type: 'email', required: true, hint: 'Only used to reply.', messages: { valueMissing: 'Enter your email address', typeMismatch: 'Enter an email address like name@example.com' } }));
  assert.match(out, /<label data-scope="field" data-part="label" for="email">Email<\/label>/);
  assert.match(out, /<input[^>]* id="email"[^>]*aria-describedby="email-hint"/);
  assert.match(out, /<p data-scope="field" data-part="hint" id="email-hint">Only used to reply\.<\/p>/);
  assert.match(out, /<p data-scope="field" data-part="error" id="email-error" data-message-value-missing="Enter your email address" data-message-type-mismatch="Enter an email address like name@example.com">Enter an email address like name@example.com<\/p>/);
});

test('Field renders a textarea when multiline, and makes an id when none is given', () => {
  const out = html(h(Field, { label: 'Message', name: 'message', multiline: true }));
  assert.match(out, /<textarea [^>]*data-part="input"/);
  const id = out.match(/for="([^"]+)"/)[1];
  assert.match(id, /^[A-Za-z0-9_-]+$/);
  assert.match(out, new RegExp(`<textarea[^>]* id="${id}"`));
});

test('Form renders a plain form on the server, in Strict Mode too', () => {
  const out = html(h(StrictMode, null, h(Form, { method: 'post', action: '/contact' }, h(Button, { type: 'submit' }, 'Send'))));
  assert.match(out, /^<form [^>]*><button type="submit"/);
  assert.match(out, /method="post"/);
  assert.match(out, /action="\/contact"/);
});
