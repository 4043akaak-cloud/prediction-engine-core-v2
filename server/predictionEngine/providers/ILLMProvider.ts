/**
 * ILLMProvider
 *
 * Abstraction layer for LLM services.
 * Enables swapping between different LLM providers without modifying LLMPredictionEngine.
 *
 * Future providers:
 * - OpenAI
 * - Claude
 * - Gemini
 * - DeepSeek
 * - Grok
 * - Local Llama
 * - Ollama
 * - Azure OpenAI
 */

export interface LLMResponse {
  summary: string;
  keyFacts: string[];
  opportunities: string[];
  risks: string[];
  reasoning: string;
  confidence: number;
  source: string;
}

export interface LLMQuery {
  text: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ILLMProvider {
  /**
   * Analyze text and extract structured reasoning evidence
   */
  analyzeText(query: LLMQuery): Promise<LLMResponse>;

  /**
   * Summarize text
   */
  summarizeText(text: string, maxLength?: number): Promise<string>;

  /**
   * Extract key facts from text
   */
  extractKeyFacts(text: string): Promise<string[]>;

  /**
   * Identify opportunities in text
   */
  identifyOpportunities(text: string): Promise<string[]>;

  /**
   * Identify risks in text
   */
  identifyRisks(text: string): Promise<string[]>;

  /**
   * Get provider name
   */
  getName(): string;

  /**
   * Check if provider is available
   */
  isAvailable(): Promise<boolean>;
}
