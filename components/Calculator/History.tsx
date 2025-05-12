import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { HistoryProps } from './types';
import { X } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function History({ entries, onSelectEntry, visible, onClose }: HistoryProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(visible ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    
    const translateY = withSpring(visible ? 0 : 20, {
      damping: 15,
      stiffness: 150,
    });

    return {
      opacity,
      transform: [{ translateY }],
      pointerEvents: visible ? 'auto' as const : 'none' as const,
    };
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <LinearGradient
        colors={['rgba(41, 98, 255, 0.1)', 'rgba(0, 200, 255, 0.1)']}
        style={styles.gradient}
      >
        <AnimatedBlurView intensity={15} tint="dark" style={styles.blur}>
          <View style={styles.header}>
            <Text style={styles.title}>History</Text>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={20} color="#00C8FF" />
            </Pressable>
          </View>
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {entries.length === 0 ? (
              <Text style={styles.emptyText}>No calculations yet</Text>
            ) : (
              entries.map((entry, index) => (
                <Pressable
                  key={entry.timestamp}
                  style={({ pressed }) => [
                    styles.entry,
                    pressed && styles.entryPressed,
                    index === entries.length - 1 && styles.lastEntry
                  ]}
                  onPress={() => onSelectEntry(entry.result)}
                >
                  <Text style={styles.expression}>{entry.expression}</Text>
                  <Text style={styles.result}>{entry.result}</Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </AnimatedBlurView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gradient: {
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
    flex: 1,
  },
  blur: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#00C8FF',
    fontSize: 20,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 200, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  entry: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  entryPressed: {
    backgroundColor: 'rgba(41, 98, 255, 0.2)',
  },
  lastEntry: {
    borderBottomWidth: 0,
  },
  expression: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginBottom: 4,
  },
  result: {
    color: '#00C8FF',
    fontSize: 20,
    fontWeight: '500',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});