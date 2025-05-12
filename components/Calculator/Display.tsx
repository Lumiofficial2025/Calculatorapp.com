import { Text, View, StyleSheet } from 'react-native';
import { DisplayProps } from './types';
import { useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';

export default function Display({
  value,
  showHistory,
  isScientific,
  isDegrees,
}: DisplayProps) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 500;
  
  let displayValue = value;
  const MAX_DIGITS = isLargeScreen ? 12 : 9;
  
  if (value !== 'Error' && value.replace(/\./g, '').length > MAX_DIGITS) {
    const num = parseFloat(value);
    displayValue = num.toExponential(MAX_DIGITS - 5);
  }

  return (
    <View style={styles.container}>
      <BlurView intensity={15} tint="dark" style={styles.blur}>
        <Text
          style={styles.text}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {displayValue}
        </Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
    backgroundColor: 'rgba(13, 17, 23, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(41, 98, 255, 0.3)',
    zIndex: 1,
  },
  blur: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 70,
  },
  text: {
    color: '#00C8FF',
    fontSize: 48,
    fontWeight: '300',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 200, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});