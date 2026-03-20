import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle } from "lucide-react";

export const WhaleFlipDetector = () => {
  return (
    <Card className="data-card p-5 terminal-accent">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground">Whale Flip Alert</h3>
            <p className="text-xs text-muted-foreground font-body">Position reversal detected</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-destructive/30 text-destructive">
          <span className="signal-dot bg-destructive mr-1.5" />
          LIVE
        </Badge>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div>
            <p className="text-sm font-body font-medium text-foreground">Trump 2024 Election</p>
            <p className="text-xs text-muted-foreground font-body">3 whales flipped to NO</p>
          </div>
          <div className="flex items-center gap-1.5 text-destructive font-mono text-sm font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            -$240K
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div>
            <p className="text-sm font-body font-medium text-foreground">Bitcoin $100K+ 2025</p>
            <p className="text-xs text-muted-foreground font-body">2 whales flipped to YES</p>
          </div>
          <div className="flex items-center gap-1.5 text-success font-mono text-sm font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            +$180K
          </div>
        </div>
      </div>
    </Card>
  );
};
