import React from 'react';
import './FilePicker.css';

const paperClipIcon = require("./assets/paper-clip.png");

type FilePickerProps = {
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
};

const FilePicker: React.FC<FilePickerProps> = ({ accept = "*/*", multiple = false, onFilesSelected }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFilesSelected) return;
    const files = e.target.files ? Array.from(e.target.files) : [];
    onFilesSelected(files);
  };

  return (
    <label className="ac-file-picker">
      <input className="ac-file-input" type="file" accept={accept} multiple={multiple} onChange={handleChange} />
      <div className="ac-file-picker-button">
        <img src={paperClipIcon} alt="Attach file" className="ac-paper-clip-icon" />
      </div>
    </label>
  );
};

export default FilePicker;
