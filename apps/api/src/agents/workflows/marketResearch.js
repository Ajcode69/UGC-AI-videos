const { StateGraph, Annotation, END, START } = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { BaseMessage, HumanMessage } = require("@langchain/core/messages");

// ── Tools ─────────────────────────────────────────────
const { webSearchTool } = require("../tools/webSearch");
const { trendAnalyzerTool } = require("../tools/trendAnalyzer");
const { competitorIntelTool } = require("../tools/competitorIntel");
const { audienceInsightsTool } = require("../tools/audienceInsights");

// ── Agent Nodes ───────────────────────────────────────
const { createMarketResearcherNode } = require("../nodes/marketResearcher");
const { createCompetitorAnalystNode } = require("../nodes/competitorAnalyst");
const { createPersonaGeneratorNode } = require("../nodes/personaGenerator");
const { createSwotAnalystNode } = require("../nodes/swotAnalyst");
const { createCampaignStrategistNode } = require("../nodes/campaignStrategist");
const { createSynthesizerNode } = require("../nodes/researchSynthesizer");

// ── All tools available to agents ─────────────────────
const allTools = [webSearchTool, trendAnalyzerTool, competitorIntelTool, audienceInsightsTool];

// ── State Schema ──────────────────────────────────────
const ResearchState = Annotation.Root({
  messages: Annotation({
    reducer: (left, right) => {
      if (Array.isArray(right)) return left.concat(right);
      return left.concat([right]);
    },
    default: () => [],
  }),
  // Track which phase we're in for routing
  currentPhase: Annotation({
    reducer: (_left, right) => right,
    default: () => "market_research",
  }),
  // Accumulated research sections
  researchSections: Annotation({
    reducer: (left, right) => ({ ...left, ...right }),
    default: () => ({}),
  }),
});

// ── Tool Node (shared) ────────────────────────────────
const toolNode = new ToolNode(allTools);

// ── Route: should agent continue to tools or move on? ─
const shouldCallTools = (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return "next_phase";
};

// ── Route: which phase comes next? ────────────────────
const routeNextPhase = (state) => {
  const phase = state.currentPhase;
  const phaseOrder = [
    "market_research",
    "competitor_analysis",
    "persona_generation",
    "swot_analysis",
    "campaign_strategy",
    "synthesis",
  ];
  const currentIndex = phaseOrder.indexOf(phase);
  if (currentIndex < phaseOrder.length - 1) {
    return phaseOrder[currentIndex + 1];
  }
  return "__end__";
};

// ── Phase transition nodes (inject context for next agent) ──
const createPhaseTransition = (fromPhase, toPhase, summaryLabel) => {
  return async (state) => {
    // Extract the last AI response (the completed analysis)
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage?.content || "";

    // Store the section
    const sections = { [fromPhase]: content };

    // Inject a bridging message so the next agent has context
    const bridgeMessage = new HumanMessage(
      `--- ${summaryLabel} Complete ---\n\n` +
        `The previous analyst has completed their ${summaryLabel}. ` +
        `Their findings are in the conversation above. ` +
        `Now it's your turn. Use the above research as context and ` +
        `perform your specialized analysis on the same product/market. ` +
        `Use your tools to gather additional data as needed.`
    );

    return {
      messages: [bridgeMessage],
      currentPhase: toPhase,
      researchSections: sections,
    };
  };
};

/**
 * Build the full Market Research workflow graph.
 * 
 * Flow:
 *   START → market_researcher ↔ tools → transition →
 *   competitor_analyst ↔ tools → transition →
 *   persona_generator ↔ tools → transition →
 *   swot_analyst ↔ tools → transition →
 *   campaign_strategist ↔ tools → transition →
 *   synthesizer → END
 */
