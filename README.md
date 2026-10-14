# SoilArt: responsive pottery studio website

A four-page static website (Home, About, Services, Contact) for a fictional pottery studio. Plain HTML5, CSS3 and ES6+ JavaScript. No build step, no framework.

**Live demo:** add your GitHub Pages / Netlify / Vercel link here after deploying.

## Structure
```
index.html  about.html  services.html  contact.html
css/style.css     all styling, design tokens in :root
js/main.js        nav toggle, scroll reveal, form validation
img/              logo.svg (brand mark), vase.svg, bowl.svg, jug.svg (hand-built SVG illustrations)
```

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

## Deploy (GitHub Pages)
1. `git init && git add . && git commit -m "Initial site"`
2. Create a GitHub repo, then `git remote add origin <url> && git push -u origin main`
3. Repo **Settings > Pages > Deploy from branch > main / root**.

## Design decisions
- **Palette from soil and fired clay:** sand background `#EFE4D4`, soil brown `#4A2E1F`, umber `#7A5035`, terracotta `#B5603A`, straw `#D9B47C`, and a touch of moss `#7C8F4E`. A soft grain texture and soil-strata stripe add an earthy feel.
- **Type:** Gloock for the SoilArt wordmark, Fraunces (a soft, slightly wonky serif that echoes hand-thrown forms) for headings; DM Sans for body text. System fallbacks are defined.
- **Motion with purpose:** the hero shows a real painted jar photo that genuinely turns on a potter's wheel (`js/spinner.js` remaps the photo texture around the jar every frame; `js/jar-data.js` holds the embedded texture). Other motion is light: glaze-name marquee, scroll reveals, expanding clay tiles, hover zooms. Header photos and the "Watch a pot take shape" photo are static. `prefers-reduced-motion` stops the spinning and the rest.
- **Images:** real photographs (resized to max 900px, lazy-loaded). Only the logo and the animated pot-making scene are vector.
- **Layout:** full-width, edge-to-edge sections with only a small fluid inner padding (`--pad`). CSS Grid with `auto-fit/minmax` for cards, Flexbox for the header and button rows. One breakpoint at 768px switches the nav to a hamburger; 820px / 860px collapse split layouts.
- **Accessibility:** semantic landmarks (`header`, `nav`, `main`, `footer`), skip link, `aria-expanded` on the burger, visible focus rings, labelled fields with `role="alert"` errors, and contrast-checked colour pairs.
- **No JS fallback:** reveal animations only apply when JS adds the `js` class, so content is never hidden without it.

## Form validation (contact.html)
Validated in `js/main.js` with `novalidate` on the form so messages are consistent:
name (min 2 chars), email (regex), phone (optional, 7-15 digits), topic (required), message (min 20 chars, 500 max, live counter), consent checkbox. Errors show on blur and clear while typing; on submit the first invalid field is focused. The success message is a front-end demo: connect the form to Formspree, Netlify Forms or your own endpoint to receive messages.

## Responsive testing checklist (Chrome DevTools)
Test at 360, 390, 768, 1024, 1280 and 1920 px: nav toggles below 769px, no horizontal scroll, cards reflow, form is usable at 360px. Save screenshots of each page at mobile / tablet / desktop into a `screenshots/` folder for your submission.

## Customising
Edit the studio name, address and copy in the HTML. Colours, spacing and fonts are CSS variables at the top of `css/style.css`.


## Platform features (front-end demo)
- **Shop** (`shop.html`): filterable products, add to cart, cart drawer with quantities, free-shipping hint, delivery form and demo checkout. Cart is saved in `localStorage`.
- **Learn** (`learn.html`): studio, online and at-home courses with filters and an enrol dialog.
- **Artist at home** (`at-home.html`): booking form with artist choice, date/slot, live price estimate and Indian mobile/PIN validation.
- Forms share `js/validate.js`. All submissions are demos; connect them to a backend, Formspree or a payment gateway (Razorpay, Stripe) before going live.

## Photos
`img/potter.jpg`, the `tex-*.jpg` crops and the `pot-*.jpg` product/gallery photos come from reference images supplied for this project. Make sure you have the right to publish it, or replace it with your own studio photos (keep the file names; the hero overlays are positioned for a similar framing).
