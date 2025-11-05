import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle } from "lucide-react";

export const WhaleFlipDetector = () => {
  return (
    <Card className="p-6 card-elevated border-destructive/30 bg-gradient-to-br from-card to-destructive/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Whale Flip Alert</h3>
            <p className="text-sm text-muted-foreground">Major position reversal detected</p>
          </div>
        </div>
        <Badge variant="destructive" className="animate-pulse">
          Live
        </Badge>
      </div>
      
      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
          <div>
            <p className="font-semibold text-foreground">Trump 2024 Election</p>
            <p className="text-sm text-muted-foreground">3 whales flipped to NO</p>
          </div>
          <div className="flex items-center gap-2 text-destructive">
            <TrendingUp className="h-4 w-4" />
            <span className="font-bold">-$240K</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
          <div>
            <p className="font-semibold text-foreground">Bitcoin $100K+ 2025</p>
            <p className="text-sm text-muted-foreground">2 whales flipped to YES</p>
          </div>
          <div className="flex items-center gap-2 text-success">
            <TrendingUp className="h-4 w-4" />
            <span className="font-bold">+$180K</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
