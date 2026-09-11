// A compact catalog of ~50 of the brightest, most recognizable naked-eye
// stars, spanning both hemispheres — enough for a decorative "sky at a
// moment/place" print without needing a full star catalog dependency.
// Coordinates are approximate J2000 RA (decimal hours) / Dec (decimal
// degrees), hand-compiled from general astronomical reference. This is
// deliberately time-boxed per the build plan (the checkout/fulfillment
// pipeline doesn't depend on chart precision) — verify against a proper
// catalog (e.g. the Yale Bright Star Catalog) before treating positions as
// print-accurate to arcminute precision.
export interface CatalogStar {
  name: string;
  ra: number; // hours
  dec: number; // degrees
  mag: number; // apparent magnitude, lower = brighter
}

export const BRIGHT_STARS: CatalogStar[] = [
  { name: "Sirius", ra: 6.7522, dec: -16.7161, mag: -1.46 },
  { name: "Canopus", ra: 6.3992, dec: -52.6956, mag: -0.74 },
  { name: "Alpha Centauri", ra: 14.66, dec: -60.8322, mag: -0.27 },
  { name: "Arcturus", ra: 14.261, dec: 19.1825, mag: -0.05 },
  { name: "Vega", ra: 18.6156, dec: 38.7837, mag: 0.03 },
  { name: "Capella", ra: 5.2782, dec: 45.998, mag: 0.08 },
  { name: "Rigel", ra: 5.2423, dec: -8.2016, mag: 0.13 },
  { name: "Procyon", ra: 7.655, dec: 5.225, mag: 0.34 },
  { name: "Betelgeuse", ra: 5.9195, dec: 7.4071, mag: 0.5 },
  { name: "Achernar", ra: 1.6286, dec: -57.2367, mag: 0.46 },
  { name: "Hadar", ra: 14.0637, dec: -60.373, mag: 0.61 },
  { name: "Altair", ra: 19.8464, dec: 8.8683, mag: 0.76 },
  { name: "Aldebaran", ra: 4.5987, dec: 16.5093, mag: 0.85 },
  { name: "Antares", ra: 16.4901, dec: -26.432, mag: 0.96 },
  { name: "Spica", ra: 13.4199, dec: -11.1613, mag: 1.04 },
  { name: "Pollux", ra: 7.7553, dec: 28.0262, mag: 1.14 },
  { name: "Fomalhaut", ra: 22.9608, dec: -29.6222, mag: 1.16 },
  { name: "Deneb", ra: 20.6905, dec: 45.2803, mag: 1.25 },
  { name: "Mimosa", ra: 12.7953, dec: -59.6888, mag: 1.25 },
  { name: "Regulus", ra: 10.1395, dec: 11.9672, mag: 1.35 },
  { name: "Adhara", ra: 6.977, dec: -28.9721, mag: 1.5 },
  { name: "Castor", ra: 7.5766, dec: 31.8883, mag: 1.58 },
  { name: "Gacrux", ra: 12.5194, dec: -57.1133, mag: 1.63 },
  { name: "Shaula", ra: 17.5601, dec: -37.1038, mag: 1.63 },
  { name: "Bellatrix", ra: 5.4188, dec: 6.3497, mag: 1.64 },
  { name: "Elnath", ra: 5.4382, dec: 28.6075, mag: 1.65 },
  { name: "Alnilam", ra: 5.6036, dec: -1.2019, mag: 1.69 },
  { name: "Alnair", ra: 22.1372, dec: -46.9611, mag: 1.73 },
  { name: "Alioth", ra: 12.9006, dec: 55.9598, mag: 1.76 },
  { name: "Alnitak", ra: 5.6793, dec: -1.9426, mag: 1.79 },
  { name: "Dubhe", ra: 11.0621, dec: 61.7511, mag: 1.79 },
  { name: "Mirfak", ra: 3.4054, dec: 49.8612, mag: 1.79 },
  { name: "Wezen", ra: 7.1398, dec: -26.3932, mag: 1.83 },
  { name: "Kaus Australis", ra: 18.4028, dec: -34.3846, mag: 1.85 },
  { name: "Alkaid", ra: 13.7923, dec: 49.3133, mag: 1.86 },
  { name: "Menkalinan", ra: 5.9922, dec: 44.9474, mag: 1.9 },
  { name: "Alhena", ra: 6.6285, dec: 16.3993, mag: 1.93 },
  { name: "Peacock", ra: 20.4275, dec: -56.735, mag: 1.94 },
  { name: "Polaris", ra: 2.5303, dec: 89.2641, mag: 1.98 },
  { name: "Mirzam", ra: 6.3783, dec: -17.9559, mag: 1.98 },
  { name: "Alphard", ra: 9.4599, dec: -8.6586, mag: 1.98 },
  { name: "Hamal", ra: 2.1196, dec: 23.4624, mag: 2.0 },
  { name: "Diphda", ra: 0.7264, dec: -17.9866, mag: 2.04 },
  { name: "Nunki", ra: 18.9211, dec: -26.2967, mag: 2.05 },
  { name: "Menkent", ra: 14.1113, dec: -36.3699, mag: 2.06 },
  { name: "Mirach", ra: 1.1623, dec: 35.6206, mag: 2.07 },
  { name: "Alpheratz", ra: 0.1398, dec: 29.0904, mag: 2.07 },
  { name: "Kochab", ra: 14.8451, dec: 74.1555, mag: 2.07 },
  { name: "Saiph", ra: 5.7959, dec: -9.6696, mag: 2.09 },
  { name: "Almach", ra: 2.065, dec: 42.3297, mag: 2.1 },
  { name: "Rasalhague", ra: 17.5822, dec: 12.5601, mag: 2.08 },
  { name: "Algol", ra: 3.1361, dec: 40.9556, mag: 2.12 },
  { name: "Denebola", ra: 11.8177, dec: 14.572, mag: 2.14 },
  { name: "Naos", ra: 8.0592, dec: -40.0031, mag: 2.21 },
];
