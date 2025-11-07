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
import { Activity } from "lucide-react";
import { useWhaleActivity } from "@/hooks/usePolymarketData";

const Dashboard = () => {
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [searchQuery] = useState("");
  const [minAmount] = useState(5000);
  
  const { data: whaleActivity, isLoading: whaleLoading } = useWhaleActivity(searchQuery, "", minAmount);

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
        setSearchQuery={() => {}}
        minAmount={minAmount}
        setMinAmount={() => {}}
      />

      <main className="container px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold text-gradient">PolyScop Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Advanced prediction market intelligence - Track traders, whales, and market momentum
          </p>
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

        {/* Overview Cards */}
        <section className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <OverviewCards />
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
              <WhaleMovementsTable />
            </div>
            <WhaleFlipDetector />
          </div>

          <WalletComparison />
        </section>

        {/* Market Insights */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold text-gradient">Market Insights</h2>
          
          <MarketHeatmap />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HotMarketsTable />
            <SentimentGauge />
          </div>
        </section>

        {/* Live Price Movements */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.32s' }}>
          <h2 className="text-3xl font-bold text-gradient">Live Market Odds</h2>
          <LivePriceCharts />
        </section>

        {/* Alpha Feed & Network */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.35s' }}>
          <h2 className="text-3xl font-bold text-gradient">Alpha Intelligence</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlphaFeed />
            <WhaleNetworkViz />
          </div>
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

export default Dashboard;
