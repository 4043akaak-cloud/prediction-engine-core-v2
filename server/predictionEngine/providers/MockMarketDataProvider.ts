/**
 * MockMarketDataProvider
 * 
 * Implements IMarketDataProvider with realistic mock data for testing and development.
 * Used as fallback when real API providers are unavailable.
 * 
 * Features:
 * - Realistic market data generation
 * - Deterministic results based on symbol
 * - Simulated volatility and trends
 * - No external API dependencies
 */

import { IMarketDataProvider, MarketSnapshot, MarketDataQuery } from './IMarketDataProvider';

export class MockMarketDataProvider implements IMarketDataProvider {
  private mockData: Map<string, MarketSnapshot> = new Map();

  async getMarketSnapshot(query: MarketDataQuery): Promise<MarketSnapshot> {
    const cacheKey = query.symbol.toUpperCase();
    
    // Return cached mock data if available
    if (this.mockData.has(cacheKey)) {
      return this.mockData.get(cacheKey)!;
    }

    // Generate realistic mock data based on symbol
    const snapshot = this.generateMockSnapshot(query.symbol);
    this.mockData.set(cacheKey, snapshot);
    return snapshot;
  }

  async getHistoricalData(query: MarketDataQuery, limit: number = 20): Promise<MarketSnapshot[]> {
    const snapshots: MarketSnapshot[] = [];
    const baseSnapshot = await this.getMarketSnapshot(query);
    
    // Generate historical data by simulating price movements
    let price = baseSnapshot.price * 1.1; // Start 10% higher
    
    for (let i = 0; i < limit; i++) {
      // Simulate random walk
      const change = (Math.random() - 0.5) * price * 0.02; // ±1% daily change
      price += change;
      
      const changePercent = (change / (price - change)) * 100;
      const volatility = Math.random() * 0.15 + 0.05; // 5-20% volatility
      
      snapshots.push({
        symbol: query.symbol,
        price: Math.max(price, 0.01), // Ensure positive price
        change,
        changePercent,
        volume: Math.floor(Math.random() * 10000000 + 1000000), // 1M-11M shares
        volatility,
        marketTrend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Go back i days
        source: 'mock-provider',
        high: price * 1.02,
        low: price * 0.98,
        sentiment: changePercent > 1 ? 'bullish' : changePercent < -1 ? 'bearish' : 'neutral',
      });
    }
    
    return snapshots;
  }

  getName(): string {
    return 'mock-provider';
  }

  async isAvailable(): Promise<boolean> {
    return true; // Always available
  }

  /**
   * Generate realistic mock market snapshot based on symbol
   * Uses deterministic algorithm so same symbol always returns consistent data
   */
  private generateMockSnapshot(symbol: string): MarketSnapshot {
    // Generate deterministic but varied data based on symbol
    const seed = this.hashSymbol(symbol);
    
    // Base prices for common symbols
    const basePrices: Record<string, number> = {
      'AAPL': 150,
      'GOOGL': 140,
      'MSFT': 380,
      'AMZN': 170,
      'TSLA': 240,
      'META': 320,
      'NVDA': 875,
      'BTC': 42000,
      'ETH': 2200,
      'EUR/USD': 1.08,
    };

    // Get base price or use seed-based generation
    let basePrice = basePrices[symbol.toUpperCase()] || (seed % 500) + 50;
    
    // Add some randomness to price
    const priceVariation = (seed % 20) - 10; // -10 to +10
    const price = basePrice + priceVariation;
    
    // Generate daily change
    const changePercent = ((seed % 10) - 5) / 10; // -0.5% to +0.5%
    const change = price * (changePercent / 100);
    
    // Generate volume
    const volume = (seed % 10000000) + 1000000; // 1M to 11M
    
    // Generate volatility (5-20%)
    const volatility = (seed % 15 + 5) / 100;
    
    // Determine trend
    const marketTrend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    
    // Determine sentiment
    const sentiment = changePercent > 0.2 ? 'bullish' : changePercent < -0.2 ? 'bearish' : 'neutral';
    
    return {
      symbol: symbol.toUpperCase(),
      price,
      change,
      changePercent,
      volume,
      volatility,
      marketTrend,
      timestamp: new Date(),
      source: 'mock-provider',
      high: price * 1.02,
      low: price * 0.98,
      previousClose: price - change,
      sentiment: sentiment as 'bullish' | 'neutral' | 'bearish',
    };
  }

  /**
   * Simple hash function for deterministic symbol-based values
   */
  private hashSymbol(symbol: string): number {
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      const char = symbol.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
