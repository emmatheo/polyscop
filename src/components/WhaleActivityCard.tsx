import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, TrendingDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { WalletTradeHistory } from "./WalletTradeHistory";
import { toast } from "sonner";

interface WhaleActivity {
  id: string;
  wallet: string;
  market: string;
  side: "YES" | "NO";
  amount: number;
  price: number;
  timestamp: string;
  profitability: number; // trader's win rate
  category: string;
}

interface WhaleActivityCardProps {
  activity: WhaleActivity;
}

export const WhaleActivityCard = ({ activity }: WhaleActivityCardProps) => {
  const isBuy = activity.side === "YES";
  const [showHistory, setShowHistory] = useState(false);
  
  const copyWallet = () => {
    navigator.clipboard.writeText(activity.wallet);
    toast.success("Wallet address copied!");
  };

  return (
    <>
      <Card className="p-4 hover:bg-muted/50 hover:scale-[1.01] transition-all duration-300 cursor-pointer hover:shadow-lg" onClick={() => setShowHistory(true)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Wallet Info */}
            <div className="flex items-center gap-2 flex-wrap">
              <Wallet className="h-4 w-4 text-warning" />
              <span className="font-mono text-sm font-medium">
                {activity.wallet.slice(0, 6)}...{activity.wallet.slice(-4)}
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
              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                {activity.category}
              </Badge>
              <Badge variant="outline" className="text-xs bg-warning/10 border-warning/30 text-warning">
                {activity.profitability.toFixed(0)}% Win Rate
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
    
    <WalletTradeHistory 
      wallet={activity.wallet}
      open={showHistory}
      onOpenChange={setShowHistory}
    />
    </>
  );
};
