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

## To-dos

### Fri 13 Nov
- [x] Activate Presentación and Evaluación (done 13 Nov; user chose to launch retargeting now too).
- [ ] Check the 6 new image ads pass review; fix any rejection.
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
- [ ] "Publicidad" check on the Instagram post: pause any active boost once the user confirms.
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
