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
  const hugeTrades = whaleTrades.filter(trade => trade.amount >= minTradeSize).slice(0, 5);

  return (
    <Card className="data-card p-5 terminal-accent h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-warning/10">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground">Whale Alerts</h3>
            <p className="text-xs text-muted-foreground font-body">Trades over ${(minTradeSize / 1000).toFixed(0)}K</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-warning/30 text-warning">
          <span className="signal-dot bg-warning mr-1.5" />
          LIVE
        </Badge>
      </div>
      
      {hugeTrades.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground font-body text-sm">
          <p>No whale trades detected yet</p>
          <p className="text-xs mt-1">Monitoring for trades over ${(minTradeSize / 1000).toFixed(0)}K</p>
        </div>
      ) : (
        <div className="space-y-2">
          {hugeTrades.map((trade, index) => (
            <div 
              key={trade.id} 
              className="p-3 bg-muted/50 rounded-md animate-reveal-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-foreground truncate">{trade.market}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {trade.wallet.slice(0, 6)}…{trade.wallet.slice(-4)}
                  </p>
                </div>
                <Badge 
                  variant="outline"
                  className={`text-[10px] font-mono ml-2 ${
                    trade.side === "YES" ? "text-success border-success/30" : "text-destructive border-destructive/30"
                  }`}
                >
                  {trade.side}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-body">Amount</p>
                    <p className="text-sm font-mono font-medium text-foreground tabular-nums">
                      ${(trade.amount / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-body">Price</p>
                    <p className="text-sm font-mono font-medium text-foreground tabular-nums">
                      {(trade.price * 100).toFixed(1)}¢
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {trade.side === "YES" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                <Badge variant="outline" className="text-[10px] font-body">
                  {trade.category}
                </Badge>
                <p className="text-[10px] text-muted-foreground font-mono tabular-nums">
                  {new Date(trade.timestamp).toLocaleDateString()} {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
