(() => {
  'use strict';
  const form = document.getElementById('contact-form'); if (!form) return;
  const msg = form.elements.message, count = document.getElementById('count'), ok = document.getElementById('success');
  const v = SoilForm.attach(form, {
    name: v => v.trim().length >= 2 || 'Please enter your name (at least 2 characters).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email, like name@example.com.',
    phone: v => !v.trim() || SoilForm.phoneIN(v),
    topic: v => !!v || 'Choose what you would like to talk about.',
    message: v => v.trim().length >= 20 || `Tell us a little more: ${20 - v.trim().length} more characters needed.`,
    consent: v => v === true || 'Please agree so we can reply to you.'
  }, (d, f) => {
    // Demo only: connect to Formspree / Netlify Forms to actually deliver messages.
    ok.querySelector('strong').textContent = `Thank you, ${f.elements.name.value.trim().split(' ')[0]}!`;
    ok.classList.add('show'); v.reset(); count.textContent = '0 / 500'; ok.focus();
  });
  msg.addEventListener('input', () => count.textContent = `${msg.value.length} / 500`);
})();
