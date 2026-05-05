const { generateText } = require("../../config/gemini");
const { webSearch, gatherCompetitorIntel } = require("../tools");

/**
 * Competitor Analyst Node
 * 
 * Specializes in competitive landscape analysis.
 */

const SYSTEM_PROMPT = `You are a Competitive Intelligence Analyst specializing in deep competitive analysis.

Your expertise includes:
- Competitor identification (direct, indirect, and emerging)
- Competitive positioning maps
- Pricing strategy analysis
- Feature/capability comparison matrices
- SWOT per competitor
- Competitive moat and vulnerability assessment

Your output should include:
- Competitive Landscape Overview (market map)
- Top 3-5 Competitors Deep Dive (for each: positioning, pricing, strengths, weaknesses)
- Competitive Positioning Matrix
- Threat Assessment (who is the biggest threat and why)
- Strategic Gaps & Opportunities (where competitors are weak)`;

const runCompetitorAnalysis = async (query) => {
  const [searchResults, competitorData] = await Promise.all([
    webSearch({ query: `${query} competitors landscape 2026` }),
    gatherCompetitorIntel({ companyOrProduct: query }),
  ]);

  const toolContext = `
## Web Search Results
${JSON.stringify(searchResults, null, 2)}

## Competitor Intelligence
${JSON.stringify(competitorData, null, 2)}
`;

  const userPrompt = `Analyze the competitive landscape for: "${query}"

Here is the data I gathered:
${toolContext}

Now produce a comprehensive competitive analysis.`;

  return await generateText(SYSTEM_PROMPT, userPrompt, { temperature: 0.2 });
};

module.exports = { runCompetitorAnalysis, SYSTEM_PROMPT };
