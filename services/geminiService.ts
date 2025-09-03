
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT_GENERATION_MODEL = 'gemini-2.5-flash';
const IMAGE_GENERATION_MODEL = 'gemini-2.5-flash-image-preview';

/**
 * Generates 8 distinct style prompts based on an image and document context.
 */
export const generateStylePrompts = async (imageBase64: string, mimeType: string, context: string): Promise<string[]> => {
  const base64Data = imageBase64.split(',')[1];
  
  const prompt = `Você é um diretor de criação especializado em design moderno de documentos. Com base na imagem anexada e no contexto do documento de "${context}", gere exatamente 8 sugestões de estilo distintas, concisas e práticas. Essas sugestões serão usadas para remodelar a imagem. Os estilos devem ser variados e profissionais (ex: 'Uma ilustração vetorial minimalista com uma paleta de cores duotone', 'Uma foto cinematográfica com iluminação dramática e um toque corporativo', 'Um efeito abstrato de aquarela', 'Um design retrofuturista com detalhes em neon'). Cada sugestão deve ser uma frase curta e descritiva. Retorne o resultado como um array JSON de 8 strings.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: PROMPT_GENERATION_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A creative style prompt for image remodeling.",
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const prompts = JSON.parse(jsonString);

    if (!Array.isArray(prompts) || prompts.length === 0) {
      throw new Error("A API retornou um formato inválido para as sugestões.");
    }
    
    return prompts.slice(0, 8); // Ensure exactly 8 prompts
  } catch (error) {
    console.error("Error generating style prompts:", error);
    throw new Error("Falha ao gerar estilos criativos da IA.");
  }
};

/**
 * Generates a new image variation based on an original image and a style prompt.
 */
export const generateImageVariation = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
  const base64Data = imageBase64.split(',')[1];
  
  const fullPrompt = `Por favor, remodele a imagem fornecida para corresponder ao seguinte estilo: "${prompt}". É crucial manter a proporção original, o assunto principal e preservar qualquer texto dentro da imagem sem alterá-lo.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: IMAGE_GENERATION_MODEL,
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: fullPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const newImageData = part.inlineData.data;
        const newMimeType = part.inlineData.mimeType;
        return `data:${newMimeType};base64,${newImageData}`;
      }
    }

    throw new Error("Nenhuma imagem foi gerada pelo modelo.");
  } catch (error) {
    console.error(`Error generating image for prompt "${prompt}":`, error);
    throw new Error(`A IA falhou ao criar uma imagem para o estilo: "${prompt}".`);
  }
};