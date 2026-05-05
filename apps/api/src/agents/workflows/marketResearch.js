const { runMarketResearcher } = require("../nodes/marketResearcher");
const { runCompetitorAnalysis } = require("../nodes/competitorAnalyst");
const { runPersonaGeneration } = require("../nodes/personaGenerator");
const { runSwotAnalysis } = require("../nodes/swotAnalyst");
const { runCampaignStrategy } = require("../nodes/campaignStrategist");
const { runSynthesizer } = require("../nodes/researchSynthesizer");

/**
 * Run the full Market Research pipeline sequentially.
 * 
 * Each agent runs independently, gathers its own tool data,
 * and the outputs are collected and passed to the synthesizer.
 * 
 * Flow:
 *   Market Researcher → Competitor Analyst → Persona Generator →
 *   SWOT Analyst → Campaign Strategist → Synthesizer
 *
 * @param {object} params
 * @param {string} params.productDescription - What the product/service is
 * @param {string} params.targetMarket - Who it's for
 * @param {string} params.objectives - What the user wants to learn
 * @returns {object} Full research results with all sections + executive summary
 */
const runFullResearch = async ({ productDescription, targetMarket, objectives }) => {
  const query = `${productDescription} for ${targetMarket}. Objectives: ${objectives}`;

  console.log("[Pipeline] Starting full research pipeline...");

  // Phase 1: Market Research
  console.log("[Pipeline] Phase 1/6: Market Research...");
  const marketResearch = await runMarketResearcher(query);

  // Phase 2: Competitor Analysis
  console.log("[Pipeline] Phase 2/6: Competitor Analysis...");
  const competitorAnalysis = await runCompetitorAnalysis(query);

  // Phase 3: Persona Generation
  console.log("[Pipeline] Phase 3/6: Persona Generation...");
  const personaGeneration = await runPersonaGeneration(query);

  // Phase 4: SWOT Analysis
  console.log("[Pipeline] Phase 4/6: SWOT Analysis...");
  const swotAnalysis = await runSwotAnalysis(query);

  // Phase 5: Campaign Strategy
  console.log("[Pipeline] Phase 5/6: Campaign Strategy...");
  const campaignStrategy = await runCampaignStrategy(query);

  // Phase 6: Synthesis
  console.log("[Pipeline] Phase 6/6: Executive Synthesis...");
  const sections = {
    market_research: marketResearch,
    competitor_analysis: competitorAnalysis,
    persona_generation: personaGeneration,
    swot_analysis: swotAnalysis,
    campaign_strategy: campaignStrategy,
  };
  const executiveSummary = await runSynthesizer(sections);

  console.log("[Pipeline] ✅ Full research pipeline complete.");

  return {
    sections,
    executiveSummary,
  };
};

module.exports = { runFullResearch };
