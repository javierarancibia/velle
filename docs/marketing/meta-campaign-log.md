# Meta campaign log — Navidad 2026

Ad account `1430261881584204` ("Campañas España 1"), Page `240467412489394`, Instagram `17841465204808383`, pixel `769834309094276`. Plan: [navidad-2026-campaign-report.md](navidad-2026-campaign-report.md).

## 2026-10-26 — Phase 1 (Test) built, everything PAUSED

Campaign `ES_TEST_PROSPECCION_NAV26` — `120248693572350534`. Sales objective, purchase optimisation, ad set budgets (ABO), 5 €/ad set/day, start 2 Nov 2026 00:00 (Madrid). Spain, ages 25+ hard / 25–65 suggested, Advantage+ audience and placements on. DSA beneficiary and payor: "Velle".

| Ad set / ad | Ad set ID | Ad ID | Creative ID | Video | Angle |
| --- | --- | --- | --- | --- | --- |
| ES_TEST_V0_REGALO | 120248693573920534 | 120248693578730534 | 1454090969986926 | Lampara Jesus Ad 2 (1646240216526871) | Gift reaction, Navidad |
| ES_TEST_V0_PRESENCIA | 120248693582120534 | 120248693591500534 | 28533121813025905 | Lampara Jesus Ad 2 | Nightly peace, Salmo 73:23 |
| ES_TEST_V0_PACK | 120248693582530534 | 120248693591800534 | 1158957396484319 | Lampara Jesus Ad 2 | Paga 2 y recibe 3 |
| ES_TEST_XMAS1_NAVIDAD | 120248693582960534 | 120248693592520534 | 3593196507508660 | Christmas Ad 1 (872210701982568) | Regala luz |
| ES_TEST_V5_ASMR_DEMO | 120248693583620534 | 120248693592880534 | 2341643116593324 | ASMR Velle (995592663178471) | Product demo |

"Lampara Jesus Ad 2" is the customer-reaction compilation behind the best past results: 33 sales at 17,29 € (Feb 2026), 12 sales at 8,36 € ("Regalos y Familia", Testeo 3). All links go to `velle.es/products/cuadro-jesus` with `utm_campaign=nav26-test` and a per-ad `utm_content`.

## 2026-10-26 — Audiences and retargeting added, still PAUSED

Custom Audience terms accepted. Instagram account `17841465204808383` renamed to @velle_espana (same ID, so the creatives need no change).

| Audience | ID | Rule |
| --- | --- | --- |
| VELLE_WEB_30D | 120248693955180534 | All velle.es visitors, 30 days |
| VELLE_CHECKOUT_14D | 120248693955320534 | InitiateCheckout, 14 days |
| VELLE_COMPRADORES_30D | 120248693955380534 | Purchase, 30 days, excluded from every ad set |

Campaign `ES_RETARGETING_NAV26` — `120248693958950534`. Ad set `ES_RT_C_WARM` `120248693960030534` (5 €/day, web 30d + checkout 14d, Advantage+ audience off so it reaches only those people), ad `ES_RT_V0_PACK` `120248693961900534` reusing creative 1158957396484319.

XMAS1 cover swapped to `hero.png` (no Gemini mark, pushed in 85ab844): new creative `2901748686864935`, new ad `ES_TEST_XMAS1_NAVIDAD_v2` `120248694153170534` (PAUSED) in the same ad set. The old ad `120248693592520534` is archived.

## 2026-10-26 — End of day status

