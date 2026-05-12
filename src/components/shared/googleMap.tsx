import React from "react";

type CoordProps = { lat: number; lon: number; clinicName: string };

const GoogleMap = ({ lat, lon, clinicName }: CoordProps) => {
  const src = `https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed`;

  return (
    <div>
      {" "}
      <iframe
        src={src}
        width="100%"
        height="220"
        style={{ border: 0 }}
        loading="lazy"
        title={`${clinicName} location`}
      />
    </div>
  );
};

export default GoogleMap;
