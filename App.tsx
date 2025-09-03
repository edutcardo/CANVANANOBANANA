
import React, { useState } from "react";
import { AppStatus } from './types';
import type { OriginalImage, GeneratedImage } from './types';
import { generateStylePrompts, generateImageVariation } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ContextInput from './components/ContextInput';
import Loader from './components/Loader';
import ImageGrid from './components/ImageGrid';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(
    null
  );
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<
    OriginalImage | GeneratedImage | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const handleImageUpload = (image: OriginalImage) => {
    setOriginalImage(image);
    setAppStatus(AppStatus.IMAGE_UPLOADED);
    setError(null);
    setGeneratedImages([]);
    setSelectedImage(null);
  };

  const handleContextSubmit = async (docContext: string) => {
    if (!originalImage) return;
    setContext(docContext);
    setAppStatus(AppStatus.GENERATING_STYLES);
    setError(null);
    setSelectedImage(null);
    setGeneratedImages([]);
    setGenerationProgress(null);

    try {
      const prompts = await generateStylePrompts(
        originalImage.base64,
        originalImage.file.type,
        docContext
      );

      setAppStatus(AppStatus.GENERATING_IMAGES);

      for (let i = 0; i < prompts.length; i++) {
        setGenerationProgress({ current: i + 1, total: prompts.length });
        const prompt = prompts[i];
        try {
          const newImageSrc = await generateImageVariation(
            originalImage.base64,
            originalImage.file.type,
            prompt
          );
          const newImage: GeneratedImage = {
            id: i,
            src: newImageSrc,
            prompt: prompt,
          };
          setGeneratedImages((prev) => [...prev, newImage]);
        } catch (imageGenError) {
          console.error(
            `Failed to generate image for prompt: "${prompt}"`,
            imageGenError
          );
          // Stop generation and show an error.
          throw new Error(
            `A IA falhou ao criar uma imagem para o estilo: "${prompt}".`
          );
        }
      }

      setAppStatus(AppStatus.COMPLETE);
      setSelectedImage(originalImage);
      setGenerationProgress(null);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro desconhecido ao gerar as imagens.";
      setError(`${errorMessage} Por favor, tente novamente.`);
      setAppStatus(AppStatus.ERROR);
      setGenerationProgress(null);
    }
  };

  const handleGenerateAgain = () => {
    if (context) {
      handleContextSubmit(context);
    }
  };

  const handleImageSelect = (image: OriginalImage | GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleReset = () => {
    setAppStatus(AppStatus.IDLE);
    setOriginalImage(null);
    setGeneratedImages([]);
    setError(null);
    setContext("");
    setSelectedImage(null);
    setGenerationProgress(null);
  };

  const renderContent = () => {
    const isGenerating = appStatus === AppStatus.GENERATING_IMAGES;
    switch (appStatus) {
      case AppStatus.IDLE:
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case AppStatus.IMAGE_UPLOADED:
        return (
          <div className="w-full max-w-lg mx-auto flex flex-col items-center">
            <img
              src={originalImage!.base64}
              alt="Preview"
              className="max-w-xs max-h-64 object-contain rounded-lg shadow-lg mb-8"
            />
            <ContextInput onSubmit={handleContextSubmit} isLoading={false} />
          </div>
        );
      case AppStatus.GENERATING_STYLES:
        return <Loader message="Buscando direções criativas..." />;
      case AppStatus.GENERATING_IMAGES:
      case AppStatus.COMPLETE:
        return (
          <ImageGrid
            originalImage={originalImage!}
            generatedImages={generatedImages}
            context={context}
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
            onGenerateAgain={handleGenerateAgain}
            onReset={handleReset}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
          />
        );
      case AppStatus.ERROR:
        return (
          <div className="text-center text-red-400">
            <p className="mb-4">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
            >
              Começar de Novo
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="text-center mb-10 w-full">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
          <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          Remixador de Imagens com IA
        </h1>
        <p className="mt-4 text-lg text-dark-subtext max-w-2xl mx-auto">
          Gere 8 estilos distintos para seus documentos. Chega de precisar do
          Canva.
        </p>
      </header>
      <main className="w-full flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
