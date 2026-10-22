# marcelo-berges.com — Roadmap

Vision: one home for the three crafts — **Artist** (live & DJ), **Facilitator** (dance & rituals),
**Engineer & Educator** (studio, academy, coaching) — that turns visitors into clients and,
over time, gives clients a place to follow their work with Marcelo.

_Last updated: 14 Oct 2026 · Maintained by Claude as the working to-do list for this project._

---

## Now — set-up steps (Marcelo)

- [ ] **Activate the contact form**: send a test message from the site, click "Activate Form" in the FormSubmit email (check spam).
- [ ] **Check the visitor confirmation email** arrives after the test message (FormSubmit autoresponse).
- [ ] **Google Search Console**: add marcelo-berges.com, submit `https://marcelo-berges.com/sitemap.xml`.
- [ ] **Google Business Profile**: service-area business, Alicante / Costa Blanca; categories music producer, music school, DJ service, recording studio.
- [ ] **Delete or rotate the Spotify developer app** (keys were shared in chat; no longer used).
- [ ] **Read the Spanish pages and Spanish press kit** with a native eye and correct anything that doesn't sound like you.
- [ ] **Confirm two assumptions**: in-person classes happen in Alicante; local studio clients can meet in person.

## Next — content that sells

- [ ] **Testimonials**: 2–3 quotes each from studio clients, students, festival / retreat organisers (slots ready on Studio page).
- [ ] **Google reviews**: ask past students and clients once the Business Profile is live.
- [ ] **Technical rider**: list setup needs (decks, mixer, mics, inputs) → add a rider section to both press kits.
- [ ] **Before / after audio** on the Studio page (a short mix comparison).
- [ ] **Press kit (EN)**: say "Costa Blanca" instead of "Spain", like the Spanish version — decide.
- [ ] **Bios**: keep or remove "Colombian" in the press kit bios — decide.
- [ ] **About photo**: consider the black-and-white Guadalest walk photo on the home page.

## Later — grow the business

### Client area (decided to plan, not build yet)
Goal: clients log in, follow their project and download results; Marcelo uploads files and updates status.

- **Option A — ready-made tool** (recommended first step for studio clients): Samply, Filepass or Disco.
  Mix versions, timestamped comments ("vocal too loud at 1:32"), revision rounds, payment-gated downloads.
  Site gets a branded "Client area / Área de clientes" button. Live in a day, no maintenance.
- **Option B — custom portal at `/portal/`** (when one branded hub is wanted for studio, students and facilitation):
  Supabase (magic-link login, database, storage), project timeline
  (Received → Mixing → Revisions → Mastered → Delivered), notes, file delivery, email when something is ready,
  admin view for Marcelo, student session notes and homework.
  Needs: ~1–2 days of build, a privacy notice (GDPR), and paid storage or Dropbox / Drive links for large WAV files.
- [ ] Compare Samply / Filepass / Disco (features, Spanish support, payments) and pick one.
- [ ] Add the "Client area" button (EN / ES).
- [ ] Revisit Option B once there are regular clients across several services.

### Merch shop (requested 22 Oct 2026 — planning)
Goal: a "Shop / Tienda" tab with shirts, cups etc., printed and shipped on demand (no stock, no shipping by Marcelo).
- Recommended setup: **Shopify (Starter plan) + Printful**, products embedded on `/shop/` and `/es/tienda/` with Shopify's Buy Button; checkout, payment and EU VAT handled by Shopify; Printful prints in its EU facilities and ships automatically.
- Alternatives: Fourthwall or Printify Pop-Up (free hosted shop on e.g. `shop.marcelo-berges.com`, less design control); fully custom Stripe + Printful API (most control, needs a server function and VAT handling — not worth it at the start).
- Needs from Marcelo: decide platform; Shopify + Printful accounts; **high-res / vector artwork** (current logo PNGs are too small to print: symbol 199 px, wordmark 900 px); product picks; business details for legal pages (aviso legal, privacy, shipping & returns, terms).
- Note: merch shows prices — confirm this is fine (the no-pricing rule was for services).
- Artwork review (22 Oct): candidate designs are ~1000 px (too small except for chest logos / stickers / small mugs).
  Best picks: triangle/diamond mark and interwoven star (vectorise), Gratitud and La gema (need 3000 px originals), unspoken-needs swirl.
  Skip or fix: compass mandala (AI gibberish text), diamond eye ("MARCÉLO" accent typo), glass-lines piece.
  **Kamatjui** cover is print-ready: cropped 2980 × 2980 master saved in `merch-artwork/` (git-ignored, never uploaded) → posters / art prints / totes.
  Check commercial-use rights: AI tool terms for AI images, and the illustrator's permission for commissioned covers (e.g. Kamatjui).
