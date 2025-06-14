// src/services/DataService.js
import mockData from '../data/mockData.json'; // Adjust path as needed

class DataService {
  constructor() {
    // Set this to true to use mock data, false for real backend
    this.USE_MOCK_DATA = true;
    this.BASE_URL = 'http://localhost:3001/api'; // Your colleague's backend URL
    this.MOCK_DATA_PATH = '/mockData.json'; // Path to your mock data file
  }

  // Main method to get robot status
  async getRobotStatus() {
    if (this.USE_MOCK_DATA) {
      return this.getMockRobotStatus();
    } else {
      return this.getRealRobotStatus();
    }
  }

  // Mock data method - uses imported JSON
  async getMockRobotStatus() {
    try {
      // Simulate network delay
      await this.delay(300 + Math.random() * 200);
      
      return {
        success: true,
        data: mockData
      };
    } catch (error) {
      console.error('Failed to load mock data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Real backend method (for when your colleague is ready)
  async getRealRobotStatus() {
    try {
      const response = await fetch(`${this.BASE_URL}/robot/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Failed to fetch from backend:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send command to robot
  async sendCommand(command) {
    if (this.USE_MOCK_DATA) {
      return this.sendMockCommand(command);
    } else {
      return this.sendRealCommand(command);
    }
  }

  // Mock command method
  async sendMockCommand(command) {
    await this.delay(500);
    
    console.log(`Mock: Executing command "${command}"`);
    
    // Simulate command execution
    const validCommands = ['start', 'resume', 'pause', 'stop', 'charge'];
    
    if (!validCommands.includes(command.toLowerCase())) {
      return {
        success: false,
        error: `Unknown command: ${command}`
      };
    }
    
    return {
      success: true,
      message: `Command "${command}" executed successfully`,
      newStatus: this.getNewStatusForCommand(command)
    };
  }

  // Helper method to determine new status based on command
  getNewStatusForCommand(command) {
    switch (command.toLowerCase()) {
      case 'start':
      case 'resume':
        return 'Active';
      case 'pause':
        return 'Pause';
      case 'stop':
        return 'Offline';
      case 'charge':
        return 'Charging';
      default:
        return 'Unknown';
    }
  }

  // Real command method
  async sendRealCommand(command) {
    try {
      const response = await fetch(`${this.BASE_URL}/robot/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send command to backend:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update coordinates
  async updateCoordinates(coordinates) {
    if (this.USE_MOCK_DATA) {
      return this.updateMockCoordinates(coordinates);
    } else {
      return this.updateRealCoordinates(coordinates);
    }
  }

  // Mock coordinates update
  async updateMockCoordinates(coordinates) {
    await this.delay(400);
    
    console.log('Mock: Coordinates updated to:', coordinates);
    
    return {
      success: true,
      message: 'Coordinates updated successfully'
    };
  }

  // Real coordinates update
  async updateRealCoordinates(coordinates) {
    try {
      const response = await fetch(`${this.BASE_URL}/robot/coordinates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update coordinates:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper method to simulate network delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method to switch between mock and real data
  setDataSource(useMockData) {
    this.USE_MOCK_DATA = useMockData;
    console.log(`Data source switched to: ${useMockData ? 'Mock Data' : 'Real Backend'}`);
  }

  // Method to update backend URL
  setBackendUrl(url) {
    this.BASE_URL = url;
    console.log(`Backend URL updated to: ${url}`);
  }

  // Method to update mock data file path
  setMockDataPath(path) {
    this.MOCK_DATA_PATH = path;
    console.log(`Mock data path updated to: ${path}`);
  }
}

// Export singleton instance
export default new DataService();