import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketCardProps {
  id: string;
  title: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume24h: number;
  priceChange24h: number;
  liquidity: number;
  onClick?: () => void;
}

export const MarketCard = ({
  title,
  category,
  yesPrice,
  noPrice,
  volume24h,
  priceChange24h,
  liquidity,
  onClick,
}: MarketCardProps) => {
  const isPositive = priceChange24h >= 0;
  const yesPercentage = Math.round(yesPrice * 100);
  const noPercentage = Math.round(noPrice * 100);

  return (
    <Card
      className="p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group card-elevated hover:glow-primary"
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <div className={cn("flex items-center gap-1 text-sm font-medium", isPositive ? "text-success" : "text-destructive")}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isPositive ? "+" : ""}
            {priceChange24h.toFixed(1)}%
          </div>
        </div>

        {/* Price Display */}
        <div className="flex gap-3">
          <div className="flex-1 p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="text-xs text-muted-foreground mb-1">YES</div>
            <div className="text-2xl font-bold text-success">{yesPercentage}¢</div>
          </div>
          <div className="flex-1 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="text-xs text-muted-foreground mb-1">NO</div>
            <div className="text-2xl font-bold text-destructive">{noPercentage}¢</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Vol: ${(volume24h / 1000).toFixed(1)}K</span>
          </div>
          <div className="text-muted-foreground">
            Liq: ${(liquidity / 1000).toFixed(1)}K
          </div>
        </div>
      </div>
    </Card>
  );
};
