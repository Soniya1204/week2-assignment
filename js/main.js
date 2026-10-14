(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);

  /* Navigation */
  const btn = $('.burger'), nav = $('#nav'), header = $('.site-header');
  const setNav = open => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  btn.addEventListener('click', () => setNav(btn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => e.target.closest('a') && setNav(false));
  document.addEventListener('keydown', e => e.key === 'Escape' && setNav(false));
  matchMedia('(min-width:961px)').addEventListener('change', () => setNav(false));
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Scroll reveal */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('in'));

  $('#year').textContent = new Date().getFullYear();
})();
