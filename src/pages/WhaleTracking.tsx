import { useState } from "react";
import { Header } from "@/components/Header";
import { WhaleMovementsTable } from "@/components/dashboard/WhaleMovementsTable";
import { WhaleNetworkViz } from "@/components/dashboard/WhaleNetworkViz";
import { WhaleMomentum } from "@/components/dashboard/WhaleMomentum";
import { WhaleFlipDetector } from "@/components/dashboard/WhaleFlipDetector";
import { WalletComparison } from "@/components/dashboard/WalletComparison";
import { AdvancedFilters } from "@/components/dashboard/AdvancedFilters";
import { Activity } from "lucide-react";

const WhaleTracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minTradeSize, setMinTradeSize] = useState(5000);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <span className="text-[20rem] font-bold text-foreground rotate-[-45deg]">
          POLYSCOP
        </span>
      </div>
      
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        minAmount={minTradeSize}
        setMinAmount={setMinTradeSize}
      />

      <main className="container px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Activity className="h-12 w-12 text-warning animate-pulse" />
            <h1 className="text-5xl font-bold text-gradient">Whale Tracking</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Monitor whale movements, analyze trading patterns, and track market influencers
          </p>
        </section>

        {/* Advanced Filters */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <AdvancedFilters
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            minTradeSize={minTradeSize}
            onMinTradeSizeChange={setMinTradeSize}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </section>

        {/* Whale Intelligence Grid */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-3xl font-bold text-gradient">Whale Intelligence</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WhaleMovementsTable 
                selectedCategories={selectedCategories}
                minTradeSize={minTradeSize}
              />
            </div>
            <WhaleMomentum 
              selectedCategories={selectedCategories}
              minTradeSize={minTradeSize}
              searchQuery={searchQuery}
              dateRange={dateRange}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WhaleFlipDetector />
            <WalletComparison />
          </div>

          <WhaleNetworkViz />
        </section>

        {/* Footer */}
        <footer className="mt-12 pb-8 text-center">
          <p className="text-sm text-muted-foreground">
            Created by <span className="text-primary font-semibold">timmyy</span>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default WhaleTracking;
