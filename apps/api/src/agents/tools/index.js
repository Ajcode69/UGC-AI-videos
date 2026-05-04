/**
 * Tools Index
 * 
 * Central export of all tools available to agents.
 * Import from here to keep agent code clean.
 */

const { webSearchTool } = require("./webSearch");
const { trendAnalyzerTool } = require("./trendAnalyzer");
const { competitorIntelTool } = require("./competitorIntel");
const { audienceInsightsTool } = require("./audienceInsights");

// All research tools
const researchTools = [webSearchTool, trendAnalyzerTool, competitorIntelTool, audienceInsightsTool];

// Internet-only tools
const internetTools = [webSearchTool];

// Analysis tools (no internet dependency)
const analysisTools = [trendAnalyzerTool, competitorIntelTool, audienceInsightsTool];

module.exports = {
  // Individual tools
  webSearchTool,
  trendAnalyzerTool,
  competitorIntelTool,
  audienceInsightsTool,

  // Tool bundles
  researchTools,
  internetTools,
  analysisTools,
};
