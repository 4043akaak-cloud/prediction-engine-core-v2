/**
 * MockSearchProvider
 * 
 * v1 implementation of ISearchProvider for testing and development.
 * Returns mock search results without calling any external API.
 */

import { ISearchProvider, SearchQuery, SearchResult } from './ISearchProvider';

export class MockSearchProvider implements ISearchProvider {
  private mockResults: Map<string, SearchResult[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Mock data for common queries
    this.mockResults.set('weather', [
      {
        title: 'Weather Forecast for Tomorrow',
        content: 'Tomorrow will be sunny with temperatures reaching 25°C. Wind speed: 10 km/h.',
        source: 'mock-weather-service',
        url: 'https://mock-weather.example.com',
        timestamp: new Date(),
        confidence: 0.9,
      },
      {
        title: 'Historical Weather Patterns',
        content: 'Based on 30 years of data, tomorrow typically has 70% chance of clear skies.',
        source: 'mock-climate-db',
        url: 'https://mock-climate.example.com',
        timestamp: new Date(),
        confidence: 0.85,
      },
    ]);

    this.mockResults.set('stock', [
      {
        title: 'Market Analysis: Tech Stocks',
        content: 'Technology sector showing strong growth. Major indices up 2.5% this week.',
        source: 'mock-financial-news',
        url: 'https://mock-finance.example.com',
        timestamp: new Date(),
        confidence: 0.88,
      },
      {
        title: 'Quarterly Earnings Report',
        content: 'Q3 earnings exceeded expectations with 15% revenue growth year-over-year.',
        source: 'mock-earnings-db',
        url: 'https://mock-earnings.example.com',
        timestamp: new Date(),
        confidence: 0.92,
      },
    ]);

    this.mockResults.set('sports', [
      {
        title: 'Team Performance Analysis',
        content: 'The team has won 8 of their last 10 games with strong defensive performance.',
        source: 'mock-sports-stats',
        url: 'https://mock-sports.example.com',
        timestamp: new Date(),
        confidence: 0.87,
      },
      {
        title: 'Player Statistics',
        content: 'Leading scorer averaging 25 points per game this season.',
        source: 'mock-player-db',
        url: 'https://mock-players.example.com',
        timestamp: new Date(),
        confidence: 0.91,
      },
    ]);

    this.mockResults.set('economy', [
      {
        title: 'Economic Indicators Report',
        content: 'GDP growth at 3.2%, unemployment at 4.1%, inflation at 2.8%.',
        source: 'mock-economic-bureau',
        url: 'https://mock-economy.example.com',
        timestamp: new Date(),
        confidence: 0.93,
      },
      {
        title: 'Consumer Confidence Index',
        content: 'Consumer confidence increased 5 points to 102.4 in latest survey.',
        source: 'mock-consumer-research',
        url: 'https://mock-consumer.example.com',
        timestamp: new Date(),
        confidence: 0.86,
      },
    ]);
  }

  async search(query: SearchQuery): Promise<SearchResult[]> {
    const queryLower = query.query.toLowerCase();

    // Try exact match first
    if (this.mockResults.has(queryLower)) {
      const results = this.mockResults.get(queryLower) || [];
      return results.slice(0, query.limit || 10);
    }

    // Try keyword matching
    for (const [key, results] of this.mockResults.entries()) {
      if (queryLower.includes(key) || key.includes(queryLower)) {
        return results.slice(0, query.limit || 10);
      }
    }

    // Default: return generic results
    return [
      {
        title: `Search Results for "${query.query}"`,
        content: `No specific information found for "${query.query}". This is mock data.`,
        source: 'mock-default',
        url: 'https://mock-search.example.com',
        timestamp: new Date(),
        confidence: 0.5,
      },
    ];
  }

  getName(): string {
    return 'mock';
  }

  async isAvailable(): Promise<boolean> {
    return true; // Mock provider is always available
  }
}
