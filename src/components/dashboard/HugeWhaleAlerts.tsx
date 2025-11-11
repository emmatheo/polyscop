import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";

interface HugeWhaleAlertsProps {
  minTradeSize?: number;
}

export const HugeWhaleAlerts = ({ minTradeSize = 100000 }: HugeWhaleAlertsProps) => {
  const { whaleTrades } = useRealtimePolymarket({ minTradeSize });
  
  // Filter for huge trades (>= minTradeSize)
  const hugeTrades = whaleTrades.filter(trade => trade.amount >= minTradeSize).slice(0, 5);

  return (
    <Card className="p-6 card-elevated border-warning/30 bg-gradient-to-br from-card to-warning/5 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-warning/20 animate-pulse">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Huge Whale Alerts</h3>
            <p className="text-sm text-muted-foreground">Trades over ${(minTradeSize / 1000).toFixed(0)}K</p>
          </div>
        </div>
        <Badge variant="default" className="bg-warning animate-pulse">
          Live
        </Badge>
      </div>
      
      {hugeTrades.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No huge whale trades detected yet</p>
          <p className="text-xs mt-2">Monitoring for trades over ${(minTradeSize / 1000).toFixed(0)}K</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hugeTrades.map((trade, index) => (
            <div 
              key={trade.id} 
              className="p-4 bg-card rounded-lg border border-border hover:border-warning/50 transition-all duration-300 animate-fade-in hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm mb-1">{trade.market}</p>
                  <p className="text-xs text-muted-foreground">
                    Wallet: {trade.wallet.slice(0, 6)}...{trade.wallet.slice(-4)}
                  </p>
                </div>
                <Badge 
                  variant={trade.side === "YES" ? "default" : "secondary"}
                  className={trade.side === "YES" ? "bg-success" : "bg-destructive"}
                >
                  {trade.side}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-foreground">
                      ${(trade.amount / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-sm font-semibold text-foreground">
                      {(trade.price * 100).toFixed(1)}¢
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {trade.side === "YES" ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <Badge variant="outline" className="text-xs">
                  {trade.category}
                </Badge>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-mono">
                    {new Date(trade.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
