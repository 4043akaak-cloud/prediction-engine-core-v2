import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared PageContainer component for consistent page layout across all pages.
 * Ensures unified spacing, background, and text colors.
 * 
 * Usage:
 * <PageContainer>
 *   <PageHeader showBackButton backTo="/" />
 *   <main className="flex-1">
 *     page content
 *   </main>
 *   <PageFooter />
 * </PageContainer>
 */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${className}`}>
      {children}
    </div>
  );
}
