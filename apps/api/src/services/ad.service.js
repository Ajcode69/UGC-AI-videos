const adAgent = require('../agents/core/adAgent');

const createAdFromPhoto = async (photoPath, additionalPrompt) => {
  // Use the new Veo 3.0 video generation pipeline
  const result = await adAgent.generateAdVideo({
    photoPath,
    userPrompt: additionalPrompt || "Create a compelling UGC product video.",
  });

  return result;
};

// Legacy text-only fallback
const createAdCopyFromPhoto = async (photoPath, additionalPrompt) => {
  const result = await adAgent.generateAdCopy({
    photoContext: `Image located at ${photoPath}`,
    userPrompt: additionalPrompt || "Make a catchy ad for this product.",
  });

  return result;
};

module.exports = {
  createAdFromPhoto,
  createAdCopyFromPhoto,
};
