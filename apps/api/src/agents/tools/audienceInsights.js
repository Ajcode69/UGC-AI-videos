const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

/**
 * Audience Insights Tool
 * 
 * Searches for demographic and psychographic data about target audiences.
 * In production, integrate with Meta Audience Insights, Google Analytics API,
 * or social listening platforms like Brandwatch / Sprout Social.
 */
const audienceInsightsTool = tool(
  async ({ productCategory, targetDemographic }) => {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    const queries = [
      `${productCategory} target audience demographics 2026`,
      `${productCategory} consumer behavior trends`,
      `${targetDemographic || "millennials gen z"} ${productCategory} preferences`,
    ];

    const allResults = [];

    for (const query of queries) {
      if (apiKey && cx) {
        try {
          const url = new URL("https://www.googleapis.com/customsearch/v1");
          url.searchParams.set("key", apiKey);
          url.searchParams.set("cx", cx);
          url.searchParams.set("q", query);
          url.searchParams.set("num", "3");

          const res = await fetch(url.toString());
          if (res.ok) {
            const data = await res.json();
            allResults.push(
              ...(data.items || []).map((item) => ({
                query,
                title: item.title,
                snippet: item.snippet,
                link: item.link,
              }))
            );
            continue;
          }
        } catch (err) {
          console.error("[audienceInsights] Search failed:", err.message);
        }
      }

      // Fallback
      allResults.push({
        query,
        title: `Audience data for ${productCategory} (simulated)`,
        snippet: `Simulated audience insights. Configure search API for real data.`,
        link: "https://example.com",
      });
    }

    return JSON.stringify({
      tool: "audience_insights",
      productCategory,
      targetDemographic: targetDemographic || "not specified",
      results: allResults,
    });
  },
  {
    name: "audience_insights",
    description:
      "Research target audience demographics, psychographics, and consumer behavior for a product category. Returns search results about audience preferences, behaviors, and trends.",
    schema: z.object({
      productCategory: z
        .string()
        .describe("The product category or industry to research audiences for"),
      targetDemographic: z
        .string()
        .optional()
        .describe("Specific demographic group to focus on (e.g. 'Gen Z women 18-25')"),
    }),
  }
);

module.exports = { audienceInsightsTool };
