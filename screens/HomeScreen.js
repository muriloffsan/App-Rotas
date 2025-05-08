import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada para acessar localização');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleNavigate = () => {
    if (!location || !destination) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    navigation.navigate("Route", { origin: location, destination });
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="Você está aqui" />
        </MapView>
      )}

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Digite o destino"
          value={destination}
          onChangeText={setDestination}
          placeholderTextColor="#999"
        />
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button title="Navegar" onPress={handleNavigate} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Perfil" onPress={handleProfile} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: '#ffffffee',
    padding: 15,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  input: {
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
