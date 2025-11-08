import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";
import { useMemo } from "react";

interface WhaleMomentumProps {
  selectedCategories?: string[];
  minTradeSize?: number;
  searchQuery?: string;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

export const WhaleMomentum = ({ 
  selectedCategories = [], 
  minTradeSize = 5000,
  searchQuery = "",
  dateRange,
}: WhaleMomentumProps) => {
  const { whaleTrades, isConnected } = useRealtimePolymarket({
    categories: selectedCategories,
    minTradeSize,
    searchQuery,
    dateRange,
  });

  const momentum = useMemo(() => {
    if (whaleTrades.length === 0) return { direction: 'neutral', strength: 0, yesBias: 50, noBias: 50 };
    
    const recentTrades = whaleTrades.slice(0, 20);
    const yesCount = recentTrades.filter(t => t.side === 'YES').length;
    const noCount = recentTrades.filter(t => t.side === 'NO').length;
    const totalAmount = recentTrades.reduce((sum, t) => sum + t.amount, 0);
    
    const yesBias = (yesCount / recentTrades.length) * 100;
    const noBias = (noCount / recentTrades.length) * 100;
    
    const direction = yesBias > 60 ? 'bullish' : yesBias < 40 ? 'bearish' : 'neutral';
    const strength = Math.abs(yesBias - 50) * 2; // 0-100 scale
    
    return { direction, strength, yesBias, noBias, totalAmount, tradeCount: recentTrades.length };
  }, [whaleTrades]);

  const getMomentumColor = () => {
    if (momentum.direction === 'bullish') return 'text-success';
    if (momentum.direction === 'bearish') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getMomentumIcon = () => {
    if (momentum.direction === 'bullish') return TrendingUp;
    if (momentum.direction === 'bearish') return TrendingDown;
    return Activity;
  };

  const Icon = getMomentumIcon();

  return (
    <Card className="p-6 card-elevated border-primary/20 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Whale Momentum</h3>
        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
      </div>

      <div className="space-y-6">
        {/* Momentum Direction */}
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl bg-muted/30 ${getMomentumColor()}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold text-foreground capitalize">{momentum.direction}</p>
            <p className="text-sm text-muted-foreground">Market Sentiment</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {momentum.strength.toFixed(0)}%
          </Badge>
        </div>

        {/* YES/NO Distribution */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-success font-medium">YES Bias</span>
            <span className="text-success font-bold">{momentum.yesBias.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-success to-success-glow transition-all duration-1000 animate-fade-in"
              style={{ width: `${momentum.yesBias}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-destructive font-medium">NO Bias</span>
            <span className="text-destructive font-bold">{momentum.noBias.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-destructive to-destructive-glow transition-all duration-1000 animate-fade-in"
              style={{ width: `${momentum.noBias}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Recent Trades</p>
            <p className="text-2xl font-bold text-foreground">{momentum.tradeCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="text-2xl font-bold text-warning">${(momentum.totalAmount || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
