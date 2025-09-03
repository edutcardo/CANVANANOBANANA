
import React from 'react';
import type { OriginalImage, GeneratedImage } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import RefreshIcon from './icons/RefreshIcon';

interface ImageGridProps {
  originalImage: OriginalImage;
  generatedImages: GeneratedImage[];
  context: string;
  selectedImage: OriginalImage | GeneratedImage | null;
  onImageSelect: (image: OriginalImage | GeneratedImage) => void;
  onGenerateAgain: () => void;
  onReset: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ 
  originalImage, 
  generatedImages, 
  context, 
  selectedImage,
  onImageSelect,
  onGenerateAgain,
  onReset 
}) => {

  const getFileExtension = (base64: string): string => {
    const mimeType = base64.match(/data:(image\/\w+);base64,/)?.[1] || 'image/png';
    return mimeType.split('/')[1] || 'png';
  }

  const handleDownload = (src: string, filename: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadSelected = () => {
    if (!selectedImage) return;
    const isOriginal = !('prompt' in selectedImage);
    const imageSrc = isOriginal ? selectedImage.base64 : selectedImage.src;
    const extension = getFileExtension(imageSrc);
    const filename = isOriginal 
      ? `original-${originalImage.file.name}` 
      : `remix-${context.replace(/\s+/g, '_')}-${selectedImage.id + 1}.${extension}`;
    handleDownload(imageSrc, filename);
  };

  const handleDownloadAll = () => {
    generatedImages.forEach((image) => {
      const extension = getFileExtension(image.src);
      const filename = `remix-${context.replace(/\s+/g, '_')}-${image.id + 1}.${extension}`;
      handleDownload(image.src, filename);
    });
  };

  const allImages = [originalImage, ...generatedImages];

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Column: Thumbnails and Actions */}
      <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6 self-stretch">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-dark-text">Resultados para: <span className="text-brand-secondary">{context}</span></h2>
          <p className="text-dark-subtext mt-1">Selecione uma imagem para pré-visualizar.</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 pr-2 overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-250px)]">
          {allImages.map((image, index) => {
            const isSelected = selectedImage === image;
            const isOriginal = !('prompt' in image);
            const src = isOriginal ? image.base64 : image.src;
            return (
              <button
                key={isOriginal ? 'original' : image.id}
                onClick={() => onImageSelect(image)}
                className={`relative aspect-square rounded-lg overflow-hidden focus:outline-none transition-all duration-200 ring-offset-2 ring-offset-dark-bg ${isSelected ? 'ring-2 ring-brand-secondary' : 'ring-0 hover:ring-2 ring-gray-600'}`}
              >
                <img src={src} alt={isOriginal ? 'Original' : `Variação ${image.id + 1}`} className="w-full h-full object-cover" />
                {isOriginal && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Original</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-col gap-3 mt-auto pt-4">
           <button
            onClick={onGenerateAgain}
            className="w-full px-6 py-3 text-base font-semibold text-white bg-brand-primary rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-500 transition-all flex items-center justify-center gap-2"
          >
            <RefreshIcon className="w-5 h-5" />
            Gerar Novamente
          </button>
          <button
            onClick={handleDownloadAll}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" />
            Baixar Todas as 8 Variações
          </button>
          <button
            onClick={onReset}
            className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Começar de Novo
          </button>
        </div>
      </div>
      
      {/* Right Column: Large Preview */}
      <div className="w-full lg:w-2/3 xl:w-3/4 sticky top-8">
        <div className="w-full bg-dark-card rounded-xl shadow-2xl p-4 flex flex-col">
          <div className="relative w-full aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
             {selectedImage ? (
                <img 
                  src={'src' in selectedImage ? selectedImage.src : selectedImage.base64} 
                  alt="Selected preview" 
                  className="max-w-full max-h-full object-contain"
                />
             ) : (
                <p className="text-dark-subtext">Selecione uma imagem para pré-visualizar</p>
             )}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-dark-text">
                {'prompt' in selectedImage ? 'Estilo Sugerido' : 'Imagem Original'}
              </h3>
              <p className="text-dark-subtext text-sm mt-1">
                {'prompt' in selectedImage ? selectedImage.prompt : originalImage.file.name}
              </p>
            </div>
            <button
              onClick={handleDownloadSelected}
              disabled={!selectedImage}
              className="px-6 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed flex-shrink-0"
            >
              <DownloadIcon className="w-5 h-5" />
              Baixar Selecionada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;