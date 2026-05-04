const researchService = require("../services/research.service");

/**
 * POST /api/research/full
 * Run the complete multi-agent research pipeline.
 * 
 * Body: { productDescription, targetMarket, objectives }
 */
const runFullResearch = async (req, res) => {
  try {
    const { productDescription, targetMarket, objectives } = req.body;

    if (!productDescription) {
      return res.status(400).json({ error: "productDescription is required" });
    }

    console.log("[ResearchController] Starting full research pipeline...");
    const startTime = Date.now();

    const result = await researchService.runFullMarketResearch({
      productDescription,
      targetMarket: targetMarket || "General market",
      objectives: objectives || "Comprehensive market analysis",
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[ResearchController] Full research completed in ${duration}s`);

    return res.status(200).json({
      success: true,
      duration: `${duration}s`,
      data: result,
    });
  } catch (error) {
    console.error("[ResearchController] Full research failed:", error);
    return res.status(500).json({
      error: "Research pipeline failed",
      message: error.message,
    });
  }
};

/**
 * POST /api/research/market
 * Run standalone market analysis.
 * 
 * Body: { query }
 */
const runMarketAnalysis = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "query is required" });

    console.log("[ResearchController] Running market analysis...");
    const result = await researchService.runMarketAnalysis(query);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("[ResearchController] Market analysis failed:", error);
    return res.status(500).json({ error: "Market analysis failed", message: error.message });
  }
};

/**
 * POST /api/research/competitors
 * Run standalone competitor analysis.
 * 
 * Body: { query }
 */
const runCompetitorAnalysis = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "query is required" });

    console.log("[ResearchController] Running competitor analysis...");
    const result = await researchService.runCompetitorResearch(query);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("[ResearchController] Competitor analysis failed:", error);
    return res.status(500).json({ error: "Competitor analysis failed", message: error.message });
  }
};

/**
 * POST /api/research/personas
 * Run standalone persona generation.
 * 
 * Body: { query }
 */
const runPersonaGeneration = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "query is required" });

    console.log("[ResearchController] Running persona generation...");
    const result = await researchService.runPersonaCreation(query);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("[ResearchController] Persona generation failed:", error);
    return res.status(500).json({ error: "Persona generation failed", message: error.message });
  }
};

/**
 * POST /api/research/swot
 * Run standalone SWOT analysis.
 * 
 * Body: { query }
 */
const runSwotAnalysis = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "query is required" });

    console.log("[ResearchController] Running SWOT analysis...");
    const result = await researchService.runSwot(query);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("[ResearchController] SWOT analysis failed:", error);
    return res.status(500).json({ error: "SWOT analysis failed", message: error.message });
  }
};

/**
 * POST /api/research/campaign
 * Run standalone campaign strategy generation.
 * 
 * Body: { query }
 */
const runCampaignStrategy = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "query is required" });

    console.log("[ResearchController] Running campaign strategy...");
    const result = await researchService.runCampaign(query);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("[ResearchController] Campaign strategy failed:", error);
    return res.status(500).json({ error: "Campaign strategy failed", message: error.message });
  }
};

module.exports = {
  runFullResearch,
  runMarketAnalysis,
  runCompetitorAnalysis,
  runPersonaGeneration,
  runSwotAnalysis,
  runCampaignStrategy,
};
