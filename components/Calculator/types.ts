export type KeyType = 
  | number 
  | '.' 
  | 'C' 
  | '±' 
  | '%' 
  | '+' 
  | '-' 
  | '×' 
  | '÷' 
  | '=' 
  | 'sin' 
  | 'cos' 
  | 'tan' 
  | 'ln' 
  | 'log' 
  | 'π' 
  | 'e' 
  | 'x²' 
  | '√' 
  | 'DEG';

export interface CalculatorState {
  display: string;
  firstOperand: number | null;
  operator: '+' | '-' | '×' | '÷' | null;
  waitingForSecondOperand: boolean;
  clearDisplay: boolean;
  history: HistoryEntry[];
  showHistory: boolean;
  isScientific: boolean;
  isDegrees: boolean;
}

export interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

export interface KeypadButtonProps {
  value: KeyType;
  onPress: (value: KeyType) => void;
  type?: 'number' | 'operator' | 'function' | 'scientific';
  isActive?: boolean;
  isZero?: boolean;
  small?: boolean;
}

export interface KeypadProps {
  onKeyPress: (key: KeyType) => void;
  activeOperator: '+' | '-' | '×' | '÷' | null;
  isScientific: boolean;
  isDegrees: boolean;
}

export interface DisplayProps {
  value: string;
  showHistory?: boolean;
  isScientific?: boolean;
  isDegrees?: boolean;
}

export interface HistoryProps {
  entries: HistoryEntry[];
  onSelectEntry: (value: string) => void;
  visible: boolean;
  onClose: () => void;
}