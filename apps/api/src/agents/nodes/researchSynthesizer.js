const { createAnalyticalModel } = require("../../config/gemini");
const { SystemMessage } = require("@langchain/core/messages");

/**
 * Research Synthesizer Node
 * 
 * A meta-agent that reads all outputs from previous research nodes and
 * produces a unified executive summary. This is the orchestrator's
 * final pass — it identifies conflicts between agents, fills gaps,
 * and produces a cohesive narrative.
 * 
 * Only used in the full workflow (not standalone).
 */

const SYSTEM_PROMPT = `You are a Chief Strategy Officer synthesizing research from your entire team.

You have received outputs from:
- Market Researcher (market sizing, trends, drivers)
- Competitor Analyst (competitive landscape, positioning)
- Persona Specialist (user personas, audience insights)
- SWOT Analyst (strategic assessment)
- Campaign Strategist (UGC video campaign recommendations)

Your job is to:
1. Read ALL previous outputs in the conversation
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

const createSynthesizerNode = () => {
  const model = createAnalyticalModel();

  return async (state) => {
    const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];
    const response = await model.invoke(messages);
    return { messages: [response] };
  };
};

module.exports = { createSynthesizerNode };
