import { getCurrentPositionAsync, LocationObject, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import { LocationAccuracy } from 'expo-location/build/Location.types';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import DocumentPicker, { DocumentPickerResponse, isInProgress } from 'react-native-document-picker';
import MapView, { Marker } from 'react-native-maps';
import { styles } from './styles';

export default function App() {
  const [result, setResult] = useState<DocumentPickerResponse | null>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  };

  function handleError(error: unknown) {
    if (DocumentPicker.isCancel(error)) {
      console.warn('Cancelado');
    } else if (isInProgress(error)) {
      console.warn('Vários arquivos foram abertos, mas apenas o último será considerado');
    } else {
      throw error;
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (updatedLocation) => {
      setLocation(updatedLocation);
      mapRef.current?.animateCamera({
        // pitch: 120,
        center: updatedLocation.coords
      })
    })
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2))
  }, [result]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={async () => {
          try {
            const pickerResult = await DocumentPicker.pickSingle({
              presentationStyle: 'fullScreen',
              copyTo: 'documentDirectory',
              type: 'application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz'
            });
            setResult(pickerResult);
          } catch (e) {
            handleError(e);
          }
        }}
        style={styles.selectFileButton}
      >
        <Text style={styles.text}>KML</Text>
      </Pressable>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{ 
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude, 
            latitudeDelta: 0.005, 
            longitudeDelta: 0.005
          }}
        >
          <Marker
            coordinate={{ 
              latitude: location.coords.latitude, 
              longitude: location.coords.longitude 
            }}
            title='1'
            description='teste'
            pinColor='#0032ca'
          />
        </MapView>
      )}
   </View>
  );
}