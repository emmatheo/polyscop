import { useState } from "react";
import { Header } from "@/components/Header";
import { WalletSearch } from "@/components/dashboard/WalletSearch";
import { WatchlistToggle } from "@/components/dashboard/WatchlistToggle";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { WalletStatsCards } from "@/components/dashboard/WalletStatsCards";
import { PnLLineChart } from "@/components/dashboard/PnLLineChart";
import { WinRatePieChart } from "@/components/dashboard/WinRatePieChart";
import { VolumeBarChart } from "@/components/dashboard/VolumeBarChart";
import { WhaleMovementsTable } from "@/components/dashboard/WhaleMovementsTable";
import { WhaleFlipDetector } from "@/components/dashboard/WhaleFlipDetector";
import { WalletComparison } from "@/components/dashboard/WalletComparison";
import { MarketHeatmap } from "@/components/dashboard/MarketHeatmap";
import { HotMarketsTable } from "@/components/dashboard/HotMarketsTable";
import { SentimentGauge } from "@/components/dashboard/SentimentGauge";
import { AlphaFeed } from "@/components/dashboard/AlphaFeed";
import { LivePriceCharts } from "@/components/dashboard/LivePriceCharts";
import { AdvancedFilters } from "@/components/dashboard/AdvancedFilters";
import { WhaleMomentum } from "@/components/dashboard/WhaleMomentum";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { DailyVolumeTracking } from "@/components/dashboard/DailyVolumeTracking";
import { HugeWhaleAlerts } from "@/components/dashboard/HugeWhaleAlerts";
import { DataExport } from "@/components/dashboard/DataExport";
import { TradeHistoryTimeline } from "@/components/dashboard/TradeHistoryTimeline";
import { AIPredictionChat } from "@/components/AIPredictionChat";
import { MessageSquare, ArrowRight } from "lucide-react";
import { useWhaleActivity } from "@/hooks/usePolymarketData";
import { Button } from "@/components/ui/button";

const SectionHeader = ({ label, accent = "primary" }: { label: string; accent?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`h-5 w-1 rounded-full bg-${accent}`} />
    <h2 className="text-lg font-display font-semibold text-foreground tracking-tight">{label}</h2>
  </div>
);

const Dashboard = () => {
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minTradeSize, setMinTradeSize] = useState(5000);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [showAIChat, setShowAIChat] = useState(false);
  
  const { data: whaleActivity, isLoading: whaleLoading } = useWhaleActivity(
    searchQuery, 
    selectedCategories.length === 1 ? selectedCategories[0] : "", 
    minTradeSize
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        minAmount={minTradeSize}
        setMinAmount={setMinTradeSize}
      />

      <main className="container px-4 py-6 space-y-8 max-w-[1400px]">
        {/* Hero — compact, data-forward */}
        <section className="animate-reveal-up pt-4 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
                Whale Intelligence Platform
              </p>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight leading-tight">
                PolyScop
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-md font-body">
                Real-time prediction market analytics · whale tracking · AI insights
              </p>
            </div>
            <Button 
              onClick={() => setShowAIChat(true)}
              className="self-start sm:self-auto h-9 px-4 text-sm font-body font-medium bg-primary text-primary-foreground hover:bg-primary/90 press-scale"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Predictions
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </section>

        <div className="section-rule" />

        {/* Controls Row */}
        <section className="animate-reveal-up stagger-1 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <WalletSearch selectedWallet={selectedWallet} onWalletChange={setSelectedWallet} />
          </div>
          <WatchlistToggle />
        </section>

        <section className="animate-reveal-up stagger-2">
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

        {/* Overview Stats */}
        <section className="animate-reveal-up stagger-3">
          <OverviewCards />
        </section>

        {/* Alerts + Export Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-reveal-up stagger-4">
          <div className="lg:col-span-2">
            <HugeWhaleAlerts minTradeSize={100000} />
          </div>
          <DataExport 
            selectedCategories={selectedCategories}
            minTradeSize={minTradeSize}
            searchQuery={searchQuery}
            dateRange={dateRange}
          />
        </section>

        {/* Volume Tracking */}
        <section className="animate-reveal-up stagger-5">
          <DailyVolumeTracking 
            selectedCategories={selectedCategories}
            minTradeSize={minTradeSize}
            searchQuery={searchQuery}
            dateRange={dateRange}
          />
        </section>

        {/* Wallet Stats (conditional) */}
        {selectedWallet && (
          <section className="animate-reveal-up">
            <WalletStatsCards wallet={selectedWallet} />
          </section>
        )}

        {/* Performance Section */}
        <section className="space-y-4 animate-reveal-up">
          <SectionHeader label="Performance Analytics" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PnLLineChart />
            <WinRatePieChart />
            <VolumeBarChart />
          </div>
        </section>

        {/* Whale Intelligence Section */}
        <section className="space-y-4 animate-reveal-up">
          <SectionHeader label="Whale Intelligence" accent="warning" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WhaleFlipDetector />
            <WalletComparison />
          </div>
        </section>

        {/* Trade History */}
        <section className="animate-reveal-up">
          <SectionHeader label="Trade History" accent="secondary" />
          <TradeHistoryTimeline />
        </section>

        {/* Market Insights */}
        <section className="space-y-4 animate-reveal-up">
          <SectionHeader label="Market Insights" accent="accent" />
          <MarketHeatmap />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HotMarketsTable 
              selectedCategories={selectedCategories}
              minTradeSize={minTradeSize}
            />
            <SentimentGauge />
          </div>
        </section>

        {/* Live Market Odds */}
        <section className="animate-reveal-up">
          <SectionHeader label="Live Market Odds" />
          <LivePriceCharts 
            selectedCategories={selectedCategories}
            minTradeSize={minTradeSize}
          />
        </section>

        {/* Intelligence Feed */}
        <section className="space-y-4 animate-reveal-up">
          <SectionHeader label="Intelligence Feed" accent="secondary" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NewsFeed 
              selectedCategories={selectedCategories}
              minTradeSize={minTradeSize}
              searchQuery={searchQuery}
              dateRange={dateRange}
            />
            <AlphaFeed 
              selectedCategories={selectedCategories}
              minTradeSize={minTradeSize}
              searchQuery={searchQuery}
              dateRange={dateRange}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center font-body">
            Built by <span className="text-foreground font-medium">timmyy</span>
          </p>
        </footer>
      </main>

      <AIPredictionChat open={showAIChat} onOpenChange={setShowAIChat} />
    </div>
  );
};

export default Dashboard;
