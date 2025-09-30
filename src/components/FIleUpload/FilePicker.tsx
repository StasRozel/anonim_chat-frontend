import React, { useState, useRef, useEffect } from 'react';
import './FilePicker.css';

const paperClipIcon = require("./assets/paper-clip.png");

type FilePickerProps = {
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
};

const FilePicker: React.FC<FilePickerProps> = ({ accept = "*/*", multiple = false, onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Проверяем платформу Telegram
    if (window.Telegram?.WebApp) {
      const platform = window.Telegram.WebApp.platform;
      setIsDesktop(platform === 'tdesktop' || platform === 'web');
      console.log('Telegram platform:', platform);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    if (!onFilesSelected || files.length === 0) return;
    onFilesSelected(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFilesSelected) return;
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleClick = () => {
    // Проверяем платформу перед открытием file picker
    if (isDesktop && window.Telegram?.WebApp?.showPopup) {
      // Показываем подсказку для desktop версии
      window.Telegram.WebApp.showPopup({
        title: 'Совет',
        message: 'В десктопной версии Telegram вы можете перетащить файл в эту область',
        buttons: [{type: 'ok'}]
      });
    }
    fileInputRef.current?.click();
  };

  // Drag and Drop обработчики
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Проверяем, что мы действительно покинули dropZone
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    
    // Фильтруем файлы по accept если указан
    let filteredFiles = files;
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      filteredFiles = files.filter(file => {
        return acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            // Например: image/*
            const baseType = type.replace('/*', '');
            return file.type.startsWith(baseType);
          }
          return file.type === type || file.name.endsWith(type.replace('*', ''));
        });
      });
    }

    // Если multiple = false, берем только первый файл
    const finalFiles = multiple ? filteredFiles : filteredFiles.slice(0, 1);
    
    if (finalFiles.length > 0) {
      handleFiles(finalFiles);
    } else if (files.length > 0) {
      alert(`Пожалуйста, выберите файлы следующих типов: ${accept}`);
    }
  };

  return (
    <div 
      ref={dropZoneRef}
      className={`ac-file-picker ${isDragging ? 'ac-file-picker-dragging' : ''} ${isDesktop ? 'ac-file-picker-desktop' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        ref={fileInputRef}
        className="ac-file-input" 
        type="file" 
        accept={accept} 
        multiple={multiple} 
        onChange={handleChange}
        capture={undefined}
      />
      <div className="ac-file-picker-button" onClick={handleClick}>
        <img src={paperClipIcon} alt="Attach file" className="ac-paper-clip-icon" />
      </div>
      {isDragging && (
        <div className="ac-file-picker-overlay">
          <div className="ac-file-picker-overlay-text">
            Отпустите файл для загрузки
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePicker;
