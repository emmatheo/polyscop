import { Header } from "@/components/Header";
import { WhaleActivityCard } from "@/components/WhaleActivityCard";
import { TraderCard } from "@/components/TraderCard";
import { Activity, TrendingUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWhaleActivity, useTopTraders } from "@/hooks/usePolymarketData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  
  const { data: whaleActivity, isLoading: whaleLoading, error: whaleError } = useWhaleActivity(searchQuery, category);
  const { data: topTraders, isLoading: tradersLoading, error: tradersError } = useTopTraders(searchQuery);

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="container px-4 py-8 space-y-6">
        {/* Live Whale Activity Feed */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-warning animate-pulse" />
            <h2 className="text-2xl font-bold">Live Whale Activity</h2>
            <span className="text-xs text-muted-foreground">Updates every 30s</span>
          </div>
          
          {/* Category Filters */}
          <Tabs value={category} onValueChange={setCategory} className="mb-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="">All</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="politics">Politics</TabsTrigger>
              <TabsTrigger value="economy">Economy</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {whaleLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : whaleError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load whale activity. Please try again later.
              </AlertDescription>
            </Alert>
          ) : whaleActivity && whaleActivity.length > 0 ? (
            <div className="space-y-3">
              {whaleActivity.map((activity) => (
                <WhaleActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No whale activity found{searchQuery ? ` for "${searchQuery}"` : ""}
            </p>
          )}
        </section>

        {/* Top Profitable Traders */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-success" />
            <h2 className="text-2xl font-bold">Top Profitable Traders</h2>
            <span className="text-xs text-muted-foreground">Ranked by 30-day performance</span>
          </div>
          
          {tradersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tradersError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load top traders. Please try again later.
              </AlertDescription>
            </Alert>
          ) : topTraders && topTraders.length > 0 ? (
            <div className="space-y-3">
              {topTraders.map((trader, idx) => (
                <TraderCard key={trader.wallet} trader={trader} rank={idx + 1} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No traders found{searchQuery ? ` for "${searchQuery}"` : ""}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
