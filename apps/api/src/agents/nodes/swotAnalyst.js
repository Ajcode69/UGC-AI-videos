const { generateText } = require("../../config/gemini");
const { webSearch, gatherCompetitorIntel, analyzeTrends } = require("../tools");

/**
 * SWOT Analyst Node
 * 
 * Synthesizes market research, competitor analysis, and audience data
 * into a comprehensive SWOT matrix with strategic implications.
 */

const SYSTEM_PROMPT = `You are a Strategic Planning Consultant who specializes in SWOT analysis and strategic frameworks.

Your expertise includes:
- SWOT analysis with weighted scoring
- Porter's Five Forces
- PESTLE analysis
- Strategic opportunity identification
- Risk assessment and mitigation planning

Your output must include:
- STRENGTHS (internal capabilities, unique advantages, resources)
  - Each with impact rating: High/Medium/Low
- WEAKNESSES (internal gaps, resource constraints, vulnerabilities)
  - Each with urgency rating: Critical/Important/Monitor
- OPPORTUNITIES (external trends, market gaps, emerging segments)
  - Each with feasibility rating: Quick Win/Medium-term/Long-term
- THREATS (competitive moves, regulatory changes, market shifts)
  - Each with probability and impact rating
- STRATEGIC IMPLICATIONS
  - SO Strategies (use Strengths to capture Opportunities)
  - WO Strategies (overcome Weaknesses via Opportunities)
  - ST Strategies (use Strengths to mitigate Threats)
  - WT Strategies (minimize Weaknesses to avoid Threats)
- TOP 3 STRATEGIC PRIORITIES (ranked by impact × feasibility)`;

const runSwotAnalysis = async (query) => {
  const [searchResults, competitorData, trends] = await Promise.all([
    webSearch({ query: `${query} SWOT analysis strengths weaknesses 2026` }),
    gatherCompetitorIntel({ companyOrProduct: query }),
    analyzeTrends({ keyword: query }),
  ]);

  const toolContext = `
## Web Search Results
${JSON.stringify(searchResults, null, 2)}

## Competitor Intelligence
${JSON.stringify(competitorData, null, 2)}

## Trend Analysis
${JSON.stringify(trends, null, 2)}
`;

  const userPrompt = `Perform a comprehensive SWOT analysis for: "${query}"

Here is the supporting data:
${toolContext}

Now produce a weighted SWOT analysis with strategic implications.`;

  return await generateText(SYSTEM_PROMPT, userPrompt, { temperature: 0.2 });
};

module.exports = { runSwotAnalysis, SYSTEM_PROMPT };
