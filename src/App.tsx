/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWritingMonitor } from './useWritingMonitor';
import { Download, Activity, Trash2, ChevronUp, ChevronDown, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const {
    logs,
    content,
    setContent,
    handleKeyDown,
    handleKeyUp,
    handlePaste,
    clearLogs,
    downloadLogs,
  } = useWritingMonitor();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-32 min-h-screen flex flex-col">
        {/* Header/Title (Subtle) */}
        <div className="mb-12 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <h1 className="text-sm font-medium tracking-widest uppercase">Vi-Notes</h1>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest">
            {content.length} characters
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-grow relative">
          <textarea
            id="vi-editor"
            className="w-full h-full min-h-[60vh] bg-transparent border-none outline-none resize-none text-xl leading-relaxed font-mono placeholder:text-gray-300"
            placeholder="Start writing naturally..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onPaste={handlePaste}
            spellCheck={false}
            autoFocus
          />
        </div>
      </main>

      {/* Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-green-600">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity size={14} />
            </motion.div>
            <span className="tracking-tight">Monitoring Active</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
            {logs.length} events logged
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            {isDrawerOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            Session Data
          </button>
          <button
            onClick={clearLogs}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Clear Session"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={downloadLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Download size={14} />
            Export Log
          </button>
        </div>
      </footer>

      {/* Session Data Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-16 left-0 right-0 h-[40vh] bg-white border-t border-gray-200 z-40 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="px-6 py-3 border-bottom border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Captured Behavior Logs</h2>
              <span className="text-[10px] text-gray-400 italic">No actual text content is stored.</span>
            </div>
            <div className="flex-grow overflow-y-auto p-6 font-mono text-[11px] leading-tight space-y-1">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-300 italic">
                  Waiting for input...
                </div>
              ) : (
                logs.slice().reverse().map((log, i) => (
                  <div key={i} className="flex gap-4 border-b border-gray-50 py-1 hover:bg-gray-50">
                    <span className="text-gray-300 w-20">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    {log.type === 'KEYSTROKE' ? (
                      <>
                        <span className="text-orange-500 w-20">{log.category}</span>
                        <span className="text-gray-500">Dwell: {log.dwellTime}ms</span>
                        <span className="text-gray-400">Flight: {log.flightTime}ms</span>
                      </>
                    ) : (
                      <>
                        <span className="text-blue-500 w-20">PASTE</span>
                        <span className="text-gray-500">Length: {log.charCount} chars</span>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

