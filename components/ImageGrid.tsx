
import React from 'react';
import type { OriginalImage, GeneratedImage } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import RefreshIcon from './icons/RefreshIcon';

type DisplayImage = GeneratedImage | { id: number; placeholder: true };
type SelectableImage = OriginalImage | GeneratedImage;

interface ImageGridProps {
  originalImage: OriginalImage;
  generatedImages: GeneratedImage[];
  context: string;
  selectedImage: SelectableImage | null;
  onImageSelect: (image: SelectableImage) => void;
  onGenerateAgain: () => void;
  onReset: () => void;
  isGenerating: boolean;
  generationProgress: { current: number; total: number } | null;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  originalImage,
  generatedImages,
  context,
  selectedImage,
  onImageSelect,
  onGenerateAgain,
  onReset,
  isGenerating,
  generationProgress,
}) => {
  const getFileExtension = (base64: string): string => {
    const mimeType =
      base64.match(/data:(image\/\w+);base64,/)?.[1] || "image/png";
    return mimeType.split("/")[1] || "png";
  };

  const handleDownload = (src: string, filename: string) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSelected = () => {
    if (!selectedImage) return;
    const isOriginal = !("prompt" in selectedImage);
    const imageSrc = isOriginal ? selectedImage.base64 : selectedImage.src;
    const extension = getFileExtension(imageSrc);
    const filename = isOriginal
      ? `original-${originalImage.file.name}`
      : `remix-${context.replace(/\s+/g, "_")}-${
          (selectedImage as GeneratedImage).id + 1
        }.${extension}`;
    handleDownload(imageSrc, filename);
  };

  const totalVariations = 8;

  const handleDownloadAll = () => {
    generatedImages.forEach((image) => {
      const extension = getFileExtension(image.src);
      const filename = `remix-${context.replace(/\s+/g, "_")}-${
        image.id + 1
      }.${extension}`;
      handleDownload(image.src, filename);
    });
  };

  const variationPlaceholders = Array.from(
    { length: totalVariations - generatedImages.length },
    (_, i) => ({
      id: generatedImages.length + i,
      placeholder: true as const,
    })
  );

  const allVariations: DisplayImage[] = isGenerating
    ? [...generatedImages, ...variationPlaceholders]
    : generatedImages;

  const allThumbnails = [originalImage, ...allVariations];
  const selectedIsGenerated = selectedImage && "prompt" in selectedImage;

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6 self-stretch">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-dark-text">
            Resultados para:{" "}
            <span className="text-brand-secondary">{context}</span>
          </h2>
          {isGenerating && generationProgress ? (
            <p className="text-brand-secondary mt-2 animate-pulse font-semibold">
              Gerando variação {generationProgress.current} de{" "}
              {generationProgress.total}...
            </p>
          ) : (
            <p className="text-dark-subtext mt-1">
              Selecione uma imagem para pré-visualizar.
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 pr-2 overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-250px)]">
          {allThumbnails.map((image) => {
            if ("placeholder" in image && image.placeholder) {
              return (
                <div
                  key={`placeholder-${image.id}`}
                  className="relative aspect-square rounded-lg bg-dark-card animate-pulse"
                  aria-label="Gerando imagem..."
                ></div>
              );
            }

            const selectableImage = image as SelectableImage;
            const isSelected = selectedImage === selectableImage;
            const isOriginal = !("prompt" in selectableImage);
            const src = isOriginal
              ? selectableImage.base64
              : selectableImage.src;
            return (
              <button
                key={isOriginal ? "original" : selectableImage.id}
                onClick={() => onImageSelect(selectableImage)}
                className={`relative aspect-square rounded-lg overflow-hidden focus:outline-none transition-all duration-200 ring-offset-2 ring-offset-dark-bg ${
                  isSelected
                    ? "ring-2 ring-brand-secondary"
                    : "ring-0 hover:ring-2 ring-gray-600"
                }`}
              >
                <img
                  src={src}
                  alt={
                    isOriginal
                      ? "Original"
                      : `Variação ${selectableImage.id + 1}`
                  }
                  className="w-full h-full object-cover"
                />
                {isOriginal && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      Original
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 mt-auto pt-4">
          <button
            onClick={onGenerateAgain}
            disabled={isGenerating}
            className="w-full px-6 py-3 text-base font-semibold text-white bg-brand-primary rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-700 disabled:cursor-wait transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <RefreshIcon className="w-5 h-5" />
                Gerar Novamente
              </>
            )}
          </button>
          <button
            onClick={handleDownloadAll}
            disabled={isGenerating || generatedImages.length < totalVariations}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <DownloadIcon className="w-5 h-5" />
            Baixar Todas as {totalVariations} Variações
          </button>
          <button
            onClick={onReset}
            disabled={isGenerating}
            className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-800 disabled:cursor-not-allowed"
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
                src={
                  selectedIsGenerated
                    ? selectedImage.src
                    : (selectedImage as OriginalImage).base64
                }
                alt="Selected preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <p className="text-dark-subtext">
                Selecione uma imagem para pré-visualizar
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-dark-text">
                {selectedIsGenerated ? "Estilo Sugerido" : "Imagem Original"}
              </h3>
              <p className="text-dark-subtext text-sm mt-1">
                {selectedIsGenerated
                  ? selectedImage.prompt
                  : (selectedImage as OriginalImage)?.file?.name ?? ""}
              </p>
            </div>
            <button
              onClick={handleDownloadSelected}
              disabled={!selectedImage || isGenerating}
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
