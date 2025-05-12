import { View, StyleSheet } from 'react-native';
import { useCallback, useState } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import History from './History';
import FeatureDropdown, { Feature } from './FeatureDropdown';
import { CalculatorState, KeyType } from './types';

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    clearDisplay: false,
    history: [],
    showHistory: false,
    isScientific: false,
    isDegrees: true,
  });

  const features: Feature[] = [
    {
      id: 'scientific',
      label: 'Scientific Calculator',
      onSelect: () => setState(prev => ({ ...prev, isScientific: !prev.isScientific })),
    },
    {
      id: 'history',
      label: 'Calculation History',
      onSelect: () => setState(prev => ({ ...prev, showHistory: !prev.showHistory })),
    },
    {
      id: 'degrees',
      label: state.isDegrees ? 'Switch to Radians' : 'Switch to Degrees',
      onSelect: () => setState(prev => ({ ...prev, isDegrees: !prev.isDegrees })),
    },
  ];

  const handleKeyPress = useCallback((key: KeyType) => {
    if (typeof key === 'number' || key === '.') {
      inputDigit(key);
    } else if (key === 'C') {
      clearAll();
    } else if (key === '±') {
      toggleSign();
    } else if (key === '%') {
      inputPercent();
    } else if (['+', '-', '×', '÷'].includes(key)) {
      handleOperator(key as '+' | '-' | '×' | '÷');
    } else if (key === '=') {
      handleEquals();
    } else if (key === 'sin' || key === 'cos' || key === 'tan') {
      handleTrigonometry(key);
    } else if (key === 'ln') {
      handleNaturalLog();
    } else if (key === 'log') {
      handleLog10();
    } else if (key === 'π') {
      handlePi();
    } else if (key === 'e') {
      handleE();
    } else if (key === 'x²') {
      handleSquare();
    } else if (key === '√') {
      handleSquareRoot();
    } else if (key === 'DEG') {
      toggleDegrees();
    }
  }, [state]);

  const handleTrigonometry = (func: 'sin' | 'cos' | 'tan') => {
    setState(prev => {
      const value = parseFloat(prev.display);
      let angle = value;
      
      if (prev.isDegrees) {
        angle = (value * Math.PI) / 180;
      }

      let result;
      switch (func) {
        case 'sin':
          result = Math.sin(angle);
          break;
        case 'cos':
          result = Math.cos(angle);
          break;
        case 'tan':
          result = Math.tan(angle);
          break;
      }

      const expression = `${func}(${value}${prev.isDegrees ? '°' : ''})`;
      
      return {
        ...prev,
        display: result.toString(),
        waitingForSecondOperand: true,
        history: [
          {
            expression,
            result: result.toString(),
            timestamp: Date.now(),
          },
          ...prev.history
        ].slice(0, 10),
      };
    });
  };

  const handleNaturalLog = () => {
    setState(prev => {
      const value = parseFloat(prev.display);
      if (value <= 0) return { ...prev, display: 'Error' };
      
      const result = Math.log(value);
      const expression = `ln(${value})`;
      
      return {
        ...prev,
        display: result.toString(),
        waitingForSecondOperand: true,
        history: [
          {
            expression,
            result: result.toString(),
            timestamp: Date.now(),
          },
          ...prev.history
        ].slice(0, 10),
      };
    });
  };

  const handleLog10 = () => {
    setState(prev => {
      const value = parseFloat(prev.display);
      if (value <= 0) return { ...prev, display: 'Error' };
      
      const result = Math.log10(value);
      const expression = `log(${value})`;
      
      return {
        ...prev,
        display: result.toString(),
        waitingForSecondOperand: true,
        history: [
          {
            expression,
            result: result.toString(),
            timestamp: Date.now(),
          },
          ...prev.history
        ].slice(0, 10),
      };
    });
  };

  const handlePi = () => {
    setState(prev => ({
      ...prev,
      display: Math.PI.toString(),
      waitingForSecondOperand: true,
    }));
  };

  const handleE = () => {
    setState(prev => ({
      ...prev,
      display: Math.E.toString(),
      waitingForSecondOperand: true,
    }));
  };

  const handleSquare = () => {
    setState(prev => {
      const value = parseFloat(prev.display);
      const result = value * value;
      const expression = `(${value})²`;
      
      return {
        ...prev,
        display: result.toString(),
        waitingForSecondOperand: true,
        history: [
          {
            expression,
            result: result.toString(),
            timestamp: Date.now(),
          },
          ...prev.history
        ].slice(0, 10),
      };
    });
  };

  const handleSquareRoot = () => {
    setState(prev => {
      const value = parseFloat(prev.display);
      if (value < 0) return { ...prev, display: 'Error' };
      
      const result = Math.sqrt(value);
      const expression = `√(${value})`;
      
      return {
        ...prev,
        display: result.toString(),
        waitingForSecondOperand: true,
        history: [
          {
            expression,
            result: result.toString(),
            timestamp: Date.now(),
          },
          ...prev.history
        ].slice(0, 10),
      };
    });
  };

  const toggleDegrees = () => {
    setState(prev => ({
      ...prev,
      isDegrees: !prev.isDegrees,
    }));
  };

  const inputDigit = (digit: number | '.') => {
    setState(prev => {
      const { display, waitingForSecondOperand, clearDisplay } = prev;
      
      if (waitingForSecondOperand || clearDisplay) {
        return {
          ...prev,
          display: digit === '.' ? '0.' : digit.toString(),
          waitingForSecondOperand: false,
          clearDisplay: false,
        };
      } else {
        if (display === '0' && digit !== '.') {
          return {
            ...prev,
            display: digit.toString(),
          };
        } else if (digit === '.' && display.includes('.')) {
          return prev;
        } else {
          return {
            ...prev,
            display: display + digit.toString(),
          };
        }
      }
    });
  };

  const clearAll = () => {
    setState(prev => ({
      ...prev,
      display: '0',
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: false,
      clearDisplay: false,
    }));
  };

  const toggleSign = () => {
    setState(prev => ({
      ...prev,
      display: (parseFloat(prev.display) * -1).toString(),
    }));
  };

  const inputPercent = () => {
    setState(prev => ({
      ...prev,
      display: (parseFloat(prev.display) / 100).toString(),
    }));
  };

  const handleOperator = (nextOperator: '+' | '-' | '×' | '÷') => {
    setState(prev => {
      const { display, firstOperand, operator } = prev;
      const inputValue = parseFloat(display);

      if (firstOperand === null) {
        return {
          ...prev,
          firstOperand: inputValue,
          operator: nextOperator,
          waitingForSecondOperand: true,
        };
      } else if (operator) {
        const result = performCalculation(firstOperand, inputValue, operator);
        const expression = `${firstOperand} ${operator} ${inputValue}`;
        
        return {
          ...prev,
          display: result.toString(),
          firstOperand: result,
          operator: nextOperator,
          waitingForSecondOperand: true,
          history: [
            {
              expression,
              result: result.toString(),
              timestamp: Date.now(),
            },
            ...prev.history
          ].slice(0, 10),
        };
      }
      return prev;
    });
  };

  const handleEquals = () => {
    setState(prev => {
      const { display, firstOperand, operator } = prev;
      if (firstOperand === null || operator === null) return prev;

      const inputValue = parseFloat(display);
      const result = performCalculation(firstOperand, inputValue, operator);
      const expression = `${firstOperand} ${operator} ${inputValue}`;

      return {
        ...prev,
        display: result.toString(),
        firstOperand: result,
        operator: null,
        waitingForSecondOperand: true,
        clearDisplay: true,
        history: [
          {
            expression,
            result: result.toString(),
            timestamp: Date.now(),
          },
          ...prev.history
        ].slice(0, 10),
      };
    });
  };

  const performCalculation = (
    firstOperand: number,
    secondOperand: number,
    operator: '+' | '-' | '×' | '÷'
  ) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        if (secondOperand === 0) {
          return 'Error';
        }
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleHistorySelect = (value: string) => {
    setState(prev => ({
      ...prev,
      display: value,
      showHistory: false,
      waitingForSecondOperand: true,
    }));
  };

  return (
    <View style={styles.container}>
      <FeatureDropdown features={features} />
      <Display
        value={state.display}
        showHistory={state.showHistory}
        isScientific={state.isScientific}
        isDegrees={state.isDegrees}
      />
      <History
        entries={state.history}
        onSelectEntry={handleHistorySelect}
        visible={state.showHistory}
        onClose={() => setState(prev => ({ ...prev, showHistory: false }))}
      />
      <Keypad
        onKeyPress={handleKeyPress}
        activeOperator={state.operator}
        isScientific={state.isScientific}
        isDegrees={state.isDegrees}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});