const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

/**
 * Competitor Intel Tool
 * 
 * Searches for competitor information, pricing, positioning, and reviews.
 * In production, this would integrate with competitor monitoring APIs
 * (e.g., SimilarWeb, Crunchbase, or SerpAPI).
 */
const competitorIntelTool = tool(
  async ({ companyOrProduct, aspectsToAnalyze }) => {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    const aspects = aspectsToAnalyze || ["pricing", "features", "reviews", "market_position"];
    const searchResults = {};

    for (const aspect of aspects) {
      const query = `${companyOrProduct} ${aspect} 2026`;

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
            searchResults[aspect] = (data.items || []).map((item) => ({
              title: item.title,
              snippet: item.snippet,
              link: item.link,
            }));
            continue;
          }
        } catch (err) {
          console.error(`[competitorIntel] Search failed for ${aspect}:`, err.message);
        }
      }

      // Fallback
      searchResults[aspect] = [
        {
          title: `${companyOrProduct} — ${aspect} (simulated)`,
          snippet: `Simulated intel for ${companyOrProduct} on ${aspect}. Configure search API keys for real data.`,
          link: "https://example.com",
        },
      ];
    }

    return JSON.stringify({
      tool: "competitor_intel",
      target: companyOrProduct,
      aspects,
      data: searchResults,
    });
  },
  {
    name: "competitor_intel",
    description:
      "Gather competitive intelligence about a specific company or product. Searches for pricing, features, reviews, market position, and other specified aspects. Returns structured search results per aspect.",
    schema: z.object({
      companyOrProduct: z
        .string()
        .describe("The competitor company name or product to research"),
      aspectsToAnalyze: z
        .array(z.string())
        .optional()
        .default(["pricing", "features", "reviews", "market_position"])
        .describe(
          "Which aspects to investigate (e.g. 'pricing', 'features', 'reviews', 'social_media', 'funding', 'market_position')"
        ),
    }),
  }
);

module.exports = { competitorIntelTool };
