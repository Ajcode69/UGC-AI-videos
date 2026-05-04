const { StateGraph, Annotation, END, START } = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { HumanMessage } = require("@langchain/core/messages");

const { webSearchTool } = require("../tools/webSearch");
const { trendAnalyzerTool } = require("../tools/trendAnalyzer");
const { competitorIntelTool } = require("../tools/competitorIntel");
const { audienceInsightsTool } = require("../tools/audienceInsights");

const { createMarketResearcherNode } = require("../nodes/marketResearcher");
const { createCompetitorAnalystNode } = require("../nodes/competitorAnalyst");
const { createPersonaGeneratorNode } = require("../nodes/personaGenerator");
const { createSwotAnalystNode } = require("../nodes/swotAnalyst");
const { createCampaignStrategistNode } = require("../nodes/campaignStrategist");

// ── All tools ─────────────────────────────────────────
const allTools = [webSearchTool, trendAnalyzerTool, competitorIntelTool, audienceInsightsTool];

// ── Shared State ──────────────────────────────────────
const SingleAgentState = Annotation.Root({
  messages: Annotation({
    reducer: (left, right) => {
      if (Array.isArray(right)) return left.concat(right);
      return left.concat([right]);
    },
    default: () => [],
  }),
});

// ── Shared routing logic ──────────────────────────────
const shouldContinue = (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return "__end__";
};

/**
 * Build a standalone single-agent graph.
 * Each agent loops with tools until it produces a final answer.
 * 
 *   START → agent ↔ tools → END
 */
const buildSingleAgentGraph = (agentNodeFactory, tools) => {
  const toolNode = new ToolNode(tools);

  const graph = new StateGraph(SingleAgentState)
    .addNode("agent", agentNodeFactory(tools))
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  return graph.compile();
};

// ── Individual workflow builders ──────────────────────

const buildMarketResearcherGraph = () =>
  buildSingleAgentGraph(createMarketResearcherNode, allTools);

const buildCompetitorAnalystGraph = () =>
  buildSingleAgentGraph(createCompetitorAnalystNode, [webSearchTool, competitorIntelTool]);

const buildPersonaGeneratorGraph = () =>
  buildSingleAgentGraph(createPersonaGeneratorNode, [webSearchTool, audienceInsightsTool]);

const buildSwotAnalystGraph = () =>
  buildSingleAgentGraph(createSwotAnalystNode, [webSearchTool, competitorIntelTool, trendAnalyzerTool]);

const buildCampaignStrategistGraph = () =>
  buildSingleAgentGraph(createCampaignStrategistNode, [webSearchTool, trendAnalyzerTool, audienceInsightsTool]);

// ── Runner helpers ────────────────────────────────────

/**
 * Run a standalone market research analysis.
 */
const runStandaloneMarketResearch = async (query) => {
  const app = buildMarketResearcherGraph();
  return await app.invoke({ messages: [new HumanMessage(query)] });
};

/**
 * Run a standalone competitor analysis.
 */
const runStandaloneCompetitorAnalysis = async (query) => {
  const app = buildCompetitorAnalystGraph();
  return await app.invoke({ messages: [new HumanMessage(query)] });
};

/**
 * Run standalone persona generation.
 */
const runStandalonePersonaGeneration = async (query) => {
  const app = buildPersonaGeneratorGraph();
  return await app.invoke({ messages: [new HumanMessage(query)] });
};

/**
 * Run a standalone SWOT analysis.
 */
const runStandaloneSwotAnalysis = async (query) => {
  const app = buildSwotAnalystGraph();
  return await app.invoke({ messages: [new HumanMessage(query)] });
};

/**
 * Run a standalone campaign strategy.
 */
const runStandaloneCampaignStrategy = async (query) => {
  const app = buildCampaignStrategistGraph();
  return await app.invoke({ messages: [new HumanMessage(query)] });
};

module.exports = {
  // Graph builders (for custom composition)
  buildMarketResearcherGraph,
  buildCompetitorAnalystGraph,
  buildPersonaGeneratorGraph,
  buildSwotAnalystGraph,
  buildCampaignStrategistGraph,
  buildSingleAgentGraph,

  // Runners (for quick standalone use)
  runStandaloneMarketResearch,
  runStandaloneCompetitorAnalysis,
  runStandalonePersonaGeneration,
  runStandaloneSwotAnalysis,
  runStandaloneCampaignStrategy,
};
