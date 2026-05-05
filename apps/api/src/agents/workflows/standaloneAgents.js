const { runMarketResearcher } = require("../nodes/marketResearcher");
const { runCompetitorAnalysis } = require("../nodes/competitorAnalyst");
const { runPersonaGeneration } = require("../nodes/personaGenerator");
const { runSwotAnalysis } = require("../nodes/swotAnalyst");
const { runCampaignStrategy } = require("../nodes/campaignStrategist");

/**
 * Standalone agent runners.
 * Each function runs a single agent independently with its own tool data.
 */

const runStandaloneMarketResearch = async (query) => {
  return await runMarketResearcher(query);
};

const runStandaloneCompetitorAnalysis = async (query) => {
  return await runCompetitorAnalysis(query);
};

const runStandalonePersonaGeneration = async (query) => {
  return await runPersonaGeneration(query);
};

const runStandaloneSwotAnalysis = async (query) => {
  return await runSwotAnalysis(query);
};

const runStandaloneCampaignStrategy = async (query) => {
  return await runCampaignStrategy(query);
};

module.exports = {
  runStandaloneMarketResearch,
  runStandaloneCompetitorAnalysis,
  runStandalonePersonaGeneration,
  runStandaloneSwotAnalysis,
  runStandaloneCampaignStrategy,
};
