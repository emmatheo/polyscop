import { useState } from "react";
import { Header } from "@/components/Header";
import { WalletSearch } from "@/components/dashboard/WalletSearch";
import { WalletStatsCards } from "@/components/dashboard/WalletStatsCards";
import { WinRatePieChart } from "@/components/dashboard/WinRatePieChart";
import { WinRateLineChart } from "@/components/dashboard/WinRateLineChart";
import { TopTradersTable } from "@/components/dashboard/TopTradersTable";
import { MarketHeatmap } from "@/components/dashboard/MarketHeatmap";
import { ActiveMarketsTable } from "@/components/dashboard/ActiveMarketsTable";
import { WhaleActivityCard } from "@/components/WhaleActivityCard";
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
            Analyze top traders, markets, and whale performance
          </p>
        </section>

        {/* Wallet Search */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <WalletSearch 
            selectedWallet={selectedWallet}
            onWalletChange={setSelectedWallet}
          />
        </section>

        {/* Wallet Analytics Cards */}
        {selectedWallet && (
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <WalletStatsCards wallet={selectedWallet} />
          </section>
        )}

        {/* Performance Section */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold text-gradient">Performance Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WinRatePieChart />
            <WinRateLineChart />
          </div>

          <TopTradersTable />
        </section>

        {/* Market Insights Section */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-bold text-gradient">Market Insights</h2>
          
          <MarketHeatmap />
          <ActiveMarketsTable />
        </section>

        {/* Recent Trades Feed */}
        <section className="animate-fade-in space-y-6" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-warning animate-pulse" />
            <h2 className="text-3xl font-bold text-gradient">Recent Whale Trades</h2>
            <span className="text-xs text-muted-foreground animate-pulse">Live Feed</span>
          </div>
          
          {!whaleLoading && whaleActivity && whaleActivity.length > 0 ? (
            <div className="space-y-3">
              {whaleActivity.slice(0, 10).map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <WhaleActivityCard activity={activity} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Loading recent whale trades...
            </p>
          )}
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
