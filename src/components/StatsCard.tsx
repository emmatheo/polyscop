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
    <Card className="data-card press-scale">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[11px] font-body font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={`p-1.5 rounded-md ${
          iconColor === 'text-primary' ? 'bg-primary/10' :
          iconColor === 'text-success' ? 'bg-success/10' :
          iconColor === 'text-warning' ? 'bg-warning/10' :
          'bg-muted'
        }`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-display font-bold text-foreground tabular-nums tracking-tight">
          {value}
        </div>
        {change && (
          <p className={`text-[11px] font-body font-medium flex items-center gap-1 mt-1 ${
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
