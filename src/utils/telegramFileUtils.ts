// utils/telegramFileUtils.ts

/**
 * Утилиты для работы с файлами в Telegram WebApp
 */

export interface TelegramFileOptions {
  accept?: string;
  multiple?: boolean;
}

/**
 * Создает правильно сконфигурированный input для Telegram Desktop
 */
export const createTelegramFileInput = (options: TelegramFileOptions = {}) => {
  const input = document.createElement('input');
  input.type = 'file';
  
  // Важные атрибуты для Telegram Desktop
  if (options.accept) {
    input.accept = options.accept;
  }
  
  if (options.multiple) {
    input.multiple = true;
  }
  
  // Убеждаемся, что не выбираем директории
  input.removeAttribute('webkitdirectory');
  
  // Скрываем элемент
  input.style.position = 'absolute';
  input.style.left = '-9999px';
  input.style.width = '1px';
  input.style.height = '1px';
  input.style.opacity = '0';
  
  return input;
};

/**
 * Открывает диалог выбора файлов с улучшенной поддержкой Telegram
 */
export const openTelegramFilePicker = (options: TelegramFileOptions = {}): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Opening Telegram file picker with options:', options);
      
      const input = createTelegramFileInput(options);
      
      input.onchange = (event) => {
        console.log('File input changed:', event);
        const target = event.target as HTMLInputElement;
        const files = target.files ? Array.from(target.files) : [];
        
        console.log('Selected files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
        
        // Очищаем DOM
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
        
        resolve(files);
      };
      
      input.oncancel = () => {
        console.log('File picker cancelled');
        // Очищаем DOM
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
        resolve([]);
      };
      
      input.onerror = (error) => {
        console.error('File picker error:', error);
        // Очищаем DOM
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
        reject(error);
      };
      
      // Добавляем в DOM и кликаем
      document.body.appendChild(input);
      
      console.log('File input created and added to DOM:', {
        accept: input.accept,
        multiple: input.multiple,
        type: input.type
      });
      
      // Небольшая задержка для лучшей совместимости с Telegram
      setTimeout(() => {
        console.log('Triggering file input click');
        input.click();
      }, 10);
      
    } catch (error) {
      console.error('Error in openTelegramFilePicker:', error);
      reject(error);
    }
  });
};

/**
 * Проверяет, запущено ли приложение в Telegram
 */
export const isTelegramWebApp = (): boolean => {
  return !!(window as any).Telegram?.WebApp;
};

/**
 * Проверяет, является ли Telegram Desktop версией
 */
export const isTelegramDesktop = (): boolean => {
  if (!isTelegramWebApp()) return false;
  
  const tg = (window as any).Telegram.WebApp;
  return tg.platform === 'tdesktop' || tg.platform === 'weba';
};