import { Horizon, Observer } from "astronomy-engine";
import { BRIGHT_STARS } from "./stars";
import backgroundStarsRaw from "./data/background-stars.json";
import constellationLinesRaw from "./data/constellation-lines.json";

export interface ProjectedStar {
  name: string;
  mag: number;
  x: number; // 0..1, projected position within the sky disc
  y: number; // 0..1
}

export interface ProjectedBackgroundStar {
  mag: number;
  x: number;
  y: number;
}

export interface ProjectedLineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ConstellationLinesGeoJSON {
  features: { geometry: { coordinates: [number, number][][] } }[];
}

/**
 * Projects a single (RA in degrees, Dec in degrees) sky coordinate as seen
 * from (lat, lon) at the given moment onto a zenith-centered
 * azimuthal-equidistant disc: the zenith (straight up) is the center, the
 * horizon is the edge, matching how a "the sky above you, right then" print
 * is conventionally drawn. `astronomy-engine`'s Horizon() takes RA in hours,
 * so raDeg is converted here.
 */
function projectPoint(
  date: Date,
  observer: Observer,
  raDeg: number,
  decDeg: number
): { x: number; y: number; visible: boolean } {
  const raHours = (((raDeg % 360) + 360) % 360) / 15;
  const horizontal = Horizon(date, observer, raHours, decDeg, "normal");
  if (horizontal.altitude <= 0) return { x: 0, y: 0, visible: false };

  const radius = (90 - horizontal.altitude) / 90; // 0 at zenith, 1 at horizon
  const azimuthRad = (horizontal.azimuth * Math.PI) / 180; // 0=N, 90=E, clockwise

  const x = 0.5 + 0.5 * radius * Math.sin(azimuthRad);
  const y = 0.5 - 0.5 * radius * Math.cos(azimuthRad);
  return { x, y, visible: true };
}

/**
 * Projects the catalog of bright, named stars as seen from (lat, lon) at the
 * given moment. Only stars above the horizon (altitude > 0) at that
 * moment/location are included.
 */
export function projectVisibleStars(date: Date, lat: number, lon: number): ProjectedStar[] {
  const observer = new Observer(lat, lon, 0);
  const projected: ProjectedStar[] = [];

  for (const star of BRIGHT_STARS) {
    const p = projectPoint(date, observer, star.ra * 15, star.dec);
    if (p.visible) projected.push({ name: star.name, mag: star.mag, x: p.x, y: p.y });
  }

  return projected;
}

/**
 * Projects a denser field of fainter real stars (magnitude <= 5.0, from the
 * d3-celestial catalog -- see data/NOTICE.md) for visual density/atmosphere,
 * on top of the named bright-star catalog above. Real catalog data, not
 * decorative noise -- keeps the "this is the actual sky" claim honest.
 */
export function projectBackgroundStars(date: Date, lat: number, lon: number): ProjectedBackgroundStar[] {
  const observer = new Observer(lat, lon, 0);
  const out: ProjectedBackgroundStar[] = [];

  for (const [raDeg, decDeg, mag] of backgroundStarsRaw as [number, number, number][]) {
    const p = projectPoint(date, observer, raDeg, decDeg);
    if (p.visible) out.push({ mag, x: p.x, y: p.y });
  }

  return out;
}

/**
 * Projects the IAU constellation figure lines (d3-celestial, see
 * data/NOTICE.md) visible above the horizon at the given moment. Segments
 * where either endpoint is below the horizon are dropped rather than drawn
 * to a wrapped/incorrect position.
 */
export function projectConstellationLines(date: Date, lat: number, lon: number): ProjectedLineSegment[] {
  const observer = new Observer(lat, lon, 0);
  const segments: ProjectedLineSegment[] = [];
  const data = constellationLinesRaw as unknown as ConstellationLinesGeoJSON;

  for (const feature of data.features) {
    for (const line of feature.geometry.coordinates) {
      let prev: { x: number; y: number; visible: boolean } | null = null;
      for (const [raDeg, decDeg] of line) {
        const p = projectPoint(date, observer, raDeg, decDeg);
        if (prev && prev.visible && p.visible) {
          segments.push({ x1: prev.x, y1: prev.y, x2: p.x, y2: p.y });
        }
        prev = p;
      }
    }
  }

  return segments;
}
