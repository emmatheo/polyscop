import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhaleActivity {
  id: string;
  wallet: string;
  market: string;
  side: "YES" | "NO";
  amount: number;
  price: number;
  timestamp: string;
  profitability: number; // trader's win rate
}

interface WhaleActivityCardProps {
  activity: WhaleActivity;
}

export const WhaleActivityCard = ({ activity }: WhaleActivityCardProps) => {
  const isBuy = activity.side === "YES";
  
  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Wallet Info */}
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-warning" />
            <span className="font-mono text-sm font-medium">
              {activity.wallet.slice(0, 6)}...{activity.wallet.slice(-4)}
            </span>
            <Badge variant="outline" className="text-xs bg-warning/10 border-warning/30 text-warning">
              {activity.profitability}% Win Rate
            </Badge>
          </div>

          {/* Market */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {activity.market}
          </p>

          {/* Trade Details */}
          <div className="flex items-center gap-3 text-sm">
            <div className={cn(
              "flex items-center gap-1 font-medium",
              isBuy ? "text-success" : "text-destructive"
            )}>
              {isBuy ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {activity.side}
            </div>
            <span className="text-muted-foreground">
              ${activity.amount.toLocaleString()} @ {(activity.price * 100).toFixed(1)}¢
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {activity.timestamp}
        </div>
      </div>
    </Card>
  );
};
