import React, { useRef } from 'react';
import './FilePicker.css';
import { openTelegramFilePicker, isTelegramWebApp, isTelegramDesktop } from '../../utils/telegramFileUtils';

const paperClipIcon = require("./assets/paper-clip.png");

type FilePickerProps = {
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
};

const FilePicker: React.FC<FilePickerProps> = ({ accept = "*/*", multiple = false, onFilesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFilesSelected) return;
    const files = e.target.files ? Array.from(e.target.files) : [];
    onFilesSelected(files);
    
    // Очищаем input для возможности выбора того же файла повторно
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Проверяем, запущены ли мы в Telegram Desktop
    if (isTelegramWebApp() && isTelegramDesktop()) {
      console.log('Using enhanced Telegram Desktop file picker');
      
      try {
        const files = await openTelegramFilePicker({
          accept,
          multiple
        });
        
        if (onFilesSelected && files.length > 0) {
          onFilesSelected(files);
        }
      } catch (error) {
        console.error('Telegram file picker error:', error);
        // Fallback к стандартному методу
        fallbackFilePicker();
      }
    } else {
      // Стандартный браузер или мобильный Telegram
      fallbackFilePicker();
    }
  };

  const fallbackFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="ac-file-picker" onClick={handleClick}>
      <input 
        ref={fileInputRef}
        className="ac-file-input" 
        type="file" 
        accept={accept} 
        multiple={multiple} 
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <div className="ac-file-picker-button" title="Выбрать файлы для отправки">
        <img src={paperClipIcon} alt="Attach file" className="ac-paper-clip-icon" />
      </div>
    </div>
  );
};

export default FilePicker;
