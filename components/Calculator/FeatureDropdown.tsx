import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown, ChevronUp, X } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export interface Feature {
  id: string;
  label: string;
  onSelect: () => void;
  description?: string;
}

interface FeatureDropdownProps {
  features: Feature[];
}

export default function FeatureDropdown({ features }: FeatureDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const dropdownStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      transform: [
        {
          translateY: withSpring(isOpen ? 0 : -10, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
      pointerEvents: isOpen ? 'auto' as const : 'none' as const,
    };
  });

  const helpStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showHelp ? 1 : 0, {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      transform: [
        {
          translateY: withSpring(showHelp ? 0 : -10, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
      pointerEvents: showHelp ? 'auto' as const : 'none' as const,
    };
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.trigger, isOpen && styles.triggerActive]}
        onPress={() => {
          setIsOpen(!isOpen);
          setShowHelp(false);
        }}
      >
        <LinearGradient
          colors={
            isOpen
              ? ['rgba(41, 98, 255, 0.3)', 'rgba(41, 98, 255, 0.2)']
              : ['rgba(0, 200, 255, 0.2)', 'rgba(0, 200, 255, 0.1)']
          }
          style={styles.gradient}
        >
          <BlurView intensity={20} tint="dark" style={styles.blur}>
            <Text style={[styles.triggerText, isOpen && styles.triggerTextActive]}>
              Features
            </Text>
            {isOpen ? (
              <ChevronUp size={20} color="#2962FF" />
            ) : (
              <ChevronDown size={20} color="#00C8FF" />
            )}
          </BlurView>
        </LinearGradient>
      </Pressable>

      <Animated.View style={[styles.dropdown, dropdownStyle]}>
        <LinearGradient
          colors={['rgba(41, 98, 255, 0.1)', 'rgba(0, 200, 255, 0.1)']}
          style={styles.dropdownGradient}
        >
          <AnimatedBlurView intensity={15} tint="dark" style={styles.dropdownBlur}>
            {features.map((feature) => (
              <Pressable
                key={feature.id}
                style={styles.option}
                onPress={() => {
                  feature.onSelect();
                  setIsOpen(false);
                }}
              >
                <Text style={styles.optionText}>{feature.label}</Text>
              </Pressable>
            ))}
            <View style={styles.divider} />
            <Pressable
              style={styles.option}
              onPress={() => {
                setShowHelp(true);
                setIsOpen(false);
              }}
            >
              <Text style={styles.optionText}>How to Use</Text>
            </Pressable>
          </AnimatedBlurView>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.helpPanel, helpStyle]}>
        <View style={styles.helpBackground}>
          <View style={styles.helpHeader}>
            <Text style={styles.helpTitle}>Calculator Guide</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowHelp(false)}
            >
              <X size={20} color="#00C8FF" />
            </Pressable>
          </View>
          <ScrollView style={styles.helpContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Operations</Text>
              <Text style={styles.sectionText}>
                • Use the number pad for basic calculations{'\n'}
                • C clears the current calculation{'\n'}
                • ± toggles between positive and negative{'\n'}
                • % converts the number to a percentage{'\n'}
                • = shows the final result
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scientific Mode</Text>
              <Text style={styles.sectionText}>
                • Toggle scientific mode to access advanced functions{'\n'}
                • sin, cos, tan for trigonometric calculations{'\n'}
                • ln for natural logarithm{'\n'}
                • log for base-10 logarithm{'\n'}
                • π and e for mathematical constants{'\n'}
                • x² for square and √ for square root{'\n'}
                • Switch between degrees and radians for trig functions
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>History</Text>
              <Text style={styles.sectionText}>
                • View your recent calculations{'\n'}
                • Tap any previous result to use it{'\n'}
                • History saves up to 10 calculations{'\n'}
                • Each entry shows the expression and result
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips</Text>
              <Text style={styles.sectionText}>
                • Long expressions automatically adjust font size{'\n'}
                • Scientific notation is used for very large numbers{'\n'}
                • Results are preserved when switching modes{'\n'}
                • Use DEG/RAD for accurate trigonometric results
              </Text>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1000,
  },
  trigger: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.3)',
  },
  triggerActive: {
    borderColor: 'rgba(41, 98, 255, 0.4)',
  },
  gradient: {
    borderRadius: 12,
  },
  blur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  triggerText: {
    color: '#00C8FF',
    fontSize: 16,
    fontWeight: '500',
  },
  triggerTextActive: {
    color: '#2962FF',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 8,
    minWidth: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(41, 98, 255, 0.2)',
  },
  dropdownGradient: {
    borderRadius: 12,
  },
  dropdownBlur: {
    padding: 8,
  },
  option: {
    padding: 12,
    borderRadius: 8,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4,
  },
  helpPanel: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 8,
    width: 300,
    maxHeight: 500,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(41, 98, 255, 0.2)',
  },
  helpBackground: {
    flex: 1,
    backgroundColor: '#0A0F1C',
  },
  helpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#0D1117',
  },
  helpTitle: {
    color: '#00C8FF',
    fontSize: 20,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 200, 255, 0.1)',
  },
  helpContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#00C8FF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  sectionText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});