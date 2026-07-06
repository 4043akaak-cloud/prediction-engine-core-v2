/**
 * ISearchProvider Interface
 * 
 * Abstraction layer for external search providers.
 * Enables SearchPredictionEngine to work with any search provider without direct API coupling.
 * 
 * v1: MockSearchProvider only
 * Future: Google, Brave, Tavily, News API, SEC Filings, Yahoo Finance, etc.
 */

export interface SearchResult {
  title: string;
  content: string;
  source: string;
  url?: string;
  timestamp?: Date;
  confidence: number; // 0-1, provider's confidence in result relevance
}

export interface SearchQuery {
  query: string;
  limit?: number; // max results to return
  timeframe?: 'recent' | 'week' | 'month' | 'year' | 'all'; // time filter
  category?: string; // optional category filter
}

export interface ISearchProvider {
  /**
   * Search for information relevant to the query
   * @param query Search query with optional filters
   * @returns Array of search results with confidence scores
   */
  search(query: SearchQuery): Promise<SearchResult[]>;

  /**
   * Provider name (e.g., "mock", "google", "brave", "tavily")
   */
  getName(): string;

  /**
   * Whether this provider is available/configured
   */
  isAvailable(): Promise<boolean>;
}
