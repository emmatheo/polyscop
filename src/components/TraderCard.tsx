import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Trader {
  wallet: string;
  totalProfit: number;
  winRate: number;
  totalTrades: number;
  recentActivity: string;
  profitChange24h: number;
}

interface TraderCardProps {
  trader: Trader;
  rank: number;
}

export const TraderCard = ({ trader, rank }: TraderCardProps) => {
  const isProfitable = trader.totalProfit > 0;
  
  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
          <span className="text-sm font-bold text-white">#{rank}</span>
        </div>

        {/* Trader Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-medium">
              {trader.wallet.slice(0, 8)}...{trader.wallet.slice(-6)}
            </span>
            <Badge variant="outline" className={cn(
              "text-xs",
              isProfitable 
                ? "bg-success/10 border-success/30 text-success" 
                : "bg-destructive/10 border-destructive/30 text-destructive"
            )}>
              {isProfitable ? "+" : ""}{trader.totalProfit.toLocaleString()} USDC
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                Win Rate
              </div>
              <div className="text-sm font-semibold">{trader.winRate}%</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Trades
              </div>
              <div className="text-sm font-semibold">{trader.totalTrades}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                24h
              </div>
              <div className={cn(
                "text-sm font-semibold",
                trader.profitChange24h > 0 ? "text-success" : "text-destructive"
              )}>
                {trader.profitChange24h > 0 ? "+" : ""}{trader.profitChange24h.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <p className="text-xs text-muted-foreground">
            Last active: {trader.recentActivity}
          </p>
        </div>
      </div>
    </Card>
  );
};
