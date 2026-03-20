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
    Politics: "border-chart-4/30 text-chart-4",
    Crypto: "border-warning/30 text-warning",
    Sports: "border-success/30 text-success",
    Economy: "border-chart-1/30 text-chart-1",
    Technology: "border-chart-5/30 text-chart-5",
    Market: "border-primary/30 text-primary",
  };
  return colors[category] || "border-border text-muted-foreground";
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
    
    const significantTrades = whaleTrades.filter(t => t.amount > minTradeSize * 2).slice(0, 5);
    significantTrades.forEach(trade => {
      items.push({
        id: `trade-${trade.id}`,
        type: 'whale-trade',
        title: `Major Whale Movement in ${trade.market}`,
        description: `Whale ${trade.wallet.slice(0, 6)}…${trade.wallet.slice(-4)} placed a $${trade.amount.toLocaleString()} ${trade.side} bet`,
        category: trade.category,
        timestamp: trade.timestamp,
        icon: TrendingUp,
      });
    });

    const hotMarkets = marketStats.slice(0, 3);
    hotMarkets.forEach((market, i) => {
      if (market.volume > 50000) {
        items.push({
          id: `market-${market.market}-${i}`,
          type: 'market-heat',
          title: `${market.market} Shows High Activity`,
          description: `Volume $${market.volume.toLocaleString()} with ${market.whaleCount} whales`,
          category: 'Market',
          timestamp: 'Just now',
          icon: AlertCircle,
        });
      }
    });

    return items.slice(0, 10);
  }, [whaleTrades, marketStats, minTradeSize]);

  return (
    <Card className="data-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-display font-semibold text-foreground">Market News</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`signal-dot ${isConnected ? 'bg-success' : 'bg-muted-foreground'}`} />
          <span className="text-[10px] text-muted-foreground font-mono">{isConnected ? 'LIVE' : 'CONNECTING'}</span>
        </div>
      </div>

      <ScrollArea className="h-[460px]">
        {newsItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-2 pr-3">
            {newsItems.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group animate-reveal-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="p-1.5 rounded-md bg-primary/10 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <ItemIcon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground font-body font-semibold mb-0.5 group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className={`text-[10px] font-body ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">{item.timestamp}</span>
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
