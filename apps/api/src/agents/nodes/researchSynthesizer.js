const { generateText } = require("../../config/gemini");

/**
 * Research Synthesizer Node
 * 
 * A meta-agent that reads all outputs from previous research nodes and
 * produces a unified executive summary. Only used in the full workflow.
 */

const SYSTEM_PROMPT = `You are a Chief Strategy Officer synthesizing research from your entire team.

You have received outputs from:
- Market Researcher (market sizing, trends, drivers)
- Competitor Analyst (competitive landscape, positioning)
- Persona Specialist (user personas, audience insights)
- SWOT Analyst (strategic assessment)
- Campaign Strategist (UGC video campaign recommendations)

Your job is to:
1. Read ALL previous outputs provided
2. Identify contradictions or conflicts between analysts (flag them)
3. Fill in any gaps that individual analysts missed
4. Produce a unified Executive Summary that a CEO or CMO can act on

Your output format:

## Executive Summary
- 3-sentence overview of the market opportunity
- Go/No-Go recommendation with confidence level

## Key Findings (top 5, prioritized by strategic importance)
Each with: Finding → Evidence → Implication → Recommended Action

## Risk Register
- Top 3 risks with likelihood, impact, and mitigation

## Confidence Assessment
- What we know with high confidence
- What we inferred (medium confidence)  
- What we don't know and need to validate (low confidence / data gaps)

## Immediate Next Steps (first 30 days)
- Actionable items with owners and deadlines

DO NOT repeat the full analysis from previous agents. Reference their sections and add your higher-order synthesis. Be concise and action-oriented.`;

/**
 * Synthesize all research sections into an executive summary.
 * 
 * @param {object} sections - All research outputs keyed by phase name
 * @returns {Promise<string>} Executive synthesis
 */
const runSynthesizer = async (sections) => {
  const userPrompt = `Here are all the research outputs from my team:

## Market Research
${sections.market_research || "Not available"}

## Competitor Analysis
${sections.competitor_analysis || "Not available"}

## User Personas
${sections.persona_generation || "Not available"}

## SWOT Analysis
${sections.swot_analysis || "Not available"}

## Campaign Strategy
${sections.campaign_strategy || "Not available"}

Now synthesize all of this into a cohesive executive summary.`;

  return await generateText(SYSTEM_PROMPT, userPrompt, { temperature: 0.2 });
};

module.exports = { runSynthesizer, SYSTEM_PROMPT };
