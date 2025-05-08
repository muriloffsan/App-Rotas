import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import polyline from '@mapbox/polyline';

export default function RouteScreen({ route }) {
  const { origin, destination } = route.params;
  const [destCoords, setDestCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [info, setInfo] = useState(null);

  const getCoordinatesFromName = async () => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: destination,
          format: 'json',
          addressdetails: 1,
          limit: 1
        },
        headers: {
          'User-Agent': 'MyApp/1.0 (teste@gmail.com)',
        }
      });
      if (res.data.length === 0) {
        Alert.alert("Destino não encontrado");
        return;
      }
      const { lat, lon } = res.data[0];
      const coords = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      };
      setDestCoords(coords);
    } catch (err) {
      Alert.alert("Erro ao buscar coordenadas");
    }
  };

  const fetchRoute = async () => {
    try {
      const body = {
        coordinates: [
          [origin.longitude, origin.latitude],
          [destCoords.longitude, destCoords.latitude]
        ],
        format: "json",
      };

      const headers = {
        Authorization: '5b3ce3597851110001cf6248a124b866e67c428cbf813c541d84da35',
        'Content-Type': 'application/json',
      };

      const response = await axios.post('https://api.openrouteservice.org/v2/directions/driving-car', body, { headers });

      const decoded = polyline.decode(response.data.routes[0].geometry);
      const coords = decoded.map(([lat, lon]) => ({ latitude: lat, longitude: lon }));
      setRouteCoords(coords);
      setInfo({
        distance: (response.data.routes[0].summary.distance / 1000).toFixed(2),
        duration: Math.ceil(response.data.routes[0].summary.duration / 60)
      });
    } catch (err) {
      Alert.alert("Erro ao buscar rota");
    }
  };

  useEffect(() => {
    getCoordinatesFromName();
  }, []);

  useEffect(() => {
    if (destCoords) fetchRoute();
  }, [destCoords]);

  if (!destCoords || !info) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando rota...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={origin} title="Origem" />
        <Marker coordinate={destCoords} title="Destino" />
        <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📏 {info.distance} km</Text>
        <Text style={styles.infoText}>🕒 {info.duration} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoBox: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#ffffffdd',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: 'flex-start'
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4
  }
});
