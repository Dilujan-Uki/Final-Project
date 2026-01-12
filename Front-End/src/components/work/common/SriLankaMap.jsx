// src/components/work/common/SriLankaMap.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SrilankaMap.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SriLankaMap = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Sri Lanka destinations with real coordinates
  const destinations = [
    { id: 1, name: "Colombo", lat: 6.9271, lng: 79.8612, guides: 45, type: "city" },
    { id: 2, name: "Kandy", lat: 7.2906, lng: 80.6337, guides: 32, type: "cultural" },
    { id: 3, name: "Galle", lat: 6.0535, lng: 80.2210, guides: 28, type: "coastal" },
    { id: 4, name: "Sigiriya", lat: 7.9570, lng: 80.7603, guides: 18, type: "historical" },
    { id: 5, name: "Ella", lat: 6.8690, lng: 81.0463, guides: 22, type: "nature" },
    { id: 6, name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, guides: 25, type: "hill" },
    { id: 7, name: "Yala National Park", lat: 6.3665, lng: 81.5176, guides: 15, type: "wildlife" },
    { id: 8, name: "Anuradhapura", lat: 8.3114, lng: 80.4037, guides: 20, type: "historical" },
    { id: 9, name: "Mirissa", lat: 5.9467, lng: 80.4583, guides: 16, type: "beach" },
    { id: 10, name: "Polonnaruwa", lat: 7.9260, lng: 81.0000, guides: 14, type: "historical" }
  ];

  // Sri Lanka center coordinates
  const center = [7.8731, 80.7718];
  const zoom = 7;

  // Custom icon for markers
  const createCustomIcon = (type) => {
    let iconColor = '#2c5f2d';
    
    switch(type) {
      case 'city': iconColor = '#004E89'; break;
      case 'cultural': iconColor = '#FF6B35'; break;
      case 'coastal': iconColor = '#17B794'; break;
      case 'historical': iconColor = '#8B4513'; break;
      case 'nature': iconColor = '#2c5f2d'; break;
      case 'hill': iconColor = '#6B8E23'; break;
      case 'wildlife': iconColor = '#8B0000'; break;
      case 'beach': iconColor = '#00BFFF'; break;
    }
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${iconColor};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: bold;
        ">
          📍
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  };

  return (
    <div className="sri-lanka-map">
      <div className="map-container">
        <div className="map-header">
          <h2 className="map-title">Explore Sri Lanka</h2>
          <p className="map-subtitle">Click on any destination to find local guides</p>
        </div>
        
        {/* Interactive Map */}
        <div className="map-visual">
          <MapContainer 
            center={center} 
            zoom={zoom}
            style={{ height: '400px', width: '100%', borderRadius: '12px' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Destination Markers */}
            {destinations.map(destination => (
              <Marker
                key={destination.id}
                position={[destination.lat, destination.lng]}
                icon={createCustomIcon(destination.type)}
                eventHandlers={{
                  click: () => setSelectedDestination(destination),
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <h3>{destination.name}</h3>
                    <p>📍 {destination.type} Destination</p>
                    <p>👨‍🏫 {destination.guides} Guides Available</p>
                    <button 
                      className="popup-btn"
                      onClick={() => window.location.href = `/guides?location=${destination.name}`}
                    >
                      Find Guides
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* Destination List */}
        <div className="destination-list">
          <h3 className="list-title">Popular Destinations</h3>
          <div className="destinations-grid">
            {destinations.map(dest => (
              <div 
                key={dest.id} 
                className={`destination-item ${selectedDestination?.id === dest.id ? 'selected' : ''}`}
                onClick={() => setSelectedDestination(dest)}
              >
                <div className="dest-info">
                  <span className="dest-icon">
                    {dest.type === 'city' ? '🏙️' : 
                     dest.type === 'cultural' ? '🏛️' :
                     dest.type === 'coastal' ? '🏖️' :
                     dest.type === 'historical' ? '🏺' :
                     dest.type === 'nature' ? '🌳' :
                     dest.type === 'hill' ? '⛰️' :
                     dest.type === 'wildlife' ? '🐘' :
                     dest.type === 'beach' ? '🌊' : '📍'}
                  </span>
                  <div>
                    <div className="dest-name">{dest.name}</div>
                    <div className="dest-type">{dest.type}</div>
                  </div>
                </div>
                <div className="dest-guides">{dest.guides} guides</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Selected Destination Details */}
        {selectedDestination && (
          <div className="selected-destination">
            <h3 className="selected-title">{selectedDestination.name}</h3>
            <div className="selected-details">
              <div className="detail">
                <span className="label">Type:</span>
                <span className="value">{selectedDestination.type}</span>
              </div>
              <div className="detail">
                <span className="label">Coordinates:</span>
                <span className="value">{selectedDestination.lat.toFixed(4)}°N, {selectedDestination.lng.toFixed(4)}°E</span>
              </div>
              <div className="detail">
                <span className="label">Available Guides:</span>
                <span className="value">{selectedDestination.guides} guides</span>
              </div>
            </div>
            <button 
              className="find-guides-btn"
              onClick={() => window.location.href = `/guides?location=${selectedDestination.name}`}
            >
              Find Guides in {selectedDestination.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SriLankaMap;