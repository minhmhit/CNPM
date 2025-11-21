import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMapPicker.css';

export default function RouteMapPicker({ onComplete, initialData }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [stopPoints, setStopPoints] = useState(initialData?.stop_points || []);
  const [startPoint, setStartPoint] = useState(initialData?.start_point || null);
  const [endPoint, setEndPoint] = useState(initialData?.end_point || null);
  const [mode, setMode] = useState('stop');

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;

    if (mode === 'start') {
      setStartPoint({ latitude: 10.7805, longitude: 106.64, stop_name: 'Điểm đầu' });
      setMode('stop');
    } else if (mode === 'end') {
      setEndPoint({ latitude: lat, longitude: lng, stop_name: 'Điểm cuối' });
      setMode('stop');
    } else if (mode === 'stop') {
      const newStop = { latitude: lat, longitude: lng, stop_name: `Điểm dừng ${stopPoints.length + 1}` };
      setStopPoints([...stopPoints, newStop]);
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current).setView([10.8231, 106.6797], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.off('click');
      mapInstanceRef.current.on('click', handleMapClick);
    }
  }, [mode, stopPoints]);

  useEffect(() => {
    clearMarkers();

    if (startPoint) {
      const marker = L.marker([startPoint.latitude, startPoint.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        }),
        title: 'Điểm đầu'
      }).addTo(mapInstanceRef.current);
      marker.bindPopup('Điểm đầu');
      markersRef.current.push(marker);
    }

    if (endPoint) {
      const marker = L.marker([endPoint.latitude, endPoint.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        }),
        title: 'Điểm cuối'
      }).addTo(mapInstanceRef.current);
      marker.bindPopup('Điểm cuối');
      markersRef.current.push(marker);
    }

    stopPoints.forEach((point, idx) => {
      const marker = L.marker([point.latitude, point.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        }),
        title: `Điểm dừng ${idx + 1}`
      }).addTo(mapInstanceRef.current);
      marker.bindPopup(`Điểm dừng ${idx + 1}`);
      markersRef.current.push(marker);
    });
  }, [startPoint, endPoint, stopPoints]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const handleRemoveStop = (idx) => {
    setStopPoints(stopPoints.filter((_, i) => i !== idx));
  };

  const handleClearStart = () => setStartPoint(null);
  const handleClearEnd = () => setEndPoint(null);

  const handleComplete = () => {
    if (!startPoint || !endPoint) {
      alert('Vui lòng chọn điểm đầu và điểm cuối!');
      return;
    }
    onComplete({ startPoint, endPoint, stopPoints });
  };

  return (
    <div className="route-map-picker">
      <div className="map-container">
        <div ref={mapRef} className="map"></div>
      </div>

      <div className="map-controls">
        <div className="mode-selector">
          <label>Chọn điểm cho tuyến đường</label>
          <button
            className={`mode-btn ${mode === 'start' ? 'active' : ''}`}
            onClick={() => setMode('start')}
          >
            Điểm đầu
          </button>
          <button
            className={`mode-btn ${mode === 'end' ? 'active' : ''}`}
            onClick={() => setMode('end')}
          >
            Điểm cuối
          </button>
          <button
            className={`mode-btn ${mode === 'stop' ? 'active' : ''}`}
            onClick={() => setMode('stop')}
          >
            Điểm dừng
          </button>
        </div>

        <div className="selected-points">
          <div className="point-info">
            <h4>Điểm đầu</h4>
            {startPoint ? (
              <div className="point-item">
                <span>{startPoint.latitude.toFixed(4)}, {startPoint.longitude.toFixed(4)}</span>
                <button onClick={handleClearStart} className="remove-btn">✕</button>
              </div>
            ) : (
              <p className="placeholder">Chưa chọn</p>
            )}
          </div>

          <div className="point-info">
            <h4>Điểm cuối</h4>
            {endPoint ? (
              <div className="point-item">
                <span>{endPoint.latitude.toFixed(4)}, {endPoint.longitude.toFixed(4)}</span>
                <button onClick={handleClearEnd} className="remove-btn">✕</button>
              </div>
            ) : (
              <p className="placeholder">Chưa chọn</p>
            )}
          </div>

          <div className="point-info">
            <h4>Điểm dừng ({stopPoints.length})</h4>
            <div className="stop-points-list">
              {stopPoints.length > 0 ? (
                stopPoints.map((point, idx) => (
                  <div key={idx} className="point-item">
                    <span>{point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}</span>
                    <button onClick={() => handleRemoveStop(idx)} className="remove-btn">✕</button>
                  </div>
                ))
              ) : (
                <p className="placeholder">Chưa có điểm dừng</p>
              )}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="complete-btn" onClick={handleComplete}> Hoàn tất</button>
        </div>
      </div>
    </div>
  );
}
