import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import {
  projectBackgroundStars,
  projectConstellationLines,
  projectVisibleStars,
} from "./astronomy";
import type { PersonalizationStarMap, StarMapTheme } from "../types";

interface ThemeStyle {
  pageBackground: string;
  // Optional full-bleed photographic background (path under /public), used
  // by "galaxy" instead of a flat/gradient pageBackground. Loaded once and
  // cached as a data URI -- see backgroundImageDataUri() below.
  backgroundImage?: string;
  // Optional distinct fill for the star-circle disc itself, when it should
  // read as a different tone than the page around it (e.g. "white-circle":
  // a black disc on a white page). Omit for themes where the circle is the
  // same tone as the page (the star field just sits directly on it).
  circleFill?: string;
  border: string;
  star: string;
  line: string;
  compass: string;
  title: string;
  message: string;
  caption: string;
}

// Background photos are a few hundred KB -- cheap to base64-embed once per
// cold start and reuse across every render, rather than re-reading disk on
// every request.
const backgroundImageCache = new Map<string, string>();
function backgroundImageDataUri(relPath: string): string {
  const cached = backgroundImageCache.get(relPath);
  if (cached) return cached;
  const abs = path.join(process.cwd(), "public", relPath);
  const buf = fs.readFileSync(abs);
  const ext = path.extname(relPath).toLowerCase();
  const mime =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : "image/png";
  const uri = `data:${mime};base64,${buf.toString("base64")}`;
  backgroundImageCache.set(relPath, uri);
  return uri;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// "2019-06-15" -> "JUNE 15, 2019"
function formatDateLine(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]?.toUpperCase() ?? ""} ${d}, ${y}`.trim();
}

const THEME_STYLES: Record<StarMapTheme, ThemeStyle> = {
  midnight: {
    pageBackground: "#0b0e1a",
    border: "rgba(255,255,255,0.3)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.32)",
    compass: "rgba(255,255,255,0.55)",
    title: "#ffffff",
    message: "rgba(255,255,255,0.75)",
    caption: "rgba(255,255,255,0.55)",
  },
  "deep-blue": {
    // Warm navy-slate, not near-black -- matches the reference creative
    // (creative-2-1x1-1789302792119.png) rather than the previous near-navy
    // that read closer to "midnight". Cream text (not white) throughout,
    // per the same reference.
    pageBackground: "#212b3f",
    border: "rgba(244,234,214,0.3)",
    star: "#ffffff",
    line: "rgba(244,234,214,0.32)",
    compass: "rgba(244,234,214,0.55)",
    title: "#f0e4c8",
    message: "rgba(240,228,200,0.8)",
    caption: "rgba(240,228,200,0.65)",
  },
  black: {
    pageBackground: "#000000",
    border: "rgba(255,255,255,0.28)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.3)",
    compass: "rgba(255,255,255,0.5)",
    title: "#ffffff",
    message: "rgba(255,255,255,0.75)",
    caption: "rgba(255,255,255,0.55)",
  },
  ivory: {
    pageBackground: "#f6f1e7",
    border: "rgba(30,26,20,0.35)",
    star: "#1e1a14",
    line: "rgba(30,26,20,0.4)",
    compass: "rgba(30,26,20,0.5)",
    title: "#1e1a14",
    message: "rgba(30,26,20,0.72)",
    caption: "rgba(30,26,20,0.55)",
  },
  galaxy: {
    // Real Milky Way astrophotography (Gemini-generated once, cached to
    // /public/images/star-map/milky-way-bg.png) instead of a flat gradient
    // approximation -- the gradient read as "fake"/too-perfect. pageBackground
    // stays as a dark fallback tone in case the file is ever missing.
    pageBackground: "#0a0a14",
    backgroundImage: "/images/star-map/milky-way-bg.png",
    // Same deep-blue disc as the "deep-blue" theme's page, sitting on top of
    // the Milky Way photo -- the photo only shows through the margin
    // around the circle, not behind the star chart itself.
    circleFill: "#212b3f",
    border: "rgba(244,234,214,0.35)",
    star: "#ffffff",
    line: "rgba(244,234,214,0.3)",
    compass: "rgba(244,234,214,0.6)",
    title: "#f0e4c8",
    message: "rgba(240,228,200,0.85)",
    caption: "rgba(240,228,200,0.65)",
  },
  "white-circle": {
    // White page, the star circle itself filled as a near-black disc --
    // two-tone, like a photo mounted on white matting.
    pageBackground: "#ffffff",
    circleFill: "#111111",
    border: "rgba(255,255,255,0.4)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.35)",
    compass: "rgba(20,20,20,0.55)",
    title: "#1a1a1a",
    message: "rgba(26,26,26,0.72)",
    caption: "rgba(26,26,26,0.55)",
  },
  "white-lines": {
    // Fully white, minimal -- thin dark linework directly on the page, no
    // separate circle tone. The lightest, most minimal option.
    pageBackground: "#ffffff",
    border: "rgba(20,20,20,0.3)",
    star: "#1a1a1a",
    line: "rgba(20,20,20,0.38)",
    compass: "rgba(20,20,20,0.5)",
    title: "#1a1a1a",
    message: "rgba(26,26,26,0.72)",
    caption: "rgba(26,26,26,0.55)",
  },
};

// 16-point compass rose, 0deg = North = top, increasing clockwise (standard
// bearing convention) -- matches the reference's "North"/"South" spelled out
// at the cardinals, abbreviated elsewhere.
const COMPASS_POINTS = [
  { angle: 0, label: "North" },
  { angle: 22.5, label: "NNE" },
  { angle: 45, label: "NE" },
  { angle: 67.5, label: "ENE" },
  { angle: 90, label: "East" },
  { angle: 112.5, label: "ESE" },
  { angle: 135, label: "SE" },
  { angle: 157.5, label: "SSE" },
  { angle: 180, label: "South" },
  { angle: 202.5, label: "SSW" },
  { angle: 225, label: "SW" },
  { angle: 247.5, label: "WSW" },
  { angle: 270, label: "West" },
  { angle: 292.5, label: "WNW" },
  { angle: 315, label: "NW" },
  { angle: 337.5, label: "NNW" },
];

// Point on a circle of radius r (viewBox units, center 50,50) at compass
// bearing `angleDeg` (0 = up/North, clockwise).
function pointOnRing(angleDeg: number, r: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 50 + r * Math.sin(rad), y: 50 - r * Math.cos(rad) };
}

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
  size: { width: number; height: number } = { width: 1200, height: 1500 },
): Promise<Buffer> {
  const date = toDate(personalization);
  const stars = projectVisibleStars(
    date,
    personalization.lat,
    personalization.lon,
  );
  const backgroundStars = projectBackgroundStars(
    date,
    personalization.lat,
    personalization.lon,
  );
  const lines = projectConstellationLines(
    date,
    personalization.lat,
    personalization.lon,
  );
  const theme = THEME_STYLES[personalization.theme ?? "galaxy"];

  // The whole compass -- star circle + tick marks + labels -- now lives in
  // one 100x100-unit viewBox, center (50,50). Radii below are fractions of
  // that, so they scale automatically with compassSize.
  // Band width (star circle edge to outer ring) is deliberately narrow --
  // tuned to read as ~2-3cm on a real print, not a wide margin eating into
  // the star field -- so the star circle itself gets most of the space.
  const STAR_R = 44; // star chart circle
  const TICK_R1 = 44.4; // tick marks sit just outside the star circle
  const TICK_MINOR_R2 = 44.9;
  const TICK_MAJOR_R2 = 45.6;
  const DEGREE_LABEL_R = 46.5;
  const OUTER_RING_R = 49.5;
  // Now sits outside the outer ring (49.5) rather than just inside it --
  // each label is also rotated tangent to the circle (see COMPASS_POINTS
  // render below), so it reads like text curved around the ring rather than
  // upright text stacked on top of it. Kept close (49.5 -> 51.5, a tight
  // ~2-unit gap) rather than floating further out in the page margin.
  const DIRECTION_LABEL_R = 51.5;
  const STAR_SCALE = STAR_R / 32; // keep star point sizes visually consistent as STAR_R changes

  // BUG FIX: this used to be `Math.min(size.width, size.height * 0.72)` --
  // it never subtracted the page's own 48px padding, so on narrower renders
  // the circle could be wider than the space actually available for it and
  // overflow past the intended margin (visible as the circle nearly
  // touching or crossing the frame edge). Now sized off the real available
  // width, with room reserved below for the (now larger, ring-inclusive)
  // compass and the title/caption text under it.
  const PAGE_PADDING = 48;
  const compassSize = Math.min(
    size.width - PAGE_PADDING * 2,
    size.height * 0.62,
  );

  // Star positions arrive as 0..1 fractions of the *old* full-square disc;
  // remap that same relative offset-from-center into the smaller STAR_R
  // circle instead of the full 0..100 viewBox.
  const toViewX = (fracX: number) => 50 + (fracX - 0.5) * 2 * STAR_R;
  const toViewY = (fracY: number) => 50 + (fracY - 0.5) * 2 * STAR_R;

  const minorTickPath = Array.from({ length: 72 }, (_, i) => i * 5)
    .filter((deg) => deg % 30 !== 0)
    .map((deg) => {
      const p1 = pointOnRing(deg, TICK_R1);
      const p2 = pointOnRing(deg, TICK_MINOR_R2);
      return `M${p1.x},${p1.y}L${p2.x},${p2.y}`;
    })
    .join(" ");
  const majorTickPath = Array.from({ length: 12 }, (_, i) => i * 30)
    .map((deg) => {
      const p1 = pointOnRing(deg, TICK_R1);
      const p2 = pointOnRing(deg, TICK_MAJOR_R2);
      return `M${p1.x},${p1.y}L${p2.x},${p2.y}`;
    })
    .join(" ");

  const image = new ImageResponse(
    <div
      style={{
        width: size.width,
        height: size.height,
        position: "relative",
        display: "flex",
        background: theme.pageBackground,
      }}
    >
      {theme.backgroundImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- Satori (next/og) requires a plain <img>, not next/image
        <img
          src={backgroundImageDataUri(theme.backgroundImage)}
          alt=""
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: size.width,
            height: size.height,
            objectFit: "cover",
          }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: PAGE_PADDING,
        }}
      >
        <div
          style={{
            width: compassSize,
            height: compassSize,
            position: "relative",
            display: "flex",
            marginTop: 24,
          }}
        >
          <svg
            width={compassSize}
            height={compassSize}
            viewBox="0 0 100 100"
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            {/* Two-tone themes (e.g. "white-circle"): fill the star disc a
                different tone than the page before anything else draws. */}
            {theme.circleFill ? (
              <circle cx={50} cy={50} r={STAR_R} fill={theme.circleFill} />
            ) : null}

            {/* Star circle boundary */}
            <circle
              cx={50}
              cy={50}
              r={STAR_R}
              fill="none"
              stroke={theme.border}
              strokeWidth={0.25}
            />

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
                d={lines
                  .map(
                    (seg) =>
                      `M${toViewX(seg.x1)},${toViewY(seg.y1)}L${toViewX(seg.x2)},${toViewY(seg.y2)}`,
                  )
                  .join(" ")}
                stroke={theme.line}
                strokeWidth={0.15}
                fill="none"
              />
            ) : null}

            {Object.entries(
              backgroundStars.reduce<Record<string, typeof backgroundStars>>(
                (buckets, star) => {
                  const bucket = (Math.round(star.mag * 2) / 2).toFixed(1); // group every 0.5 mag
                  (buckets[bucket] ??= []).push(star);
                  return buckets;
                },
                {},
              ),
            ).map(([bucket, group]) => {
              const mag = Number(bucket);
              const r = Math.max(0.08, 0.35 - mag * 0.045) * STAR_SCALE;
              const opacity = Math.max(0.25, 1 - mag / 5.5);
              const d = group
                .map((s) => {
                  const cx = toViewX(s.x);
                  const cy = toViewY(s.y);
                  return `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`;
                })
                .join(" ");
              return (
                <path
                  key={`bg-${bucket}`}
                  d={d}
                  fill={theme.star}
                  opacity={opacity}
                />
              );
            })}

            {stars.map((star) => {
              const r = Math.max(0.3, 1.0 - star.mag * 0.22) * STAR_SCALE;
              return (
                <circle
                  key={star.name}
                  cx={toViewX(star.x)}
                  cy={toViewY(star.y)}
                  r={r}
                  fill={theme.star}
                  opacity={Math.max(0.75, 1 - star.mag / 6)}
                />
              );
            })}

            {/* Compass ring: tick marks + outer boundary. Satori (next/og's
                renderer) doesn't support SVG <text> at all ("please convert
                them to <path>") -- the degree/direction labels below are
                plain HTML divs absolutely positioned over this SVG instead,
                using the same pointOnRing() math converted to pixels. */}
            <path
              d={minorTickPath}
              stroke={theme.compass}
              strokeWidth={0.2}
              fill="none"
            />
            <path
              d={majorTickPath}
              stroke={theme.compass}
              strokeWidth={0.3}
              fill="none"
            />
            <circle
              cx={50}
              cy={50}
              r={OUTER_RING_R}
              fill="none"
              stroke={theme.compass}
              strokeWidth={0.25}
            />
          </svg>

          {Array.from({ length: 12 }, (_, i) => i * 30)
            // Skip the cardinals (0/90/180/270) -- at this band width a
            // degree number there would sit right on top of "North"/"East"/
            // "South"/"West", which already mark that same angle.
            .filter((deg) => deg % 90 !== 0)
            .map((deg) => {
              const p = pointOnRing(deg, DEGREE_LABEL_R);
              const fontSize = compassSize * 0.012;
              const boxW = compassSize * 0.05;
              const boxH = fontSize * 1.4;
              return (
                <div
                  key={`deg-${deg}`}
                  style={{
                    position: "absolute",
                    left: (p.x / 100) * compassSize - boxW / 2,
                    top: (p.y / 100) * compassSize - boxH / 2,
                    width: boxW,
                    height: boxH,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize,
                    color: theme.compass,
                  }}
                >
                  {deg}
                </div>
              );
            })}

          {COMPASS_POINTS.map((pt) => {
            const p = pointOnRing(pt.angle, DIRECTION_LABEL_R);
            const fontSize = compassSize * 0.0135;
            const boxW = compassSize * 0.095;
            const boxH = fontSize * 1.4;
            // Tangent-to-circle rotation: North/South stay horizontal
            // (0deg), East/West stand fully sideways (90deg), everything
            // between follows the curve. Mirrored on the bottom half
            // (90deg < angle < 270deg) so South-side labels read normally
            // instead of upside-down -- same convention as text curved
            // around a badge/seal.
            const rotation =
              pt.angle > 90 && pt.angle < 270 ? pt.angle + 180 : pt.angle;
            return (
              <div
                key={pt.label}
                style={{
                  position: "absolute",
                  left: (p.x / 100) * compassSize - boxW / 2,
                  top: (p.y / 100) * compassSize - boxH / 2,
                  width: boxW,
                  height: boxH,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize,
                  letterSpacing: 0.5,
                  color: theme.compass,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {pt.label}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 30,
            fontWeight: 600,
            color: theme.title,
            letterSpacing: 3,
            textTransform: "uppercase",
            textAlign: "center",
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
              textAlign: "center",
              display: "flex",
            }}
          >
            {personalization.message}
          </div>
        ) : null}

        {/* Standardized 3-line block: TITLE (above) / DATE / PLACE -- every
            theme uses this same structure now, matching the reference
            creative (creative-2-1x1-1789302792119.png) rather than the
            previous single "Place — date" caption line. */}
        <div
          style={{
            marginTop: 20,
            fontSize: 19,
            fontWeight: 500,
            color: theme.caption,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {formatDateLine(personalization.date)}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 19,
            fontWeight: 500,
            color: theme.caption,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {personalization.locationLabel}
        </div>
      </div>
    </div>,
    { width: size.width, height: size.height },
  );

  const arrayBuffer = await image.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