- Second batch (22 Oct): Tak'aj ⭐ (mandala works alone on shirts too), Rios, La gema, Pies Descalzos, altiplano collage, new star mark.
  Covers are Canva exports at 1024–1400 px → re-download from Canva at 3000 px+ (Pro size slider).
  "PIES DESCAIZOS" typo on the cover → should be DESCALZOS (fix in Canva before printing).
  All low-res candidates collected in `merch-artwork/candidates-lowres/`.
- Third batch (22 Oct): **Andean flute banner** 2925 × 1079 — wide format fits a mug wrap almost exactly, also a strong website banner; real identifiable person → needs photographer + model permission for merch. **Café de Tierra** cover 1200 px (Bandcamp size) → find the 3000 px original; poster / tote.
- **Correction (22 Oct):** the covers were generated by AI tools at 1024 px (Gemini, Leonardo, Flux…) and finished in Canva at 1400 px — no bigger originals exist (searched the Mac). Re-exporting from Canva at 3000 px would only stretch them.
  Fix = **AI upscale ×3** (Marcelo already uses Topaz via ElevenLabs; output e.g. 2752 × 1536 px) → 3000–4200 px, then check in Printful's preview.
- [x] Upscaled ×4 locally with Real-ESRGAN (free, offline; tool in `tools/realesrgan`): Tak'aj, Rios, La gema, Gratitud, unspoken needs, Café de Tierra, Pies Descalzos, orange cubes → `merch-artwork/upscaled/` (4096–5600 px). Quality checked: faces natural, text sharp; Gratitud loses a little paper grain.
- [x] Shirt-ready transparent PNGs (black ink + white ink) for triangle-diamond, star, interwoven star (frame removed), diamond-eye symbol (misspelled name removed) → `merch-artwork/shirt-ready/`. See `merch-artwork/README.txt`.
- [ ] Fix "DESCAIZOS" → DESCALZOS on the Pies Descalzos cover, then re-upscale.
- High-res photo shoots found in Downloads (Guadalest 5472 px, Els Arcs, "Marcelo Berges/edits" 6000 px) — great for site, press kit and photo-based merch.
- [ ] Optional: vectorise symbol marks + circle logo for infinite scaling (the 4000 px transparent PNGs already cover shirts/hoodies).
- **Decided (22 Oct):** prices shown on the merch pages only; shop embedded in the site's own design (Shopify Buy Button + Printful).
- **Open — payouts & tax:** Marcelo is registered self-employed in Costa Rica with Costa Rican bank accounts, but lives in Spain. Shopify Payments needs a bank account in a supported country (Costa Rica isn't one) → likely PayPal as payment method, or a Spanish/EU account. Spanish tax residency / IVA obligations to confirm with a gestor before launch.
- Art rights: covers = Marcelo's; AI images made with Leonardo (some Gemini / Flux) — confirm the plan used allowed commercial use.
- [x] Decide platform (Shopify + Printful, own design).
- **Decided (22 Oct): no Shopify (paid) → manual ordering first.** Shop on GitHub Pages; customer sends an order request (FormSubmit) with items + address; Marcelo replies with a PayPal payment link and places the order in Printful by hand. Later: automate with PayPal checkout + free Cloudflare Worker + Printful API.
- [x] Printful account + store "Manual order platform / API"; read-only API token in `tools/printful-token.txt` (git-ignored).
- [x] `scripts/sync_printful.py` pulls products, sizes, prices and mockups into `assets/data/merch.json` + `assets/img/merch/`. Re-run after any change in Printful: `SSL_CERT_FILE=/etc/ssl/cert.pem python3 scripts/sync_printful.py`. Product texts (EN/ES) live in `assets/data/merch-extra.json`.
- [x] Shop pages `/shop/` + `/es/tienda/` with Shop/Tienda tab on every page; first product: Kamatjui crewneck (€49–53.50).
- **Automation path (saved 22 Oct — do NOT build manual-order flow long term):**
  1. Now: PayPal checkout on the shop page (PayPal JS SDK, Client ID only — public, safe). Customer pays on the site; Marcelo gets PayPal's payment email with items + address; he places it in Printful (check paid amount matches before fulfilling).
  2. Next: free Cloudflare Worker (no hosting cost, site stays on GitHub) that (a) recomputes prices from Printful server-side, (b) creates + captures the PayPal order, (c) creates the Printful order automatically. Needs: PayPal Client ID + Secret, Printful token with "View and manage orders" — both stored as Worker secrets, never in the repo.
  3. Then: Printful webhook → shipping/tracking email to customer; remove the manual step entirely.
- [ ] Legal pages before announcing: aviso legal, privacy, terms of sale, shipping & returns (needs Marcelo's legal name / NIF / address).
- [ ] Decide shipping prices (Spain / EU / rest) from Printful's rates.
- [x] Bandcamp section on the shop ("Exclusive edits & remixes"): `scripts/sync_bandcamp.py` → `assets/data/bandcamp.json`, refreshed daily by the GitHub Action; listen in-page, buy on Bandcamp.
- Note: edits of other artists' songs (Facundo Cabral, Tears for Fears, La Masa…) — selling them needs the rights holders' OK; consider name-your-price/free or promo-only.
- [ ] PayPal checkout on the shop (needs Marcelo's PayPal **Live Client ID** — public, safe to share).
- [x] Brand look: "Dusk & ritual" theme approved 23 Oct (warm earth browns, firelight glow, fine grain, faint circle-symbol watermark). Rejected: Andean textile / paper grain / topographic patterns on cream. Theme lives at the end of `assets/css/site.css`; press kit inline styles adapted.
- [ ] Add more products in Printful (shirts, posters, mugs, totes) → re-run sync.
- [ ] Accounts connected (Shopify ↔ Printful), first products with mockups.
- [ ] Build `/shop/` + `/es/tienda/` pages, nav tab, legal pages.
- [ ] Test order end to end.

### Academy
- [ ] Group cohorts and self-paced online courses (waitlist already collects interest).
- [ ] Course booking / scheduling (e.g. calendar link after the free intro call).

### Traffic plan (agreed direction, 14 Oct 2026)
Principle: every channel points to the **specific page** for that audience, never just the home page.
Four sources: Google (people searching), social content, platforms where buyers already look, relationships/referrals.

**Month 1 — foundations (on the site, Claude)**
- [ ] Privacy-friendly analytics (GoatCounter or Plausible: no cookie banner needed) to see which channel brings clients.
- [ ] Tracked links (UTM) for Instagram bio, WhatsApp, SoundBetter, listings — so each channel's visits are counted.
- [ ] "Link in bio" page (`/links/`) styled like the site: Studio · Clases · Danza · Booking · Latest release.
- [ ] Events page (`/events/` + `/es/eventos/`) for upcoming sessions and gigs — gives people a reason to come back.
- [ ] WhatsApp contact button (needs the number).

**Month 1 — foundations (Marcelo)**
- [ ] Google Business Profile + first 5–10 reviews (students, dancers, clients).
- [ ] Google Search Console + sitemap.
- [ ] Website link everywhere: Instagram, SoundCloud, Spotify for Artists bio, Bandcamp, label artist pages, festival artist pages.

**Month 2 — channels per business**
- Studio (online, worldwide):
  - [ ] SoundBetter profile.
  - [ ] Short before/after reels.
  - [ ] Ask labels / artists to credit "Mixed & mastered by Marcelo Bergés" with the link.
  - [ ] Producer communities (organic house / downtempo groups, Discord).
- Academy (Alicante + online):
  - [ ] Profiles on Superprof and Tusclasesparticulares linking to `/es/academia/`.
  - [ ] Free monthly Ableton masterclass in Alicante (or online) → collects emails.
  - [ ] Short tips videos (Reels / YouTube Shorts).
- Facilitation (local community):
  - [ ] Every session on Meetup, Eventbrite and Facebook events, plus local conscious-community groups (Altea, Alicante, Dénia).
  - [ ] Partnerships with yoga studios and retreat centres (they share your events, you play theirs).
  - [ ] Photos / short clips after every session, location-tagged.
- Perform (bookers):
  - [ ] Direct outreach to Costa Blanca beach clubs, chiringuitos and festivals with the press kit link.
  - [ ] Fresh SoundCloud mix every 1–2 months.
  - [ ] Resident Advisor artist profile.

**Month 3 — measure and double down**
- [ ] Check analytics: which channel → which page → which enquiries. Keep the top 2 channels, drop the rest.
- [ ] Newsletter (releases, events, course launches) from the waitlist and masterclass emails.
- [ ] Evergreen articles that rank on Google, e.g. "Qué es la danza extática", "Cómo preparar tus stems para mezcla".

**Weekly routine (2–3 h)**: 2 posts/reels that each link to one page · list next event · 1 outreach message (booker, studio, label) · ask 1 happy client for a review.

### Security (hardened 22 Oct)
- [x] Content-Security-Policy on every page (only own scripts; fonts, Spotify, Bandcamp, FormSubmit allowed); all inline scripts/handlers removed; referrer policy. Verified: no violations on 12 pages, injected scripts blocked.
- [x] Secrets never in repo: Printful token in git-ignored `tools/`; Spotify keys unused.
- [ ] **Marcelo: GitHub → repo Settings → Pages → tick "Enforce HTTPS"** (http:// currently does not redirect to https://).
- [ ] After FormSubmit activation, switch forms to FormSubmit's random alias so the email address isn't in the page source.
- When adding PayPal: add `https://www.paypal.com https://*.paypal.com https://*.paypalobjects.com` to script-src / frame-src / connect-src / img-src in the CSP.

### Site maintenance
- [ ] Put the page generator in the repo, so menu / footer / form changes are one edit instead of ten.
- [ ] Keep EN and ES (pages and press kits) in sync on every change.

---

## Done

- **Redesign**: single long page split into Home + Perform, Facilitate, Studio, Academy; images moved out of the HTML (1.7 MB → small pages).
- **Clean URLs**: `/studio/`, `/es/estudio/`, `/presskit/`… with old `.html` links forwarding.
- **Spanish site** under `/es/` with EN / ES switch, plus a Spanish press kit.
- **Press kit**: personal letter, formats, press photos with downloads, copy-ready bios, save as PDF.
- **Local SEO**: Costa Blanca / Alicante in titles and text, structured data, sitemap, robots.txt.
- **Contact forms**: messages delivered straight to Marcelo (FormSubmit), service-specific fields, spam filter, email-typo check, "wrong email? fix it", visitor confirmation email, optional WhatsApp / phone.
- **Latest release**: updates itself daily from Deezer (GitHub Action); currently "Ancestral Dunes".
- **No public pricing** anywhere; free intro call and free track assessment as entry points.
