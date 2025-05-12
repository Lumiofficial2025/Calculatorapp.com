import { 
  Text, 
  Pressable, 
  StyleSheet, 
  Platform,
  useWindowDimensions 
} from 'react-native';
import { useCallback } from 'react';
import { KeypadButtonProps } from './types';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function KeypadButton({
  value,
  onPress,
  type = 'number',
  isActive = false,
  isZero = false,
  small = false,
}: KeypadButtonProps) {
  const { width } = useWindowDimensions();
  const buttonSize = Math.min(80, (width - 64) / 4);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0.9, 1], [0.8, 1]);
    return {
      transform: [{ scale: scale.value }],
      opacity,
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 200 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, []);

  const handlePress = useCallback(() => {
    onPress(value);
  }, [value, onPress]);

  let gradientColors;
  let textColor;
  let blurIntensity;
  let borderColor;
  let fontSize = small ? 16 : 24;

  switch (type) {
    case 'scientific':
      gradientColors = isActive 
        ? ['rgba(156, 39, 176, 0.3)', 'rgba(156, 39, 176, 0.2)']
        : ['rgba(156, 39, 176, 0.2)', 'rgba(156, 39, 176, 0.1)'];
      textColor = isActive ? '#E1BEE7' : '#CE93D8';
      blurIntensity = 20;
      borderColor = isActive 
        ? 'rgba(156, 39, 176, 0.4)'
        : 'rgba(156, 39, 176, 0.3)';
      break;
    case 'function':
      gradientColors = ['rgba(255, 69, 58, 0.2)', 'rgba(255, 69, 58, 0.1)'];
      textColor = '#FF453A';
      blurIntensity = 15;
      borderColor = 'rgba(255, 69, 58, 0.3)';
      break;
    case 'operator':
      gradientColors = isActive 
        ? ['rgba(41, 98, 255, 0.3)', 'rgba(41, 98, 255, 0.2)']
        : ['rgba(0, 200, 255, 0.2)', 'rgba(0, 200, 255, 0.1)'];
      textColor = isActive ? '#2962FF' : '#00C8FF';
      blurIntensity = 20;
      borderColor = isActive 
        ? 'rgba(41, 98, 255, 0.4)'
        : 'rgba(0, 200, 255, 0.3)';
      break;
    default:
      gradientColors = ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'];
      textColor = '#FFFFFF';
      blurIntensity = 10;
      borderColor = 'rgba(255, 255, 255, 0.2)';
  }

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          width: buttonSize,
          height: small ? buttonSize * 0.75 : buttonSize,
          borderColor,
        },
        isZero && { width: buttonSize * 2 + 8 },
        animatedStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AnimatedBlurView intensity={blurIntensity} tint="dark" style={styles.blur}>
          <Text style={[styles.text, { color: textColor, fontSize }]}>
            {value.toString()}
          </Text>
        </AnimatedBlurView>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 4,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#2962FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 0 8px rgba(41, 98, 255, 0.3)',
      },
    }),
  },
  gradient: {
    flex: 1,
  },
  blur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
    textShadowColor: 'rgba(0, 200, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});