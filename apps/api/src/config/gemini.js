const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Factory for Gemini model instances.
 * Centralizes model config so every agent/node gets a consistent setup.
 */
const createModel = (overrides = {}) => {
  return new ChatGoogleGenerativeAI({
    model: overrides.model || "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: overrides.temperature ?? 0.7,
    maxOutputTokens: overrides.maxOutputTokens ?? 8192,
  });
};

/**
 * A low-temperature model for structured/analytical work.
 */
const createAnalyticalModel = (overrides = {}) => {
  return createModel({ temperature: 0.2, ...overrides });
};

/**
 * A higher-temperature model for creative generation.
 */
const createCreativeModel = (overrides = {}) => {
  return createModel({ temperature: 0.9, ...overrides });
};

module.exports = {
  createModel,
  createAnalyticalModel,
  createCreativeModel,
};
