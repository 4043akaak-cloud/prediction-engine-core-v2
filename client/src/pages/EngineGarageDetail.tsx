import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft, Check, AlertCircle } from "lucide-react";

export default function EngineGarageDetail() {
  const [location, setLocation] = useLocation();
  const engineId = location.split("/").pop();

  const engineQuery = trpc.engineLibrary.getEngine.useQuery(
    { id: engineId || "" },
    { enabled: !!engineId }
  );

  const handleBack = () => {
    setLocation("/engine-garage");
  };

  const handleUseInRecipe = () => {
    setLocation(`/recipe-builder?engineId=${engineId}`);
  };

  if (!engineId) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Engine not found.</p>
          <Button variant="outline" onClick={handleBack} className="mt-6">
            Back to Engine Garage
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (engineQuery.isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-96">
          <Loader2 className="animate-spin" size={32} />
        </div>
      </PageContainer>
    );
  }

  if (engineQuery.isError || !engineQuery.data) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Failed to load engine details.</p>
          <Button variant="outline" onClick={handleBack} className="mt-6">
            Back to Engine Garage
          </Button>
        </div>
      </PageContainer>
    );
  }

  const engine = engineQuery.data;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-800";
      case "beta":
        return "bg-yellow-100 text-yellow-800";
      case "experimental":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageContainer>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Engine Garage
        </button>

        {/* Header Section */}
        <div className="mb-10 pb-8 border-b border-border">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{engine.name}</h1>
              <p className="text-lg text-muted-foreground italic">{engine.role}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 ${getStatusBadgeColor(engine.status)}`}>
              {engine.status.charAt(0).toUpperCase() + engine.status.slice(1)}
            </span>
          </div>

          {/* Metadata Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="px-4 py-2 bg-background border border-border rounded-lg text-sm">
              <span className="font-semibold">Family:</span> {engine.family}
            </div>
            <div className="px-4 py-2 bg-background border border-border rounded-lg text-sm">
              <span className="font-semibold">Category:</span> {engine.category}
            </div>
            <div className="px-4 py-2 bg-background border border-border rounded-lg text-sm">
              <span className="font-semibold">Version:</span> {engine.version}
            </div>
          </div>

          {/* Use in Recipe Button */}
          <Button onClick={handleUseInRecipe} size="lg" className="w-full sm:w-auto">
            Use in Recipe
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview Section */}
            <section>
              <h2 className="text-2xl font-bold mb-5">Overview</h2>
              <p className="text-foreground mb-6 leading-relaxed">{engine.description}</p>
              <div className="bg-background border border-border rounded-lg p-6">
                <p className="text-sm font-semibold text-primary mb-3">Core Question</p>
                <p className="text-foreground italic text-base leading-relaxed">{engine.coreQuestion}</p>
              </div>
              {engine.knowledgeSource && (
                <div className="bg-background border border-border rounded-lg p-6 mt-6">
                  <p className="text-sm font-semibold text-primary mb-3">
                    {engine.knowledgeSource.type === "People" && "Inspired By"}
                    {engine.knowledgeSource.type === "Theories & Laws" && "Based On"}
                    {engine.knowledgeSource.type === "Philosophy" && "Rooted In"}
                    {engine.knowledgeSource.type === "Art & Culture" && "Heritage"}
                    {engine.knowledgeSource.type === "Natural Systems" && "Derived From"}
                  </p>
                  <p className="text-foreground text-base">{engine.knowledgeSource.value}</p>
                </div>
              )}
            </section>

            {/* Capabilities Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Capabilities</h2>

              {/* Strengths */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Check size={20} className="text-green-600 flex-shrink-0" />
                  Strengths
                </h3>
                <ul className="space-y-3 ml-7">
                  {engine.strengths.map((strength, idx) => (
                    <li key={idx} className="flex gap-3 text-foreground">
                      <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
                  Limitations
                </h3>
                <ul className="space-y-3 ml-7">
                  {engine.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex gap-3 text-foreground">
                      <span className="text-yellow-600 font-bold mt-0.5 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* I/O Specifications */}
            <section>
              <h2 className="text-2xl font-bold mb-6">I/O Specifications</h2>

              {/* Input */}
              <div className="mb-8">
                <h3 className="font-semibold text-base mb-3">Input</h3>
                <div className="bg-background border border-border rounded-lg p-6">
                  <p className="text-foreground leading-relaxed">{engine.input}</p>
                </div>
              </div>

              {/* Output */}
              <div>
                <h3 className="font-semibold text-base mb-3">Output</h3>
                <div className="bg-background border border-border rounded-lg p-6">
                  <p className="text-foreground leading-relaxed">{engine.output}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-background border border-border rounded-lg p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-6">Engine Information</h3>

              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-muted-foreground font-semibold mb-2">Family</p>
                  <p className="text-foreground">{engine.family}</p>
                </div>

                <div>
                  <p className="text-muted-foreground font-semibold mb-2">Category</p>
                  <p className="text-foreground">{engine.category}</p>
                </div>

                <div>
                  <p className="text-muted-foreground font-semibold mb-2">Version</p>
                  <p className="text-foreground">{engine.version}</p>
                </div>

                <div>
                  <p className="text-muted-foreground font-semibold mb-2">Status</p>
                  <p className={`font-semibold ${getStatusBadgeColor(engine.status).split(" ")[1]}`}>
                    {engine.status.charAt(0).toUpperCase() + engine.status.slice(1)}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-muted-foreground font-semibold mb-2">Engine ID</p>
                  <p className="font-mono text-xs break-all text-foreground">{engine.id}</p>
                </div>
              </div>

              <Button onClick={handleUseInRecipe} className="w-full mt-8">
                Use in Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
