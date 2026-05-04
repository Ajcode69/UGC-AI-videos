const { createAnalyticalModel } = require("../../config/gemini");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");

/**
 * Market Researcher Node
 * 
 * The primary research agent. Uses web search and trend analysis tools
 * to gather raw market data, then synthesizes findings into a structured
 * market research brief.
 * 
 * Can be used standalone or as a node in the full research workflow.
 */

const SYSTEM_PROMPT = `You are a Senior Market Research Analyst with 15+ years of experience at top consulting firms (McKinsey, BCG, Bain).

Your expertise includes:
- Market sizing and TAM/SAM/SOM analysis
- Industry trend identification and forecasting
- Consumer behavior analysis
- Market segmentation
- Growth opportunity identification

When conducting research:
1. ALWAYS use the web_search tool to find current, real data — never fabricate statistics
2. Use the trend_analyzer tool to understand market momentum and seasonality
3. Cross-reference multiple sources before drawing conclusions
4. Distinguish between verified data and your own inferences (label them clearly)
5. Think about macro trends (economic, technological, social) that affect the market

Your output should be a structured research brief with:
- Market Overview (size, growth rate, key players)
- Key Trends (with evidence)
- Market Drivers & Inhibitors
- Opportunity Areas
- Data gaps and areas needing deeper investigation`;

const createMarketResearcherNode = (tools) => {
  const model = createAnalyticalModel().bindTools(tools);

  return async (state) => {
    const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];
    const response = await model.invoke(messages);
    return { messages: [response] };
  };
};

/**
 * Standalone function — run the market researcher outside a graph.
 */
const runMarketResearcher = async (query, tools) => {
  const model = createAnalyticalModel().bindTools(tools);
  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(query),
  ];
  return await model.invoke(messages);
};

module.exports = { createMarketResearcherNode, runMarketResearcher };
