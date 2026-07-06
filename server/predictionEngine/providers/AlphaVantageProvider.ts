/**
 * AlphaVantageProvider
 * 
 * Implements IMarketDataProvider for Alpha Vantage API.
 * 
 * Features:
 * - Real-time stock data
 * - Intraday, daily, weekly, monthly data
 * - Volatility estimation
 * - Market trend detection
 * - API key managed via environment variables (never hardcoded)
 * 
 * API Key: Injected via ALPHA_VANTAGE_API_KEY environment variable
 */

import { IMarketDataProvider, MarketSnapshot, MarketDataQuery } from './IMarketDataProvider';

interface AlphaVantageQuote {
  'Global Quote'?: {
    '01. symbol': string;
    '05. price': string;
    '09. change': string;
    '10. change percent': string;
    '06. volume': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '08. previous close': string;
  };
  'Time Series (Daily)'?: Record<string, {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  }>;
  'Information'?: string;
  'Note'?: string;
  'Error Message'?: string;
}

export class AlphaVantageProvider implements IMarketDataProvider {
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';
  private requestCache: Map<string, { data: MarketSnapshot; timestamp: number }> = new Map();
  private cacheExpiry = 60000; // 1 minute cache

  constructor(apiKey?: string) {
    // Allow injection for testing, otherwise use environment variable
    this.apiKey = apiKey || process.env.ALPHA_VANTAGE_API_KEY || '';
  }

  async getMarketSnapshot(query: MarketDataQuery): Promise<MarketSnapshot> {
    const cacheKey = `snapshot-${query.symbol}`;
    const cached = this.requestCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${query.symbol}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.statusText}`);
      }

      const data: AlphaVantageQuote = await response.json();

      // Check for API errors
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        // API call frequency limit
        console.warn('Alpha Vantage note:', data['Note']);
        throw new Error('API call frequency limit reached');
      }

      if (!data['Global Quote'] || !data['Global Quote']['01. symbol']) {
        throw new Error(`No data found for symbol: ${query.symbol}`);
      }

      const quote = data['Global Quote'];
      const price = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = parseFloat(quote['10. change percent']);
      const volume = parseInt(quote['06. volume'], 10);
      const previousClose = parseFloat(quote['08. previous close']);
      const high = parseFloat(quote['03. high']);
      const low = parseFloat(quote['04. low']);

      // Calculate volatility (simple estimation based on high-low range)
      const volatility = this.calculateVolatility(high, low, price);

      // Determine market trend
      const marketTrend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

      // Estimate market sentiment
      const sentiment = changePercent > 2 ? 'bullish' : changePercent < -2 ? 'bearish' : 'neutral';

      const snapshot: MarketSnapshot = {
        symbol: query.symbol,
        price,
        change,
        changePercent,
        volume,
        volatility,
        marketTrend,
        timestamp: new Date(),
        source: 'alpha-vantage',
        previousClose,
        high,
        low,
        sentiment: sentiment as 'bullish' | 'neutral' | 'bearish',
      };

      // Cache the result
      this.requestCache.set(cacheKey, { data: snapshot, timestamp: Date.now() });

      return snapshot;
    } catch (error) {
      console.error('AlphaVantageProvider error:', error);
      throw error;
    }
  }

  async getHistoricalData(query: MarketDataQuery, limit: number = 20): Promise<MarketSnapshot[]> {
    const cacheKey = `historical-${query.symbol}-${limit}`;
    const cached = this.requestCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return [cached.data]; // Return as array for consistency
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?function=TIME_SERIES_DAILY&symbol=${query.symbol}&outputsize=full&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.statusText}`);
      }

      const data: AlphaVantageQuote = await response.json();

      if (data['Error Message']) {
        throw new Error(`Alpha Vantage error: ${data['Error Message']}`);
      }

      if (!data['Time Series (Daily)']) {
        throw new Error(`No historical data found for symbol: ${query.symbol}`);
      }

      const timeSeries = data['Time Series (Daily)'];
      const snapshots: MarketSnapshot[] = [];

      let count = 0;
      for (const [date, dayData] of Object.entries(timeSeries)) {
        if (count >= limit) break;

        const close = parseFloat(dayData['4. close']);
        const open = parseFloat(dayData['1. open']);
        const high = parseFloat(dayData['2. high']);
        const low = parseFloat(dayData['3. low']);
        const volume = parseInt(dayData['5. volume'], 10);

        const change = close - open;
        const changePercent = (change / open) * 100;
        const volatility = this.calculateVolatility(high, low, close);

        snapshots.push({
          symbol: query.symbol,
          price: close,
          change,
          changePercent,
          volume,
          volatility,
          marketTrend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
          timestamp: new Date(date),
          source: 'alpha-vantage',
          high,
          low,
        });

        count++;
      }

      return snapshots;
    } catch (error) {
      console.error('AlphaVantageProvider historical error:', error);
      throw error;
    }
  }

  getName(): string {
    return 'alpha-vantage';
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  /**
   * Calculate volatility as a 0-1 scale based on high-low range
   * Formula: (High - Low) / Close
   * Normalized to 0-1 range (assuming max volatility of 20%)
   */
  private calculateVolatility(high: number, low: number, close: number): number {
    if (close === 0) return 0;
    const range = (high - low) / close;
    // Normalize to 0-1 scale (20% = 1.0)
    const normalized = Math.min(range / 0.2, 1.0);
    return Math.round(normalized * 100) / 100; // Round to 2 decimals
  }
}