const buildFullResearchGraph = () => {
  const graph = new StateGraph(ResearchState);

  // ── Add agent nodes ──
  graph.addNode("market_researcher", createMarketResearcherNode(allTools));
  graph.addNode("competitor_analyst", createCompetitorAnalystNode(allTools));
  graph.addNode("persona_generator", createPersonaGeneratorNode(allTools));
  graph.addNode("swot_analyst", createSwotAnalystNode(allTools));
  graph.addNode("campaign_strategist", createCampaignStrategistNode(allTools));
  graph.addNode("synthesizer", createSynthesizerNode());

  // ── Add tool node (shared by all agents) ──
  graph.addNode("tools", toolNode);

  // ── Phase transition nodes ──
  graph.addNode(
    "transition_to_competitor",
    createPhaseTransition("market_research", "competitor_analysis", "Market Research")
  );
  graph.addNode(
    "transition_to_persona",
    createPhaseTransition("competitor_analysis", "persona_generation", "Competitor Analysis")
  );
  graph.addNode(
    "transition_to_swot",
    createPhaseTransition("persona_generation", "swot_analysis", "Persona Generation")
  );
  graph.addNode(
    "transition_to_campaign",
    createPhaseTransition("swot_analysis", "campaign_strategy", "SWOT Analysis")
  );
  graph.addNode(
    "transition_to_synthesis",
    createPhaseTransition("campaign_strategy", "synthesis", "Campaign Strategy")
  );

  // ── Entry ──
  graph.addEdge(START, "market_researcher");

  // ── Market Researcher phase ──
  graph.addConditionalEdges("market_researcher", (state) => {
    const last = state.messages[state.messages.length - 1];
    if (last?.tool_calls && last.tool_calls.length > 0) return "tools";
    return "transition_to_competitor";
  });

  // After tools, route back to the current phase's agent
  graph.addConditionalEdges("tools", (state) => {
    const phase = state.currentPhase;
    const phaseToAgent = {
      market_research: "market_researcher",
      competitor_analysis: "competitor_analyst",
      persona_generation: "persona_generator",
      swot_analysis: "swot_analyst",
      campaign_strategy: "campaign_strategist",
    };
    return phaseToAgent[phase] || "market_researcher";
  });

  // ── Competitor Analyst phase ──
  graph.addEdge("transition_to_competitor", "competitor_analyst");
  graph.addConditionalEdges("competitor_analyst", (state) => {
    const last = state.messages[state.messages.length - 1];
    if (last?.tool_calls && last.tool_calls.length > 0) return "tools";
    return "transition_to_persona";
  });

  // ── Persona Generator phase ──
  graph.addEdge("transition_to_persona", "persona_generator");
  graph.addConditionalEdges("persona_generator", (state) => {
    const last = state.messages[state.messages.length - 1];
    if (last?.tool_calls && last.tool_calls.length > 0) return "tools";
    return "transition_to_swot";
  });

  // ── SWOT Analyst phase ──
  graph.addEdge("transition_to_swot", "swot_analyst");
  graph.addConditionalEdges("swot_analyst", (state) => {
    const last = state.messages[state.messages.length - 1];
    if (last?.tool_calls && last.tool_calls.length > 0) return "tools";
    return "transition_to_campaign";
  });

  // ── Campaign Strategist phase ──
  graph.addEdge("transition_to_campaign", "campaign_strategist");
  graph.addConditionalEdges("campaign_strategist", (state) => {
    const last = state.messages[state.messages.length - 1];
    if (last?.tool_calls && last.tool_calls.length > 0) return "tools";
    return "transition_to_synthesis";
  });

  // ── Synthesizer (no tools, just reads everything) ──
  graph.addEdge("transition_to_synthesis", "synthesizer");
  graph.addEdge("synthesizer", END);

  return graph.compile();
};

/**
 * Run the full research workflow end-to-end.
 * 
 * @param {string} productDescription - What the product/service is
 * @param {string} targetMarket - Who it's for
 * @param {string} objectives - What the user wants to learn
 * @returns {object} Full research state with all sections
 */
const runFullResearch = async ({ productDescription, targetMarket, objectives }) => {
  const app = buildFullResearchGraph();

  const userMessage = new HumanMessage(
    `I need comprehensive market research for my product/service.\n\n` +
      `**Product/Service:** ${productDescription}\n\n` +
      `**Target Market:** ${targetMarket}\n\n` +
      `**Research Objectives:** ${objectives}\n\n` +
      `Please conduct thorough research using all available tools.`
  );

  const result = await app.invoke({
    messages: [userMessage],
  });

  return result;
};

module.exports = {
  buildFullResearchGraph,
  runFullResearch,
  ResearchState,
  allTools,
};
