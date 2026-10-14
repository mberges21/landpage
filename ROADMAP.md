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

### Academy
- [ ] Group cohorts and self-paced online courses (waitlist already collects interest).
- [ ] Course booking / scheduling (e.g. calendar link after the free intro call).

### Visibility
- [ ] Events page with upcoming ecstatic dance sessions and gigs (Costa Blanca).
- [ ] Listings on local event platforms (Meetup, Eventbrite, Facebook events) for every session.
- [ ] Studio listing on a mixing marketplace (e.g. SoundBetter).
- [ ] Simple analytics to see which page brings clients.
- [ ] WhatsApp contact button (needs the number).
- [ ] Newsletter for releases, events and course launches.

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
