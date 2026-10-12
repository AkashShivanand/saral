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
};
