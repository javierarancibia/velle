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

## To-dos

### Next session
1. The user sends the new creatives. Add each as its own PAUSED ad set + ad (5 €/day, same settings as the test ad sets, buyers excluded, UTMs `nav26-test`).
2. Review the result of the "Publicidad" check. If a boost is active, pause it once the user confirms.
3. Confirm "Velle" as DSA beneficiary and payor (the name shown in the EU ad transparency info) **before activating**. If it should be the legal company name, update every ad set.
4. Confirm the start date. Activate the test and the retargeting campaign **only with the user's explicit OK**.
5. Push commit `9bf6970` (docs and report script only) with the next push to `main`.

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
