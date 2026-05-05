const { HfInference } = require("@huggingface/inference");
const dotenv = require("dotenv");

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

/**
 * Generate a video using Hugging Face Inference API (via fal-ai provider)
 *
 * @param {string} prompt - The video generation prompt
 * @returns {Promise<{videoUri: string, videoBuffer: Buffer}>}
 */
const generateVideoHF = async (prompt) => {
  console.log(`[HF Video] Starting video generation with Wan-AI/Wan2.1-T2V-1.3B...`);

  // Call the Hugging Face Inference API for text-to-video.
  // Note: For custom providers like 'fal-ai', we can pass the provider in the options.
  const videoBlob = await hf.textToVideo({
    model: "Wan-AI/Wan2.1-T2V-14B",
    inputs: prompt,
    provider: "fal-ai", // Requesting fal-ai provider as specified
  });

  console.log(`[HF Video] Video generated successfully. Size: ${videoBlob.size} bytes`);
  const arrayBuffer = await videoBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // In a production app, you would upload this buffer to an S3/Supabase bucket 
  // and return the public URL. For now, we return it as a Base64 data URI so the 
  // frontend can immediately display it.
  const base64Data = buffer.toString('base64');
  const videoUri = `data:video/mp4;base64,${base64Data}`;

  return {
    videoUri,
    videoBuffer: buffer
  };
};

module.exports = {
  hf,
  generateVideoHF
};
