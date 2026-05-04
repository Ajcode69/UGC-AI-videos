const { runFullResearch } = require("../agents/workflows/marketResearch");
const {
  runStandaloneMarketResearch,
  runStandaloneCompetitorAnalysis,
  runStandalonePersonaGeneration,
  runStandaloneSwotAnalysis,
  runStandaloneCampaignStrategy,
} = require("../agents/workflows/standaloneAgents");

/**
 * Extract the final AI response content from a LangGraph result.
 */
const extractFinalResponse = (result) => {
  const messages = result.messages || [];
  // Walk backwards to find the last AI message (not a tool message)
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    // AIMessage from Gemini has _getType() === "ai" or constructor.name
    if (msg.content && (!msg.tool_calls || msg.tool_calls.length === 0)) {
      // Skip ToolMessages and HumanMessages
      const type = msg._getType?.() || msg.constructor?.name || "";
      if (type === "ai" || type === "AIMessage" || type === "AIMessageChunk") {
        return msg.content;
      }
    }
  }
  // Fallback: return the last message content
  return messages[messages.length - 1]?.content || "No response generated.";
};

/**
 * Extract all AI responses grouped by phase/agent.
 */
const extractAllSections = (result) => {
  const messages = result.messages || [];
  const sections = [];
  let currentPhase = "market_research";

  for (const msg of messages) {
    const type = msg._getType?.() || msg.constructor?.name || "";

    // Track phase transitions
    if (type === "human" && msg.content?.includes("Complete ---")) {
      const match = msg.content.match(/--- (.+?) Complete ---/);
      if (match) {
        // Map completed phase to the next one
        const phaseMap = {
          "Market Research": "competitor_analysis",
          "Competitor Analysis": "persona_generation",
          "Persona Generation": "swot_analysis",
          "SWOT Analysis": "campaign_strategy",
          "Campaign Strategy": "synthesis",
        };
        currentPhase = phaseMap[match[1]] || currentPhase;
      }
    }

    // Capture AI responses (non-tool-call ones)
    if (
      (type === "ai" || type === "AIMessage" || type === "AIMessageChunk") &&
      msg.content &&
      (!msg.tool_calls || msg.tool_calls.length === 0)
    ) {
      sections.push({
        phase: currentPhase,
        content: msg.content,
      });
    }
  }

  return sections;
};

// ── Full Research ─────────────────────────────────────

const runFullMarketResearch = async ({ productDescription, targetMarket, objectives }) => {
  const result = await runFullResearch({ productDescription, targetMarket, objectives });

  const sections = extractAllSections(result);
  const finalSynthesis = extractFinalResponse(result);

  return {
    synthesis: finalSynthesis,
    sections,
    researchSections: result.researchSections || {},
    messageCount: result.messages?.length || 0,
  };
};

// ── Standalone Agents ─────────────────────────────────

const runMarketAnalysis = async (query) => {
  const result = await runStandaloneMarketResearch(query);
  return { analysis: extractFinalResponse(result) };
};

const runCompetitorResearch = async (query) => {
  const result = await runStandaloneCompetitorAnalysis(query);
  return { analysis: extractFinalResponse(result) };
};

const runPersonaCreation = async (query) => {
  const result = await runStandalonePersonaGeneration(query);
  return { personas: extractFinalResponse(result) };
};

const runSwot = async (query) => {
  const result = await runStandaloneSwotAnalysis(query);
  return { swot: extractFinalResponse(result) };
};

const runCampaign = async (query) => {
  const result = await runStandaloneCampaignStrategy(query);
  return { strategy: extractFinalResponse(result) };
};

module.exports = {
  runFullMarketResearch,
  runMarketAnalysis,
  runCompetitorResearch,
  runPersonaCreation,
  runSwot,
  runCampaign,
};
