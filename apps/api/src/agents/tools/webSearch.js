/**
 * Web Search Tool
 * 
 * Uses Google Custom Search JSON API for real internet access.
 * Falls back to simulated search when API keys are absent.
 */
const webSearch = async ({ query, numResults = 5 }) => {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

  // ── Real Google Custom Search ──
  if (apiKey && cx) {
    try {
      const url = new URL("https://www.googleapis.com/customsearch/v1");
      url.searchParams.set("key", apiKey);
      url.searchParams.set("cx", cx);
      url.searchParams.set("q", query);
      url.searchParams.set("num", String(Math.min(numResults, 10)));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Google Search API ${res.status}: ${res.statusText}`);

      const data = await res.json();
      const results = (data.items || []).map((item, i) => ({
        position: i + 1,
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }));

      return {
        source: "google_custom_search",
        query,
        totalResults: data.searchInformation?.totalResults || "0",
        results,
      };
    } catch (err) {
      console.error("[webSearch] Google Search failed, falling back:", err.message);
    }
  }

  // ── Fallback: simulated search context ──
  return {
    source: "simulated",
    query,
    note: "No GOOGLE_SEARCH_API_KEY configured. Returning simulated results.",
    results: [
      {
        position: 1,
        title: `Simulated result for: ${query}`,
        snippet: `This is a simulated search result. Configure GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID for real web results.`,
        link: "https://example.com",
      },
    ],
  };
};

module.exports = { webSearch };
