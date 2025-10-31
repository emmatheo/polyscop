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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <span className="text-[20rem] font-bold text-foreground rotate-[-45deg]">
          POLYSCOPE
        </span>
      </div>
      
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="container px-4 py-8 space-y-6">
        {/* Live Whale Activity Feed */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-warning animate-pulse" />
            <h2 className="text-2xl font-bold text-gradient">Live Whale Activity</h2>
            <span className="text-xs text-muted-foreground animate-pulse">Updates every 30s</span>
          </div>
          
          {/* Category Filters */}
          <Tabs value={category} onValueChange={setCategory} className="mb-6 animate-fade-in">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-1 p-1">
              <TabsTrigger value="" className="transition-all duration-300 hover:scale-105">All</TabsTrigger>
              <TabsTrigger value="sports" className="transition-all duration-300 hover:scale-105">Sports</TabsTrigger>
              <TabsTrigger value="crypto" className="transition-all duration-300 hover:scale-105">Crypto</TabsTrigger>
              <TabsTrigger value="politics" className="transition-all duration-300 hover:scale-105">Politics</TabsTrigger>
              <TabsTrigger value="economy" className="transition-all duration-300 hover:scale-105">Economy</TabsTrigger>
              <TabsTrigger value="trending" className="transition-all duration-300 hover:scale-105">Trending</TabsTrigger>
              <TabsTrigger value="entertainment" className="transition-all duration-300 hover:scale-105">Entertainment</TabsTrigger>
              <TabsTrigger value="technology" className="transition-all duration-300 hover:scale-105">Tech</TabsTrigger>
              <TabsTrigger value="weather" className="transition-all duration-300 hover:scale-105">Weather</TabsTrigger>
              <TabsTrigger value="gaming" className="transition-all duration-300 hover:scale-105">Gaming</TabsTrigger>
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
              {whaleActivity.map((activity, index) => (
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
              No whale activity found{searchQuery ? ` for "${searchQuery}"` : ""}
            </p>
          )}
        </section>

        {/* Top Profitable Traders */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-success animate-pulse" />
            <h2 className="text-2xl font-bold text-gradient">Top Profitable Traders</h2>
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
                <div 
                  key={trader.wallet} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <TraderCard trader={trader} rank={idx + 1} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No traders found{searchQuery ? ` for "${searchQuery}"` : ""}
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

export default Index;
