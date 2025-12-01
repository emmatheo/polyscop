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
import { Activity, MessageSquare } from "lucide-react";
import { useWhaleActivity } from "@/hooks/usePolymarketData";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background relative">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--secondary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />
      </div>

      {/* Floating Orbs */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float pointer-events-none" />
      
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        minAmount={minTradeSize}
        setMinAmount={setMinTradeSize}
      />

      <main className="container relative z-10 px-4 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 sm:space-y-6 animate-fade-in py-8 sm:py-12">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-gradient mb-3 tracking-tight">
              POLYSCOP
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-glow-pulse" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 font-heading font-light">
            Next-Gen Whale Intelligence Platform
          </p>
          <p className="text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto font-body">
            Real-time prediction market analytics • Advanced whale tracking • AI-powered insights
          </p>
          <Button 
            onClick={() => setShowAIChat(true)}
            size="lg"
            className="mt-6 group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 text-sm sm:text-base font-heading font-semibold px-8 py-6 glow-cyan"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 relative z-10" />
            <span className="relative z-10">AI Predictions</span>
          </Button>
        </section>

        {/* Wallet Search & Watchlist */}
        <section className="animate-fade-in flex flex-col sm:flex-row gap-3 sm:gap-4" style={{ animationDelay: '0.1s' }}>
          <div className="flex-1">
            <WalletSearch 
              selectedWallet={selectedWallet}
              onWalletChange={setSelectedWallet}
            />
          </div>
          <WatchlistToggle />
        </section>

        {/* Advanced Filters */}
        <section className="animate-fade-in" style={{ animationDelay: '0.12s' }}>
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

        {/* Huge Whale Alerts */}
        <section className="animate-fade-in" style={{ animationDelay: '0.13s' }}>
          <HugeWhaleAlerts minTradeSize={100000} />
        </section>

        {/* Trade History Timeline */}
        <section className="animate-fade-in" style={{ animationDelay: '0.14s' }}>
          <TradeHistoryTimeline />
        </section>

        {/* Overview Cards - Real-time */}
        <section className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <OverviewCards />
        </section>

        {/* Data Export */}
        <section className="animate-fade-in" style={{ animationDelay: '0.16s' }}>
          <DataExport 
            selectedCategories={selectedCategories}
            minTradeSize={minTradeSize}
            searchQuery={searchQuery}
            dateRange={dateRange}
          />
        </section>

        {/* Daily Volume Tracking */}
        <section className="animate-fade-in" style={{ animationDelay: '0.17s' }}>
          <DailyVolumeTracking 
            selectedCategories={selectedCategories}
            minTradeSize={minTradeSize}
            searchQuery={searchQuery}
            dateRange={dateRange}
          />
        </section>

        {/* Wallet Analytics Cards */}
        {selectedWallet && (
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <WalletStatsCards wallet={selectedWallet} />
          </section>
        )}

        {/* Performance Analytics */}
        <section className="animate-fade-in space-y-6 sm:space-y-8" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-primary/50 to-primary" />
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-gradient-gold">
              PERFORMANCE
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <PnLLineChart />
            <WinRatePieChart />
            <VolumeBarChart />
          </div>
        </section>

        {/* Whale Intelligence */}
        <section className="animate-fade-in space-y-6 sm:space-y-8" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-secondary/50 to-secondary" />
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-gradient">
              WHALE INTELLIGENCE
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-secondary via-secondary/50 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <WhaleFlipDetector />
            <WalletComparison />
          </div>
        </section>

        {/* Market Insights */}
        <section className="animate-fade-in space-y-6 sm:space-y-8" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-accent/50 to-accent" />
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-gradient-gold">
              MARKET INSIGHTS
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
          </div>
          
          <MarketHeatmap />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <HotMarketsTable 
              selectedCategories={selectedCategories}
              minTradeSize={minTradeSize}
            />
            <SentimentGauge />
          </div>
        </section>

        {/* Live Price Movements */}
        <section className="animate-fade-in space-y-6 sm:space-y-8" style={{ animationDelay: '0.32s' }}>
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-primary/50 to-primary" />
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-gradient">
              LIVE MARKET ODDS
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          </div>
          <LivePriceCharts 
            selectedCategories={selectedCategories}
            minTradeSize={minTradeSize}
          />
        </section>

        {/* News & Alpha Feed */}
        <section className="animate-fade-in space-y-6 sm:space-y-8" style={{ animationDelay: '0.35s' }}>
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-secondary/50 to-secondary" />
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-gradient">
              INTELLIGENCE FEED
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-secondary via-secondary/50 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
        <footer className="mt-12 sm:mt-16 pb-8 sm:pb-12 text-center border-t border-border/30 pt-8">
          <p className="text-xs sm:text-sm text-muted-foreground font-body">
            Built with <span className="text-primary font-semibold">precision</span> by{" "}
            <span className="text-gradient-gold font-bold">timmyy</span>
          </p>
        </footer>
      </main>

      {/* AI Prediction Chat */}
      <AIPredictionChat open={showAIChat} onOpenChange={setShowAIChat} />
    </div>
  );
};

export default Dashboard;
