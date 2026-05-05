/**
 * Agent Nodes Index
 * 
 * Central export of all agent runner functions.
 */

const { runMarketResearcher } = require("./marketResearcher");
const { runCompetitorAnalysis } = require("./competitorAnalyst");
const { runPersonaGeneration } = require("./personaGenerator");
const { runSwotAnalysis } = require("./swotAnalyst");
const { runCampaignStrategy } = require("./campaignStrategist");
const { runSynthesizer } = require("./researchSynthesizer");

module.exports = {
  runMarketResearcher,
  runCompetitorAnalysis,
  runPersonaGeneration,
  runSwotAnalysis,
  runCampaignStrategy,
  runSynthesizer,
};
