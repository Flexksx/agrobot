// src/models/AgroBot.js
import DataService from '../services/DataService';

class AgroBot {
  constructor() {
    this.id = null;
    this.status = 'Offline';
    this.battery = 0;
    this.pests = 0;
    this.dryness = 0;
    this.coordinates = [];
    this.pestCoordinates = []; // New property for pest coordinates
    this.lastUpdated = null;
    this.isConnected = false;
    
    // Additional properties from mock data
    this.sensors = {
      temperature: 0,
      humidity: 0,
      soilMoisture: 0
    };
    this.workArea = {
      totalArea: 0,
      coveredArea: 0,
      remainingArea: 0
    };
    this.alerts = [];
  }

  // Initialize bot data from API response
  initialize(data) {
    this.id = data.id || null;
    this.status = data.status || 'Offline';
    this.battery = data.battery || 0;
    this.pests = data.pests || 0;
    this.dryness = data.dryness || 0;
    this.coordinates = data.coordinates || [];
    this.pestCoordinates = data.pestCoordinates || []; // Initialize pest coordinates
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.sensors = data.sensors || this.sensors;
    this.workArea = data.workArea || this.workArea;
    this.alerts = data.alerts || [];
    this.isConnected = true;
    return this;
  }

  // Fetch bot data using DataService
  async fetchData() {
    try {
      const result = await DataService.getRobotStatus();
      
      if (result.success) {
        this.initialize(result.data);
        return this;
      } else {
        this.isConnected = false;
        throw new Error(result.error || 'Failed to fetch robot data');
      }
    } catch (error) {
      console.error('Failed to fetch robot data:', error);
      this.isConnected = false;
      throw error;
    }
  }

  // Send command using DataService
  async sendCommand(command) {
    try {
      const result = await DataService.sendCommand(command);
      
      if (result.success) {
        // Update local status if command was successful
        if (result.newStatus) {
          this.status = result.newStatus;
          this.lastUpdated = new Date().toISOString();
        }
      }
      
      return result;
    } catch (error) {
      console.error('Failed to send command:', error);
      throw error;
    }
  }

  // Update coordinates using DataService
  async updateCoordinates(newCoordinates) {
    try {
      const result = await DataService.updateCoordinates(newCoordinates);
      
      if (result.success) {
        this.coordinates = newCoordinates;
        this.lastUpdated = new Date().toISOString();
      }
      
      return result;
    } catch (error) {
      console.error('Failed to update coordinates:', error);
      throw error;
    }
  }

  // Get formatted data for components
  getFormattedData() {
    return {
      id: this.id,
      status: this.status,
      battery: this.battery,
      pests: this.pests,
      dryness: this.dryness,
      coordinates: this.coordinates,
      pestCoordinates: this.pestCoordinates, // Add pest coordinates to formatted data
      lastUpdated: this.lastUpdated,
      isConnected: this.isConnected,
      sensors: this.sensors,
      workArea: this.workArea,
      alerts: this.alerts
    };
  }

  // Check if robot is active
  isActive() {
    return this.status === 'Active' || this.status === 'Working';
  }

  // Check if robot needs attention (low battery, high pests, etc.)
  needsAttention() {
    return this.battery < 20 || this.pests > 10 || this.dryness > 80;
  }

  // Get status color for UI
  getStatusColor() {
    switch (this.status.toLowerCase()) {
      case 'active':
      case 'working':
        return '#4CAF50'; // Green
      case 'pause':
      case 'paused':
        return '#FF9800'; // Orange
      case 'charging':
        return '#2196F3'; // Blue
      case 'error':
      case 'offline':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  }

  // Get battery status
  getBatteryStatus() {
    if (this.battery > 60) return 'good';
    if (this.battery > 30) return 'medium';
    if (this.battery > 15) return 'low';
    return 'critical';
  }

  // Get work progress percentage
  getWorkProgress() {
    if (this.workArea.totalArea === 0) return 0;
    return Math.round((this.workArea.coveredArea / this.workArea.totalArea) * 100);
  }

  // Get time since last update
  getTimeSinceUpdate() {
    if (!this.lastUpdated) return 'Never';
    
    const now = new Date();
    const lastUpdate = new Date(this.lastUpdated);
    const diffInMinutes = Math.floor((now - lastUpdate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }

  // Get active alerts count
  getActiveAlertsCount() {
    return this.alerts.filter(alert => alert.type === 'warning' || alert.type === 'error').length;
  }

  // New method to get pest coordinates by severity
  getPestsBySeverity(severity) {
    return this.pestCoordinates.filter(pest => pest.severity === severity);
  }

  // New method to get all pest coordinates
  getAllPestCoordinates() {
    return this.pestCoordinates;
  }

  // New method to get current robot position
  getCurrentPosition() {
    return this.coordinates.length > 0 ? this.coordinates[0] : null;
  }
}

export default AgroBot;