import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page whenever the route changes.
 * This component should be mounted once at the root level (inside App or Router).
 * 
 * Usage:
 * <ScrollToTop />
 */
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [location]);

  return null;
}
