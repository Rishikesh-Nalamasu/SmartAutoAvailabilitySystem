# 🚀 Quick Setup Guide

## Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MySQL** v8+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** (comes with Node.js)

## Step 1: Database Setup

### Option 1: Using MySQL CLI

```bash
mysql -u root -p
```

Then paste this into MySQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS auto_admin_dashboard;
USE auto_admin_dashboard;

-- Locations table
CREATE TABLE IF NOT EXISTS Locations (
  location_id INT PRIMARY KEY AUTO_INCREMENT,
  location_name VARCHAR(255) NOT NULL,
  location_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Geofence points for locations
CREATE TABLE IF NOT EXISTS Location_Geofence_Points (
  point_id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  sequence_order INT DEFAULT 0,
  FOREIGN KEY (location_id) REFERENCES Locations(location_id) ON DELETE CASCADE
);

-- UI coordinates for locations
CREATE TABLE IF NOT EXISTS Location_UI_Coordinates (
  ui_coord_id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  x_coordinate INT,
  y_coordinate INT,
  FOREIGN KEY (location_id) REFERENCES Locations(location_id) ON DELETE CASCADE
);

-- Checkpoints table
CREATE TABLE IF NOT EXISTS Checkpoints (
  checkpoint_id INT PRIMARY KEY AUTO_INCREMENT,
  checkpoint_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  sequence_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UI coordinates for checkpoints
CREATE TABLE IF NOT EXISTS Checkpoint_UI_Coordinates (
  ui_coord_id INT PRIMARY KEY AUTO_INCREMENT,
  checkpoint_id INT NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  x_coordinate INT,
  y_coordinate INT,
  FOREIGN KEY (checkpoint_id) REFERENCES Checkpoints(checkpoint_id) ON DELETE CASCADE
);
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Create new query tab
3. Paste the SQL above
4. Execute

## Step 2: Backend Setup

### Windows
```bash
cd backend
npm install
```

### Linux/Mac
```bash
cd backend
npm install
```

### Verify .env file
Check that `backend/.env` has correct credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Nrk_23042005
DB_NAME=auto_admin_dashboard
PORT=5000
```

Adjust if your MySQL password is different.

### Start Backend
```bash
npm run dev
```

✅ Backend should be running on `http://localhost:5000`

## Step 3: Frontend Setup

### Open new terminal/PowerShell

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend should be running on `http://localhost:5173`

## Step 4: Verify Setup

1. Open browser and go to `http://localhost:5173`
2. You should see the Admin Dashboard with navigation to Locations and Checkpoints
3. Try navigating between pages

## 🎮 Quick Test

### Test Locations Page
1. Click on "📍 Locations" in navbar
2. Click "+ Add Location"
3. Enter location name and description
4. Click on the map to draw a polygon (use Draw Polygon tool)
5. Click "Create Location"
6. Location should appear below the form

### Test Checkpoints Page
1. Click on "📍 Checkpoints" in navbar
2. Click "+ Add Checkpoint"
3. Enter:
   - Checkpoint Name: `Test Checkpoint`
   - Latitude: `28.6139` (Delhi)
   - Longitude: `77.2090` (Delhi)
   - Sequence Order: `1`
4. Click "Create Checkpoint"
5. Checkpoint should appear below the form

## 📋 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Windows:
netstat -ano | findstr :5000

# Linux/Mac:
lsof -i :5000

# Kill the process and try again
```

### Database connection error
- Ensure MySQL is running
- Check username/password in .env
- Verify database name is correct
- Restart MySQL if needed

### Frontend shows error "Cannot find module"
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Map not showing
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check browser console for errors

## 🔧 Common Commands

```bash
# Terminal 1: Backend
cd backend
npm run dev        # Start development server
npm start          # Start production server
npm install        # Install dependencies

# Terminal 2: Frontend
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm install        # Install dependencies
```

## 📱 Accessing from Mobile/Another Device

### Get your machine's IP address

**Windows:**
```bash
ipconfig
# Look for IPv4 Address (usually 192.168.x.x)
```

**Linux/Mac:**
```bash
ifconfig
# Look for inet address
```

### Access frontend from other device
```
http://YOUR_IP:5173
```

### Backend API from other device
```
http://YOUR_IP:5000/api
```

## 🎨 Customization

### Change map center location
Edit `frontend/src/pages/Locations/PolygonMap.jsx`:
```javascript
<MapContainer
  center={[YOUR_LAT, YOUR_LNG]}  // Change this
  zoom={5}
  className="polygon-map"
  ref={mapRef}
>
```

### Change colors
Edit CSS files in `src/components/` and `src/pages/`

### Change API base URL
Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = "http://YOUR_SERVER:5000/api";
```

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Leaflet Documentation](https://leafletjs.com/)

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Check backend terminal for error messages
3. Verify database connection
4. Check network tab in DevTools for API errors
5. Review README.md for detailed information

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] MySQL server running
- [ ] Database created with tables
- [ ] Backend dependencies installed
- [ ] Backend .env file configured
- [ ] Backend server running (http://localhost:5000)
- [ ] Frontend dependencies installed
- [ ] Frontend server running (http://localhost:5173)
- [ ] Dashboard loads in browser
- [ ] Can create a location
- [ ] Can create a checkpoint

---

**You're all set! Happy coding! 🎉**
