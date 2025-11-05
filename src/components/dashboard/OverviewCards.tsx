import { StatsCard } from "@/components/StatsCard";
import { TrendingUp, Activity, DollarSign, Award, Target } from "lucide-react";

export const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="Total Trades"
        value="12,458"
        change="+12% from last week"
        changeType="positive"
        icon={Activity}
        iconColor="text-primary"
      />
      <StatsCard
        title="Win Rate"
        value="67.3%"
        change="+2.1% improvement"
        changeType="positive"
        icon={Award}
        iconColor="text-success"
      />
      <StatsCard
        title="Total Volume"
        value="$2.4M"
        change="+18% this month"
        changeType="positive"
        icon={DollarSign}
        iconColor="text-warning"
      />
      <StatsCard
        title="Profit/Loss"
        value="+$142K"
        change="Last 30 days"
        changeType="positive"
        icon={TrendingUp}
        iconColor="text-success"
      />
      <StatsCard
        title="PolyScore"
        value="8.7/10"
        change="Elite Tier"
        changeType="positive"
        icon={Target}
        iconColor="text-primary"
      />
    </div>
  );
};