- **Nothing is running.** Account spend is 0 € with 0 impressions over the last 7 days. Both Navidad campaigns and all their ad sets and ads are PAUSED. The old Testeo 3 "Ad 1" (`120231450140990534`) is under a paused campaign and has spent 0 €.
- **Start date:** ad sets are scheduled for 2 Nov 2026 00:00 Madrid, but they only deliver once activated. Move the date if the new creatives arrive later.
- **"Publicidad" on the Instagram post:** the only static image on @velle_espana is the 9 Nov 2025 post (https://www.instagram.com/p/DQ2go7gjfnR/). No ad delivering in any account the connector can read. Not checked: ad account `1257382236095065` ("Toolbox Joe 2", not readable by the connector) and boosts made in the Instagram app. The user is checking the post's Promoción status and Instagram's ad tools.
- **Website:** `hero.png` live on velle.es (commit 85ab844).
- **Repo:** marketing docs and `scripts/meta/report.mjs` committed.

## 2026-11-12 (night) — Navidad test rebuilt, everything PAUSED, waiting for the user's OK

Structure from Felipe Vergara's skills (excel-de-estrategia: Presentación + Evaluación, exclusions; generador-de-nombres: `Anunciante / Ciclo / …` naming). Our per-concept ABO test is kept inside Presentación. Copy is from the creative plan; every ad links to `velle.es/products/cuadro-jesus` with `utm_source=meta&utm_medium=paid_social`, `utm_campaign=nav26-test` (prospecting) or `nav26-rt` (retargeting), and `utm_content` = the ad code. CTA "Comprar" (SHOP_NOW). DSA beneficiary "Velle", payor "Javier Arancibia Digital Services" on the new ad sets.

**Presentación** — campaign `120248693572350534` renamed `Velle / Presentación / Ventas / ABO / Navidad 2026`. 5 ad sets × 5 €/day = 25 €/day. Spain, age 25+ (25–65 suggested), Advantage+ audience and placements, Purchase optimisation. Excludes VELLE_COMPRADORES_180D, VELLE_WEB_90D, VELLE_FB_ENG_90D.

| Ad set | ID | Ads (ID) |
| --- | --- | --- |
| … / Control (was ES_TEST_V0_REGALO) | 120248693573920534 | V0 `120248693578730534` (original Oct creative) |
| … / Abuelos | 120248968796700534 | 1A `120248968805350534`, 1B `120248968811100534`, 2A `120248968811720534`, 2B `120248968812580534` |
| … / Montaje | 120248968797430534 | 3A `120248968813930534`, 3B `120248968814270534`, 3C `120248968814900534` |
| … / Reseñas | 120248968798360534 | 5A `120248968815170534`, 5B `120248968815870534` |
| … / Niño | 120248968799410534 | 6A `120248968817200534`, 6B `120248968817810534`, 6C `120248968818210534` |

New ad sets are scheduled to start 13 Nov 07:00 Madrid. Control's start date (2 Nov) is in the past and can't be edited, so it starts as soon as it's switched on.

**Evaluación** — campaign `120248693958950534` renamed `Velle / Evaluación / Ventas / ABO / Navidad 2026`. Ad set `120248693960030534` renamed `Velle / Evaluación / Retargeting 30d`, 5 €/day: VELLE_WEB_30D + VELLE_CHECKOUT_14D + VELLE_FB_ENG_30D, excludes VELLE_COMPRADORES_30D. Ads: V6A `120248968818950534`, I1 `120248968820560534`, I5 `120248968820800534`, I6 `120248968821070534` (images use the 4:5 version; the connector can't do per-placement images together with UTMs yet).

**Archived:** ad sets V0_PRESENCIA, V0_PACK, XMAS1_NAVIDAD (with XMAS1_v2), V5_ASMR_DEMO and the ad ES_RT_V0_PACK.

**New audiences:** VELLE_WEB_90D `120248968774730534`, VELLE_COMPRADORES_180D `120248968775310534`, VELLE_FB_ENG_90D `120248968774640534`, VELLE_FB_ENG_30D `120248968776520534`. Instagram engager audiences failed (the connector has no audience permission on the IG account); create them in Ads Manager if wanted.

**Media:** 13 videos and 6 images uploaded to the ad account (titles start with "NAV26"). The connector's direct upload isn't enabled yet, so files were hosted briefly in Supabase storage `uploads/tmp-ads/` and pulled by URL; the large files are deleted. The 13 cover frames (`thumb-*.jpg`) are still there; delete them once the ads are approved.

**Total when live:** 30 €/day (25 prospecting + 5 retargeting).

## 2026-11-13 — LIVE: both campaigns activated (user's OK: "go all in with the campaign setup and activation")

**Retargeting images rebuilt** from the user's new sources (`Imagenes Retargeting/src/build.mjs`; previous versions in `old/`), 4:5 + 9:16 each. Uploaded via temporary Supabase hosting (user approved; files deleted right after). The connector's direct upload and `url_tags` are still "rolling out", so UTMs are in the link itself (`?utm_source=meta&utm_medium=paid_social&utm_campaign=nav26-rt&utm_content=<code>`). Each creative uses placement customization: the 4:5 image everywhere and the 9:16 image in FB/IG Stories + Reels and Messenger Stories.

| Ad (Evaluación / Retargeting 30d) | Ad ID | Creative |
| --- | --- | --- |
| I1 v2 Paga 2 recibe 3 | 120248977561150534 | 1119823277433608 |
| I5A Valeria (Abuela) | 120248977562340534 | 1644590477161020 |
| I5B Fernanda (Abuelo) | 120248977562950534 | 1161465509682834 |
| I5C Carolina (Niño) | 120248977563390534 | 1584058870195709 |
| I5D Teresa M., Zamora (Hermana) | 120248977563980534 | 2292719351517466 |
| I6 v2 Apagado/Encendido | 120248977564160534 | 2113904745927358 |

Copy unchanged from the old ads (I5x share "Lo que dicen nuestros clientes…"). Old I1/I5/I6 ads archived.

**Activated (13 Nov, afternoon):** both campaigns, all 6 ad sets, all 20 ads. Read back: campaigns and the 14 video ads ACTIVE; the 6 new image ads PENDING_REVIEW. Spend: 30 €/day (25 prospecting + 5 retargeting).

## 2026-11-16 — First read (day 3), 3 Q's: 🔴

Full report: [analisis-3qs-2026-11-16.html](analisis-3qs-2026-11-16.html). 13–16 Nov: Presentación 88,92 € spent, 139 outbound clicks (CTR 1,59 %), 1 purchase credited by Meta (5A, 44,90 €) → ROAS 0,50 vs objective 2,6. Evaluación 0 € (all 6 ads approved; audience too small: VELLE_WEB_30D = 20 people because the pixel only loads after cookie consent).
- Order database: every paid order since launch is from 13 Nov. **VEL-20261113-4DY3 is the only real sale** (confirmed by the user 16 Nov; credited to 5A Reseñas); VEL-20261113-FUYM was a test. **0 checkouts started 14–16 Nov**.
- Same day: cookie banner slimmed to a bottom bar and a phone-only sticky buy bar added to the product page (8e77d81).

## 2026-11-16 (midday) — Retargeting audiences widened, V0 text fixed (user's OK)

- **Retargeting 30d** `120248693960030534`: now VELLE_WEB_30D + VELLE_CHECKOUT_14D + VELLE_FB_ENG_30D + **VELLE_WEB_90D** + **VELLE_FB_ENG_90D**; still custom audiences only (Advantage+ audience off), Spain 18–65, excludes VELLE_COMPRADORES_30D. Applied live. Right after the edit its delivery read "no_active_ad" and all 7 ads were re-processing (IN_PROCESS); check tomorrow that it spends.
- Instagram engagers audience still fails (no audience permission on IG `17841465204808383` through the connector): the user creates it in Ads Manager and adds it to this ad set.
- Video-viewer audiences can't be created through the connector.
- **Control:** new creative `28948204528193706` (same video, thumbnail, headline; text says "tiene marco de madera" instead of "está pintado a mano"; `utm_content=v0-regalo-v2`), new ad **V0 v2** `120249014145680534` ACTIVE (in review). Old V0 `120248693578730534` PAUSED.
- **COD:** user decided to add a "pay on delivery" button with a form (no automation; orders are entered by hand on the warehouse page). Build it on **18 Nov**, ready for the day-7 decision on 20 Nov. Pixel agrees (InitiateCheckout 8 / Purchase 4 on 13 Nov only).
- Product page on mobile: the cookie banner covers about a third of the screen until answered. Rest of the page is fine.
- Control ad V0 text still says "pintado a mano".
- Nothing paused (under 7 days, no ad set near 36 €). Proposed, awaiting the user (since done: banner, WEB_90D, V0 text): slimmer cookie banner, warm audiences for retargeting (video viewers 50 %, IG engagers, WEB_90D), fix V0 text, no budget increase on 20 Nov until checkouts appear, day-7 COD decision.

## 2026-11-17 — Day 4 read (after the 16 Nov page update)

- Presentación by day (spend / outbound clicks / Meta purchases): 13 Nov 22,13 € / 35 / 1 · 14 Nov 29,94 € / 43 / 0 · 15 Nov 28,38 € / 51 / 0 · 16 Nov 28,71 € / 40 / 0 · 17 Nov (to midday) 9,62 € / 9 / 0. Total 118,78 €, 178 clicks, 1 sale.
- Evaluación (retargeting) spent 0,40 € on 16 Nov and 0 € on 17 Nov: still not delivering after the audience change.
- Vercel Analytics 13–17 Nov: 148 visitors, 159 page views, all on /products/cuadro-jesus, 1 /checkout/success. 148 visitors vs 178 outbound clicks is normal (ad blockers, people who close before the page loads). The 94 % bounce rate means little here: Stripe checkout is on another domain, so even buyers count as bounces.
- Orders database: checkout started twice since the update, both unpaid (pending_payment): VEL-20261116-WHP9 (16 Nov 13:35 Madrid, maybe the user testing) and VEL-20261117-9QVU (17 Nov 01:08 Madrid). Before the update: 0 checkouts 14–16 Nov.

## 2026-11-17 (afternoon) — Cash on delivery live (user's OK)

- Moved up from 18 Nov. "Pagar al recibir • price" is now the main button (also on the phone sticky bar and the pack-of-3 banner); "Pagar ahora con tarjeta o Bizum" is the secondary button. No COD surcharge: the price is already about 5 € above the old all-in 39,99 €.
- Form → order saved as `cod_pending` (migration 0006), customer email with the approved wording, operator email with a one-tap WhatsApp link to the customer. Thank-you page has "Confirmar ahora por WhatsApp" to Velle's number (`NEXT_PUBLIC_WHATSAPP_NUMBER`, NL number, set in Vercel).
- Meta: opening the form fires InitiateCheckout; placing a COD order fires Purchase. Meta's purchase count now includes orders that may be refused at the door (old campaigns: 10–15 %).
- Live test by the user (VEL-20261117-IUA4, 79,90 €, 10:50 Madrid): emails, WhatsApp links and number all worked; order deleted. It fired one Purchase in Meta on 17 Nov, so subtract it from Meta's count for that day.
- Read from 18 Nov: COD orders per day vs card checkouts; day-7 decision on 20 Nov becomes "does COD sell".

## 2026-11-18 (morning) — Day 5 read + cookie banner check

**First COD order:** VEL-20261118-OQS0, 18 Nov 07:53 Madrid, Córdoba, 1 frame, 44,90 €, `cod_pending` (to be confirmed by WhatsApp). No card checkout since COD went live (17 Nov ~10:45). The pixel logged it: Meta's pixel day 17 Nov (09:00 17 Nov → 09:00 18 Nov Madrid) has 2 Purchase (the user's test + this order) and 6 InitiateCheckout (some are the user's tests). Meta hadn't credited it to an ad by midday; the only checkout started 18 Nov is on **V0 v2**, so probably that one.

- Presentación by day (spend / outbound clicks / CPM / landing page views): 13 Nov 22,13 € / 35 / 9,83 / 13 · 14 Nov 29,94 € / 43 / 9,12 / 10 · 15 Nov 28,38 € / 51 / 10,97 / 12 · 16 Nov 28,72 € / 40 / 12,70 / 6 · 17 Nov 30,88 € / 37 / 16,36 / **1** · 18 Nov (to ~11:30) 8,92 € / 15 / 14,79 / **1**. Total 148,97 €, 221 clicks, **2 real sales (≈74 € per sale, ROAS ≈0,6)**.
- By ad: 3A 26,59 € / 42 clicks / 0 checkouts (closest to the 36 € pause line) · 5A 25,42 € / 1 sale · V0 + V0 v2 32,81 € / 1 checkout · 6B 22,24 € / 0 · 1A 14,79 € / 0 · 1B 11,58 € / 0 · other 8 ads under 7 € each. No ad at 36 € without a sale, so nothing paused.
- Evaluación (retargeting): 1,11 € and 9 impressions in total. Still not delivering.
- CPM up from ~9 € to ~16 €; CTR 1,3–2,5 % (past campaigns 2,2–3,7 %).

**Cookie banner check** (live test on velle.es at 390 px wide, with a fake `fbclid`; it sent one test PageView with `utm_content=claudetest`):
- The banner works: a 98 px bottom bar, with the sticky buy bar sitting above it. Nothing loads from Meta before consent. On "Aceptar" the pixel loads and sends PageView with `fbc` (the ad click ID) and sets `_fbc`/`_fbp`, so ad visits can be matched.
- The landing page view drop doesn't come from a broken pixel. Pixel PageViews held at 20–40/day (22 / 40 / 35 / 25 on 14–17 Nov) while landing page views fell 10 → 1. We can't measure the accept rate: banner choices aren't recorded anywhere. Possible causes: fewer ad visitors accept the slimmer bar, while the PageView total is held up by our own test visits (COD tests on 17 Nov); or just noise at these small numbers.
- **Bug found:** `ViewContent` fires once when the product page mounts (`CuadroJesusProductClient.tsx` ~l.277). For a first-time visitor the pixel isn't loaded yet, so `trackMetaPixelEvent` drops it and doesn't send it again after "Aceptar". Every new visitor's ViewContent has been lost since the consent gate (12 Nov). Meta only sees ViewContent from returning visitors who accepted earlier. Fix proposed: hold events in memory until the visitor chooses, send them on "Aceptar", drop them on "Rechazar".
- Proposed: count banner choices (accept / reject / no answer) without cookies or personal data, so the accept rate can be measured.
- Vercel Analytics (user, 18 Nov): visitors from Spain 15 Nov 40 · 16 Nov 33 · 17 Nov 33. That's close to the pixel's PageViews (40 / 35 / 25), which points to a fairly high accept rate. The counter below will give the real number.

**Both fixes built (user's OK, 18 Nov):**
- `lib/metaPixel.ts`: events fired before the pixel loads wait in memory (up to 20; nothing is stored or sent). `MetaPixel` sends them right after its PageView on "Aceptar" and drops them on "Rechazar". New visitors' ViewContent now reaches Meta, and so does a Purchase fired before the pixel loads.
- Banner counter: `components/CookieBanner.tsx` → `POST /api/consent-event` → table `consent_events` (migration **0007**). One row per `shown` / `granted` / `denied`, plus `from_ad` (the landing URL had `fbclid`). Only the banner that opens by itself is counted, not a reopen from the footer. No cookie, IP, user agent or URL is stored. A sentence explaining it was added to /cookies.
- Tested on a local production build with Meta's requests blocked. Accept → PageView + ViewContent, both with `fbc`. Reject → nothing sent to Meta, pixel never loads. One count per action. An earlier test on the dev server let a few localhost events through to the pixel (URL `localhost:3123`, `fbclid=IwLOCALtest`).
- Accept rate per day: `shown` = banners shown, `granted / shown` = accept rate, `shown − granted − denied` = ignored. Split by `from_ad`.

## To-dos

### Next session (start here)

**Wed 18 Nov plan (agreed 17 Nov):**
1. [x] (done, see 18 Nov entry) Morning read: cash-on-delivery orders vs card checkouts since COD went live (17 Nov ~10:45 Madrid). Subtract the test Purchase from 17 Nov in Meta. Check orders in the DB (`cod_pending`) against Meta's Purchase count.
2. [ ] Retargeting `ES_RT_C_WARM` / Evaluación: spent 0,40 € on 16 Nov and 0 € on 17 Nov after the audience change. Find out why it isn't delivering.
3. [ ] **New product gallery** (`GALLERY` in `components/CuadroJesusProductClient.tsx`), shipped on one day and logged here for the before/after:
   - Slide 1: a 3–4 s off → on loop, **made by the user** from our existing videos (real frame, "Salmo"). Claude trims, loops smoothly, compresses to a muted MP4 (~200 KB, `preload` with the lit hero as poster so phones never see a blank box).
   - Then: features (current 2) → **size** (17,5 × 23,5 cm, in a hand or on a nightstand) → grandma reaction (current 4) → **reviews slide** (+500 familias, ★★★★★, 2 real quotes) → **in the box** (frame, USB cable with dimmer, packaging) → **peace-of-mind slide** (Paga al recibir · Envío gratis 24–72 h · Si llega dañado te enviamos otro · 14 días de devolución) → **packs slide** (Paga 2 y recibe 3 with prices) → boy at bedtime (current 5) → mother and daughter (current 7).
   - Claude makes the reviews, peace-of-mind and packs slides (same style as the retargeting images, `Imagenes Retargeting/src/build.mjs`).
   - Remove: catalogue image (current 3), joven (6), pareja (8), salmo (9), and both videos `encendido.mp4` and `oferta.mp4`: **the real frames say "Salmo 73:23" (confirmed by the user 17 Nov); those two videos say "Psalm 73:23"**, so they don't show what customers receive.
   - Needed from the user: the off → on clip, a size photo, an in-the-box photo, and whether it comes in a gift box.
   - Also check the "Míralo en casa" videos (`IN_ACTION_VIDEOS`) and the ad videos for "Psalm"; flag any that show it.
The Meta Ads connector went down mid-afternoon 13 Nov (CONNECT_TIMEOUT; Claude Docs also erroring). Campaigns keep running. If it still fails, the user should reconnect it in claude.ai → Settings → Connectors.
- [ ] Read the live body + headline of all 20 ads and confirm each matches its video.
- [ ] **Niño ads 6A/6B/6C:** they quoted Leonor's "Con mi hija…" over the boy video. The user edited the 3 ads by hand in Ads Manager (13 Nov) to credit "Carolina S., Sevilla ⭐⭐⭐⭐⭐". Unconfirmed: whether the quote is now Carolina's own ("Es nuestro pequeño ritual con mi hijo: rezar antes de dormir") or still Leonor's words with Carolina's name. The user said to leave it for now; check the live text and raise it only if it still says "hija". The edit also changed the creative IDs, so re-read them.
- [ ] Creative plan (Claude Doc + `navidad-2026-creative-plan.md` line ~234, V11 primary text) still has the Leonor quote. Sync it to whatever the live 6A/6B/6C text is.
- [ ] Check the 6 new image ads passed review; fix any rejection.
- [ ] Then delete `uploads/tmp-ads/thumb-*.jpg` (13 cover frames) from Supabase.
- [ ] First performance read around 16 Nov (day 3): per-ad cost per sale, add to cart → checkout → purchase.

### Fri 13 Nov
- [x] Activate Presentación and Evaluación (done 13 Nov; user chose to launch retargeting now too).
- [x] Website: customer video reviews, payment logos (no Bizum until approved), Vercel Analytics, pointer cursor. All pushed and live (5e9ea83, cc5eb85).
- [ ] Check every ad passed review; fix any rejection.
- [ ] Product page: remove the duplicate José María review; add Clara Z. ("Mi hija Josefina ama su Luz de Cristo"), Fernanda M. ("Mi Yayo lloró cuando vio a Jesús al iluminarse"), Carolina S. ("Es nuestro pequeño ritual con mi hijo rezar antes de dormir") and Luz R. ("El mejor regalo que me han dado para Navidad", from V6A), with stills from the Ad 5 / V6A videos as photos.
- [ ] Payment-logo row under the buy button is built locally (not pushed); push it once Bizum is approved in Stripe.
- [ ] Bizum live test purchase once Stripe approves it.
- [ ] Delete `uploads/tmp-ads/thumb-*.jpg` from Supabase after review (`node --env-file=.env.local <scratchpad>/upthumbs.mjs <dir> --delete`, or from the Supabase dashboard).

### Launch day: Thu 12 Nov 2026 (goal: campaign live by end of day)

Videos are in `Apps/Cuadro de Jesus/Ads/Campaña Noviembre 2026/<Ad folder>/`. Export rules agreed 11 Nov: 1080×1920, 30 fps, offer and captions just below the centre (≈55–65% height), white text with a black border (no black box). Reviews, "500 familias" and "Quedan pocas unidades" are real; V0 stays unedited.

**Creative status (re-checked 12 Nov midday: all 14 files are 1080×1920, 30 fps, with audio)**

| Ad | Status |
| --- | --- |
| 1A, 1B Abuela | ✅ Ready (1080p, offer moved up, lowercase fixed) |
| 2A, 2B Abuelo | ✅ Ready (stray "·" gone from 2A) |
| 3A, 3B, 3C Para quién es | ✅ Ready ("Paga 2 y lleva 3" on all three) |
| 5A, 5B Reseñas | ✅ Ready. "Clara Z., Madrid" is correct (confirmed 12 Nov) |
| 6A, 6B, 6C Antes de dormir | ✅ Ready. Intentional format test (user, 12 Nov): 6A has no offer end card; black-box captions with the offer near the top vs white + border below centre on the other ads. Compare caption format/position when reading results |
| V6A Unboxing (retargeting) | ✅ Ready (offer "Paga 2 Lleva 3" near the top, fine for retargeting) |
| V0 Lampara Jesus Ad 2 | ✅ Runs as is (already 1080p) |

Optional, user's call: thicker border or soft shadow where text sits on the lit frame; open 2A on the hug clip to match "El abrazo que no esperaba".

**User, morning**
- [x] Fix 2A and re-export 5A, 5B, 6A, 6B, 6C, V6A.
- [x] Reconnect the "Meta ads Velle" connector (working again in Claude Code, 12 Nov).
- [x] Retargeting images approved (12 Nov).

**Claude**
- [x] Check the re-exported files (12 Nov: all 1080×1920, 30 fps).
- [x] I1, I5, I6 made (4:5 + 9:16) from the real V6A unboxing footage (frame off/on) and the Ad1 Abuela clip: `Campaña Noviembre 2026/Imagenes Retargeting/`, rebuild with `src/build.mjs`.
- [ ] Rebuild `ES_TEST_PROSPECCION_NAV26`, all PAUSED, 5 €/day per ad set (25 €/day), buyers excluded, UTMs `nav26-test` + per-ad `utm_content`, primary text and headlines from the creative plan:
  - `ES_TEST_CONTROL`: V0
  - `ES_TEST_ABUELOS`: 1A, 1B, 2A, 2B
  - `ES_TEST_MONTAJE`: 3A, 3B, 3C
  - `ES_TEST_RESENAS`: 5A, 5B
  - `ES_TEST_NINO`: 6A, 6B, 6C
- [ ] Ask the user before touching the old 10-26 ad sets (V0_REGALO, V0_PRESENCIA, V0_PACK, XMAS1, V5_ASMR): proposal is to reuse V0_REGALO as `ES_TEST_CONTROL` and archive the other four.
- [ ] Retargeting `ES_RT_C_WARM` (5 €/day): swap in V6A + the 3 images; keep or drop `ES_RT_V0_PACK` per the user.
- [ ] Set the start date to 12 Nov (ad sets are still scheduled for 2 Nov).
- [ ] Show the full structure to the user, then activate **only with their explicit OK**.

**Website before launch (added 11 Nov night; the site has none of these yet)**
- [ ] **Stripe live setup:** live keys in production env, Bizum enabled in live mode, live webhook `https://velle.es/api/webhooks/stripe` with `checkout.session.completed` + `async_payment_succeeded`, signing secret = `STRIPE_WEBHOOK_SECRET`. Business details, statement descriptor and payout account complete in the Stripe dashboard.
- [ ] **Real test purchase** (card and Bizum) on velle.es: order turns paid, confirmation email arrives, Meta Purchase event fires with the right value. Refund it.
- [ ] **Legal pages** (Spanish law, also checked by Stripe and Meta): Aviso legal (LSSI: owner name, NIF, address, email), Política de privacidad (RGPD), Política de cookies, Condiciones generales de venta (prices with IVA, delivery 24–72 h, 14-day desistimiento + withdrawal form, guarantee, link to /devoluciones). Links in the footer and at checkout. Needs from the user: legal name, NIF/CIF, postal address, contact email.
- [x] **Cookie banner** (12 Nov, not deployed yet): Meta Pixel loads only after "Aceptar"; Rechazar/Aceptar same weight, Configurar per purpose, footer "Configurar cookies" to withdraw (deletes _fbp/_fbc), /cookies policy page. No server-side Conversions API yet, so visitors who reject aren't counted.
- [ ] **Final touches:** user to list them; check mobile checkout end to end, the "Quedan pocas unidades" banner, and that every ad's `utm_content` lands on `/products/cuadro-jesus`.

**Still open from before (needed before activating)**
- [ ] Confirm "Velle" as DSA beneficiary and payor, or the legal company name.
- [ ] Bizum in Stripe **live** mode, live webhook endpoint + secret, and one real test purchase that fires the Meta Purchase event (see Checkout below).
- [x] "Publicidad" check on the Instagram post: closed 13 Nov. The user has never boosted a post on this account, and no ad in the readable accounts delivers it; nothing to pause.
- [ ] Push commit `9bf6970` (docs and report script only) with the next push to `main`.

**After launch:** Black Friday phase starts 20 Nov; V9 (cut from the phase 1 winner) and image I4 are due 18 Nov.

### Checkout (added 2026-11-02)
Past campaigns (Oct 2025 – Jun 2026) ran on the old store with COD (contrareembolso), 10–15% refused. velle.es is card-only (Stripe), so expect a higher cost per sale than those benchmarks.
1. ~~**Bizum:** enabled in the Stripe dashboard (2 Nov); Checkout shows it automatically. Webhook now waits for confirmed payment (`async_payment_succeeded`). Trust line added under the buy button.~~ `checkout.session.async_payment_succeeded` is already on the webhook endpoint (confirmed by the user, 2 Nov). Still to do:
   - [ ] Check Bizum is enabled in Stripe **live** mode, not only test mode.
   - [ ] Check the webhook with that event is the **live** endpoint for `https://velle.es/api/webhooks/stripe`, and its signing secret matches `STRIPE_WEBHOOK_SECRET` in production.
   - [ ] Deploy, make one real Bizum purchase on velle.es, check the order turns paid and the Meta Purchase event fires, then refund it.
2. **7-day card-only test** from the day the test campaign goes live. Track add to cart → started checkout → purchase in Ads Manager each day.
3. **Day 7 decision:** if many people start checkout but few pay, add COD (the warehouse offers it) as a second option with a 2–3 € surcharge. Otherwise stay card-only.

### Before each phase
- **User:** remove the watermarks from every creative before sending it.
- **By 30 Nov:** set the Christmas delivery cut-off (last order date to arrive by 24 Dec) from real carrier times. Needed for image I2 and the "Llega para Nochebuena" copy, and for the announcement bar on velle.es.
- **By 16 Dec:** set the Reyes cut-off (last order date to arrive by 6 Jan). Needed for image I3, and to decide when the Reyes ads stop.

### Answered 2026-10-26
- **Delivery:** not in the 4 € unit cost; the courier costs 6–8 € per order and shipping is free for the customer. The budget now uses 7 € per order: break-even 34 € per sale, realistic profit about 2.700 €.
- **Black Friday:** no extra discount for now; pack 3 only.
- **AI disclosure:** ads won't be marked as AI. The user will remove every watermark from the creatives.
- **Scripts:** `check.mjs` and `setup-test-phase.mjs` deleted; the Meta Ads MCP builds the campaigns. `npm run meta:report` stays.

### Once running (from the plan)
- Daily check: per-ad cost per sale against the rules (target 18 €, pause at 36 € with no sale, stop-loss 30 €, break-even 34 €).
- Scale winners +20% every 48 h while under 18 €; never change budgets without the user's OK.
- Phase changes: Black Friday 20 Nov (65 €/day), Navidad 2 Dec (70 €/day), Reyes 21 Dec (30 €/day), end 4 Jan.
- Watch stock daily; slow down below about 40 frames.
- Keep the Claude Doc and `navidad-2026-campaign-report.md` in sync after every doc edit.

## Past Cuadro de Jesús results by month (all campaigns, this account)

| Month | Campaigns | Spend | Sales | Cost per sale | ROAS | CPM |
| --- | --- | --- | --- | --- | --- | --- |
| Oct 2025 | Testeo 3 | 73 € | 4 | 18,32 € | 2.3 | 8,23 € |
| Nov 2025 | none | 0 € | 0 | — | — | — |
| Dec 2025 | Testeo 3 + Liquidación | 304 € | 31 | 9,80 € | 5.3 | 7,27–9,81 € |
| Feb 2026 | Febrero2026 | 90 € | 6 | 14,92 € | 3.1 | 7,76 € |
| Mar 2026 | Febrero2026 | 485 € | 27 | 17,95 € | 2.6 | 6,77 € |
| May 2026 | Mayo 2026 | 231 € | 8 | 28,85 € | 1.6 | 8,97 € |
| Jun 2026 | Mayo 2026 | 584 € | 16 | 36,52 € | 1.2 | 7,09 € |

Total 1.766 € for 92 sales (19,20 € each). CTR stayed between 2.2% and 3.7% every month.
