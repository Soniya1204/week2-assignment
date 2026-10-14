(() => {
  'use strict';
  const chips = document.querySelectorAll('[data-filter]'), items = document.querySelectorAll('.product');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.setAttribute('aria-pressed', x === c));
    items.forEach(p => p.hidden = c.dataset.filter !== 'all' && p.dataset.cat !== c.dataset.filter);
  }));
})();
