/**
 * SearchPredictionEngine
 * 
 * "The Reporter" - First external knowledge specialist engine
 * 
 * Collects and evaluates external information to improve prediction quality.
 * Depends only on ISearchProvider (abstracted, no direct API coupling).
 * 
 * Implements IPredictionEngine contract.
 */

import { IPredictionEngine, PredictionRequest, PredictionResult, PredictionMetadata } from '../types';
import { ISearchProvider, SearchQuery } from '../providers/ISearchProvider';
import { randomUUID } from 'crypto';

export class SearchPredictionEngine implements IPredictionEngine {
  constructor(private searchProvider: ISearchProvider) {}

  async predict(request: PredictionRequest): Promise<PredictionResult> {
    const query = request.query.toLowerCase();
    const predictionId = randomUUID();
    const timestamp = new Date();

    // Search for external information
    const searchResults = await this.searchProvider.search({
      query: request.query,
      limit: 5,
      timeframe: 'recent',
    });

    // Analyze search results
    const { evidence, confidence, factors } = this.analyzeSearchResults(searchResults, query);

    // Generate prediction based on external information
    const prediction = this.generatePrediction(query, evidence, searchResults);

    // Create metadata
    const metadata: PredictionMetadata = {
      recipeId: 'search-recipe',
      recipeName: 'Search Recipe',
      executionTimestamp: Date.now(),
      confidenceScore: confidence,
      evidenceCount: evidence.length,
      predictionVersion: '1.0.0',
    };

    return {
      prediction,
      confidence,
      reason: this.generateReason(evidence, factors, searchResults),
      metadata,
    };
  }

  private analyzeSearchResults(
    searchResults: any[],
    query: string
  ): { evidence: string[]; confidence: number; factors: string[] } {
    const evidence: string[] = [];
    const factors: string[] = [];
    let totalConfidence = 0;

    // Extract evidence from search results
    for (const result of searchResults) {
      if (result.content) {
        evidence.push(result.content);
        totalConfidence += result.confidence || 0.5;

        // Identify source type
        if (result.source.includes('financial') || result.source.includes('market')) {
          factors.push('financial-data');
        }
        if (result.source.includes('weather') || result.source.includes('climate')) {
          factors.push('weather-data');
        }
        if (result.source.includes('sports') || result.source.includes('team')) {
          factors.push('sports-data');
        }
        if (result.source.includes('economic') || result.source.includes('consumer')) {
          factors.push('economic-data');
        }
        if (result.source.includes('news')) {
          factors.push('news-source');
        }
      }
    }

    // Remove duplicate factors
    const uniqueFactors = Array.from(new Set(factors));

    // Calculate confidence (0.5 - 0.95 range)
    const baseConfidence = searchResults.length > 0 ? totalConfidence / searchResults.length : 0.5;
    const confidence = Math.min(0.95, Math.max(0.5, baseConfidence));

    return { evidence, confidence, factors: uniqueFactors };
  }

  private generatePrediction(query: string, evidence: string[], searchResults: any[]): string {
    if (searchResults.length === 0) {
      return `No external information found for "${query}". Prediction confidence is low.`;
    }

    if (searchResults.length === 1) {
      return `Based on recent information: ${searchResults[0].title}. This suggests the prediction for "${query}" should consider this external factor.`;
    }

    // Multiple sources
    const sources = searchResults.map((r) => r.source).join(', ');
    return `Based on external information from ${sources}, the prediction for "${query}" should be adjusted. Key findings: ${searchResults[0].title}`;
  }

  private generateReason(evidence: string[], factors: string[], searchResults: any[]): string {
    if (searchResults.length === 0) {
      return 'No external information available. Prediction based on internal data only.';
    }

    const sourceCount = searchResults.length;
    const factorList = factors.length > 0 ? factors.join(', ') : 'general-information';
    const avgConfidence = (
      searchResults.reduce((sum, r) => sum + (r.confidence || 0.5), 0) / sourceCount
    ).toFixed(2);

    return `Found ${sourceCount} external source(s) with average confidence ${avgConfidence}. Data types: ${factorList}. External evidence integrated into prediction.`;
  }
}
