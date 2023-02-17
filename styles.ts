import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%'
  },
  map: {
    flex: 1,
    width: '100%'
  },
  selectFileButton: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    zIndex: 10,
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#3992ff',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export { styles };

