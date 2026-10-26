// Minimal Meta Marketing API client — no dependencies, Node 22 fetch.
// Env (loaded with `node --env-file=.env.local`): META_ACCESS_TOKEN,
// META_AD_ACCOUNT_ID (digits, with or without "act_"),
// optional META_API_VERSION.

const VERSION = process.env.META_API_VERSION || "v26.0";
const BASE = `https://graph.facebook.com/${VERSION}`;

export function env(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name} in .env.local`);
    process.exit(1);
  }
  return value;
}

export const adAccount = () => `act_${env("META_AD_ACCOUNT_ID").replace(/^act_/, "")}`;

function encode(params) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    body.set(key, typeof value === "object" ? JSON.stringify(value) : String(value));
  }
  return body;
}

export async function graph(path, params = {}, method = "GET") {
  const query = encode({ ...params, access_token: env("META_ACCESS_TOKEN") });
  const res =
    method === "GET"
      ? await fetch(`${BASE}/${path}?${query}`)
      : await fetch(`${BASE}/${path}`, { method, body: query });
  const json = await res.json();
  if (json.error) {
    const e = json.error;
    throw new Error(`${method} ${path}: ${e.message} (code ${e.code}${e.error_subcode ? `/${e.error_subcode}` : ""})`);
  }
  return json;
}

// Follows `paging.next` so callers get every row of an edge.
export async function graphAll(path, params = {}) {
  const rows = [];
  let page = await graph(path, { limit: 100, ...params });
  rows.push(...(page.data || []));
  while (page.paging?.next) {
    page = await (await fetch(page.paging.next)).json();
    if (page.error) throw new Error(page.error.message);
    rows.push(...(page.data || []));
  }
  return rows;
}

export const euros = (cents) => `${(Number(cents) / 100).toFixed(2)} €`;
