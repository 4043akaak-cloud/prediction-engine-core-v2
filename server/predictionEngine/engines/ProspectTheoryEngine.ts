import { PredictionResult } from "../types";
import { IEngine } from "../EngineRegistry";

/**
 * Prospect Theory Engine
 *
 * Analyzes decisions using Prospect Theory principles.
 * Evaluates how people perceive gains, losses, risk, and uncertainty,
 * recognizing that human choices often deviate from purely rational expectations.
 *
 * Inspired By: Daniel Kahneman & Amos Tversky — Prospect Theory
 */
export class ProspectTheoryEngine implements IEngine {
  async predict(query: string): Promise<RecipeExecutionResult> {
    const lowerQuery = query.toLowerCase();

    // Detect behavioral keywords
    const hasGainKeywords = /\b(gain|profit|win|benefit|advantage|upside|reward)\b/i.test(
      lowerQuery
    );
    const hasLossKeywords = /\b(loss|lose|risk|downside|cost|penalty|threat)\b/i.test(
      lowerQuery
    );
    const hasRiskKeywords = /\b(risk|uncertain|gamble|bet|chance|probability|odds)\b/i.test(
      lowerQuery
    );
    const hasDecisionKeywords = /\b(decide|choice|choose|decision|option|prefer)\b/i.test(
      lowerQuery
    );

    const evidence: string[] = [];

    // Analyze behavioral patterns
    if (hasGainKeywords && hasRiskKeywords) {
      evidence.push(
        "People tend to be risk-averse when facing potential gains (prefer certain smaller gains)"
      );
    }

    if (hasLossKeywords && hasRiskKeywords) {
      evidence.push(
        "People tend to be risk-seeking when facing potential losses (willing to take risks to avoid losses)"
      );
    }

    if (hasGainKeywords && hasLossKeywords) {
      evidence.push(
        "Loss aversion: losses are perceived as roughly twice as impactful as equivalent gains"
      );
    }

    if (hasDecisionKeywords) {
      evidence.push("Decision framing matters: identical choices presented differently yield different decisions");
    }

    if (hasRiskKeywords) {
      evidence.push("Probability weighting: people overweight small probabilities and underweight large ones");
    }

    // Default evidence if no keywords detected
    if (evidence.length === 0) {
      evidence.push("Human decision-making often deviates from rational expectations");
      evidence.push("Perceived value depends on reference points, not absolute outcomes");
    }

    const confidence = Math.min(0.9, 0.5 + evidence.length * 0.1);

    return {
      prediction: "Behavioral analysis suggests human decision-making will deviate from rational expectations",
      confidence,
      reasoning: "Prospect Theory analysis of perceived gains, losses, and risk preferences",
      evidenceList: evidence,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }
}
