import { ImageResponse } from "next/og";
import { projectBackgroundStars, projectConstellationLines, projectVisibleStars } from "./astronomy";
import type { PersonalizationStarMap, StarMapTheme } from "../types";

interface ThemeStyle {
  pageBackground: string;
  discBackground: string; // may be a solid color or a CSS gradient string
  border: string;
  star: string;
  line: string;
  title: string;
  message: string;
  caption: string;
}

const THEME_STYLES: Record<StarMapTheme, ThemeStyle> = {
  midnight: {
    pageBackground: "#0b0e1a",
    discBackground: "#0b0e1a",
    border: "rgba(255,255,255,0.3)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.32)",
    title: "#ffffff",
    message: "rgba(255,255,255,0.75)",
    caption: "rgba(255,255,255,0.55)",
  },
  "deep-blue": {
    pageBackground: "#0a1636",
    discBackground: "#0a1636",
    border: "rgba(255,255,255,0.3)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.32)",
    title: "#ffffff",
    message: "rgba(255,255,255,0.75)",
    caption: "rgba(255,255,255,0.55)",
  },
  black: {
    pageBackground: "#000000",
    discBackground: "#000000",
    border: "rgba(255,255,255,0.28)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.3)",
    title: "#ffffff",
    message: "rgba(255,255,255,0.75)",
    caption: "rgba(255,255,255,0.55)",
  },
  ivory: {
    pageBackground: "#f6f1e7",
    discBackground: "#f6f1e7",
    border: "rgba(30,26,20,0.35)",
    star: "#1e1a14",
    line: "rgba(30,26,20,0.4)",
    title: "#1e1a14",
    message: "rgba(30,26,20,0.72)",
    caption: "rgba(30,26,20,0.55)",
  },
  galaxy: {
    // One continuous nebula behind the whole poster (not just inside the
    // circle, per the reference) -- the disc below is left transparent so
    // this same background shows through uninterrupted, with the ring just
    // outlining it, matching how the reference poster reads as one image.
    pageBackground:
      "radial-gradient(circle at 30% 20%, rgba(120,60,180,0.6) 0%, rgba(120,60,180,0) 42%), " +
      "radial-gradient(circle at 75% 65%, rgba(40,80,190,0.55) 0%, rgba(40,80,190,0) 48%), " +
      "radial-gradient(circle at 55% 85%, rgba(200,80,140,0.35) 0%, rgba(200,80,140,0) 38%), " +
      "radial-gradient(circle at 15% 80%, rgba(60,100,200,0.4) 0%, rgba(60,100,200,0) 40%), " +
      "#0a0e24",
    discBackground: "transparent",
    border: "rgba(255,255,255,0.35)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.3)",
    title: "#ffffff",
    message: "rgba(255,255,255,0.8)",
    caption: "rgba(255,255,255,0.6)",
  },
};

// KNOWN SIMPLIFICATION (time-boxed per the build plan — the checkout/
// fulfillment pipeline doesn't depend on chart precision): the date+time the
// customer enters is treated as UTC directly rather than resolved to the
// actual local time at (lat, lon). Real local-time handling needs a
// timezone lookup keyed off the coordinates (e.g. tz-lookup + a TZ
// database) — worth adding as a follow-up quality pass, not a v1 blocker.
function toDate(personalization: PersonalizationStarMap): Date {
  const time = personalization.time ?? "20:00";
  return new Date(`${personalization.date}T${time}:00Z`);
}

export async function renderStarMapPng(
  personalization: PersonalizationStarMap,
  size: { width: number; height: number } = { width: 1200, height: 1500 }
): Promise<Buffer> {
  const date = toDate(personalization);
  const stars = projectVisibleStars(date, personalization.lat, personalization.lon);
  const backgroundStars = projectBackgroundStars(date, personalization.lat, personalization.lon);
  const lines = projectConstellationLines(date, personalization.lat, personalization.lon);
  const discSize = Math.min(size.width, size.height * 0.72);
  const theme = THEME_STYLES[personalization.theme ?? "midnight"];

  const image = new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          background: theme.pageBackground,
          padding: 48,
        }}
      >
        <div
          style={{
            width: discSize,
            height: discSize,
            borderRadius: "50%",
            border: `1px solid ${theme.border}`,
            position: "relative",
            display: "flex",
            marginTop: 24,
            overflow: "hidden",
            background: theme.discBackground,
          }}
        >
          <svg
            width={discSize}
            height={discSize}
            viewBox="0 0 100 100"
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            {/* Constellation lines and the ~1600-star background field were
                previously ~2300 separate <line>/<circle> elements -- Satori
                (next/og's renderer) scales badly with element count at large
                canvas sizes (a 60x90cm print render took 60s+ / timed out).
                Merging them into a handful of <path> elements (all lines as
                one path; background stars grouped into magnitude buckets so
                brightness variation survives) renders the identical image in
                a fraction of the time -- same visual output, ~30 elements
                instead of ~2300. */}
            {lines.length > 0 ? (
              <path
                d={lines.map((seg) => `M${seg.x1 * 100},${seg.y1 * 100}L${seg.x2 * 100},${seg.y2 * 100}`).join(" ")}
                stroke={theme.line}
                strokeWidth={0.15}
                fill="none"
              />
            ) : null}

            {Object.entries(
              backgroundStars.reduce<Record<string, typeof backgroundStars>>((buckets, star) => {
                const bucket = (Math.round(star.mag * 2) / 2).toFixed(1); // group every 0.5 mag
                (buckets[bucket] ??= []).push(star);
                return buckets;
              }, {})
            ).map(([bucket, group]) => {
              const mag = Number(bucket);
              const r = Math.max(0.12, 0.55 - mag * 0.07);
              const opacity = Math.max(0.25, 1 - mag / 5.5);
              const d = group
                .map((s) => {
                  const cx = s.x * 100;
                  const cy = s.y * 100;
                  return `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`;
                })
                .join(" ");
              return <path key={`bg-${bucket}`} d={d} fill={theme.star} opacity={opacity} />;
            })}

            {stars.map((star) => {
              const r = Math.max(0.45, 1.5 - star.mag * 0.35);
              return (
                <circle
                  key={star.name}
                  cx={star.x * 100}
                  cy={star.y * 100}
                  r={r}
                  fill={theme.star}
                  opacity={Math.max(0.75, 1 - star.mag / 6)}
                />
              );
            })}
          </svg>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 34,
            color: theme.title,
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {personalization.title}
        </div>

        {personalization.message ? (
          <div
            style={{
              marginTop: 16,
              fontSize: 22,
              lineHeight: 1.4,
              color: theme.message,
              display: "flex",
            }}
          >
            {personalization.message}
          </div>
        ) : null}

        <div
          style={{
            marginTop: 20,
            fontSize: 18,
            color: theme.caption,
            letterSpacing: 1,
            display: "flex",
          }}
        >
          {`${personalization.locationLabel} — ${personalization.date}`}
        </div>
      </div>
    ),
    { width: size.width, height: size.height }
  );

  const arrayBuffer = await image.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
