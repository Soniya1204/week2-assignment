(() => {
  'use strict';
  const chips = document.querySelectorAll('[data-filter]'), items = document.querySelectorAll('.course');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.setAttribute('aria-pressed', x === c));
    items.forEach(p => p.hidden = c.dataset.filter !== 'all' && p.dataset.mode !== c.dataset.filter);
  }));

  const dlg = document.getElementById('enroll'), form = document.getElementById('enroll-form'), title = document.getElementById('enroll-title'), done = document.getElementById('enroll-done');
  const v = SoilForm.attach(form, {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    phone: (v) => SoilForm.phoneIN(v),
    batch: v => !!v || 'Pick a start date.'
  }, d => {
    done.querySelector('strong').textContent = `You are in, ${d.get('name').trim().split(' ')[0]}!`;
    done.querySelector('span').textContent = ` Seat held for ${title.textContent}. We will call you to confirm payment.`;
    done.hidden = false; form.hidden = true;
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-enroll]');
    if (b) {
      const c = b.closest('.course');
      title.textContent = c.dataset.title; form.elements.course.value = c.dataset.title;
      v.reset(); form.hidden = false; done.hidden = true; dlg.showModal();
    }
    if (e.target.closest('[data-close]') || e.target === dlg) dlg.close();
  });
})();
