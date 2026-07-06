/**
 * MockLLMProvider
 *
 * v1 mock implementation for testing and development.
 * Returns realistic mock responses for various prediction scenarios.
 */

import { ILLMProvider, LLMResponse, LLMQuery } from './ILLMProvider';

export class MockLLMProvider implements ILLMProvider {
  private mockResponses: Map<string, LLMResponse> = new Map();

  constructor() {
    this.initializeMockResponses();
  }

  private initializeMockResponses(): void {
    // Stock market analysis
    this.mockResponses.set('stock', {
      summary: 'Strong upward momentum with positive earnings outlook',
      keyFacts: [
        'Q3 earnings beat expectations by 12%',
        'Revenue growth at 8% YoY',
        'Analyst upgrades from 3 major firms',
      ],
      opportunities: [
        'Expansion into emerging markets',
        'New product line launch',
        'Strategic partnership potential',
      ],
      risks: [
        'Rising interest rates impact valuations',
        'Supply chain disruptions',
        'Competitive pressure from new entrants',
      ],
      reasoning: 'Positive fundamentals support continued growth trajectory',
      confidence: 0.82,
      source: 'MockLLMProvider',
    });

    // Weather analysis
    this.mockResponses.set('weather', {
      summary: 'Typical seasonal pattern with minor anomalies',
      keyFacts: [
        'Temperature 2°C above historical average',
        'Precipitation 15% below normal',
        'Wind patterns consistent with season',
      ],
      opportunities: [
        'Favorable conditions for outdoor activities',
        'Reduced heating demand',
      ],
      risks: [
        'Potential drought conditions',
        'Crop yield concerns',
      ],
      reasoning: 'Seasonal factors dominate with slight warming trend',
      confidence: 0.75,
      source: 'MockLLMProvider',
    });

    // Sports analysis
    this.mockResponses.set('sports', {
      summary: 'Team momentum and player form support favorable outcome',
      keyFacts: [
        'Team won last 4 consecutive games',
        'Star player averaging 28 points per game',
        'Home court advantage historically strong',
      ],
      opportunities: [
        'Defensive improvements in recent games',
        'Bench depth showing strength',
      ],
      risks: [
        'Injury concerns for key players',
        'Opponent recent performance surge',
      ],
      reasoning: 'Current form and historical patterns suggest positive trajectory',
      confidence: 0.78,
      source: 'MockLLMProvider',
    });

    // Economic analysis
    this.mockResponses.set('economy', {
      summary: 'Mixed signals with cautious outlook',
      keyFacts: [
        'GDP growth at 2.1% in Q2',
        'Unemployment rate at 3.8%',
        'Inflation moderating from peak',
      ],
      opportunities: [
        'Potential rate cuts in coming months',
        'Consumer spending remains resilient',
      ],
      risks: [
        'Geopolitical uncertainties',
        'Banking sector stress indicators',
      ],
      reasoning: 'Macroeconomic indicators show stability with downside risks',
      confidence: 0.68,
      source: 'MockLLMProvider',
    });

    // Default response
    this.mockResponses.set('default', {
      summary: 'Reasonable analysis based on available information',
      keyFacts: [
        'Key factor 1 identified',
        'Key factor 2 identified',
        'Key factor 3 identified',
      ],
      opportunities: [
        'Opportunity 1',
        'Opportunity 2',
      ],
      risks: [
        'Risk 1',
        'Risk 2',
      ],
      reasoning: 'Analysis suggests moderate confidence in prediction',
      confidence: 0.72,
      source: 'MockLLMProvider',
    });
  }

  async analyzeText(query: LLMQuery): Promise<LLMResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 50));

    const text = query.text.toLowerCase();
    
    // Match against known scenarios
    if (text.includes('stock') || text.includes('market') || text.includes('price')) {
      return this.mockResponses.get('stock')!;
    }
    if (text.includes('weather') || text.includes('temperature') || text.includes('rain')) {
      return this.mockResponses.get('weather')!;
    }
    if (text.includes('sport') || text.includes('game') || text.includes('team') || text.includes('player')) {
      return this.mockResponses.get('sports')!;
    }
    if (text.includes('economy') || text.includes('gdp') || text.includes('inflation') || text.includes('unemployment')) {
      return this.mockResponses.get('economy')!;
    }

    return this.mockResponses.get('default')!;
  }

  async summarizeText(text: string, maxLength: number = 200): Promise<string> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 30));

    const summary = 'This text discusses important aspects that may influence future outcomes. Key themes include market dynamics, external factors, and historical patterns.';
    return summary.substring(0, maxLength);
  }

  async extractKeyFacts(text: string): Promise<string[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 40));

    return [
      'Significant trend identified',
      'Notable pattern observed',
      'Important factor recognized',
      'Relevant indicator detected',
    ];
  }

  async identifyOpportunities(text: string): Promise<string[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 40));

    return [
      'Growth potential identified',
      'Strategic advantage opportunity',
      'Market expansion possibility',
    ];
  }

  async identifyRisks(text: string): Promise<string[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 40));

    return [
      'External uncertainty factor',
      'Competitive risk element',
      'Market volatility concern',
    ];
  }

  getName(): string {
    return 'MockLLMProvider';
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}
