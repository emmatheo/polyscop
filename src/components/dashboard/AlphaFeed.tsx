import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Politics: "border-chart-4/30 text-chart-4",
    Crypto: "border-warning/30 text-warning",
    Sports: "border-success/30 text-success",
    Economy: "border-chart-1/30 text-chart-1",
    Technology: "border-chart-5/30 text-chart-5",
  };
  return colors[category] || "border-border text-muted-foreground";
};

interface AlphaFeedProps {
  selectedCategories?: string[];
  minTradeSize?: number;
  searchQuery?: string;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

export const AlphaFeed = ({ 
  selectedCategories = [], 
  minTradeSize = 5000,
  searchQuery = "",
  dateRange,
}: AlphaFeedProps) => {
  const { whaleTrades, isConnected } = useRealtimePolymarket({
    categories: selectedCategories,
    minTradeSize,
    searchQuery,
    dateRange,
  });

  return (
    <Card className="data-card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground">Alpha Feed</h3>
        <div className="flex items-center gap-2">
          <span className={`signal-dot ${isConnected ? 'bg-success' : 'bg-muted-foreground'}`} />
          <span className="text-[10px] text-muted-foreground font-mono">{isConnected ? 'LIVE' : 'CONNECTING'}</span>
        </div>
      </div>
      <ScrollArea className="h-[460px]">
        {whaleTrades.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-2 pr-3">
            {whaleTrades.map((trade, i) => (
              <div
                key={trade.id}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors animate-reveal-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground font-body font-medium leading-relaxed">
                    <span className="font-mono text-muted-foreground">{trade.wallet.slice(0, 6)}…{trade.wallet.slice(-4)}</span>
                    {' '}bought <span className="text-primary font-mono">${trade.amount.toLocaleString()}</span> {trade.side} on {trade.market}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className={`text-[10px] font-body ${getCategoryColor(trade.category)}`}>
                      {trade.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                      {new Date(trade.timestamp).toLocaleDateString()} {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
