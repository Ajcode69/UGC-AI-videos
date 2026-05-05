const { generateText } = require("../../config/gemini");
const { webSearch, analyzeTrends, gatherCompetitorIntel, gatherAudienceInsights } = require("../tools");

/**
 * Market Researcher Node
 * 
 * The primary research agent. Gathers tool data first, then synthesizes
 * findings into a structured market research brief using Gemini.
 */

const SYSTEM_PROMPT = `You are a Senior Market Research Analyst with 15+ years of experience at top consulting firms (McKinsey, BCG, Bain).

Your expertise includes:
- Market sizing and TAM/SAM/SOM analysis
- Industry trend identification and forecasting
- Consumer behavior analysis
- Market segmentation
- Growth opportunity identification

Your output should be a structured research brief with:
- Market Overview (size, growth rate, key players)
- Key Trends (with evidence)
- Market Drivers & Inhibitors
- Opportunity Areas
- Data gaps and areas needing deeper investigation

Distinguish between verified data and your own inferences (label them clearly).`;

/**
 * Run market research — gathers tool data, then sends everything to Gemini.
 */
const runMarketResearcher = async (query) => {
  // Step 1: Gather data from all tools in parallel
  const [searchResults, trends, competitorData, audienceData] = await Promise.all([
    webSearch({ query: `${query} market size trends 2026` }),
    analyzeTrends({ keyword: query }),
    gatherCompetitorIntel({ companyOrProduct: query }),
    gatherAudienceInsights({ productCategory: query }),
  ]);

  // Step 2: Compose the full context for Gemini
  const toolContext = `
## Web Search Results
${JSON.stringify(searchResults, null, 2)}

## Trend Analysis
${JSON.stringify(trends, null, 2)}

## Competitor Intelligence
${JSON.stringify(competitorData, null, 2)}

## Audience Insights
${JSON.stringify(audienceData, null, 2)}
`;

  const userPrompt = `Research query: "${query}"

Here is the data I gathered from various tools:
${toolContext}

Now synthesize all of this into a comprehensive market research brief.`;

  return await generateText(SYSTEM_PROMPT, userPrompt, { temperature: 0.2 });
};

module.exports = { runMarketResearcher, SYSTEM_PROMPT };
