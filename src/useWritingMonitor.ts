import { useState, useRef, useCallback } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { SessionLog, KeyCategory } from './types';

export function useWritingMonitor() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [content, setContent] = useState('');
  
  // Refs for timing
  const lastKeyUpTimeRef = useRef<number | null>(null);
  const keyDownTimesRef = useRef<Map<string, number>>(new Map());

  const getCategory = (key: string): KeyCategory => {
    if (key === ' ') return 'Space';
    if (key === 'Backspace') return 'Backspace';
    if (key === 'Enter') return 'Enter';
    if (/^[a-zA-Z]$/.test(key)) return 'Alpha';
    if (/^[0-9]$/.test(key)) return 'Numeric';
    return 'Special';
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const now = Date.now();
    const key = e.key;

    // Avoid multiple logs for held-down keys
    if (keyDownTimesRef.current.has(key)) return;

    keyDownTimesRef.current.set(key, now);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const now = Date.now();
    const key = e.key;
    const startTime = keyDownTimesRef.current.get(key);

    if (startTime) {
      const dwellTime = now - startTime;
      const flightTime = lastKeyUpTimeRef.current ? startTime - lastKeyUpTimeRef.current : 0;
      
      const newLog: SessionLog = {
        type: 'KEYSTROKE',
        timestamp: startTime,
        category: getCategory(key),
        dwellTime,
        flightTime,
      };

      setLogs((prev) => [...prev, newLog]);
      keyDownTimesRef.current.delete(key);
      lastKeyUpTimeRef.current = now;
    }
  }, []);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const now = Date.now();
    const pastedText = e.clipboardData.getData('text');
    
    const newLog: SessionLog = {
      type: 'PASTE_EVENT',
      timestamp: now,
      charCount: pastedText.length,
    };

    setLogs((prev) => [...prev, newLog]);
  }, []);

  const clearLogs = () => {
    setLogs([]);
    lastKeyUpTimeRef.current = null;
    keyDownTimesRef.current.clear();
  };

  const downloadLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vi-notes-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    logs,
    content,
    setContent,
    handleKeyDown,
    handleKeyUp,
    handlePaste,
    clearLogs,
    downloadLogs,
  };
}
