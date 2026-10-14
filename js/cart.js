(() => {
  'use strict';
  const KEY = 'soilart-cart', FREE = 3000;
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ } };

  document.body.insertAdjacentHTML('beforeend', `
<div class="scrim" hidden></div>
<aside class="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" inert>
 <div class="d-head"><h2>Your cart</h2><button class="x" type="button" aria-label="Close cart">&times;</button></div>
 <div class="d-body"><ul class="lines"></ul><p class="empty">Your cart is empty. <a href="shop.html">Browse the shop</a></p></div>
 <div class="d-foot"><p class="ship"></p><p class="sub"><span>Subtotal</span><strong></strong></p><button class="btn" type="button" id="go">Checkout</button></div>
 <form class="co" novalidate hidden>
  <h3>Delivery details</h3>
  <div class="field"><label for="c-name">Full name</label><input id="c-name" name="name" autocomplete="name"><p class="err" role="alert"></p></div>
  <div class="field"><label for="c-phone">Mobile number</label><input id="c-phone" name="phone" type="tel" autocomplete="tel"><p class="err" role="alert"></p></div>
  <div class="field"><label for="c-addr">Address with PIN code</label><textarea id="c-addr" name="address" rows="3" autocomplete="street-address"></textarea><p class="err" role="alert"></p></div>
  <div class="field"><label>Payment</label><label class="check"><input type="radio" name="pay" value="UPI" checked> UPI / card on delivery link</label><label class="check"><input type="radio" name="pay" value="COD"> Cash on delivery</label></div>
  <div class="row"><button class="btn" type="submit">Place order</button><button class="btn ghost" type="button" id="back">Back</button></div>
 </form>
 <div class="done" hidden tabindex="-1"><h3>Order placed</h3><p></p><button class="btn" type="button" data-x>Keep browsing</button></div>
</aside>`);

  const $ = (s, c = document) => c.querySelector(s);
  const drawer = $('.drawer'), scrim = $('.scrim'), lines = $('.lines'), empty = $('.empty'), foot = $('.d-foot'), body = $('.d-body'), co = $('.co'), done = $('.done');
  let opener = null;

  const total = () => Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const count = () => Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const render = () => {
    const items = Object.entries(cart), n = count(), t = total();
    document.querySelectorAll('.cart-btn .badge').forEach(b => { b.textContent = n; b.hidden = !n; });
    lines.innerHTML = items.map(([id, i]) => `<li><img src="${i.img}" alt="" width="56" height="56"><div><b>${i.name}</b><span>${fmt(i.price)}</span>
      <div class="qty"><button type="button" data-q="${id}" data-d="-1" aria-label="Fewer ${i.name}">&minus;</button><output>${i.qty}</output><button type="button" data-q="${id}" data-d="1" aria-label="More ${i.name}">+</button><button type="button" class="rm" data-rm="${id}">Remove</button></div></div></li>`).join('');
    empty.hidden = n > 0; foot.hidden = !n;
    $('.sub strong').textContent = fmt(t);
    $('.ship').textContent = t >= FREE ? 'Free insured shipping applied.' : `Add ${fmt(FREE - t)} more for free shipping.`;
  };
  const open = () => { opener = document.activeElement; scrim.hidden = false; drawer.inert = false; requestAnimationFrame(() => drawer.classList.add('open')); $('.x').focus(); };
  const close = () => { drawer.classList.remove('open'); scrim.hidden = true; drawer.inert = true; if (opener) opener.focus(); };
  const showCart = () => { body.hidden = false; foot.hidden = !count(); co.hidden = true; done.hidden = true; };

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = add.closest('.product'), id = p.dataset.id;
      cart[id] = cart[id] || { name: p.dataset.name, price: +p.dataset.price, img: p.dataset.img, qty: 0 };
      cart[id].qty++; save(); render(); showCart(); open(); return;
    }
    if (e.target.closest('.cart-btn')) { showCart(); open(); }
    const q = e.target.closest('[data-q]');
    if (q) { const i = cart[q.dataset.q]; i.qty += +q.dataset.d; if (i.qty < 1) delete cart[q.dataset.q]; save(); render(); }
    const rm = e.target.closest('[data-rm]'); if (rm) { delete cart[rm.dataset.rm]; save(); render(); }
    if (e.target.closest('.x') || e.target === scrim || e.target.closest('[data-x]')) close();
  });
  document.addEventListener('keydown', e => e.key === 'Escape' && !drawer.inert && close());
  $('#go').addEventListener('click', () => { body.hidden = true; foot.hidden = true; co.hidden = false; $('#c-name').focus(); });
  $('#back').addEventListener('click', showCart);

  SoilForm.attach(co, {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    phone: v => SoilForm.phoneIN(v),
    address: v => /\d{6}/.test(v) && v.trim().length >= 12 || 'Enter your full address including a 6-digit PIN code.'
  }, d => {
    // Demo only: send the order to your backend or payment provider here.
    const ref = 'SA-' + Math.floor(100000 + Math.random() * 900000);
    done.querySelector('p').textContent = `Thank you, ${d.get('name').trim().split(' ')[0]}. Order ${ref} for ${fmt(total())} is confirmed (${d.get('pay')}). We will message you when it ships.`;
    cart = {}; save(); render(); co.hidden = true; done.hidden = false; done.focus();
  });
  render();
})();
