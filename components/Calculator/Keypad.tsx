import { View, StyleSheet, Platform } from 'react-native';
import { KeypadProps } from './types';
import KeypadButton from './KeypadButton';

export default function Keypad({ onKeyPress, activeOperator, isScientific, isDegrees }: KeypadProps) {
  return (
    <View style={[styles.container, isScientific && styles.scientificContainer]}>
      {isScientific && (
        <View style={styles.scientificSection}>
          <View style={styles.row}>
            <KeypadButton value="sin" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value="cos" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value="tan" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value="DEG" onPress={onKeyPress} type="scientific" small isActive={isDegrees} />
          </View>
          <View style={styles.row}>
            <KeypadButton value="ln" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value="log" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value="π" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value="e" onPress={onKeyPress} type="scientific" small />
          </View>
          <View style={styles.row}>
            <KeypadButton value="x²" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value="√" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value="(" onPress={onKeyPress} type="scientific" small />
            <KeypadButton value=")" onPress={onKeyPress} type="scientific" small />
          </View>
        </View>
      )}

      <View style={styles.basicSection}>
        <View style={styles.row}>
          <KeypadButton value="C" onPress={onKeyPress} type="function" />
          <KeypadButton value="±" onPress={onKeyPress} type="function" />
          <KeypadButton value="%" onPress={onKeyPress} type="function" />
          <KeypadButton
            value="÷"
            onPress={onKeyPress}
            type="operator"
            isActive={activeOperator === '÷'}
          />
        </View>

        <View style={styles.row}>
          <KeypadButton value={7} onPress={onKeyPress} />
          <KeypadButton value={8} onPress={onKeyPress} />
          <KeypadButton value={9} onPress={onKeyPress} />
          <KeypadButton
            value="×"
            onPress={onKeyPress}
            type="operator"
            isActive={activeOperator === '×'}
          />
        </View>

        <View style={styles.row}>
          <KeypadButton value={4} onPress={onKeyPress} />
          <KeypadButton value={5} onPress={onKeyPress} />
          <KeypadButton value={6} onPress={onKeyPress} />
          <KeypadButton
            value="-"
            onPress={onKeyPress}
            type="operator"
            isActive={activeOperator === '-'}
          />
        </View>

        <View style={styles.row}>
          <KeypadButton value={1} onPress={onKeyPress} />
          <KeypadButton value={2} onPress={onKeyPress} />
          <KeypadButton value={3} onPress={onKeyPress} />
          <KeypadButton
            value="+"
            onPress={onKeyPress}
            type="operator"
            isActive={activeOperator === '+'}
          />
        </View>

        <View style={styles.row}>
          <KeypadButton value={0} onPress={onKeyPress} isZero />
          <KeypadButton value="." onPress={onKeyPress} />
          <KeypadButton value="=" onPress={onKeyPress} type="operator" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  scientificContainer: {
    paddingBottom: Platform.OS === 'ios' ? 16 : 8,
  },
  scientificSection: {
    gap: 4,
    marginBottom: 8,
  },
  basicSection: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});