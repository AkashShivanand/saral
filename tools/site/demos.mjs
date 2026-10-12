// Live examples for each component page, in plain Saral markup. The page
// shows each one rendered and, under it, the markup that made it.
export const demos = {
  button: [
    {
      title: 'Variants',
      html: `<div class="row">
  <button data-scope="button" data-part="root" data-variant="primary" type="button">Save changes</button>
  <button data-scope="button" data-part="root" data-variant="accent" type="button">Send message</button>
  <button data-scope="button" data-part="root" data-variant="secondary" type="button">Cancel</button>
</div>`,
    },
    {
      title: 'Pending and disabled',
      html: `<div class="row">
  <button data-scope="button" data-part="root" data-variant="accent" type="button" data-pending aria-disabled="true">Sending</button>
  <button data-scope="button" data-part="root" type="button" disabled>Unavailable</button>
</div>`,
    },
  ],
  link: [
    {
      title: 'In running text',
      html: `<p>Read the <a data-scope="link" data-part="root" href="../decisions.html">decision records</a> before changing a contract.</p>`,
    },
  ],
  field: [
    {
      title: 'With a hint. Type an incomplete address and leave the field',
      html: `<div data-scope="field" data-part="root">
  <label data-scope="field" data-part="label" for="demo-email">Email</label>
  <input data-scope="field" data-part="input" id="demo-email" name="email" type="email" required aria-describedby="demo-email-hint">
  <p data-scope="field" data-part="hint" id="demo-email-hint">Only used to reply. Never shared.</p>
  <p data-scope="field" data-part="error" id="demo-email-error" data-message-value-missing="Enter your email address" data-message-type-mismatch="Enter an email address like name@example.com">Enter an email address like name@example.com</p>
</div>`,
    },
    {
      title: 'Showing an error',
      html: `<div data-scope="field" data-part="root" data-invalid>
  <label data-scope="field" data-part="label" for="demo-name">Name</label>
  <input data-scope="field" data-part="input" id="demo-name" name="name" required aria-invalid="true" aria-describedby="demo-name-error">
  <p data-scope="field" data-part="error" id="demo-name-error">Enter your name</p>
</div>`,
    },
    {
      title: 'A text area',
      html: `<div data-scope="field" data-part="root">
  <label data-scope="field" data-part="label" for="demo-message">Message</label>
  <textarea data-scope="field" data-part="input" id="demo-message" name="message" rows="4"></textarea>
  <p data-scope="field" data-part="error" id="demo-message-error">Write a message</p>
</div>`,
    },
  ],
  notice: [
    {
      title: 'Tones',
      html: `<div class="stack">
  <div data-scope="notice" data-part="root" data-tone="info" role="status">Replies come within two days.</div>
  <div data-scope="notice" data-part="root" data-tone="success" role="status">Message sent.</div>
  <div data-scope="notice" data-part="root" data-tone="warning" role="status">The form closes at midnight.</div>
  <div data-scope="notice" data-part="root" data-tone="danger" role="status">The message could not be sent. Try again.</div>
</div>`,
    },
  ],
  checkbox: [
    {
      title: 'Required. Tick it, then clear it',
      html: `<div data-scope="checkbox" data-part="root">
  <input data-scope="checkbox" data-part="input" type="checkbox" id="demo-consent" name="consent" required>
  <label data-scope="checkbox" data-part="label" for="demo-consent">You may keep my email to reply</label>
  <p data-scope="checkbox" data-part="error" id="demo-consent-error" data-message-value-missing="Tick this so we can reply">Tick this so we can reply</p>
</div>`,
    },
  ],
  radio: [
    {
      title: 'A short list of choices',
      html: `<fieldset data-scope="radio" data-part="root">
  <legend data-scope="radio" data-part="label">How should we reply?</legend>
  <div data-scope="radio" data-part="item">
    <input data-scope="radio" data-part="input" type="radio" id="demo-reply-email" name="demo-reply" value="email" required>
    <label data-scope="radio" data-part="item-label" for="demo-reply-email">Email</label>
  </div>
  <div data-scope="radio" data-part="item">
    <input data-scope="radio" data-part="input" type="radio" id="demo-reply-phone" name="demo-reply" value="phone">
    <label data-scope="radio" data-part="item-label" for="demo-reply-phone">Phone</label>
  </div>
  <p data-scope="radio" data-part="error" id="demo-reply-error" data-message-value-missing="Choose how we should reply">Choose how we should reply</p>
</fieldset>`,
    },
  ],
  select: [
    {
      title: 'With a placeholder and a hint',
      html: `<div data-scope="select" data-part="root">
  <label data-scope="select" data-part="label" for="demo-topic">Topic</label>
  <select data-scope="select" data-part="input" id="demo-topic" name="topic" required aria-describedby="demo-topic-hint">
    <option value="">Choose a topic</option>
    <option value="work">Work together</option>
    <option value="talk">A talk or workshop</option>
  </select>
  <p data-scope="select" data-part="hint" id="demo-topic-hint">So the message reaches the right place.</p>
  <p data-scope="select" data-part="error" id="demo-topic-error" data-message-value-missing="Choose a topic">Choose a topic</p>
</div>`,
    },
  ],
  tag: [
    {
      title: 'Plain and removable',
      html: `<div class="row" role="group" aria-label="Topics">
  <span data-scope="tag" data-part="root"><span data-scope="tag" data-part="label">Design systems</span></span>
  <span data-scope="tag" data-part="root"><span data-scope="tag" data-part="label">Accessibility</span><button data-scope="tag" data-part="remove" type="button" aria-label="Remove Accessibility">×</button></span>
</div>`,
    },
  ],
  card: [
    {
      title: 'Plain, and with the whole card as a link',
      html: `<div class="looks">
  <article data-scope="card" data-part="root">
    <h3 data-scope="card" data-part="title">Tokens</h3>
    <p data-scope="card" data-part="body">Every colour role, and every contrast pair with its ratio.</p>
  </article>
  <article data-scope="card" data-part="root" data-interactive>
    <h3 data-scope="card" data-part="title"><a data-scope="card" data-part="link" href="../tokens.html">Tokens page</a></h3>
    <p data-scope="card" data-part="body">The whole card opens the page. <a data-scope="link" data-part="root" href="../changes.html">The changes</a> stay their own link.</p>
  </article>
</div>`,
    },
  ],
};
