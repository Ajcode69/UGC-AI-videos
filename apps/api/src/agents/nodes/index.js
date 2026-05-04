/**
 * Agent Nodes Index
 * 
 * Central export of all agent node factories and standalone runners.
 */

const { createMarketResearcherNode, runMarketResearcher } = require("./marketResearcher");
const { createCompetitorAnalystNode, runCompetitorAnalysis } = require("./competitorAnalyst");
const { createPersonaGeneratorNode, runPersonaGeneration } = require("./personaGenerator");
const { createSwotAnalystNode, runSwotAnalysis } = require("./swotAnalyst");
const { createCampaignStrategistNode, runCampaignStrategy } = require("./campaignStrategist");
const { createSynthesizerNode } = require("./researchSynthesizer");

module.exports = {
  // Node factories (for graph composition)
  createMarketResearcherNode,
  createCompetitorAnalystNode,
  createPersonaGeneratorNode,
  createSwotAnalystNode,
  createCampaignStrategistNode,
  createSynthesizerNode,

  // Standalone runners (for direct invocation outside graphs)
  runMarketResearcher,
  runCompetitorAnalysis,
  runPersonaGeneration,
  runSwotAnalysis,
  runCampaignStrategy,
};
