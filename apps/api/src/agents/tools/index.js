/**
 * Tools Index
 * 
 * Central export of all tool functions available to agents.
 */

const { webSearch } = require("./webSearch");
const { analyzeTrends } = require("./trendAnalyzer");
const { gatherCompetitorIntel } = require("./competitorIntel");
const { gatherAudienceInsights } = require("./audienceInsights");

module.exports = {
  webSearch,
  analyzeTrends,
  gatherCompetitorIntel,
  gatherAudienceInsights,
};
