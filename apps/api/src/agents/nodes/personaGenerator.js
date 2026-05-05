const { generateText } = require("../../config/gemini");
const { webSearch, gatherAudienceInsights } = require("../tools");

/**
 * Persona Generator Node
 * 
 * Creates detailed user personas from market research data and audience insights.
 */

const SYSTEM_PROMPT = `You are a User Research & Persona Design Specialist with deep expertise in behavioral psychology and consumer research.

Your expertise includes:
- User persona creation (Jobs-to-be-Done framework)
- Psychographic profiling (values, attitudes, lifestyle)
- Customer journey mapping
- Pain point identification
- Empathy mapping

Create 3-5 distinct personas. For EACH persona, provide:
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

IMPORTANT: Personas should be diverse in meaningful ways — different motivations, different objections, different channels.`;

const runPersonaGeneration = async (query) => {
  const [searchResults, audienceData] = await Promise.all([
    webSearch({ query: `${query} target audience consumer behavior 2026` }),
    gatherAudienceInsights({ productCategory: query }),
  ]);

  const toolContext = `
## Web Search Results
${JSON.stringify(searchResults, null, 2)}

## Audience Insights
${JSON.stringify(audienceData, null, 2)}
`;

  const userPrompt = `Generate user personas for: "${query}"

Here is the audience data I gathered:
${toolContext}

Now create 3-5 detailed, realistic user personas.`;

  return await generateText(SYSTEM_PROMPT, userPrompt, { temperature: 0.8 });
};

module.exports = { runPersonaGeneration, SYSTEM_PROMPT };
