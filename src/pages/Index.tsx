import { Header } from "@/components/Header";
import { WhaleActivityCard } from "@/components/WhaleActivityCard";
import { TraderCard } from "@/components/TraderCard";
import { Activity, TrendingUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWhaleActivity, useTopTraders } from "@/hooks/usePolymarketData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIPredictionChat } from "@/components/AIPredictionChat";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [minAmount, setMinAmount] = useState(5000);
  const [showAIChat, setShowAIChat] = useState(false);
  
  const filteredCategory = category === "all" ? "" : category;
  const { data: whaleActivity, isLoading: whaleLoading, error: whaleError } = useWhaleActivity(searchQuery, filteredCategory, minAmount);
  const { data: topTraders, isLoading: tradersLoading, error: tradersError } = useTopTraders(searchQuery);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <span className="text-[20rem] font-bold text-foreground rotate-[-45deg]">
          POLYSCOPE
        </span>
      </div>
      
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        minAmount={minAmount}
        setMinAmount={setMinAmount}
      />

      <main className="container px-4 py-8 space-y-6">
        {/* Live Whale Activity Feed */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-warning animate-pulse" />
            <h2 className="text-2xl font-bold text-gradient">Live Whale Activity</h2>
            <span className="text-xs text-muted-foreground animate-pulse">Updates every 30s</span>
          </div>
          
          {/* Category Filters & AI Chat Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[280px] bg-card border-primary/20 hover:border-primary/50 transition-all duration-300">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/20">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sports">🏆 Sports</SelectItem>
                <SelectItem value="crypto">₿ Crypto</SelectItem>
                <SelectItem value="politics">🗳️ Politics</SelectItem>
                <SelectItem value="economy">💹 Economy</SelectItem>
                <SelectItem value="trending">🔥 Trending</SelectItem>
                <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                <SelectItem value="technology">💻 Technology</SelectItem>
                <SelectItem value="weather">🌤️ Weather</SelectItem>
                <SelectItem value="gaming">🎮 Gaming</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => setShowAIChat(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Predictions
            </Button>
          </div>
          
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
      
      <AIPredictionChat open={showAIChat} onOpenChange={setShowAIChat} />
    </div>
  );
};

export default Index;
