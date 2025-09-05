export interface LogEntry {
  id: number;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private listeners: ((log: LogEntry) => void)[] = [];
  private logId = 0;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private addLog(level: LogEntry['level'], message: string) {
    const log: LogEntry = {
      id: this.logId++,
      timestamp: Date.now(),
      level,
      message
    };

    this.logs.unshift(log);
    
    // Ограничиваем количество логов
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }

    // Уведомляем слушателей о новом логе
    this.listeners.forEach(listener => listener(log));
  }

  private formatError(error: any): string {
    if (error instanceof Error) {
      return `${error.message}${error.stack ? '\n' + error.stack : ''}`;
    }
    if (typeof error === 'object') {
      try {
        return JSON.stringify(error, null, 2);
      } catch {
        return String(error);
      }
    }
    return String(error);
  }

  info(message: string, data?: any) {
    const fullMessage = data ? `${message}\n${this.formatError(data)}` : message;
    this.addLog('info', fullMessage);
    console.log(`[INFO] ${message}`, data || '');
  }

  warn(message: string, data?: any) {
    const fullMessage = data ? `${message}\n${this.formatError(data)}` : message;
    this.addLog('warn', fullMessage);
    console.warn(`[WARN] ${message}`, data || '');
  }

  error(message: string, error?: any) {
    const fullMessage = error ? `${message}\n${this.formatError(error)}` : message;
    this.addLog('error', fullMessage);
    console.error(`[ERROR] ${message}`, error || '');
  }

  success(message: string, data?: any) {
    const fullMessage = data ? `${message}\n${this.formatError(data)}` : message;
    this.addLog('success', fullMessage);
    console.log(`[SUCCESS] ${message}`, data || '');
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  subscribe(listener: (log: LogEntry) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  clear() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
