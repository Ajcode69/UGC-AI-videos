/**
 * Workflows Index
 */

const { runFullResearch } = require("./marketResearch");
const {
  runStandaloneMarketResearch,
  runStandaloneCompetitorAnalysis,
  runStandalonePersonaGeneration,
  runStandaloneSwotAnalysis,
  runStandaloneCampaignStrategy,
} = require("./standaloneAgents");

module.exports = {
  runFullResearch,
  runStandaloneMarketResearch,
  runStandaloneCompetitorAnalysis,
  runStandalonePersonaGeneration,
  runStandaloneSwotAnalysis,
  runStandaloneCampaignStrategy,
};
