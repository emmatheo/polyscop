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
    const strength = Math.abs(yesBias - 50) * 2;
    
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
    <Card className="data-card p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-display font-semibold text-foreground">Whale Momentum</h3>
        <span className={`signal-dot ${isConnected ? 'bg-success' : 'bg-muted-foreground'}`} />
      </div>

      <div className="space-y-5">
        {/* Direction */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg bg-muted/50 ${getMomentumColor()}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-display font-bold text-foreground capitalize">{momentum.direction}</p>
            <p className="text-xs text-muted-foreground font-body">Market Sentiment</p>
          </div>
          <Badge variant="outline" className="text-sm font-mono px-3 py-1 tabular-nums">
            {momentum.strength.toFixed(0)}%
          </Badge>
        </div>

        {/* Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-body mb-1.5">
              <span className="text-success font-medium">YES Bias</span>
              <span className="text-success font-mono tabular-nums">{momentum.yesBias.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all duration-700"
                style={{ width: `${momentum.yesBias}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs font-body mb-1.5">
              <span className="text-destructive font-medium">NO Bias</span>
              <span className="text-destructive font-mono tabular-nums">{momentum.noBias.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-destructive rounded-full transition-all duration-700"
                style={{ width: `${momentum.noBias}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div>
            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Trades</p>
            <p className="text-lg font-display font-bold text-foreground tabular-nums">{momentum.tradeCount}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Volume</p>
            <p className="text-lg font-display font-bold text-warning tabular-nums">${(momentum.totalAmount || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
