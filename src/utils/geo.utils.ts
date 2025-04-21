import * as wkx from 'wkx';

export const geoJsonToBase64 = (geoJson) => {
  const buffer = wkx.Geometry.parseGeoJSON(geoJson).toWkb();
  return buffer;
};

export const base64ToGeoJson = (base64) => {
  const buffer = Buffer.from(base64, 'base64');
  return wkx.Geometry.parse(buffer).toGeoJSON();
};
