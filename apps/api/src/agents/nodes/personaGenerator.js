const { createCreativeModel } = require("../../config/gemini");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");

/**
 * Persona Generator Node
 * 
 * Creates detailed user personas from market research data and audience insights.
 * Each persona includes demographics, psychographics, pain points, goals,
 * preferred channels, and a "day in the life" narrative.
 * 
 * Can be used standalone or as a node in the full research workflow.
 */

const SYSTEM_PROMPT = `You are a User Research & Persona Design Specialist with deep expertise in behavioral psychology and consumer research.

Your expertise includes:
- User persona creation (Jobs-to-be-Done framework)
- Psychographic profiling (values, attitudes, lifestyle)
- Customer journey mapping
- Pain point identification
- Empathy mapping

When generating personas:
1. Use audience_insights tool to ground personas in real demographic data
2. Use web_search to find actual consumer discussions, reviews, and forum posts
3. Create 3-5 distinct personas with meaningful differences (not just age/gender variations)
4. Each persona must feel like a REAL person, not a stereotype
5. Include specific behavioral patterns and decision-making criteria

For EACH persona, provide:
- Name, Age, Location, Occupation, Income Range
- Photo description (for visual reference)
- Quote that captures their mindset
- Demographics (education, family status, tech savviness)
- Psychographics (values, interests, lifestyle, personality traits)
- Goals & Motivations (what drives them)
- Pain Points & Frustrations (what keeps them up at night)
- Buying Behavior (how they discover, evaluate, and purchase)
- Media Consumption (which platforms, influencers, content types)
- Objections to Purchase (why they might NOT buy)
- "Day in the Life" mini-narrative (2-3 sentences)

IMPORTANT: Personas should be diverse in meaningful ways — different motivations, different objections, different channels. Not just demographic diversity for its own sake.`;

const createPersonaGeneratorNode = (tools) => {
  const model = createCreativeModel({ temperature: 0.8 }).bindTools(tools);

  return async (state) => {
    const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];
    const response = await model.invoke(messages);
    return { messages: [response] };
  };
};

/**
 * Standalone function — generate user personas outside a graph.
 */
const runPersonaGeneration = async (query, tools) => {
  const model = createCreativeModel({ temperature: 0.8 }).bindTools(tools);
  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(query),
  ];
  return await model.invoke(messages);
};

module.exports = { createPersonaGeneratorNode, runPersonaGeneration };
