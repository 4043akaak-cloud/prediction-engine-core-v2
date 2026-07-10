import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { PageContainer } from "@/components/PageContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Search } from "lucide-react";

interface Engine {
  id: string;
  name: string;
  family: string;
  category: string;
  role: string;
  coreQuestion: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  input: string;
  output: string;
  version: string;
  status: "stable" | "beta" | "experimental";
}

export default function EngineGarage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Fetch all engines
  const enginesQuery = trpc.engineLibrary.listEngines.useQuery();

  // Extract unique families, categories, and statuses
  const metadata = useMemo(() => {
    if (!enginesQuery.data) return { families: [], categories: [], statuses: [] };

    const families = new Set<string>();
    const categories = new Set<string>();
    const statuses = new Set<string>();

    enginesQuery.data.forEach((engine) => {
      families.add(engine.family);
      categories.add(engine.category);
      statuses.add(engine.status);
    });

    return {
      families: Array.from(families).sort(),
      categories: Array.from(categories).sort(),
      statuses: Array.from(statuses).sort(),
    };
  }, [enginesQuery.data]);

  // Filter and search engines
  const filteredEngines = useMemo(() => {
    if (!enginesQuery.data) return [];

    return enginesQuery.data.filter((engine) => {
      const matchesSearch =
        engine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        engine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        engine.coreQuestion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFamily = !selectedFamily || engine.family === selectedFamily;
      const matchesCategory = !selectedCategory || engine.category === selectedCategory;
      const matchesStatus = !selectedStatus || engine.status === selectedStatus;

      return matchesSearch && matchesFamily && matchesCategory && matchesStatus;
    });
  }, [enginesQuery.data, searchQuery, selectedFamily, selectedCategory, selectedStatus]);

  const handleEngineClick = (engineId: string) => {
    setLocation(`/engines/${engineId}`);
  };

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

  if (enginesQuery.isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-96">
          <Loader2 className="animate-spin" size={32} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Engine Garage</h1>
          <p className="text-lg text-muted-foreground">
            Explore and understand all available prediction engines
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by name, description, or question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 text-base"
          />
        </div>

        {/* Filters */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Family Filter */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">Family</label>
            <select
              value={selectedFamily || ""}
              onChange={(e) => setSelectedFamily(e.target.value || null)}
              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="">All Families</option>
              {metadata.families.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">Category</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="">All Categories</option>
              {metadata.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-foreground">Status</label>
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="">All Statuses</option>
              {metadata.statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Engine List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEngines.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-lg text-muted-foreground">No engines found matching your filters.</p>
            </div>
          ) : (
            filteredEngines.map((engine: Engine) => (
              <div
                key={engine.id}
                onClick={() => handleEngineClick(engine.id)}
                className="border border-border rounded-lg p-6 cursor-pointer hover:bg-accent hover:border-primary transition-all duration-200 flex flex-col h-full"
              >
                {/* Header with Status Badge */}
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-lg leading-tight flex-1">{engine.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getStatusBadgeColor(engine.status)}`}>
                      {engine.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">{engine.role}</p>
                </div>

                {/* Metadata - Multi-row layout */}
                <div className="mb-5 space-y-2 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1.5 bg-background border border-border rounded text-xs font-medium">
                      {engine.family}
                    </span>
                    <span className="inline-block px-3 py-1.5 bg-background border border-border rounded text-xs font-medium">
                      {engine.category}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1.5 bg-background border border-border rounded text-xs font-medium">
                      v{engine.version}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground mb-4 line-clamp-3 flex-grow">{engine.description}</p>

                {/* Core Question */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    <strong>Core Question:</strong>
                  </p>
                  <p className="text-sm text-foreground italic line-clamp-2">{engine.coreQuestion}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Count */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          Showing {filteredEngines.length} of {enginesQuery.data?.length || 0} engines
        </div>
      </div>
    </PageContainer>
  );
}
