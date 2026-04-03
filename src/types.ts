export type KeyCategory = 'Alpha' | 'Numeric' | 'Space' | 'Backspace' | 'Enter' | 'Special';

export interface KeystrokeEvent {
  type: 'KEYSTROKE';
  timestamp: number;
  category: KeyCategory;
  dwellTime: number; // ms
  flightTime: number; // ms
}

export interface PasteEvent {
  type: 'PASTE_EVENT';
  timestamp: number;
  charCount: number;
}

export type SessionLog = KeystrokeEvent | PasteEvent;
