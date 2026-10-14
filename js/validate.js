/* Small shared form validator: SoilForm.attach(form, rules, onValid)
   rules: { fieldName: (value, element, form) => true | 'error message' } */
window.SoilForm = (() => {
  'use strict';
  const attach = (form, rules, onValid) => {
    const names = Object.keys(rules);
    const els = names.map(n => form.querySelector(`[name="${n}"]`)).filter(Boolean);
    const check = el => {
      const field = el.closest('.field'), group = form.elements[el.name];
      const value = el.type === 'checkbox' ? el.checked : (group && group.value !== undefined ? group.value : el.value);
      const res = rules[el.name](value, el, form);
      field.classList.toggle('invalid', res !== true);
      field.classList.toggle('valid', res === true && !!String(value).trim());
      el.setAttribute('aria-invalid', res !== true);
      const err = field.querySelector('.err'); if (err) err.textContent = res === true ? '' : res;
      return res === true;
    };
    els.forEach(el => {
      el.addEventListener('blur', () => check(el));
      const live = () => { if (el.closest('.field').classList.contains('invalid')) check(el); };
      el.addEventListener('input', live); el.addEventListener('change', live);
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const bad = els.filter(el => !check(el));
      if (bad.length) return bad[0].focus();
      onValid(new FormData(form), form);
    });
    return { check, reset: () => { form.reset(); form.querySelectorAll('.field').forEach(f => f.classList.remove('valid', 'invalid')); form.querySelectorAll('.err').forEach(p => p.textContent = ''); } };
  };
  const phoneIN = v => /^(?:\+?91)?[6-9]\d{9}$/.test(String(v).replace(/[\s-]/g, '')) || 'Enter a 10-digit mobile number, like 98765 43210.';
  return { attach, phoneIN };
})();
