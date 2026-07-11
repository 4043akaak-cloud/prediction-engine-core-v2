import { PredictionResult } from "../types";
import { IEngine } from "../EngineRegistry";

/**
 * Archetypal Reasoning Engine
 *
 * Analyzes people, systems, stories, and decisions through recurring archetypes
 * and unconscious behavioral patterns. Identifies symbolic roles, hidden motivations,
 * and recurring psychological structures that influence outcomes.
 *
 * Inspired By: Carl Gustav Jung — Analytical Psychology
 */
export class ArchetypalReasoningEngine implements IEngine {
  async predict(query: string): Promise<RecipeExecutionResult> {
    const lowerQuery = query.toLowerCase();

    // Detect archetypal keywords
    const hasHeroKeywords = /\b(hero|hero's journey|challenge|overcome|quest|brave|courage)\b/i.test(
      lowerQuery
    );
    const hasShadowKeywords = /\b(shadow|darkness|fear|repressed|hidden|unconscious|denied)\b/i.test(
      lowerQuery
    );
    const hasWiseKeywords = /\b(wise|mentor|guide|teacher|wisdom|elder|sage)\b/i.test(
      lowerQuery
    );
    const hasTransformKeywords = /\b(transform|change|rebirth|renewal|metamorphosis|evolution)\b/i.test(
      lowerQuery
    );
    const hasSymbolicKeywords = /\b(symbol|meaning|narrative|story|myth|archetype|pattern)\b/i.test(
      lowerQuery
    );

    const evidence: string[] = [];

    // Analyze archetypal patterns
    if (hasHeroKeywords) {
      evidence.push("Hero archetype detected: individual facing challenges and seeking transformation");
    }

    if (hasShadowKeywords) {
      evidence.push("Shadow archetype present: repressed aspects, hidden fears, or denied motivations influencing behavior");
    }

    if (hasWiseKeywords) {
      evidence.push("Wise mentor archetype identified: guidance, wisdom, or authoritative influence shaping decisions");
    }

    if (hasTransformKeywords) {
      evidence.push("Transformation pattern evident: psychological or systemic change and renewal");
    }

    if (hasSymbolicKeywords) {
      evidence.push("Symbolic or narrative patterns structure the situation and influence interpretation");
    }

    // Default evidence if no keywords detected
    if (evidence.length === 0) {
      evidence.push("Recurring psychological patterns and archetypes influence behavior and outcomes");
      evidence.push("Unconscious motivations shape decision-making and narrative interpretation");
    }

    const confidence = Math.min(0.85, 0.5 + evidence.length * 0.08);

    return {
      prediction: "Archetypal patterns and unconscious psychological structures influence this situation",
      confidence,
      reasoning: "Analytical psychology analysis of recurring archetypes and symbolic roles",
      evidenceList: evidence,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }
}
