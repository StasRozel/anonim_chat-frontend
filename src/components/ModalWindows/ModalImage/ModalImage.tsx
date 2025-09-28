import React from 'react';
import './ModalImage.css';
import { filesAPI } from '../../../services/files.api';

type ModalImageProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName: string;
  alt?: string;
};

const ModalImage: React.FC<ModalImageProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fileName,
  alt = 'Image'
}) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await filesAPI.downloadFile(imageUrl, fileName);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Закрываем модальное окно только при клике на overlay, но не на изображение
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-image-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-image-container">
        <button 
          className="modal-image-download" 
          onClick={handleDownload}
          title="Download image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16Z" fill="white"/>
            <path d="M5 20V18H19V20H5Z" fill="white"/>
          </svg>
        </button>
        
        <button 
          className="modal-image-close" 
          onClick={onClose}
          title="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
          </svg>
        </button>

        <img 
          src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
          alt={alt}
          className="modal-image"
        />
      </div>
    </div>
  );
};

export default ModalImage;