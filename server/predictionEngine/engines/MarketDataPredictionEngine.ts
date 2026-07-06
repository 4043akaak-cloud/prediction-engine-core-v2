/**
 * MarketDataPredictionEngine
 * 
 * "The Market Analyst" - Eighth specialist engine
 * 
 * Observes current market state and provides structured market evidence.
 * Does NOT predict the future - only analyzes current market conditions.
 * 
 * Implements IPredictionEngine contract.
 * Depends only on IMarketDataProvider (abstracted, no direct API coupling).
 */

import { IPredictionEngine, PredictionRequest, PredictionResult, PredictionMetadata, StandardizedEvidence } from '../types';
import { IMarketDataProvider, MarketSnapshot } from '../providers/IMarketDataProvider';
import { randomUUID } from 'crypto';

export class MarketDataPredictionEngine implements IPredictionEngine {
  constructor(private marketDataProvider: IMarketDataProvider) {}

  async predict(request: PredictionRequest): Promise<PredictionResult> {
    const query = request.query.toLowerCase();
    const predictionId = randomUUID();
    const timestamp = new Date();

    try {
      // Extract symbol from query (e.g., "What is the price of AAPL?" -> "AAPL")
      const symbol = this.extractSymbol(query);

      if (!symbol) {
        return this.createErrorPrediction(
          predictionId,
          timestamp,
          'No market symbol found in query',
          'Unable to extract a valid stock symbol from the prediction query.'
        );
      }

      // Get current market snapshot
      const snapshot = await this.marketDataProvider.getMarketSnapshot({ symbol });

      // Analyze market data
      const { evidence, confidence, factors } = this.analyzeMarketSnapshot(snapshot, query);

      // Generate market observation
      const prediction = this.generateMarketObservation(snapshot, query);

      // Create metadata
      const metadata: PredictionMetadata = {
        recipeId: 'market-data-recipe',
        recipeName: 'Market Data Recipe',
        executionTimestamp: timestamp.getTime(),
        confidenceScore: confidence,
        evidenceCount: evidence.length,
        predictionVersion: '1.0.0',
      };

      return {
        id: predictionId,
        prediction,
        confidence,
        reason: this.generateReason(snapshot, evidence, factors),
        recipeUsed: 'market-data-recipe',
        timestamp: timestamp.getTime(),
        metadata,
        evidenceList: evidence,
        explanation: this.generateExplanation(snapshot, factors),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorPrediction(
        predictionId,
        timestamp,
        'Market data retrieval failed',
        `Failed to retrieve market data: ${errorMessage}`
      );
    }
  }

  /**
   * Extract stock symbol from query
   * Examples: "AAPL", "EUR/USD", "BTC", "CUSTOM", "TEST"
   */
  private extractSymbol(query: string): string | null {
    const upperQuery = query.toUpperCase();
    
    // Try specific patterns first
    const patterns = [
      /symbol[:\s]+([A-Z]{1,10}(?:\/[A-Z]{3})?)/i, // "symbol: AAPL"
      /stock[:\s]+([A-Z]{1,10}(?:\/[A-Z]{3})?)/i, // "stock: AAPL"
      /price[:\s]+([A-Z]{1,10}(?:\/[A-Z]{3})?)/i, // "price: AAPL"
      /([A-Z]{1,10}(?:\/[A-Z]{3})?)\s+(price|stock|symbol|data|market|trend|volatility|volume|sentiment)/i, // "AAPL price"
    ];

    for (const pattern of patterns) {
      const match = upperQuery.match(pattern);
      if (match) {
        // Extract the symbol part (group 1 or group 0)
        const symbol = match[1] || match[0];
        return symbol.replace(/\s+(price|stock|symbol|data|market|trend|volatility|volume|sentiment)/i, '').toUpperCase();
      }
    }
    
    // Try to find any uppercase word that looks like a symbol (1-10 uppercase letters, optionally with /)
    const symbolMatch = upperQuery.match(/\b([A-Z]{1,10}(?:\/[A-Z]{3})?)\b/);
    if (symbolMatch) {
      return symbolMatch[1];
    }

    return null;
  }

  /**
   * Analyze market snapshot and extract evidence
   */
  private analyzeMarketSnapshot(snapshot: MarketSnapshot, query: string) {
    const evidence: StandardizedEvidence[] = [];
    const factors: string[] = [];

    // Price evidence
    evidence.push({
      id: randomUUID(),
      source: snapshot.source,
      title: 'Current Price',
      summary: `${snapshot.symbol} is trading at $${snapshot.price.toFixed(2)}`,
      confidence: 0.95,
      timestamp: snapshot.timestamp.getTime(),
      type: 'price-data',
      weight: 1.5,
    });

    factors.push('current-price');

    // Change evidence
    if (snapshot.change !== 0) {
      evidence.push({
        id: randomUUID(),
        source: snapshot.source,
        title: 'Price Change',
        summary: `Price changed by $${snapshot.change.toFixed(2)} (${snapshot.changePercent.toFixed(2)}%)`,
        confidence: 0.95,
        timestamp: snapshot.timestamp.getTime(),
        type: 'price-change',
        weight: 1.2,
      });

      factors.push(`price-${snapshot.marketTrend}`);
    }

    // Volume evidence
    if (snapshot.volume > 0) {
      evidence.push({
        id: randomUUID(),
        source: snapshot.source,
        title: 'Trading Volume',
        summary: `Trading volume: ${(snapshot.volume / 1000000).toFixed(2)}M shares`,
        confidence: 0.9,
        timestamp: snapshot.timestamp.getTime(),
        type: 'volume-data',
        weight: 1.0,
      });

      factors.push('volume-data');
    }

    // Volatility evidence
    evidence.push({
      id: randomUUID(),
      source: snapshot.source,
      title: 'Volatility',
      summary: `Estimated volatility: ${(snapshot.volatility * 100).toFixed(1)}%`,
      confidence: 0.85,
      timestamp: snapshot.timestamp.getTime(),
      type: 'volatility-data',
      weight: 1.0,
    });

    factors.push(`volatility-${snapshot.volatility > 0.15 ? 'high' : snapshot.volatility > 0.05 ? 'medium' : 'low'}`);

    // Market trend evidence
    evidence.push({
      id: randomUUID(),
      source: snapshot.source,
      title: 'Market Trend',
      summary: `Current market trend: ${snapshot.marketTrend.toUpperCase()}`,
      confidence: 0.9,
      timestamp: snapshot.timestamp.getTime(),
      type: 'market-trend',
      weight: 1.2,
    });

    // Sentiment evidence
    if (snapshot.sentiment) {
      evidence.push({
        id: randomUUID(),
        source: snapshot.source,
        title: 'Market Sentiment',
        summary: `Market sentiment: ${snapshot.sentiment.toUpperCase()}`,
        confidence: 0.8,
        timestamp: snapshot.timestamp.getTime(),
        type: 'sentiment-data',
        weight: 1.0,
      });

      factors.push(`sentiment-${snapshot.sentiment}`);
    }

    // Calculate overall confidence
    const avgConfidence = evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length;
    const confidence = Math.min(Math.max(avgConfidence, 0.5), 0.95);

    return { evidence, confidence, factors };
  }

  /**
   * Generate market observation (not a prediction)
   */
  private generateMarketObservation(snapshot: MarketSnapshot, query: string): string {
    const trend = snapshot.marketTrend.toUpperCase();
    const sentiment = snapshot.sentiment ? snapshot.sentiment.toUpperCase() : 'NEUTRAL';

    return `${snapshot.symbol} Market Observation: Current price $${snapshot.price.toFixed(2)}, ` +
           `Change ${snapshot.changePercent.toFixed(2)}%, ` +
           `Trend ${trend}, ` +
           `Sentiment ${sentiment}`;
  }

  /**
   * Generate detailed reason for the observation
   */
  private generateReason(snapshot: MarketSnapshot, evidence: StandardizedEvidence[], factors: string[]): string {
    const sourceCount = evidence.length;
    const avgConfidence = evidence.reduce((sum, e) => sum + e.confidence, 0) / sourceCount;

    return `Market observation based on ${sourceCount} data sources with average confidence of ${(avgConfidence * 100).toFixed(0)}%. ` +
           `${snapshot.symbol} is currently ${snapshot.marketTrend} with ${snapshot.sentiment} sentiment. ` +
           `Key factors: ${factors.slice(0, 5).join(', ')}. ` +
           `This is a current market snapshot, not a future prediction.`;
  }

  /**
   * Generate human-readable explanation
   */
  private generateExplanation(snapshot: MarketSnapshot, factors: string[]): string {
    const lines = [
      `Market Data Analysis for ${snapshot.symbol}`,
      `Current Price: $${snapshot.price.toFixed(2)}`,
      `Change: ${snapshot.changePercent.toFixed(2)}% (${snapshot.change > 0 ? '+' : ''}$${snapshot.change.toFixed(2)})`,
      `Volume: ${(snapshot.volume / 1000000).toFixed(2)}M shares`,
      `Volatility: ${(snapshot.volatility * 100).toFixed(1)}%`,
      `Trend: ${snapshot.marketTrend.toUpperCase()}`,
      `Sentiment: ${snapshot.sentiment?.toUpperCase() || 'NEUTRAL'}`,
      `High: $${snapshot.high?.toFixed(2) || 'N/A'}`,
      `Low: $${snapshot.low?.toFixed(2) || 'N/A'}`,
      `Previous Close: $${snapshot.previousClose?.toFixed(2) || 'N/A'}`,
      `Source: ${snapshot.source}`,
      `Timestamp: ${snapshot.timestamp.toISOString()}`,
      ``,
      `This is a current market observation based on real-time data. ` +
      `It is not a prediction of future price movements.`,
    ];

    return lines.join('\n');
  }

  /**
   * Create error prediction
   */
  private createErrorPrediction(
    predictionId: string,
    timestamp: Date,
    title: string,
    message: string
  ): PredictionResult {
    const metadata: PredictionMetadata = {
      recipeId: 'market-data-recipe',
      recipeName: 'Market Data Recipe',
      executionTimestamp: timestamp.getTime(),
      confidenceScore: 0.0,
      evidenceCount: 0,
      predictionVersion: '1.0.0',
    };

    return {
      id: predictionId,
      prediction: `Error: ${title}`,
      confidence: 0.0,
      reason: message,
      recipeUsed: 'market-data-recipe',
      timestamp: timestamp.getTime(),
      metadata,
      evidenceList: [],
      explanation: message,
    };
  }
}
