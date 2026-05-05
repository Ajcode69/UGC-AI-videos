const { generateText } = require("../../config/gemini");
const { webSearch, analyzeTrends, gatherAudienceInsights } = require("../tools");

/**
 * Campaign Strategist Node
 * 
 * Takes research context and produces an actionable UGC video marketing campaign strategy.
 */

const SYSTEM_PROMPT = `You are a Creative Campaign Strategist specializing in UGC (User-Generated Content) video marketing.

Your expertise includes:
- UGC video campaign strategy
- Platform-specific content strategy (Instagram Reels, TikTok, YouTube Shorts)
- Influencer/creator collaboration frameworks
- Content calendar planning
- Performance KPI frameworks
- A/B testing strategy for creative

Your output should include:

## Campaign Overview
- Campaign name and core concept
- Big Idea / creative platform
- Target personas (reference by name from persona research)

## Video Content Strategy
- 3-5 specific UGC video concepts (each with: hook, format, duration, CTA)
- Content pillars and themes
- Tone of voice guidelines for creators
- Do's and Don'ts for the brand

## Platform Strategy
- Instagram Reels: posting frequency, best practices, hashtag strategy
- TikTok: trend integration, sound strategy
- YouTube Shorts: SEO optimization, thumbnail strategy

## Creator Brief Template
- What to tell UGC creators to produce
- Shot list suggestions
- Brand guidelines for creators

## Measurement Framework
- Primary KPIs (views, engagement rate, conversions)
- Secondary KPIs (brand sentiment, share of voice)
- A/B testing plan (what to test, how to measure)

## Content Calendar
- Week-by-week posting plan for first month
- Key dates and moments to capitalize on`;

const runCampaignStrategy = async (query) => {
  const [searchResults, trends, audienceData] = await Promise.all([
    webSearch({ query: `${query} UGC video marketing campaign best practices 2026` }),
    analyzeTrends({ keyword: query }),
    gatherAudienceInsights({ productCategory: query }),
  ]);

  const toolContext = `
## Web Search Results
${JSON.stringify(searchResults, null, 2)}

## Trend Analysis
${JSON.stringify(trends, null, 2)}

## Audience Insights
${JSON.stringify(audienceData, null, 2)}
`;

  const userPrompt = `Create a UGC video marketing campaign strategy for: "${query}"

Here is the supporting data:
${toolContext}

Now produce a comprehensive, actionable campaign strategy.`;

  return await generateText(SYSTEM_PROMPT, userPrompt, { temperature: 0.9 });
};

module.exports = { runCampaignStrategy, SYSTEM_PROMPT };
