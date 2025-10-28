import { useState } from "react";
import { Header } from "@/components/Header";
import { MarketCard } from "@/components/MarketCard";
import { StatsCard } from "@/components/StatsCard";
import { SignalBadge } from "@/components/SignalBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Activity, Users, Filter } from "lucide-react";

// Mock data - will be replaced with real API calls
const mockMarkets = [
  {
    id: "1",
    title: "Will Bitcoin reach $100,000 by end of 2025?",
    category: "Crypto",
    yesPrice: 0.67,
    noPrice: 0.33,
    volume24h: 125000,
    priceChange24h: 5.2,
    liquidity: 450000,
    signals: [{ type: "momentum" as const, score: 8.4 }],
  },
  {
    id: "2",
    title: "Will AI replace 50% of software jobs by 2030?",
    category: "Technology",
    yesPrice: 0.42,
    noPrice: 0.58,
    volume24h: 89000,
    priceChange24h: -2.1,
    liquidity: 320000,
    signals: [{ type: "whale" as const, score: 7.2 }],
  },
  {
    id: "3",
    title: "US Presidential Election 2024 - Democrat Win",
    category: "Politics",
    yesPrice: 0.55,
    noPrice: 0.45,
    volume24h: 523000,
    priceChange24h: 1.8,
    liquidity: 1200000,
    signals: [
      { type: "volume" as const, score: 9.1 },
      { type: "momentum" as const, score: 6.8 },
    ],
  },
  {
    id: "4",
    title: "SpaceX Mars Landing before 2030?",
    category: "Space",
    yesPrice: 0.38,
    noPrice: 0.62,
    volume24h: 67000,
    priceChange24h: 3.5,
    liquidity: 280000,
    signals: [{ type: "contrarian" as const, score: 5.9 }],
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 space-y-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Markets"
            value="1,247"
            change="+12% this week"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-primary"
          />
          <StatsCard
            title="24h Volume"
            value="$4.2M"
            change="+8.3% vs yesterday"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatsCard
            title="Active Signals"
            value="47"
            change="Updated 2m ago"
            changeType="neutral"
            icon={Activity}
            iconColor="text-warning"
          />
          <StatsCard
            title="Tracked Wallets"
            value="2,381"
            change="+156 new whales"
            changeType="positive"
            icon={Users}
            iconColor="text-accent"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trending" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="signals">Hot Signals</TabsTrigger>
              <TabsTrigger value="whales">Whale Activity</TabsTrigger>
              <TabsTrigger value="new">New Markets</TabsTrigger>
            </TabsList>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <TabsContent value="trending" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Trending Markets
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockMarkets.map((market) => (
                  <div key={market.id} className="space-y-2">
                    <MarketCard {...market} />
                    {market.signals.length > 0 && (
                      <div className="flex gap-2 pl-2">
                        {market.signals.map((signal, idx) => (
                          <SignalBadge
                            key={idx}
                            type={signal.type}
                            score={signal.score}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signals" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Markets with Strong Signals</h2>
              <p className="text-muted-foreground mb-6">
                Markets showing significant momentum, volume spikes, or whale activity
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockMarkets
                  .filter((m) => m.signals.length > 0)
                  .map((market) => (
                    <div key={market.id} className="space-y-2">
                      <MarketCard {...market} />
                      <div className="flex gap-2 pl-2">
                        {market.signals.map((signal, idx) => (
                          <SignalBadge
                            key={idx}
                            type={signal.type}
                            score={signal.score}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="whales" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Whale Activity Feed</h2>
              <p className="text-muted-foreground mb-6">Coming soon - Track large wallet movements</p>
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Newly Listed Markets</h2>
              <p className="text-muted-foreground mb-6">Coming soon - Latest prediction markets</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
