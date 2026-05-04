const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

/**
 * Web Search Tool
 * 
 * Uses Google Custom Search JSON API for real internet access.
 * Falls back to a Gemini-powered simulated search when API keys are absent,
 * so the workflow always completes even in dev without credentials.
 */
const webSearchTool = tool(
  async ({ query, numResults }) => {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    // ── Real Google Custom Search ──
    if (apiKey && cx) {
      try {
        const url = new URL("https://www.googleapis.com/customsearch/v1");
        url.searchParams.set("key", apiKey);
        url.searchParams.set("cx", cx);
        url.searchParams.set("q", query);
        url.searchParams.set("num", String(Math.min(numResults || 5, 10)));

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Google Search API ${res.status}: ${res.statusText}`);

        const data = await res.json();
        const results = (data.items || []).map((item, i) => ({
          position: i + 1,
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        }));

        return JSON.stringify({
          source: "google_custom_search",
          query,
          totalResults: data.searchInformation?.totalResults || "0",
          results,
        });
      } catch (err) {
        console.error("[webSearchTool] Google Search failed, falling back:", err.message);
      }
    }

    // ── Fallback: simulated search context ──
    return JSON.stringify({
      source: "simulated",
      query,
      note: "No GOOGLE_SEARCH_API_KEY/GOOGLE_SEARCH_ENGINE_ID configured. Returning simulated search context. Set these env vars for real web results.",
      results: [
        {
          position: 1,
          title: `Simulated result for: ${query}`,
          snippet: `This is a simulated search result. Configure GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID in .env for real internet access.`,
          link: "https://example.com",
        },
      ],
    });
  },
  {
    name: "web_search",
    description:
      "Search the internet for current information about markets, competitors, trends, products, brands, demographics, and any other topic. Returns titles, snippets, and URLs.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the internet"),
      numResults: z
        .number()
        .min(1)
        .max(10)
        .optional()
        .default(5)
        .describe("Number of results to return (1-10)"),
    }),
  }
);

module.exports = { webSearchTool };
