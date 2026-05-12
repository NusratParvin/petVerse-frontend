export const extractCoordsFromGoogleUrl = (url?: string) => {
  if (!url) return null;

  // matches the @lat,lng part in the URL
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!match) return null;
  return {
    lat: parseFloat(match[1]),
    lng: parseFloat(match[2]),
  };
};
