import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";

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

interface AlphaFeedProps {
  selectedCategories?: string[];
  minTradeSize?: number;
}

export const AlphaFeed = ({ selectedCategories = [], minTradeSize = 5000 }: AlphaFeedProps) => {
  const { whaleTrades, isConnected } = useRealtimePolymarket({
    categories: selectedCategories,
    minTradeSize,
  });

  return (
    <Card className="p-6 card-elevated border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Alpha Feed - Live Activity</h3>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
          <span className="text-xs text-muted-foreground">{isConnected ? 'Live' : 'Connecting...'}</span>
        </div>
      </div>
      <ScrollArea className="h-[500px] pr-4">
        {whaleTrades.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {whaleTrades.map((trade, i) => (
              <div
                key={trade.id}
                className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="p-2 rounded-lg bg-primary/20">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">
                    Whale {trade.wallet.slice(0, 6)}...{trade.wallet.slice(-4)} bought ${trade.amount.toLocaleString()} {trade.side} on {trade.market}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getCategoryColor(trade.category)}>
                      {trade.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{trade.timestamp}</span>
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
