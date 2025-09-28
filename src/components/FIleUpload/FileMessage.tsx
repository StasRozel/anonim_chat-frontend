import React, { useState } from "react";
import "./FileMessage.css";
import { filesAPI } from "../../services/files.api";
import ModalImage from "../ModalWindows/ModalImage/ModalImage";

const fileIcon = require("./assets/download-file.png");
const downloadIcon = require("./assets/download-button.png");

type FileMessageProps = {
  fileName: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  isDownloaded?: boolean;
};

// Функция для форматирования размера файла
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";

  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;

  if (gb >= 1) {
    return `${gb.toFixed(1)} ГБ`;
  } else if (mb >= 1) {
    return `${mb.toFixed(1)} МБ`;
  } else if (kb >= 1) {
    return `${Math.round(kb)} КБ`;
  } else {
    return `${bytes} Б`;
  }
};

const FileMessage: React.FC<FileMessageProps> = ({
  fileName,
  fileSize,
  fileType,
  fileUrl,
  isDownloaded = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = async () => {
    if (!fileUrl || !fileName) return;
    
    try {
      console.log('fileName', fileName);
      await filesAPI.downloadFile(fileUrl, fileName);
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="ac-file-message">
        {fileType && fileType.startsWith("image/") ? (
          <img
            src={`${process.env.REACT_APP_API_URL}${fileUrl}`}
            alt="Image"
            className="ac-file-image"
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <>
            <div className="ac-file-icon" aria-hidden>
              <button className="ac-file-download" type="button" onClick={handleDownload}>
                  {isDownloaded ? (
                <img src={fileIcon} alt="File" width="20" height="20" />
              ) : (
                <img src={downloadIcon} alt="Loading" width="20" height="20" />
              )}
                </button>
              
            </div>
            <div className="ac-file-meta">
              <div className="ac-file-name">{fileName}</div>
              <div className="ac-file-info">
                {fileSize && (
                  <span className="ac-file-size">{formatFileSize(fileSize)}</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {fileType && fileType.startsWith("image/") && (
        <ModalImage
          isOpen={isModalOpen}
          onClose={handleModalClose}
          imageUrl={fileUrl || ''}
          fileName={fileName}
          alt={fileName}
        />
      )}
    </>
  );
};

export default FileMessage;
