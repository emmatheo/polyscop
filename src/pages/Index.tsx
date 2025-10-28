import { Header } from "@/components/Header";
import { WhaleActivityCard } from "@/components/WhaleActivityCard";
import { TraderCard } from "@/components/TraderCard";
import { Activity, TrendingUp } from "lucide-react";

// Mock data - will be replaced with real-time data
const mockWhaleActivity = [
  {
    id: "1",
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    market: "Will Bitcoin reach $100,000 by end of 2025?",
    side: "YES" as const,
    amount: 50000,
    price: 0.67,
    timestamp: "2m ago",
    profitability: 78.5,
  },
  {
    id: "2",
    wallet: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    market: "US Presidential Election 2024 - Democrat Win",
    side: "NO" as const,
    amount: 125000,
    price: 0.45,
    timestamp: "5m ago",
    profitability: 82.3,
  },
  {
    id: "3",
    wallet: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    market: "Will AI replace 50% of software jobs by 2030?",
    side: "YES" as const,
    amount: 75000,
    price: 0.42,
    timestamp: "8m ago",
    profitability: 71.2,
  },
  {
    id: "4",
    wallet: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    market: "SpaceX Mars Landing before 2030?",
    side: "YES" as const,
    amount: 95000,
    price: 0.38,
    timestamp: "12m ago",
    profitability: 85.7,
  },
];

const mockTopTraders = [
  {
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    totalProfit: 285000,
    winRate: 78.5,
    totalTrades: 342,
    recentActivity: "2m ago",
    profitChange24h: 15200,
  },
  {
    wallet: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    totalProfit: 412000,
    winRate: 82.3,
    totalTrades: 567,
    recentActivity: "5m ago",
    profitChange24h: 23400,
  },
  {
    wallet: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    totalProfit: 198000,
    winRate: 71.2,
    totalTrades: 289,
    recentActivity: "8m ago",
    profitChange24h: 8900,
  },
  {
    wallet: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    totalProfit: 523000,
    winRate: 85.7,
    totalTrades: 678,
    recentActivity: "12m ago",
    profitChange24h: 31200,
  },
  {
    wallet: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    totalProfit: 167000,
    winRate: 68.9,
    totalTrades: 234,
    recentActivity: "15m ago",
    profitChange24h: 6700,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 space-y-6">
        {/* Live Whale Activity Feed */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-warning animate-pulse" />
            <h2 className="text-2xl font-bold">Live Whale Activity</h2>
            <span className="text-xs text-muted-foreground">Updates every 30s</span>
          </div>
          <div className="space-y-3">
            {mockWhaleActivity.map((activity) => (
              <WhaleActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>

        {/* Top Profitable Traders */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-success" />
            <h2 className="text-2xl font-bold">Top Profitable Traders</h2>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <div className="space-y-3">
            {mockTopTraders.map((trader, idx) => (
              <TraderCard key={trader.wallet} trader={trader} rank={idx + 1} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
