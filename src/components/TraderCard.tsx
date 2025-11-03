import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Target, Copy } from "lucide-react";
import { useState } from "react";
import { WalletTradeHistory } from "./WalletTradeHistory";
import { toast } from "sonner";

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
  const [showHistory, setShowHistory] = useState(false);
  
  const copyWallet = () => {
    navigator.clipboard.writeText(trader.wallet);
    toast.success("Wallet address copied!");
  };

  return (
    <>
      <Card className="p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-success/5 hover:scale-[1.02] transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 group relative overflow-hidden" onClick={() => setShowHistory(true)}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          {/* Rank */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary-glow to-primary flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-primary/50 animate-pulse">
            <span className="text-sm font-bold text-white group-hover:scale-110 transition-transform duration-300">#{rank}</span>
          </div>

          {/* Trader Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">
                  {trader.wallet.slice(0, 8)}...{trader.wallet.slice(-6)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyWallet();
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <Badge variant="outline" className="text-xs font-bold group-hover:scale-110 transition-all duration-300 bg-primary/10 border-primary/30 text-primary group-hover:bg-primary/20 group-hover:shadow-primary/50 group-hover:shadow-md">
                ${trader.totalProfit.toLocaleString()}
              </Badge>
            </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 group/stat hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3 group-hover:scale-125 group-hover:text-primary transition-all duration-300 group-hover/stat:animate-pulse" />
                Whale %
              </div>
              <div className="text-sm font-semibold group-hover:text-primary transition-colors duration-300">{trader.winRate}%</div>
            </div>
            <div className="space-y-1 group/stat hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 group-hover:scale-125 group-hover:text-success transition-all duration-300 group-hover/stat:animate-pulse" />
                Trades
              </div>
              <div className="text-sm font-semibold group-hover:text-success transition-colors duration-300">{trader.totalTrades}</div>
            </div>
            <div className="space-y-1 group/stat hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3 group-hover:scale-125 transition-all duration-300 group-hover/stat:animate-pulse" />
                Avg Trade
              </div>
              <div className="text-sm font-semibold transition-colors duration-300 text-primary group-hover:text-primary/80">
                ${trader.profitChange24h.toLocaleString()}
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

    <WalletTradeHistory 
      wallet={trader.wallet}
      open={showHistory}
      onOpenChange={setShowHistory}
    />
    </>
  );
};
