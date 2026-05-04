const { createAnalyticalModel } = require("../../config/gemini");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");

/**
 * SWOT Analyst Node
 * 
 * Synthesizes market research, competitor analysis, and audience data
 * into a comprehensive SWOT matrix with strategic implications.
 * 
 * Can be used standalone or as a node in the full research workflow.
 */

const SYSTEM_PROMPT = `You are a Strategic Planning Consultant who specializes in SWOT analysis and strategic frameworks.

Your expertise includes:
- SWOT analysis with weighted scoring
- Porter's Five Forces
- PESTLE analysis
- Strategic opportunity identification
- Risk assessment and mitigation planning

When performing SWOT analysis:
1. Use web_search to validate assumptions about strengths and opportunities
2. Cross-reference competitive data to identify real (not assumed) weaknesses
3. Consider macro factors (economic, regulatory, technological) for threats
4. Weight each SWOT factor by impact and likelihood
5. Derive actionable strategic implications from each quadrant

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

const createSwotAnalystNode = (tools) => {
  const model = createAnalyticalModel().bindTools(tools);

  return async (state) => {
    const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];
    const response = await model.invoke(messages);
    return { messages: [response] };
  };
};

/**
 * Standalone function — run SWOT analysis outside a graph.
 */
const runSwotAnalysis = async (query, tools) => {
  const model = createAnalyticalModel().bindTools(tools);
  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(query),
  ];
  return await model.invoke(messages);
};

module.exports = { createSwotAnalystNode, runSwotAnalysis };
