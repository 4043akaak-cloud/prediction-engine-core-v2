/**
 * Confidence Formatter Utility
 * 
 * Centralized formatting for confidence values.
 * Internal representation: 0.0 - 1.0 (ratio)
 * Display representation: 0 - 100 (percentage)
 */

export function formatConfidencePercent(confidence: number): string {
  const percentage = Math.round(confidence * 100);
  return `${percentage}%`;
}

export function getConfidenceBarWidth(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}
