(() => {
  'use strict';
  const form = document.getElementById('booking-form'); if (!form) return;
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  const est = document.getElementById('estimate'), ok = document.getElementById('booked');
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const min = tomorrow.toISOString().slice(0, 10); form.elements.date.min = min;

  const price = () => {
    const o = form.elements.service.selectedOptions[0];
    if (!o || !o.value) return est.textContent = 'Choose a service to see the price';
    const g = Math.max(1, parseInt(form.elements.guests.value, 10) || 1);
    const total = +o.dataset.base + +o.dataset.extra * Math.max(0, g - +o.dataset.incl);
    est.textContent = `${fmt(total)} for ${g} ${g > 1 ? 'people' : 'person'}`;
  };
  form.elements.service.addEventListener('change', price); form.elements.guests.addEventListener('input', price);

  const v = SoilForm.attach(form, {
    service: v => !!v || 'Choose a service.',
    date: v => !v ? 'Pick a date.' : v < min ? 'Choose tomorrow or a later date.' : true,
    slot: v => !!v || 'Choose a time slot.',
    guests: v => (Number.isInteger(+v) && +v >= 1 && +v <= 12) || 'Enter between 1 and 12 people.',
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    phone: v => SoilForm.phoneIN(v),
    address: v => v.trim().length >= 10 || 'Enter your full address (house, street, area).',
    pin: v => /^\d{6}$/.test(v.trim()) || 'Enter a 6-digit PIN code.'
  }, d => {
    const ref = 'SA-' + Math.floor(100000 + Math.random() * 900000);
    ok.querySelector('strong').textContent = `Booking request ${ref} received.`;
    ok.querySelector('span').textContent = ` ${d.get('artist') === 'any' ? 'An artist' : d.get('artist')} will confirm for ${d.get('date')} (${d.get('slot')}) by phone within 24 hours.`;
    ok.classList.add('show'); v.reset(); price(); ok.focus();
  });
  price();
})();
