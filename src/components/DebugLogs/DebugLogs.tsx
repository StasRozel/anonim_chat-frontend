import React, { useState, useEffect } from 'react';
import './DebugLogs.css';
import { LogEntry, logger } from '../../utils/logger';

export const DebugLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  useEffect(() => {
    const unsubscribe = logger.subscribe((log: LogEntry) => {
      setLogs(prevLogs => [...prevLogs.slice(-49), log]); // Последние 50 логов
    });

    return unsubscribe;
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const clearLogs = () => {
    setLogs([]);
    setExpandedLogs(new Set());
  };

  const toggleLogExpansion = (logIndex: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logIndex)) {
      newExpanded.delete(logIndex);
    } else {
      newExpanded.add(logIndex);
    }
    setExpandedLogs(newExpanded);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLogIcon = (level: string) => {
    switch(level) {
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
      default: return '📝';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };
  return (
    <>
      <button 
        className="debug-logs__toggle-button"
        onClick={toggleVisibility}
        title="Toggle Debug Logs"
      >
        🐛
      </button>
      
      {isVisible && (
        <div className="debug-logs">
          <div className="debug-logs__header">
            <h3>Debug Logs</h3>
            <div className="debug-logs__controls">
              <button onClick={clearLogs} className="debug-logs__clear-button">
                Clear
              </button>
              <button onClick={toggleVisibility} className="debug-logs__close-button">
                ✕
              </button>
            </div>
          </div>
          
          <div className="debug-logs__content">
            {logs.length === 0 ? (
              <div className="debug-logs__empty">No logs yet...</div>
            ) : (
              logs.map((log, index) => {
                const isExpanded = expandedLogs.has(index);
                const hasLongMessage = log.message.length > 100;
                const displayMessage = isExpanded || !hasLongMessage 
                  ? log.message 
                  : truncateMessage(log.message);
                
                return (
                  <div key={index} className={`debug-logs__entry debug-logs__entry--${log.level}`}>
                    <span className="debug-logs__timestamp">{formatTime(log.timestamp)}</span>
                    <span className="debug-logs__icon">{getLogIcon(log.level)}</span>
                    <div className="debug-logs__message-container">
                      <span className="debug-logs__message">{displayMessage}</span>
                      {hasLongMessage && (
                        <button 
                          className="debug-logs__expand-button"
                          onClick={() => toggleLogExpansion(index)}
                        >
                          {isExpanded ? '▼ Свернуть' : '▶ Развернуть'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export { logger };

