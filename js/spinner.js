/* Spins a real jar photo around its vertical axis by remapping the texture per pixel
   (orthographic cylinder-style mapping, folded back and forth so the pattern stays continuous). */
(() => {
  'use strict';
  const cv = document.getElementById('jar');
  if (!cv || !window.JAR) return;
  const { w, h, L, R, src } = window.JAR, A = 1.05;
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d');
  const img = new Image();
  img.onload = () => {
    const t = document.createElement('canvas'); t.width = w; t.height = h;
    const tc = t.getContext('2d'); tc.drawImage(img, 0, 0);
    const tex = tc.getImageData(0, 0, w, h).data;
    const out = ctx.createImageData(w, h), o = out.data;
    const baseRy = 0.05 * (R[h - 1] - L[h - 1]) * 2;

    const draw = phi => {
      o.fill(0);
      for (let y = 0; y < h; y++) {
        const l = L[y], r = R[y], rad = (r - l) / 2, cen = (l + r) / 2, row = y * w;
        for (let x = Math.max(0, Math.floor(l - 1)); x <= Math.min(w - 1, Math.ceil(r + 1)); x++) {
          const u = (x + 0.5 - cen) / rad;
          if (u <= -1 || u >= 1) continue;
          if (y > h - 1 - baseRy * (1 - Math.sqrt(1 - u * u))) continue;   // curved base
          const th = Math.asin(u);
          // Fold the turning angle back and forth inside +/-A so we never stretch the heavily
          // foreshortened limb pixels of the photo across the face of the pot.
          let m = ((th + phi + A) % (4 * A) + 4 * A) % (4 * A);
          const tt = m < 2 * A ? m - A : 3 * A - m;
          const xs = Math.min(r - 1, Math.max(l + 1, cen + rad * Math.sin(tt)));
          const x0 = Math.floor(xs), f = xs - x0, i0 = (row + x0) * 4, i1 = i0 + 4;
          const light = 0.5 + 0.5 * Math.pow(Math.cos(th), 0.7);
          const spec = 38 * Math.exp(-Math.pow((th + 0.55) / 0.22, 2));
          const k = (row + x) * 4;
          for (let c = 0; c < 3; c++) o[k + c] = Math.min(255, (tex[i0 + c] * (1 - f) + tex[i1 + c] * f) * light + spec);
          o[k + 3] = Math.min(255, (1 - Math.abs(u)) * rad * 255 / 1.5);
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    draw(0);
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    let phi = 0, last = 0, raf = 0, visible = true;
    const frame = ts => { phi += (last ? Math.min(ts - last, 50) : 16) * 0.00105; last = ts; draw(phi); raf = visible ? requestAnimationFrame(frame) : 0; };
    raf = requestAnimationFrame(frame);
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) { last = 0; raf = requestAnimationFrame(frame); } }).observe(cv);
  };
  img.src = src;
})();
