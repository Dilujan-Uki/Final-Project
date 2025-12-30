// src/components/work/SriLankaMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../common/SrilankaMap.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sri Lanka popular destinations with coordinates
const sriLankaDestinations = [
  { id: 1, name: "Colombo", lat: 6.9271, lng: 79.8612, type: "city", guides: 45 },
  { id: 2, name: "Kandy", lat: 7.2906, lng: 80.6337, type: "cultural", guides: 32 },
  { id: 3, name: "Galle", lat: 6.0535, lng: 80.2210, type: "coastal", guides: 28 },
  { id: 4, name: "Sigiriya", lat: 7.9570, lng: 80.7603, type: "historical", guides: 18 },
  { id: 5, name: "Ella", lat: 6.8690, lng: 81.0463, type: "nature", guides: 22 },
  { id: 6, name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, type: "hill", guides: 25 },
  { id: 7, name: "Yala National Park", lat: 6.3665, lng: 81.5176, type: "wildlife", guides: 15 },
  { id: 8, name: "Anuradhapura", lat: 8.3114, lng: 80.4037, type: "historical", guides: 20 },
  { id: 9, name: "Mirissa", lat: 5.9467, lng: 80.4583, type: "beach", guides: 16 },
  { id: 10, name: "Polonnaruwa", lat: 7.9260, lng: 81.0000, type: "historical", guides: 14 },
];

// Custom marker icons
const createCustomIcon = (type) => {
  let color = '#2c5f2d'; // Default green
  
  switch(type) {
    case 'city': color = '#004E89'; break;
    case 'cultural': color = '#FF6B35'; break;
    case 'coastal': color = '#17B794'; break;
    case 'historical': color = '#8B4513'; break;
    case 'nature': color = '#2c5f2d'; break;
    case 'hill': color = '#6B8E23'; break;
    case 'wildlife': color = '#8B0000'; break;
    case 'beach': color = '#00BFFF'; break;
  }
  
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    ">📍</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const SriLankaMap = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [mapCenter] = useState([7.8731, 80.7718]); // Center of Sri Lanka
  const [mapZoom] = useState(7);

  // Fetch real weather data for Colombo (example)
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    // You can replace with actual API call
    const fetchColomboWeather = async () => {
      try {
        // For demo, using OpenWeatherMap - you'll need an API key
        // const response = await fetch(
        //   `https://api.openweathermap.org/data/2.5/weather?q=Colombo&appid=YOUR_API_KEY&units=metric`
        // );
        // const data = await response.json();
        
        // Mock data for now
        setWeather({
          temp: 28,
          condition: 'Sunny',
          humidity: 78,
          icon: '☀️'
        });
      } catch (error) {
        console.log('Using mock weather data');
        setWeather({
          temp: 28,
          condition: 'Sunny',
          humidity: 78,
          icon: '☀️'
        });
      }
    };
    
    fetchColomboWeather();
  }, []);

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="map-title">Explore Sri Lanka</h2>
        <p className="map-subtitle">Click on destinations to find local guides</p>
      </div>
      
      {/* Map Stats */}
      <div className="map-stats">
        <div className="stat-card">
          <span className="stat-number">{sriLankaDestinations.length}</span>
          <span className="stat-label">Destinations</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {sriLankaDestinations.reduce((sum, dest) => sum + dest.guides, 0)}
          </span>
          <span className="stat-label">Available Guides</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </div>
      
      {/* Interactive Map */}
      <div className="map-wrapper">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom}
          style={{ height: '500px', width: '100%', borderRadius: '12px' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          {/* Destination Markers */}
          {sriLankaDestinations.map(destination => (
            <Marker
              key={destination.id}
              position={[destination.lat, destination.lng]}
              icon={createCustomIcon(destination.type)}
              eventHandlers={{
                click: () => setSelectedDestination(destination),
              }}
            >
              <Popup>
                <div className="popup-content">
                  <h3 className="popup-title">{destination.name}</h3>
                  <p className="popup-type">📍 {destination.type.charAt(0).toUpperCase() + destination.type.slice(1)} Destination</p>
                  <p className="popup-guides">👨‍🏫 {destination.guides} Guides Available</p>
                  <button 
                    className="popup-button"
                    onClick={() => window.location.href = `/guides?location=${destination.name}`}
                  >
                    Find Guides in {destination.name}
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
        <div className="destination-grid">
          {sriLankaDestinations.map(dest => (
            <div 
              key={dest.id}
              className={`destination-item ${selectedDestination?.id === dest.id ? 'selected' : ''}`}
              onClick={() => setSelectedDestination(dest)}
            >
              <span className="dest-name">{dest.name}</span>
              <span className="dest-guides">{dest.guides} guides</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Weather Info */}
      {weather && (
        <div className="weather-info">
          <div className="weather-icon">{weather.icon}</div>
          <div className="weather-details">
            <p className="weather-temp">{weather.temp}°C</p>
            <p className="weather-condition">{weather.condition} in Colombo</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SriLankaMap;