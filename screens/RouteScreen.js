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
          limit: 1
        }
      });
      if (res.data.length === 0) {
        Alert.alert("Destino não encontrado");
        return;
      }
      const { lat, lon } = res.data[0];
      setDestCoords({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
    } catch (err) {
      Alert.alert("Erro ao buscar coordenadas");
    }
  };

  const fetchRoute = async () => {
    try {
      const res = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          coordinates: [
            [origin.longitude, origin.latitude],
            [destCoords.longitude, destCoords.latitude]
          ]
        },
        {
          headers: {
            Authorization: 'SUA_API_KEY_DO_OPENROUTESERVICE',
            'Content-Type': 'application/json'
          }
        }
      );

      const decoded = polyline.decode(res.data.routes[0].geometry);
      const coords = decoded.map(([lat, lon]) => ({ latitude: lat, longitude: lon }));

      setRouteCoords(coords);
      setInfo({
        distance: (res.data.routes[0].summary.distance / 1000).toFixed(2),
        duration: Math.ceil(res.data.routes[0].summary.duration / 60)
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
      <MapView style={styles.map} initialRegion={{
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}>
        <Marker coordinate={origin} title="Origem" />
        <Marker coordinate={destCoords} title="Destino" />
        <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
      </MapView>
      <View style={styles.infoBox}>
        <Text>Distância: {info.distance} km</Text>
        <Text>Tempo estimado: {info.duration} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoBox: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc'
  }
});
