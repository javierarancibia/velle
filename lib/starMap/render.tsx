import { ImageResponse } from "next/og";
import { projectVisibleStars } from "./astronomy";
import type { PersonalizationStarMap } from "../types";

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
  const discSize = Math.min(size.width, size.height * 0.72);

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
          background: "#0b0e1a",
          padding: 48,
        }}
      >
        <div
          style={{
            width: discSize,
            height: discSize,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.25)",
            position: "relative",
            display: "flex",
            marginTop: 24,
          }}
        >
          {stars.map((star) => {
            const dotSize = Math.max(1.5, 5 - star.mag);
            return (
              <div
                key={star.name}
                style={{
                  position: "absolute",
                  left: star.x * discSize - dotSize / 2,
                  top: star.y * discSize - dotSize / 2,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  background: "#ffffff",
                  opacity: Math.max(0.4, 1 - star.mag / 3),
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 42,
            color: "#ffffff",
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
              color: "rgba(255,255,255,0.75)",
              fontStyle: "italic",
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
            color: "rgba(255,255,255,0.55)",
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
