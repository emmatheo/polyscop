import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Activity, DollarSign } from "lucide-react";

const activities = [
  { 
    type: "whale", 
    message: "Whale 0x7f3a...b821 bought $125K YES on Trump 2024", 
    category: "Politics", 
    time: "2m ago",
    icon: DollarSign
  },
  { 
    type: "market", 
    message: "Bitcoin >$100K odds shifted +5.2% in 1 hour", 
    category: "Crypto", 
    time: "5m ago",
    icon: TrendingUp
  },
  { 
    type: "whale", 
    message: "Top trader flipped to NO on Lakers Finals", 
    category: "Sports", 
    time: "8m ago",
    icon: Activity
  },
  { 
    type: "market", 
    message: "New market created: Fed Rate Decision April", 
    category: "Economy", 
    time: "12m ago",
    icon: Activity
  },
  { 
    type: "whale", 
    message: "Whale cluster accumulated $200K on ETH >$5K", 
    category: "Crypto", 
    time: "15m ago",
    icon: DollarSign
  },
  { 
    type: "market", 
    message: "Trump 2024 volume spike: +142% in 24h", 
    category: "Politics", 
    time: "18m ago",
    icon: TrendingUp
  },
  { 
    type: "whale", 
    message: "Whale 0x9a1b...c3f2 exited $76K position", 
    category: "Sports", 
    time: "22m ago",
    icon: DollarSign
  },
  { 
    type: "market", 
    message: "AI predictions show 78% confidence on Tech IPO", 
    category: "Technology", 
    time: "25m ago",
    icon: Activity
  },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Politics: "bg-chart-4",
    Crypto: "bg-warning",
    Sports: "bg-success",
    Economy: "bg-chart-1",
    Technology: "bg-chart-5",
  };
  return colors[category] || "bg-muted";
};

export const AlphaFeed = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Alpha Feed - Live Activity</h3>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="p-2 rounded-lg bg-primary/20">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getCategoryColor(activity.category)}>
                      {activity.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};
