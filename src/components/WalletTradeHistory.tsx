import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Loader2, Target, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Trade {
  id: string;
  market: string;
  side: string;
  amount: number;
  price: number;
  timestamp: string;
  profitLoss: number;
  isWin: boolean;
}

interface WalletStats {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalProfit: number;
  trades: Trade[];
}

interface WalletTradeHistoryProps {
  wallet: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalletTradeHistory = ({ wallet, open, onOpenChange }: WalletTradeHistoryProps) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["wallet-trades", wallet],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("polymarket-wallet-trades", {
        body: { wallet },
      });
      if (error) throw error;
      return data as WalletStats;
    },
    enabled: open && !!wallet,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono text-sm">
              {wallet.slice(0, 8)}...{wallet.slice(-6)}
            </span>
          </DialogTitle>
          <DialogDescription>
            Detailed trade history and performance metrics for this wallet
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Win Rate
                </div>
                <div className="text-2xl font-bold">{stats.winRate}%</div>
              </div>
              <div className="space-y-1 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-success" />
                  Wins
                </div>
                <div className="text-2xl font-bold text-success">{stats.wins}</div>
              </div>
              <div className="space-y-1 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  Losses
                </div>
                <div className="text-2xl font-bold text-destructive">{stats.losses}</div>
              </div>
              <div className="space-y-1 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Total P&L
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  stats.totalProfit > 0 ? "text-success" : "text-destructive"
                )}>
                  {stats.totalProfit > 0 ? "+" : ""}{stats.totalProfit.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Trade History */}
            <div className="space-y-3">
              <h3 className="font-semibold">Recent Trades</h3>
              {stats.trades.length > 0 ? (
                stats.trades.map((trade) => (
                  <div
                    key={trade.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium line-clamp-2">{trade.market}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant={trade.side === "YES" ? "default" : "secondary"}>
                            {trade.side}
                          </Badge>
                          <span className="text-muted-foreground">
                            ${trade.amount.toLocaleString()} @ {(trade.price * 100).toFixed(1)}¢
                          </span>
                          <span className="text-xs text-muted-foreground">{trade.timestamp}</span>
                        </div>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 font-semibold",
                        trade.isWin ? "text-success" : "text-destructive"
                      )}>
                        {trade.isWin ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {trade.profitLoss > 0 ? "+" : ""}{trade.profitLoss.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No trades found</p>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
