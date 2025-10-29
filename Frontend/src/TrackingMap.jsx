import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 10.762622,
  lng: 106.660172,
};

export default function TrackingMap() {
  const [marker, setMarker] = useState(null);

  const handleClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    console.log("📍 Kinh độ - Vĩ độ:", lat, lng);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyB8FQH6ZOUxtGEsaddoDxM3499xnXSvgrI">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onClick={handleClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>

      {marker && (
        <div style={{ marginTop: 10 }}>
          <b>Vĩ độ (lat):</b> {marker.lat} <br />
          <b>Kinh độ (lng):</b> {marker.lng}
        </div>
      )}
    </LoadScript>
  );
}
