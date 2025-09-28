import axios from "axios";

export interface FileInfo {
  name: string;
  size: number;
  modified: string;
  type: string;
  url: string;
}

export interface UploadedFileInfo {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  thumbnailUrl?: string | null;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

// Функция для генерации уникального имени файла
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  
  // Разбираем имя файла на базовое имя и расширение
  const lastDotIndex = originalName.lastIndexOf('.');
  
  if (lastDotIndex === -1) {
    // Нет расширения
    return `${originalName}_${timestamp}_${random}`;
  } else {
    // Есть расширение
    const baseName = originalName.substring(0, lastDotIndex);
    const extension = originalName.substring(lastDotIndex);
    return `${baseName}_${timestamp}_${random}${extension}`;
  }
}

class FilesAPI {
  private api = axios.create({
    baseURL: API_BASE_URL,
  });

  // Флаг для отслеживания активного скачивания
  private isDownloading = false;

  async uploadFiles(
    files: File[],
    onProgress?: (i: number, p: number) => void
  ): Promise<UploadedFileInfo[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await this.api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentComplete =
              (progressEvent.loaded / progressEvent.total) * 100;
            // For simplicity, we report the same progress for all files
            files.forEach((_, index) => {
              onProgress(index, Math.round(percentComplete));
            });
          }
        },
      });

      if (response.data.success) {
        return response.data.files;
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `HTTP ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Network error during upload");
      } else {
        throw new Error(error.message || "Upload failed");
      }
    }
  }

  async getFile(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    return response.blob();
  }

  async downloadFile(fileUrl: string, fileName: string): Promise<void> {
    try {
      // Проверяем, не идет ли уже скачивание
      if (this.isDownloading) {
        console.log('Download already in progress, ignoring request');
        return;
      }

      console.log('Downloading file:', fileName);

      // Устанавливаем флаг скачивания
      this.isDownloading = true;

      // Генерируем уникальное имя файла на случай конфликтов
      const uniqueFileName = generateUniqueFileName(fileName);
      
      // Формируем полный HTTPS URL файла
      const fullFileUrl = `${process.env.REACT_APP_API_URL}${fileUrl}`;
      
      console.log('Download URL:', fullFileUrl);
      console.log('Unique filename:', uniqueFileName);
      
      // Проверяем, доступен ли Telegram WebApp API
      if (window.Telegram?.WebApp?.downloadFile) {
        console.log('Using Telegram WebApp downloadFile API');
        
        // Используем официальный Telegram WebApp API с DownloadFileParams
        const downloadParams = {
          url: fullFileUrl,
          file_name: uniqueFileName
        };
        
        // Callback функция для отслеживания результата
        const downloadCallback = (success: boolean) => {
          // Сбрасываем флаг скачивания
          this.isDownloading = false;
          
          if (success) {
            console.log('File download completed successfully via Telegram WebApp');
          } else {
            console.error('File download failed via Telegram WebApp');
            // Fallback to browser download
            this.fallbackBrowserDownload(fullFileUrl, uniqueFileName);
          }
        };
        
        window.Telegram.WebApp.downloadFile(downloadParams, downloadCallback);
        
        // Таймаут на случай, если callback не вызовется (30 секунд)
        setTimeout(() => {
          if (this.isDownloading) {
            console.warn('Download timeout, resetting download state');
            this.isDownloading = false;
          }
        }, 30000);
        
      } else {
        console.warn('Telegram WebApp downloadFile not available, using browser download');
        this.fallbackBrowserDownload(fullFileUrl, uniqueFileName);
        // Сбрасываем флаг скачивания для браузерного скачивания
        this.isDownloading = false;
      }
      
    } catch (error: any) {
      // Сбрасываем флаг в случае ошибки
      this.isDownloading = false;
      console.error('Download failed:', error);
      throw new Error(error.message || 'Download failed');
    }
  }
  
  private fallbackBrowserDownload(url: string, filename: string): void {
    console.log('Using fallback browser download');
    
    // Создаем ссылку для скачивания
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    
    // Добавляем в DOM и кликаем
    document.body.appendChild(link);
    
    // Программный клик
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    link.dispatchEvent(clickEvent);
    
    // Удаляем ссылку через небольшое время
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 100);
  }

  // async getFilesList(folder?: string): Promise<FileInfo[]> {
  //   const endpoint = folder
  //     ? `/upload/files/${folder}`
  //     : "/upload/files";
  //   const response = await fetch(endpoint);
  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch files list: ${response.statusText}`);
  //   }
  //   const data = await response.json();
  //   return data.files || [];
  // }
}

export const filesAPI = new FilesAPI();

// Utility function for direct file download
export function downloadFile(url: string, filename?: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
