import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

export default function PolygonMap({ onPointsChange }) {
  const mapRef = useRef(null);
  const featureGroupRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const fg = featureGroupRef.current;

    if (!fg) return;

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: fg,
        poly: { allowIntersection: false },
      },
      draw: {
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
      },
    });

    map.addControl(drawControl);

    // Handle drawing created
    map.on("draw:created", (e) => {
      const layer = e.layer;
      fg.addLayer(layer);

      if (layer instanceof L.Polygon) {
        const latLngs = layer.getLatLngs()[0];
        const points = latLngs.map((coord) => ({
          latitude: coord.lat,
          longitude: coord.lng,
        }));
        onPointsChange(points);
      }
    });

    // Handle drawing edited
    map.on("draw:edited", (e) => {
      const layers = e.layers;
      layers.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          const latLngs = layer.getLatLngs()[0];
          const points = latLngs.map((coord) => ({
            latitude: coord.lat,
            longitude: coord.lng,
          }));
          onPointsChange(points);
        }
      });
    });

    // Handle drawing deleted
    map.on("draw:deleted", () => {
      onPointsChange([]);
    });

    return () => {
      map.off("draw:created");
      map.off("draw:edited");
      map.off("draw:deleted");
    };
  }, [onPointsChange]);

  return (
    <div className="polygon-map-container">
      <h2>🗺️ Draw Geofence Polygon</h2>
      <p className="map-info">Use the polygon tool (top-left) to draw a geofence on the map</p>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="polygon-map"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup ref={featureGroupRef} />
      </MapContainer>
    </div>
  );
}
