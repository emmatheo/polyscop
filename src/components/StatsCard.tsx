import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export const StatsCard = ({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "text-primary" }: StatsCardProps) => {
  return (
    <Card className="card-cyber hover-lift hover-glow border-animated group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${
          iconColor === 'text-primary' ? 'from-primary/20 to-primary/10' :
          iconColor === 'text-success' ? 'from-success/20 to-success/10' :
          iconColor === 'text-warning' ? 'from-warning/20 to-warning/10' :
          'from-muted to-muted/50'
        } group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-display font-black text-foreground mb-1 group-hover:text-gradient transition-all">
          {value}
        </div>
        {change && (
          <p className={`text-xs font-body font-medium flex items-center gap-1 ${
            changeType === "positive" ? "text-success" : 
            changeType === "negative" ? "text-destructive" : 
            "text-muted-foreground"
          }`}>
            {changeType === "positive" && <TrendingUp className="h-3 w-3" />}
            {changeType === "negative" && <TrendingDown className="h-3 w-3" />}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
