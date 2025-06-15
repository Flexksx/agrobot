import React, { useState, useEffect } from 'react';
import AgroBot from '../models/AgroBot';
import DataService from '../services/DataService';

const MapView = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [agroBot, setAgroBot] = useState(new AgroBot());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get center coordinates from AgroBot
  const getCenterCoordinates = () => {
    if (agroBot.coordinates && agroBot.coordinates.length > 0) {
      // If bot has multiple coordinates, use the first one as center or calculate centroid
      const firstCoord = agroBot.coordinates[0];
      return {
        lat: firstCoord.lat || firstCoord.latitude,
        lng: firstCoord.lng || firstCoord.lon || firstCoord.longitude
      };
    }
    return null; // Return null if no coordinates available
  };

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
        // Don't create fallback bot, let the component handle no coordinates
        const fallbackBot = new AgroBot();
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

  const centerCoords = getCenterCoordinates();
  
  // Don't render if no coordinates available
  if (!centerCoords) {
    return (
      <div className="relative w-full h-full min-h-[80vh] bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center">
        <div className="text-white text-lg">No robot coordinates available</div>
      </div>
    );
  }
  
  const centerLat = centerCoords.lat;
  const centerLng = centerCoords.lng;

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
        id: 'no-location',
        lat: 0,
        lng: 0,
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
      <div className="relative w-full h-full min-h-[80vh] bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center">
        <div className="text-white text-lg">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[80vh] bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700">
      {/* Real Satellite Map Background */}
      <iframe
        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2719.8!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1`}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '80vh' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0"
      ></iframe>

      {/* Dark overlay to make points more visible */}
      <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none"></div>

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
            </div>
            
            {/* Pulsing Ring Animation for active bots */}
            {point.isBot && agroBot.isActive() && (
              <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-60"></div>
            )}
          </div>
        );
      })}

      {/* Tooltip for hovered point */}
      {hoveredPoint && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg shadow-lg z-20 max-w-xs">
          <h3 className="font-semibold text-sm">{hoveredPoint.label}</h3>
          <p className="text-xs text-gray-300 mt-1">{hoveredPoint.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            Lat: {hoveredPoint.lat.toFixed(6)}, Lng: {hoveredPoint.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;