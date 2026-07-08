import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <GlobalHeader />
      <main className="flex-1">
        {children}
      </main>
      <GlobalFooter />
    </div>
  );
}
