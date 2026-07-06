/**
 * IMarketDataProvider Interface
 * 
 * Abstraction layer for market data providers.
 * Enables MarketDataPredictionEngine to work with any market data source without direct API coupling.
 * 
 * v1: AlphaVantageProvider only
 * Future: Yahoo Finance, Finnhub, Polygon, Twelve Data, Binance, CoinGecko, JPX, Reuters, Bloomberg, etc.
 */

export interface MarketSnapshot {
  symbol: string;
  price: number;
  change: number; // price change from previous close
  changePercent: number; // percentage change
  volume: number; // trading volume
  volatility: number; // 0-1 scale, estimated volatility
  marketTrend: 'up' | 'down' | 'neutral'; // trend direction
  timestamp: Date; // when this snapshot was captured
  source: string; // provider name
  previousClose?: number; // previous day's closing price
  high?: number; // day's high
  low?: number; // day's low
  marketBreadth?: number; // 0-1, market breadth indicator
  sentiment?: 'bullish' | 'neutral' | 'bearish'; // market sentiment
}

export interface MarketDataQuery {
  symbol: string; // stock symbol (e.g., "AAPL", "EUR/USD")
  dataType?: 'intraday' | 'daily' | 'weekly' | 'monthly'; // time series type
  interval?: string; // interval for intraday (e.g., "5min", "15min", "60min")
}

export interface IMarketDataProvider {
  /**
   * Get current market snapshot for a symbol
   * @param query Market data query with symbol and optional parameters
   * @returns Market snapshot with current market data
   */
  getMarketSnapshot(query: MarketDataQuery): Promise<MarketSnapshot>;

  /**
   * Get historical market data
   * @param query Market data query
   * @param limit Number of data points to return
   * @returns Array of market snapshots
   */
  getHistoricalData(query: MarketDataQuery, limit?: number): Promise<MarketSnapshot[]>;

  /**
   * Provider name (e.g., "alpha-vantage", "yahoo-finance", "finnhub")
   */
  getName(): string;

  /**
   * Whether this provider is available/configured
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get supported symbols or asset classes
   */
  getSupportedSymbols?(): Promise<string[]>;
}
