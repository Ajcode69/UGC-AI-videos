const { createAnalyticalModel } = require("../../config/gemini");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");

/**
 * Competitor Analyst Node
 * 
 * Specializes in competitive landscape analysis. Researches direct and
 * indirect competitors, analyzes positioning, pricing, strengths/weaknesses,
 * and identifies competitive moats and vulnerabilities.
 * 
 * Can be used standalone or as a node in the full research workflow.
 */

const SYSTEM_PROMPT = `You are a Competitive Intelligence Analyst specializing in deep competitive analysis.

Your expertise includes:
- Competitor identification (direct, indirect, and emerging)
- Competitive positioning maps
- Pricing strategy analysis
- Feature/capability comparison matrices
- SWOT per competitor
- Competitive moat and vulnerability assessment

When analyzing competitors:
1. Use the competitor_intel tool to gather data on each competitor
2. Use web_search to supplement with latest news, funding rounds, product launches
3. Look for patterns: who's winning market share and why
4. Identify under-served niches that competitors are ignoring
5. Assess barriers to entry and switching costs

Your output should include:
- Competitive Landscape Overview (market map)
- Top 3-5 Competitors Deep Dive (for each: positioning, pricing, strengths, weaknesses)
- Competitive Positioning Matrix
- Threat Assessment (who is the biggest threat and why)
- Strategic Gaps & Opportunities (where competitors are weak)`;

const createCompetitorAnalystNode = (tools) => {
  const model = createAnalyticalModel().bindTools(tools);

  return async (state) => {
    const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];
    const response = await model.invoke(messages);
    return { messages: [response] };
  };
};

/**
 * Standalone function — run competitor analysis outside a graph.
 */
const runCompetitorAnalysis = async (query, tools) => {
  const model = createAnalyticalModel().bindTools(tools);
  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(query),
  ];
  return await model.invoke(messages);
};

module.exports = { createCompetitorAnalystNode, runCompetitorAnalysis };
