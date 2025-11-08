import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";
import { useMemo } from "react";

interface NewsFeedProps {
  selectedCategories?: string[];
  minTradeSize?: number;
  searchQuery?: string;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Politics: "bg-chart-4",
    Crypto: "bg-warning",
    Sports: "bg-success",
    Economy: "bg-chart-1",
    Technology: "bg-chart-5",
  };
  return colors[category] || "bg-muted";
};

export const NewsFeed = ({ 
  selectedCategories = [], 
  minTradeSize = 5000,
  searchQuery = "",
  dateRange,
}: NewsFeedProps) => {
  const { whaleTrades, marketStats, isConnected } = useRealtimePolymarket({
    categories: selectedCategories,
    minTradeSize,
    searchQuery,
    dateRange,
  });

  const newsItems = useMemo(() => {
    const items = [];
    
    // Generate news from whale trades
    const significantTrades = whaleTrades.filter(t => t.amount > minTradeSize * 2).slice(0, 5);
    significantTrades.forEach(trade => {
      items.push({
        id: `trade-${trade.id}`,
        type: 'whale-trade',
        title: `Major Whale Movement in ${trade.market}`,
        description: `Whale ${trade.wallet.slice(0, 6)}...${trade.wallet.slice(-4)} placed a $${trade.amount.toLocaleString()} ${trade.side} bet`,
        category: trade.category,
        timestamp: trade.timestamp,
        icon: TrendingUp,
      });
    });

    // Generate news from market stats
    const hotMarkets = marketStats.slice(0, 3);
    hotMarkets.forEach((market, i) => {
      if (market.volume > 50000) {
        items.push({
          id: `market-${market.market}-${i}`,
          type: 'market-heat',
          title: `${market.market} Shows High Activity`,
          description: `Trading volume of $${market.volume.toLocaleString()} with ${market.whaleCount} whales participating`,
          category: 'Market',
          timestamp: 'Just now',
          icon: AlertCircle,
        });
      }
    });

    // Sort by most recent
    return items.slice(0, 10);
  }, [whaleTrades, marketStats, minTradeSize]);

  return (
    <Card className="p-6 card-elevated border-primary/20 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Market News Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
          <span className="text-xs text-muted-foreground">{isConnected ? 'Live' : 'Connecting...'}</span>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        {newsItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {newsItems.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer group animate-fade-in hover:scale-[1.02]"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <ItemIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-bold mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${getCategoryColor(item.category)} text-xs`}>
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
