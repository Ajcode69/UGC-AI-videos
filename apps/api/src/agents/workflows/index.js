/**
 * Workflows Index
 * 
 * Central export of all LangGraph workflow builders and runners.
 */

const {
  buildFullResearchGraph,
  runFullResearch,
} = require("./marketResearch");

const {
  buildMarketResearcherGraph,
  buildCompetitorAnalystGraph,
  buildPersonaGeneratorGraph,
  buildSwotAnalystGraph,
  buildCampaignStrategistGraph,
  buildSingleAgentGraph,
  runStandaloneMarketResearch,
  runStandaloneCompetitorAnalysis,
  runStandalonePersonaGeneration,
  runStandaloneSwotAnalysis,
  runStandaloneCampaignStrategy,
} = require("./standaloneAgents");

module.exports = {
  // Full pipeline
  buildFullResearchGraph,
  runFullResearch,

  // Standalone graph builders
  buildMarketResearcherGraph,
  buildCompetitorAnalystGraph,
  buildPersonaGeneratorGraph,
  buildSwotAnalystGraph,
  buildCampaignStrategistGraph,
  buildSingleAgentGraph,

  // Standalone runners
  runStandaloneMarketResearch,
  runStandaloneCompetitorAnalysis,
  runStandalonePersonaGeneration,
  runStandaloneSwotAnalysis,
  runStandaloneCampaignStrategy,
};
