const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");

// Initialize LLM - Assuming OpenAI, but extensible to others
const initializeModel = () => {
  return new ChatOpenAI({
    modelName: "gpt-4o-mini", // Cost effective, fast
    temperature: 0.7,
  });
};

const generateAdCopy = async ({ photoContext, userPrompt }) => {
  const model = initializeModel();

  const template = `
  You are an expert AI marketing agent. Your job is to create high-converting, catchy ad copy based on the provided photo context and user instructions.
  
  Photo Context: {photoContext}
  User Instructions: {userPrompt}

  Return the ad copy structured with a Headline, Body, and Call to Action.
  `;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["photoContext", "userPrompt"],
  });

  const chain = prompt.pipe(model);
  
  const response = await chain.invoke({
    photoContext,
    userPrompt
  });

  return response.content;
};

module.exports = {
  generateAdCopy
};
