// Applies the reader's chosen theme and mode before the page paints, and keeps
// the choice for the next page. Without script the page shows Mor and follows
// the system mode, and the switch is hidden.
(function () {
  var d = document.documentElement;
  d.setAttribute('data-js', '');
  var get = function (k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  };
  var set = function (k, v) {
    try { localStorage.setItem(k, v); } catch (e) { /* storage can be blocked */ }
  };
  function apply(theme, mode) {
    d.setAttribute('data-saral-theme', theme || 'mor');
    if (mode && mode !== 'system') d.setAttribute('data-saral-mode', mode);
    else d.removeAttribute('data-saral-mode');
  }
  apply(get('saral-theme'), get('saral-mode'));
  document.addEventListener('DOMContentLoaded', function () {
    var t = document.getElementById('theme');
    var m = document.getElementById('mode');
    if (!t || !m) return;
    t.value = d.getAttribute('data-saral-theme');
    m.value = d.getAttribute('data-saral-mode') || 'system';
    t.addEventListener('change', function () { set('saral-theme', t.value); apply(t.value, m.value); });
    m.addEventListener('change', function () { set('saral-mode', m.value); apply(t.value, m.value); });
  });
})();
