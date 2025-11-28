import { GoogleGenAI } from "@google/genai";
import { AppState, CopyMode } from "../types";
import { uploadImage } from "./storageService";

// Helper to strip base64 header if present
const stripBase64Header = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getApiKey = (): string => {
  // Get API Key from environment variable (Vercel will inject this)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in Vercel.");
  }
  return apiKey;
};

export const generateMainImage = async (state: AppState, userId: string): Promise<string> => {
  const apiKey = getApiKey();

  const ai = new GoogleGenAI({ apiKey });
  
  const parts: any[] = [];

  // Add Product Image (High priority)
  if (state.productImage) {
    parts.push({
      inlineData: {
        data: stripBase64Header(state.productImage),
        mimeType: 'image/png', // Assuming upload converts/validates or generic
      }
    });
  }

  // Add Reference Image
  if (state.referenceImage) {
    parts.push({
      inlineData: {
        data: stripBase64Header(state.referenceImage),
        mimeType: 'image/png',
      }
    });
  }

  // Construct Text Prompt
  let prompt = `Create a professional, high-quality, photorealistic 4K e-commerce product main image. 
  Style Category: ${state.selectedTag}.
  Composition: ${state.aspectRatio} aspect ratio. 
  
  Instructions:
  1. The first image provided is the PRODUCT. It must be clearly visible and the focal point.
  2. The second image (if provided) is a STYLE REFERENCE. Mimic its lighting, color palette, and composition style, but replace the subject with the PRODUCT.
  3. Realism is key. Do not produce "AI-oily" artifacts. Lighting should be natural and studio-grade.
  4. Platform optimization: The image should be suitable for Taobao/Pinduoduo/TikTok e-commerce.
  `;

  if (state.copyMode === CopyMode.MANUAL) {
    prompt += `
    5. TEXT RENDERING: You MUST render the following Chinese text legibly on the image. Matches the typography style of the reference if possible.
       - Main Title: "${state.mainCopy}"
       - Sub Title: "${state.subCopy}"
    `;
  } else {
    prompt += `
    5. TEXT RENDERING: Analyze the text in the STYLE REFERENCE image. Replicate the typography, placement, and content exactly onto the new image.
    `;
  }

  if (state.customPrompt) {
    prompt += `\nAdditional Instructions: ${state.customPrompt}`;
  }

  parts.push({ text: prompt });

  // Use Gemini 3 Pro for high quality generation
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: parts
    },
    config: {
      imageConfig: {
        aspectRatio: state.aspectRatio,
        imageSize: "1K", // Can upgrade to 2K/4K if needed/supported by quota
      }
    }
  });

  // Extract Image
  let base64Image: string | null = null;
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      base64Image = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!base64Image) {
    throw new Error("No image generated.");
  }

  // Upload to Supabase Storage and return public URL
  try {
    const publicUrl = await uploadImage(userId, base64Image);
    return publicUrl;
  } catch (error: any) {
    // If upload fails, return base64 as fallback
    console.error('Failed to upload to storage:', error);
    return base64Image;
  }
};

export const editGeneratedImage = async (
  currentImage: string,
  editInstruction: string,
  userId: string
): Promise<string> => {
  const apiKey = getApiKey();

  const ai = new GoogleGenAI({ apiKey });

  // Use Gemini 2.5 Flash Image for editing (Nano Banana)
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: stripBase64Header(currentImage),
            mimeType: 'image/png',
          },
        },
        {
          text: `Edit instruction: ${editInstruction}. Maintain photorealism. Output high quality image.`,
        },
      ],
    },
    // Note: aspect ratio is usually preserved or defined in Flash Image via config if generating new, 
    // but for editing we rely on the input image context.
  });

  let base64Image: string | null = null;
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      base64Image = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!base64Image) {
    throw new Error("Image edit failed.");
  }

  // Upload to Supabase Storage and return public URL
  try {
    const publicUrl = await uploadImage(userId, base64Image);
    return publicUrl;
  } catch (error: any) {
    // If upload fails, return base64 as fallback
    console.error('Failed to upload to storage:', error);
    return base64Image;
  }
};
