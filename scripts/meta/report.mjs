// Read-only daily check: per-ad results for the last 7 days, judged against
// the rules in docs/marketing/navidad-2026-campaign-report.md. It never
// changes the account — it only suggests. Run: npm run meta:report
// Optional: --preset=yesterday|last_3d|last_7d|last_14d|this_month

import { mkdirSync, writeFileSync } from "node:fs";
import { adAccount, graphAll } from "./graph.mjs";

const PRESET = process.argv.find((a) => a.startsWith("--preset="))?.split("=")[1] || "last_7d";

// Thresholds from the Budget section of the report.
const TARGET_CPA = 18;
const STOP_LOSS_CPA = 30;
const BREAK_EVEN_CPA = 34;
const NO_SALE_PAUSE_SPEND = 36;

const sumActions = (list, type) =>
  (list || []).filter((a) => a.action_type === type).reduce((s, a) => s + Number(a.value), 0);

const rows = await graphAll(`${adAccount()}/insights`, {
  level: "ad",
  date_preset: PRESET,
  fields: "campaign_name,adset_name,ad_name,spend,impressions,cpm,ctr,inline_link_clicks,frequency,actions,action_values",
});

const ads = rows.map((r) => {
  const spend = Number(r.spend);
  const purchases = sumActions(r.actions, "offsite_conversion.fb_pixel_purchase") || sumActions(r.actions, "purchase");
  const revenue = sumActions(r.action_values, "offsite_conversion.fb_pixel_purchase") || sumActions(r.action_values, "purchase");
  const checkouts = sumActions(r.actions, "offsite_conversion.fb_pixel_initiate_checkout") || sumActions(r.actions, "initiate_checkout");
  const cpa = purchases ? spend / purchases : null;
  let verdict = "keep";
  if (!purchases && spend >= NO_SALE_PAUSE_SPEND) verdict = "PAUSE (no sale after 36 €)";
  else if (cpa !== null && cpa > BREAK_EVEN_CPA) verdict = "PAUSE (above break-even)";
  else if (cpa !== null && cpa > STOP_LOSS_CPA) verdict = "CUT (above stop-loss)";
  else if (cpa !== null && cpa <= TARGET_CPA && purchases >= 3) verdict = "SCALE +20%";
  return {
    campaign: r.campaign_name, adset: r.adset_name, ad: r.ad_name, spend, purchases, revenue, checkouts, cpa,
    roas: spend ? revenue / spend : 0, ctr: Number(r.ctr), cpm: Number(r.cpm), frequency: Number(r.frequency || 0), verdict,
  };
}).sort((a, b) => b.spend - a.spend);

const totals = ads.reduce((t, a) => ({ spend: t.spend + a.spend, purchases: t.purchases + a.purchases, revenue: t.revenue + a.revenue }), { spend: 0, purchases: 0, revenue: 0 });
const totalCpa = totals.purchases ? totals.spend / totals.purchases : null;
const fmt = (n, d = 2) => (n === null ? "—" : n.toFixed(d));

const lines = [
  `# Meta ads check — ${PRESET} (generated ${new Date().toISOString().slice(0, 10)})`,
  "",
  `Spend ${fmt(totals.spend)} € · purchases ${totals.purchases} · cost per sale ${fmt(totalCpa)} € · ROAS ${fmt(totals.spend ? totals.revenue / totals.spend : null)}`,
  totalCpa !== null && totalCpa > STOP_LOSS_CPA
    ? `**Stop-loss hit:** account cost per sale is above ${STOP_LOSS_CPA} €. Halve prospecting, keep retargeting.`
    : `Stop-loss (${STOP_LOSS_CPA} €) not hit.`,
  "",
  "| Ad | Ad set | Spend € | Purchases | Cost/sale € | ROAS | Checkouts | CTR % | CPM € | Freq | Suggestion |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...ads.map((a) => `| ${a.ad} | ${a.adset} | ${fmt(a.spend)} | ${a.purchases} | ${fmt(a.cpa)} | ${fmt(a.roas)} | ${a.checkouts} | ${fmt(a.ctr)} | ${fmt(a.cpm)} | ${fmt(a.frequency, 1)} | ${a.verdict} |`),
  "",
  "Suggestions only — nothing was changed in the account.",
];

const out = lines.join("\n");
console.log(out);
mkdirSync("docs/marketing/meta-reports", { recursive: true });
const file = `docs/marketing/meta-reports/${new Date().toISOString().slice(0, 10)}-${PRESET}.md`;
writeFileSync(file, out + "\n");
console.log(`\nSaved ${file}`);
