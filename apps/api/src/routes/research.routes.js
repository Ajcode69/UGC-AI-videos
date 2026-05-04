const express = require("express");
const researchController = require("../controllers/research.controller");

const router = express.Router();

// ── Full Multi-Agent Research Pipeline ────────────────
// POST /api/research/full
// Body: { productDescription, targetMarket, objectives }
router.post("/full", researchController.runFullResearch);

// ── Standalone Agent Endpoints ────────────────────────
// Each accepts: { query: "..." }

// POST /api/research/market
router.post("/market", researchController.runMarketAnalysis);

// POST /api/research/competitors
router.post("/competitors", researchController.runCompetitorAnalysis);

// POST /api/research/personas
router.post("/personas", researchController.runPersonaGeneration);

// POST /api/research/swot
router.post("/swot", researchController.runSwotAnalysis);

// POST /api/research/campaign
router.post("/campaign", researchController.runCampaignStrategy);

module.exports = router;
