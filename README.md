# 🗺️ Admin Dashboard - Full Stack Application

A modern admin dashboard for managing locations with geofences and checkpoints. Built with React (Vite), Node.js/Express, and MySQL.

## 📋 Features

### Location Management
- ✅ Create, read, and delete locations
- 🗺️ Draw polygon geofences on interactive map
- 📍 Store multiple geofence points with coordinates
- 📱 Support for UI coordinates (laptop & mobile)

### Checkpoint Management
- ✅ Create, read, and delete checkpoints
- 🔢 Sequence ordering for waypoints
- 📍 Latitude & longitude coordinates
- 📱 Device-specific UI coordinates

### User Interface
- 🎨 Modern responsive design
- 📱 Mobile-friendly layout
- 🧭 Interactive Leaflet map
- ⚡ Real-time updates with React Context

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Leaflet & React-Leaflet** for maps
- **Leaflet Draw** for polygon drawing

### Backend
- **Node.js** with ES Modules
- **Express** for REST API
- **MySQL2** for database
- **CORS** enabled
- **MVC Architecture**

### Database
- MySQL with 5 main tables:
  - `Locations` - Store location info
  - `Location_Geofence_Points` - Polygon vertices
  - `Location_UI_Coordinates` - UI placement
  - `Checkpoints` - Checkpoint data
  - `Checkpoint_UI_Coordinates` - UI placement

## 📁 Project Structure

```
AdminForAuto/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   ├── locationController.js
│   │   └── checkpointController.js
│   ├── models/
│   │   ├── locationModel.js     # DB queries for locations
│   │   └── checkpointModel.js   # DB queries for checkpoints
│   ├── routes/
│   │   ├── locationRoutes.js
│   │   └── checkpointRoute.js
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express app setup
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar/
    │   │   ├── LocationCard/
    │   │   └── CheckpointCard/
    │   ├── pages/
    │   │   ├── Locations/
    │   │   │   ├── Locations.jsx
    │   │   │   ├── AddLocationForm.jsx
    │   │   │   └── PolygonMap.jsx
    │   │   └── Checkpoints/
    │   │       ├── Checkpoints.jsx
    │   │       └── AddCheckpointForm.jsx
    │   ├── context/
    │   │   └── AppContext.jsx     # Global state management
    │   ├── services/
    │   │   └── api.js             # Axios API client
    │   ├── App.jsx                # Routing setup
    │   └── main.jsx               # App entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL (v8+)
- npm or yarn

### 1. Database Setup

Create these MySQL tables:

```sql
-- Locations table
CREATE TABLE Locations (
  location_id INT PRIMARY KEY AUTO_INCREMENT,
  location_name VARCHAR(255) NOT NULL,
  location_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Geofence points for locations
CREATE TABLE Location_Geofence_Points (
  point_id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  sequence_order INT DEFAULT 0,
  FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

-- UI coordinates for locations
CREATE TABLE Location_UI_Coordinates (
  ui_coord_id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  x_coordinate INT,
  y_coordinate INT,
  FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

-- Checkpoints table
CREATE TABLE Checkpoints (
  checkpoint_id INT PRIMARY KEY AUTO_INCREMENT,
  checkpoint_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  sequence_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UI coordinates for checkpoints
CREATE TABLE Checkpoint_UI_Coordinates (
  ui_coord_id INT PRIMARY KEY AUTO_INCREMENT,
  checkpoint_id INT NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  x_coordinate INT,
  y_coordinate INT,
  FOREIGN KEY (checkpoint_id) REFERENCES Checkpoints(checkpoint_id)
);
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# Verify DB credentials in .env:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=Nrk_23042005
# DB_NAME=auto_admin_dashboard
# PORT=5000

# Start backend server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5173
```

## 📡 API Endpoints

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get specific location
- `POST /api/locations` - Create new location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

**Create Location Body:**
```json
{
  "locationName": "Downtown Area",
  "locationDescription": "Central business district",
  "geofencePoints": [
    { "latitude": 28.6139, "longitude": 77.2090 },
    { "latitude": 28.6140, "longitude": 77.2091 },
    { "latitude": 28.6141, "longitude": 77.2092 }
  ],
  "uiCoordinates": [
    { "device_type": "laptop", "x_coordinate": 100, "y_coordinate": 200 }
  ]
}
```

### Checkpoints
- `GET /api/checkpoints` - Get all checkpoints
- `GET /api/checkpoints/:id` - Get specific checkpoint
- `POST /api/checkpoints` - Create new checkpoint
- `PUT /api/checkpoints/:id` - Update checkpoint
- `DELETE /api/checkpoints/:id` - Delete checkpoint

**Create Checkpoint Body:**
```json
{
  "checkpointName": "Entrance Gate",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "sequenceOrder": 1,
  "uiCoordinates": [
    { "device_type": "laptop", "x_coordinate": 100, "y_coordinate": 200 }
  ]
}
```

## 🎮 Usage Guide

### Adding a Location
1. Click "📍 Locations" in navbar
2. Click "+ Add Location" button
3. Fill in location name and description
4. Use the map to draw a polygon (click "Draw a shape" button in map controls)
5. Click "Create Location"

### Managing Locations
- View all locations with their geofence points
- Delete locations using the ✕ button
- Each location shows all polygon vertices and UI coordinates

### Managing Checkpoints
1. Click "📍 Checkpoints" in navbar
2. Click "+ Add Checkpoint" button
3. Fill in checkpoint details:
   - Name
   - Latitude (e.g., 28.6139)
   - Longitude (e.g., 77.2090)
   - Sequence order (0, 1, 2, ...)
4. Click "Create Checkpoint"

Checkpoints are automatically sorted by sequence order.

## 🎨 Styling

- Color scheme: Purple gradient (#667eea to #764ba2)
- Responsive design with mobile support
- Card-based layout for locations and checkpoints
- Interactive map with Leaflet

## 🔍 Key Technologies Used

### Frontend Libraries
- `leaflet` - Map rendering
- `react-leaflet` - React wrapper for Leaflet
- `leaflet-draw` - Interactive polygon drawing
- `axios` - HTTP client
- `react-router-dom` - Client-side routing

### Backend Libraries
- `express` - Web framework
- `mysql2/promise` - MySQL with Promise support
- `cors` - Cross-Origin requests
- `dotenv` - Environment variables

## 📝 Notes

- The app uses React Context for state management (no Redux needed)
- All API calls are centralized in `src/services/api.js`
- The backend uses connection pooling for optimal MySQL performance
- The map defaults to center of India; customize in `PolygonMap.jsx`
- Database tables support cascading deletes for data integrity

## 🐛 Troubleshooting

### Backend won't connect to database
- Check `.env` file has correct MySQL credentials
- Ensure MySQL server is running
- Verify database name matches
- Check MySQL user has proper permissions

### Map not loading
- Clear browser cache
- Check browser console for errors
- Ensure Leaflet and Leaflet-draw are properly installed
- Latest versions required

### API calls fail
- Check backend is running on port 5000
- Verify CORS is enabled
- Check network tab in browser console for error details
- Ensure Content-Type header is application/json

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

ISC

## 👨‍💻 Author

Admin Dashboard App

---

**Happy mapping! 🗺️**
