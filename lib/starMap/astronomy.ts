import { Horizon, Observer } from "astronomy-engine";
import { BRIGHT_STARS } from "./stars";

export interface ProjectedStar {
  name: string;
  mag: number;
  x: number; // 0..1, projected position within the sky disc
  y: number; // 0..1
}

/**
 * Projects the catalog of bright stars as seen from (lat, lon) at the given
 * moment onto a zenith-centered azimuthal-equidistant disc: the zenith
 * (straight up) is the center, the horizon is the edge, matching how a
 * "the sky above you, right then" print is conventionally drawn. Only stars
 * above the horizon (altitude > 0) at that moment/location are included.
 */
export function projectVisibleStars(date: Date, lat: number, lon: number): ProjectedStar[] {
  const observer = new Observer(lat, lon, 0);
  const projected: ProjectedStar[] = [];

  for (const star of BRIGHT_STARS) {
    const horizontal = Horizon(date, observer, star.ra, star.dec, "normal");
    if (horizontal.altitude <= 0) continue; // below the horizon at this moment

    const radius = (90 - horizontal.altitude) / 90; // 0 at zenith, 1 at horizon
    const azimuthRad = (horizontal.azimuth * Math.PI) / 180; // 0=N, 90=E, clockwise

    const x = 0.5 + 0.5 * radius * Math.sin(azimuthRad);
    const y = 0.5 - 0.5 * radius * Math.cos(azimuthRad);

    projected.push({ name: star.name, mag: star.mag, x, y });
  }

  return projected;
}
