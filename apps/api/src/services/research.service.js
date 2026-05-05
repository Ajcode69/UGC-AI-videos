const { runFullResearch } = require("../agents/workflows/marketResearch");
const {
  runStandaloneMarketResearch,
  runStandaloneCompetitorAnalysis,
  runStandalonePersonaGeneration,
  runStandaloneSwotAnalysis,
  runStandaloneCampaignStrategy,
} = require("../agents/workflows/standaloneAgents");

/**
 * Research service — simplified since agents now return plain text strings
 * instead of LangGraph message arrays.
 */

// ── Full Research ─────────────────────────────────────

const runFullMarketResearch = async ({ productDescription, targetMarket, objectives }) => {
  const result = await runFullResearch({ productDescription, targetMarket, objectives });

  return {
    synthesis: result.executiveSummary,
    sections: result.sections,
  };
};

// ── Standalone Agents ─────────────────────────────────

const runMarketAnalysis = async (query) => {
  const result = await runStandaloneMarketResearch(query);
  return { analysis: result };
};

const runCompetitorResearch = async (query) => {
  const result = await runStandaloneCompetitorAnalysis(query);
  return { analysis: result };
};

const runPersonaCreation = async (query) => {
  const result = await runStandalonePersonaGeneration(query);
  return { personas: result };
};

const runSwot = async (query) => {
  const result = await runStandaloneSwotAnalysis(query);
  return { swot: result };
};

const runCampaign = async (query) => {
  const result = await runStandaloneCampaignStrategy(query);
  return { strategy: result };
};

module.exports = {
  runFullMarketResearch,
  runMarketAnalysis,
  runCompetitorResearch,
  runPersonaCreation,
  runSwot,
  runCampaign,
};
