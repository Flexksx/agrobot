import React, { useState, useEffect } from 'react';
import AgroBot from '../models/AgroBot';
import DataService from '../services/DataService';

const MapView = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [agroBot, setAgroBot] = useState(new AgroBot());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default coordinates for Chișinău if no bot coordinates available
  const defaultLat = 47.0105;
  const defaultLng = 28.8638;
  
  // Get center coordinates from AgroBot or use default
  const getCenterCoordinates = () => {
    if (agroBot.coordinates && agroBot.coordinates.length > 0) {
      // If bot has multiple coordinates, use the first one as center or calculate centroid
      const firstCoord = agroBot.coordinates[0];
      return {
        lat: firstCoord.lat || firstCoord.latitude || defaultLat,
        lng: firstCoord.lng || firstCoord.lon || firstCoord.longitude || defaultLng
      };
    }
    return { lat: defaultLat, lng: defaultLng };
  };

  const centerCoords = getCenterCoordinates();
  const centerLat = centerCoords.lat;
  const centerLng = centerCoords.lng;

  // Load AgroBot data on component mount
  useEffect(() => {
    const loadBotData = async () => {
      try {
        setLoading(true);
        const botInstance = new AgroBot();
        await botInstance.fetchData();
        setAgroBot(botInstance);
        setError(null);
      } catch (err) {
        console.error('Failed to load AgroBot data:', err);
        setError('Failed to load robot data');
        // Create a bot with default coordinates for fallback
        const fallbackBot = new AgroBot();
        fallbackBot.initialize({
          id: 'offline',
          status: 'Offline',
          coordinates: [{ lat: defaultLat, lng: defaultLng, label: 'Default Location' }]
        });
        setAgroBot(fallbackBot);
      } finally {
        setLoading(false);
      }
    };

    loadBotData();

    // Set up periodic updates every 30 seconds
    const interval = setInterval(loadBotData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Create map points from AgroBot coordinates
  const createMapPoints = () => {
    const points = [];
    
    if (agroBot.coordinates && agroBot.coordinates.length > 0) {
      agroBot.coordinates.forEach((coord, index) => {
        const lat = coord.lat || coord.latitude;
        const lng = coord.lng || coord.lon || coord.longitude;
        
        if (lat && lng) {
          points.push({
            id: `bot-${index}`,
            lat: lat,
            lng: lng,
            color: agroBot.isActive() ? 'green' : agroBot.status === 'Charging' ? 'blue' : 'red',
            label: coord.label || `AgroBot Position ${index + 1}`,
            description: `Status: ${agroBot.status} | Battery: ${agroBot.battery}%`,
            isBot: true
          });
        }
      });
    }
    
    // Add fallback point if no valid coordinates found
    if (points.length === 0) {
      points.push({
        id: 'fallback',
        lat: centerLat,
        lng: centerLng,
        color: 'gray',
        label: 'No Bot Location',
        description: 'Robot coordinates not available',
        isBot: false
      });
    }

    return points;
  };

  const mapPoints = createMapPoints();

  // Convert lat/lng to pixel positions
  const latLngToPixel = (lat, lng) => {
    const mapWidth = 100;
    const mapHeight = 100;
    
    // Dynamic range based on coordinates spread or default small range
    let latRange = 0.02;
    let lngRange = 0.02;
    
    if (agroBot.coordinates && agroBot.coordinates.length > 1) {
      const lats = agroBot.coordinates.map(c => c.lat || c.latitude).filter(Boolean);
      const lngs = agroBot.coordinates.map(c => c.lng || c.lon || c.longitude).filter(Boolean);
      
      if (lats.length > 0 && lngs.length > 0) {
        latRange = Math.max(0.02, Math.max(...lats) - Math.min(...lats) + 0.01);
        lngRange = Math.max(0.02, Math.max(...lngs) - Math.min(...lngs) + 0.01);
      }
    }
    
    const x = ((lng - (centerLng - lngRange/2)) / lngRange) * mapWidth;
    const y = (((centerLat + latRange/2) - lat) / latRange) * mapHeight;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  if (loading) {
    return (
      <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center">
        <div className="text-white text-lg">Loading AgroBot location...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700">
      {/* Real Satellite Map Background */}
      <iframe
        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2719.8!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0"
      ></iframe>

      {/* Dark overlay to make points more visible */}
      <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none"></div>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
        🤖 AgroBot Tracker - {agroBot.isConnected ? 'Connected' : 'Offline'}
      </div>

      {/* Bot Status Display */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: agroBot.getStatusColor() }}
          ></div>
          <span>{agroBot.status}</span>
          <span className="text-gray-300">|</span>
          <span>🔋 {agroBot.battery}%</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-16 left-4 bg-red-600 bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Coordinate Points */}
      {mapPoints.map((point) => {
        const position = latLngToPixel(point.lat, point.lng);
        return (
          <div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 pointer-events-auto"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onMouseEnter={() => setHoveredPoint(point)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Point Marker */}
            <div className={`
              w-6 h-6 rounded-full border-3 border-white shadow-xl relative
              ${point.color === 'green' ? 'bg-green-500' : 
                point.color === 'blue' ? 'bg-blue-500' : 
                point.color === 'red' ? 'bg-red-500' : 
                point.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'}
              ${hoveredPoint?.id === point.id ? 'scale-150' : 'scale-100'}
              transition-all duration-300
            `}>
              {/* Bot Icon */}
              {point.isBot && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                  🤖
                </div>
              )}
            </div>
            
            {/* Pulsing Ring Animation for active bots */}
            {point.isBot && agroBot.isActive() && (
              <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-60"></div>
            )}
            
            {/* Info Popup */}
            {hoveredPoint?.id === point.id && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl text-sm whitespace-nowrap z-20 border border-gray-200 min-w-48">
                <div className="font-bold text-gray-900">{point.label}</div>
                <div className="text-gray-600 text-xs">{point.description}</div>
                {point.isBot && (
                  <div className="text-gray-500 text-xs mt-1">
                    <div>Pests: {agroBot.pests} | Dryness: {agroBot.dryness}%</div>
                    <div>Last Update: {agroBot.getTimeSinceUpdate()}</div>
                  </div>
                )}
                <div className="text-gray-500 text-xs">
                  {point.lat.toFixed(4)}°N, {point.lng.toFixed(4)}°E
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
              </div>
            )}
          </div>
        );
      })}

      {/* Scale and Info */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-8 h-0.5 bg-white"></div>
            <span>500m</span>
          </div>
          <div className="text-gray-300">Zoom: 15</div>
          <div className="text-gray-300">Points: {mapPoints.length}</div>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm">
        <div>Center: {centerLat.toFixed(4)}°N, {centerLng.toFixed(4)}°E</div>
        {agroBot.needsAttention() && (
          <div className="text-yellow-400 mt-1">⚠️ Needs Attention</div>
        )}
      </div>
    </div>
  );
};

export default MapView;