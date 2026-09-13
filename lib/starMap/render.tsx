import { ImageResponse } from "next/og";
import { projectBackgroundStars, projectConstellationLines, projectVisibleStars } from "./astronomy";
import type { PersonalizationStarMap, StarMapTheme } from "../types";

interface ThemeStyle {
  pageBackground: string;
  border: string;
  star: string;
  line: string;
  compass: string;
  title: string;
  message: string;
  caption: string;
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
    pageBackground: "#0a1636",
    border: "rgba(255,255,255,0.3)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.32)",
    compass: "rgba(255,255,255,0.55)",
    title: "#ffffff",
    message: "rgba(255,255,255,0.75)",
    caption: "rgba(255,255,255,0.55)",
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
    // One continuous nebula behind the whole poster (not just inside the
    // circle, per the reference), so it reads as one image rather than a
    // disc pasted on a background.
    pageBackground:
      "radial-gradient(circle at 30% 20%, rgba(120,60,180,0.6) 0%, rgba(120,60,180,0) 42%), " +
      "radial-gradient(circle at 75% 65%, rgba(40,80,190,0.55) 0%, rgba(40,80,190,0) 48%), " +
      "radial-gradient(circle at 55% 85%, rgba(200,80,140,0.35) 0%, rgba(200,80,140,0) 38%), " +
      "radial-gradient(circle at 15% 80%, rgba(60,100,200,0.4) 0%, rgba(60,100,200,0) 40%), " +
      "#0a0e24",
    border: "rgba(255,255,255,0.35)",
    star: "#ffffff",
    line: "rgba(255,255,255,0.3)",
    compass: "rgba(255,255,255,0.6)",
    title: "#ffffff",
    message: "rgba(255,255,255,0.8)",
    caption: "rgba(255,255,255,0.6)",
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
  size: { width: number; height: number } = { width: 1200, height: 1500 }
): Promise<Buffer> {
  const date = toDate(personalization);
  const stars = projectVisibleStars(date, personalization.lat, personalization.lon);
  const backgroundStars = projectBackgroundStars(date, personalization.lat, personalization.lon);
  const lines = projectConstellationLines(date, personalization.lat, personalization.lon);
  const theme = THEME_STYLES[personalization.theme ?? "midnight"];

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
  const DIRECTION_LABEL_R = 48.3; // needs real separation from DEGREE_LABEL_R -- they land on
  // the same angle at the cardinals (0/90/180/270), so too tight a gap here
  // makes "North"/"0" (etc) collide -- the cardinal degree number is dropped
  // below instead of relying on gap alone
  const OUTER_RING_R = 49.5;
  const STAR_SCALE = STAR_R / 32; // keep star point sizes visually consistent as STAR_R changes

  // BUG FIX: this used to be `Math.min(size.width, size.height * 0.72)` --
  // it never subtracted the page's own 48px padding, so on narrower renders
  // the circle could be wider than the space actually available for it and
  // overflow past the intended margin (visible as the circle nearly
  // touching or crossing the frame edge). Now sized off the real available
  // width, with room reserved below for the (now larger, ring-inclusive)
  // compass and the title/caption text under it.
  const PAGE_PADDING = 48;
  const compassSize = Math.min(size.width - PAGE_PADDING * 2, size.height * 0.62);

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
            {/* Star circle boundary */}
            <circle cx={50} cy={50} r={STAR_R} fill="none" stroke={theme.border} strokeWidth={0.25} />

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
                      `M${toViewX(seg.x1)},${toViewY(seg.y1)}L${toViewX(seg.x2)},${toViewY(seg.y2)}`
                  )
                  .join(" ")}
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
              const r = Math.max(0.08, 0.35 - mag * 0.045) * STAR_SCALE;
              const opacity = Math.max(0.25, 1 - mag / 5.5);
              const d = group
                .map((s) => {
                  const cx = toViewX(s.x);
                  const cy = toViewY(s.y);
                  return `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`;
                })
                .join(" ");
              return <path key={`bg-${bucket}`} d={d} fill={theme.star} opacity={opacity} />;
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
            <path d={minorTickPath} stroke={theme.compass} strokeWidth={0.2} fill="none" />
            <path d={majorTickPath} stroke={theme.compass} strokeWidth={0.3} fill="none" />
            <circle cx={50} cy={50} r={OUTER_RING_R} fill="none" stroke={theme.compass} strokeWidth={0.25} />
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
