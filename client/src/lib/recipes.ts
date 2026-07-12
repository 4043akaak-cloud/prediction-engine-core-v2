/**
 * Recipe Constants and Utilities
 * Centralized recipe definitions for the frontend
 */

export const STOCK_DEFAULT_RECIPE = {
  id: "stock-default",
  name: "Stock Default",
  type: "SYSTEM",
  status: "ready",
  difficulty: "Beginner",
  category: "FINANCE",
  description:
    "A balanced stock prediction recipe designed to demonstrate the core philosophy of PEC by combining multiple reasoning approaches rather than relying on a single prediction method.",
  version: 1,
  isPublic: 1,
  displayOrder: 1,

  // Recipe Philosophy
  philosophy:
    "This recipe provides a balanced prediction by combining market trend analysis, statistical reasoning, probabilistic updating, causal reasoning, behavioral psychology, strategic interaction, business fundamentals, intrinsic valuation, and uncertainty simulation. The goal is not to maximize prediction accuracy for one specific strategy, but to demonstrate how multiple independent reasoning engines can work together.",

  // Engine composition in order
  engines: [
    {
      engineId: "market-data-engine",
      name: "Market Data Engine",
      position: 1,
      weight: "high",
      role: "Foundation - Gather market data and context",
    },
    {
      engineId: "trend-engine",
      name: "Trend Engine",
      position: 2,
      weight: "high",
      role: "Identify market trend direction and momentum",
    },
    {
      engineId: "statistical-engine",
      name: "Statistical Engine",
      position: 3,
      weight: "high",
      role: "Apply statistical inference and probability distributions",
    },
    {
      engineId: "bayesian-reasoning-engine",
      name: "Bayesian Reasoning Engine",
      position: 4,
      weight: "medium",
      role: "Update beliefs with new evidence",
    },
    {
      engineId: "causal-engine",
      name: "Causal Engine",
      position: 5,
      weight: "medium",
      role: "Identify causal relationships and mechanisms",
    },
    {
      engineId: "business-quality-engine",
      name: "Business Quality Engine",
      position: 6,
      weight: "high",
      role: "Evaluate business fundamentals and quality",
    },
    {
      engineId: "intrinsic-value-engine",
      name: "Intrinsic Value Engine",
      position: 7,
      weight: "high",
      role: "Calculate intrinsic valuation",
    },
    {
      engineId: "prospect-theory-engine",
      name: "Prospect Theory Engine",
      position: 8,
      weight: "medium",
      role: "Account for behavioral psychology and risk perception",
    },
    {
      engineId: "game-theory-engine",
      name: "Game Theory Engine",
      position: 9,
      weight: "medium",
      role: "Analyze strategic interactions and competitive dynamics",
    },
    {
      engineId: "monte-carlo-engine",
      name: "Monte Carlo Engine",
      position: 10,
      weight: "medium",
      role: "Simulate uncertainty and generate probability distributions",
    },
  ],

  // Reasoning pipeline visualization
  pipeline: [
    "Question",
    "↓",
    "Market Data",
    "↓",
    "Trend",
    "↓",
    "Statistics",
    "↓",
    "Business Quality",
    "↓",
    "Intrinsic Value",
    "↓",
    "Causal",
    "↓",
    "Prospect Theory",
    "↓",
    "Game Theory",
    "↓",
    "Bayesian Update",
    "↓",
    "Monte Carlo",
    "↓",
    "Aggregator",
    "↓",
    "Final Prediction",
  ],

  // Recipe metadata for display
  metadata: {
    engineCount: 10,
    families: [
      "Financial Reasoning",
      "Temporal Reasoning",
      "Statistical Reasoning",
      "Probabilistic Reasoning",
      "Causal Reasoning",
      "Psychology Reasoning",
      "Game Theory",
    ],
    categories: [
      "Finance",
      "Trend Analysis",
      "Statistical Analysis",
      "Valuation",
      "Behavioral Analysis",
      "Strategic Analysis",
      "Probabilistic Simulation",
    ],
    tags: [
      "stock-prediction",
      "balanced-approach",
      "multi-engine",
      "beginner-friendly",
      "system-recipe",
      "featured",
    ],
  },

  // Why these engines were selected
  rationale: {
    title: "Why These Engines?",
    description:
      "This recipe combines the most essential reasoning approaches for stock prediction:",
    reasons: [
      "Market Data Engine provides the factual foundation",
      "Trend Engine identifies directional momentum",
      "Statistical Engine applies rigorous quantitative analysis",
      "Bayesian Engine updates predictions with new information",
      "Causal Engine reveals underlying mechanisms",
      "Business Quality Engine evaluates company fundamentals",
      "Intrinsic Value Engine provides valuation anchor",
      "Prospect Theory Engine accounts for human psychology",
      "Game Theory Engine analyzes competitive dynamics",
      "Monte Carlo Engine quantifies uncertainty",
    ],
  },

  // Strengths of this recipe
  strengths: [
    "Balanced approach combining quantitative and qualitative analysis",
    "Demonstrates multi-engine reasoning philosophy of PEC",
    "Suitable for beginner users learning PEC concepts",
    "Covers multiple dimensions of stock analysis",
    "Provides both fundamental and technical perspectives",
    "Accounts for behavioral and strategic factors",
    "Quantifies uncertainty through simulation",
  ],

  // Limitations of this recipe
  limitations: [
    "Balanced approach may not outperform specialized strategies",
    "Requires understanding of multiple reasoning paradigms",
    "Execution time may be longer due to engine count",
    "Not optimized for specific market conditions",
    "Assumes all engines have equal importance",
  ],

  // Best use cases
  bestUseCases: [
    "Learning PEC reasoning philosophy",
    "General stock analysis for educational purposes",
    "Demonstrating multi-engine prediction approach",
    "Baseline comparison for specialized recipes",
    "Understanding how different reasoning methods interact",
  ],

  // Expected reasoning flow
  expectedFlow:
    "The recipe processes predictions through a sequential pipeline, starting with market data gathering, then applying trend analysis, statistical methods, and probabilistic updating. Business fundamentals and valuation are evaluated, followed by behavioral and strategic considerations. Finally, uncertainty is quantified through Monte Carlo simulation to produce a comprehensive prediction with confidence intervals.",
};

export type StockDefaultRecipeType = typeof STOCK_DEFAULT_RECIPE;
