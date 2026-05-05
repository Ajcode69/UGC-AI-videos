const { generateText } = require("../../config/gemini");
const { generateVideoHF } = require("../../config/huggingface");
const fs = require("fs");
const path = require("path");

/**
 * Generate a UGC video using Wan-AI via Hugging Face.
 *
 * Two-step process:
 * 1. Use Gemini to analyze the product photo and create a video prompt
 * 2. Use Hugging Face (Wan-AI/Wan2.1-T2V-1.3B) to generate the actual video
 *
 * @param {object} params
 * @param {string} params.photoPath - Path to the uploaded product image
 * @param {string} params.userPrompt - Additional instructions from the user
 * @returns {Promise<object>} Generated video info
 */
const generateAdVideo = async ({ photoPath, userPrompt }) => {
  // Step 1: Use Gemini to create an optimized text prompt from the user instructions
  // (We use a text-only prompt here because text_to_video on HF takes text)
  const systemPrompt = `You are an expert UGC Video Director. Given a product description and user instructions, write a single, vivid, cinematic video prompt for a text-to-video AI model. 
  The prompt should describe a short (5-8 second) UGC-style product showcase video.
  Focus on: camera angles, lighting, product interaction, mood, and a compelling hook in the first 2 seconds.
  Output ONLY the video prompt text, nothing else.`;

  const hfPrompt = await generateText(
    systemPrompt,
    `User instructions: ${userPrompt || "Create a compelling UGC product video."}
Note: A product image has been uploaded. Create a vivid video prompt that showcases this type of product in a UGC style.`,
    { temperature: 0.9 }
  );

  // Step 2: Generate video with Hugging Face using the generated text prompt
  const result = await generateVideoHF(hfPrompt);

  return {
    hfPrompt, // The prompt that was sent to HF
    videoUri: result.videoUri,
  };
};

/**
 * Legacy text-only ad copy generation (kept for backward compat).
 */
const generateAdCopy = async ({ photoContext, userPrompt }) => {
  const systemPrompt = `You are an expert AI Video Director using the Veo 3.0 model. 
  Your job is to generate a high-converting UGC video concept based on the provided photo context and user instructions.
  Return the video generation prompt structured with a Hook, Scene Description, and Call to Action.`;

  return await generateText(
    systemPrompt,
    `Photo Context: ${photoContext}\nUser Instructions: ${userPrompt}`,
    { temperature: 0.7 }
  );
};

module.exports = {
  generateAdVideo,
  generateAdCopy,
};
