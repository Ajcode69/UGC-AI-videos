const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Singleton Google GenAI client.
 * Every module that needs Gemini or Veo uses this.
 */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate text using Gemini (for research agents, analysis, etc.).
 *
 * @param {string} systemPrompt - The system-level instruction
 * @param {string} userPrompt - The user's query
 * @param {object} [options] - Optional overrides
 * @param {string} [options.model] - Model name (default: gemini-3.1-flash-lite-preview)
 * @param {number} [options.temperature] - Temperature (default: 0.7)
 * @param {number} [options.maxOutputTokens] - Max output tokens (default: 8192)
 * @returns {Promise<string>} The text response
 */
const generateText = async (systemPrompt, userPrompt, options = {}) => {
  const model = options.model || "gemini-3.1-flash-lite-preview";
  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
    },
  });
  return response.text;
};

/**
 * Generate a video using Veo 3.0 Fast.
 * This is an async long-running operation — polls until done.
 *
 * @param {string} prompt - The video generation prompt
 * @param {object} [options] - Optional config
 * @param {Buffer} [options.imageBytes] - Optional product image bytes for image-to-video
 * @param {string} [options.mimeType] - MIME type of the image (e.g., 'image/jpeg')
 * @returns {Promise<{videoUri: string, video: object}>} The generated video info
 */
const generateVideo = async (prompt, options = {}) => {
  const videoConfig = {
    model: "veo-3.0-fast-generate-001",
    prompt,
  };

  // If a product image was provided, include it for image-to-video generation
  if (options.imageBytes) {
    videoConfig.image = {
      imageBytes: options.imageBytes.toString("base64"),
      mimeType: options.mimeType || "image/jpeg",
    };
  }

  let operation = await ai.models.generateVideos(videoConfig);

  // Poll until complete
  while (!operation.done) {
    console.log("[Veo] Waiting for video generation to complete...");
    await new Promise((resolve) => setTimeout(resolve, 10000)); // 10s intervals
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const generatedVideo = operation.response.generatedVideos[0];

  return {
    video: generatedVideo.video,
    videoUri: generatedVideo.video?.uri || null,
  };
};

module.exports = {
  ai,
  generateText,
  generateVideo,
};
