// Film-still reference: https://fr.web.img3.acsta.net/newsv7/16/05/31/11/51/3941090.jpg
// Radius / height, from the lower contact point to the narrow, flat-ended upper tip.
export const topProfile = [
  [0, 0], [.025, .015], [.06, .055], [.10, .13], [.14, .22],
  [.18, .32], [.21, .40], [.25, .46], [.32, .50], [.43, .525],
  [.58, .544], [.72, .557], [.82, .568], [.85, .58], [.853, .588],
  [.84, .599], [.78, .615], [.68, .641], [.56, .678], [.44, .722],
  [.34, .768], [.26, .822], [.205, .89], [.166, .985], [.135, 1.1],
  [.109, 1.24], [.086, 1.4], [.065, 1.56], [.046, 1.72],
  [.034, 1.84], [.032, 1.88], [0, 1.88],
] as const;

// At rest, the lower point and the outer rim both touch the surface.
export const topRestAngle = Math.atan(.588 / .853);
