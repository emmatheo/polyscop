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
import { WhaleNetworkViz } from "@/components/dashboard/WhaleNetworkViz";
import { LivePriceCharts } from "@/components/dashboard/LivePriceCharts";
import { AdvancedFilters } from "@/components/dashboard/AdvancedFilters";
import { WhaleMomentum } from "@/components/dashboard/WhaleMomentum";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { DailyVolumeTracking } from "@/components/dashboard/DailyVolumeTracking";
import { HugeWhaleAlerts } from "@/components/dashboard/HugeWhaleAlerts";
import { DataExport } from "@/components/dashboard/DataExport";
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
          <h1 className="text-5xl font-bold text-gradient">PolyScop Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Advanced prediction market intelligence - Track traders, whales, and market momentum
          </p>
          <Button 
            onClick={() => setShowAIChat(true)}
            size="lg"
            className="mt-4 bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-transform"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            AI Market Predictions
          </Button>
        </section>

        {/* Wallet Search & Watchlist */}
        <section className="animate-fade-in flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.1s' }}>
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
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold text-gradient">Performance Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PnLLineChart />
            <WinRatePieChart />
            <VolumeBarChart />
          </div>
        </section>

        {/* Whale Intelligence */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.25s' }}>
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
        </section>

        {/* Market Insights */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold text-gradient">Market Insights</h2>
          
          <MarketHeatmap />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HotMarketsTable 
              selectedCategories={selectedCategories}
              minTradeSize={minTradeSize}
            />
            <SentimentGauge />
          </div>
        </section>

        {/* Live Price Movements */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.32s' }}>
          <h2 className="text-3xl font-bold text-gradient">Live Market Odds</h2>
          <LivePriceCharts 
            selectedCategories={selectedCategories}
            minTradeSize={minTradeSize}
          />
        </section>

        {/* News & Alpha Feed */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.35s' }}>
          <h2 className="text-3xl font-bold text-gradient">News & Alpha Intelligence</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <WhaleNetworkViz />
        </section>


        {/* Footer */}
        <footer className="mt-12 pb-8 text-center">
          <p className="text-sm text-muted-foreground">
            Created by <span className="text-primary font-semibold">timmyy</span>
          </p>
        </footer>
      </main>

      {/* AI Prediction Chat */}
      <AIPredictionChat open={showAIChat} onOpenChange={setShowAIChat} />
    </div>
  );
};

export default Dashboard;
