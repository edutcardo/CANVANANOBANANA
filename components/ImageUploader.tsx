
import React, { useState, useCallback } from 'react';
import type { OriginalImage } from '../types';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (image: OriginalImage) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload({
          file: file,
          base64: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecione um arquivo de imagem válido.');
    }
  };
  
  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);


  return (
    <div className="w-full max-w-lg mx-auto">
      <label
        htmlFor="image-upload"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-brand-secondary bg-dark-card' : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-dark-subtext">
            <span className="font-semibold text-brand-secondary">Clique para enviar</span> ou arraste e solte
          </p>
          <p className="text-xs text-dark-subtext">PNG, JPG, GIF ou WEBP</p>
        </div>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
        />
      </label>
    </div>
  );
};

export default ImageUploader;