# 📡 API Documentation

Base URL: `http://localhost:5000/api`

## Locations API

### Get All Locations

```http
GET /locations
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "location_id": 1,
      "location_name": "Downtown Area",
      "location_description": "Central business district",
      "geofence_points": [
        {
          "point_id": 1,
          "latitude": 28.6139,
          "longitude": 77.2090,
          "sequence_order": 0
        },
        {
          "point_id": 2,
          "latitude": 28.6140,
          "longitude": 77.2091,
          "sequence_order": 1
        }
      ],
      "ui_coordinates": [
        {
          "ui_coord_id": 1,
          "device_type": "laptop",
          "x_coordinate": 100,
          "y_coordinate": 200
        }
      ]
    }
  ]
}
```

### Get Location by ID

```http
GET /locations/:id
```

**Path Parameters:**
- `id` (integer) - Location ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "location_id": 1,
    "location_name": "Downtown Area",
    "location_description": "Central business district",
    "geofence_points": [...],
    "ui_coordinates": [...]
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Location not found"
}
```

### Create Location

```http
POST /locations
Content-Type: application/json
```

**Request Body:**
```json
{
  "locationName": "Downtown Area",
  "locationDescription": "Central business district",
  "geofencePoints": [
    {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    {
      "latitude": 28.6140,
      "longitude": 77.2091
    },
    {
      "latitude": 28.6141,
      "longitude": 77.2092
    }
  ],
  "uiCoordinates": [
    {
      "device_type": "laptop",
      "x_coordinate": 100,
      "y_coordinate": 200
    },
    {
      "device_type": "mobile",
      "x_coordinate": 50,
      "y_coordinate": 100
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Location created successfully",
  "data": {
    "location_id": 1
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Missing required fields: locationName, locationDescription, geofencePoints (at least 1 point)"
}
```

### Update Location

```http
PUT /locations/:id
Content-Type: application/json
```

**Path Parameters:**
- `id` (integer) - Location ID

**Request Body:**
```json
{
  "locationName": "Updated Name",
  "locationDescription": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Location updated successfully"
}
```

### Delete Location

```http
DELETE /locations/:id
```

**Path Parameters:**
- `id` (integer) - Location ID

**Response (200 Ok):**
```json
{
  "success": true,
  "message": "Location deleted successfully"
}
```

---

## Checkpoints API

### Get All Checkpoints

```http
GET /checkpoints
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "checkpoint_id": 1,
      "checkpoint_name": "Entrance Gate",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "sequence_order": 1,
      "ui_coordinates": [
        {
          "ui_coord_id": 1,
          "device_type": "laptop",
          "x_coordinate": 100,
          "y_coordinate": 200
        }
      ]
    }
  ]
}
```

### Get Checkpoint by ID

```http
GET /checkpoints/:id
```

**Path Parameters:**
- `id` (integer) - Checkpoint ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "checkpoint_id": 1,
    "checkpoint_name": "Entrance Gate",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "sequence_order": 1,
    "ui_coordinates": [...]
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Checkpoint not found"
}
```

### Create Checkpoint

```http
POST /checkpoints
Content-Type: application/json
```

**Request Body:**
```json
{
  "checkpointName": "Entrance Gate",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "sequenceOrder": 1,
  "uiCoordinates": [
    {
      "device_type": "laptop",
      "x_coordinate": 100,
      "y_coordinate": 200
    },
    {
      "device_type": "mobile",
      "x_coordinate": 50,
      "y_coordinate": 100
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Checkpoint created successfully",
  "data": {
    "checkpoint_id": 1
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Missing required fields: checkpointName, latitude, longitude, sequenceOrder"
}
```

### Update Checkpoint

```http
PUT /checkpoints/:id
Content-Type: application/json
```

**Path Parameters:**
- `id` (integer) - Checkpoint ID

**Request Body:**
```json
{
  "checkpointName": "Updated Gate",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "sequenceOrder": 2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Checkpoint updated successfully"
}
```

### Delete Checkpoint

```http
DELETE /checkpoints/:id
```

**Path Parameters:**
- `id` (integer) - Checkpoint ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Checkpoint deleted successfully"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request succeeded |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error - Server error |

---

## Testing with cURL

### Create Location
```bash
curl -X POST http://localhost:5000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "locationName": "Test Location",
    "locationDescription": "Test Description",
    "geofencePoints": [
      {"latitude": 28.6139, "longitude": 77.2090},
      {"latitude": 28.6140, "longitude": 77.2091},
      {"latitude": 28.6141, "longitude": 77.2092}
    ]
  }'
```

### Get All Locations
```bash
curl http://localhost:5000/api/locations
```

### Create Checkpoint
```bash
curl -X POST http://localhost:5000/api/checkpoints \
  -H "Content-Type: application/json" \
  -d '{
    "checkpointName": "Test Checkpoint",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "sequenceOrder": 1
  }'
```

### Get All Checkpoints
```bash
curl http://localhost:5000/api/checkpoints
```

### Delete Location
```bash
curl -X DELETE http://localhost:5000/api/locations/1
```

### Delete Checkpoint
```bash
curl -X DELETE http://localhost:5000/api/checkpoints/1
```

---

## Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new collection "Admin Dashboard"
3. Import URLs above as requests
4. Set method (GET, POST, PUT, DELETE)
5. Add JSON body for POST/PUT requests
6. Click "Send"

---

## Rate Limiting

Currently no rate limiting is implemented.

## Authentication

Currently no authentication is implemented. Add JWT tokens for production.

## CORS

CORS is enabled for all origins. In production, restrict to specific domains:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

Last Updated: February 6, 2026
