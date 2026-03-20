import { StatsCard } from "@/components/StatsCard";
import { TrendingUp, Activity, DollarSign, Award, Target } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";
import { useMemo } from "react";

export const OverviewCards = () => {
  const { whaleTrades, marketStats, isConnected } = useRealtimePolymarket();

  const stats = useMemo(() => {
    const totalTrades = whaleTrades.length;
    const totalVolume = whaleTrades.reduce((sum, trade) => sum + trade.amount, 0);
    const yesCount = whaleTrades.filter(t => t.side === 'YES').length;
    const winRate = totalTrades > 0 ? (yesCount / totalTrades) * 100 : 0;
    const activeMarkets = marketStats.length;
    const avgVolume = totalVolume > 0 ? totalVolume / totalTrades : 0;
    
    return { totalTrades, totalVolume, winRate, activeMarkets, avgVolume };
  }, [whaleTrades, marketStats]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div className="animate-reveal-up stagger-1">
        <StatsCard
          title="Total Trades"
          value={stats.totalTrades.toLocaleString()}
          change={isConnected ? "Live" : "Connecting..."}
          changeType="positive"
          icon={Activity}
          iconColor="text-primary"
        />
      </div>
      <div className="animate-reveal-up stagger-2">
        <StatsCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          change="YES bias"
          changeType="positive"
          icon={Award}
          iconColor="text-success"
        />
      </div>
      <div className="animate-reveal-up stagger-3">
        <StatsCard
          title="Volume"
          value={`$${(stats.totalVolume / 1000000).toFixed(2)}M`}
          change="Tracked"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-warning"
        />
      </div>
      <div className="animate-reveal-up stagger-4">
        <StatsCard
          title="Markets"
          value={stats.activeMarkets.toLocaleString()}
          change="Monitored"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>
      <div className="animate-reveal-up stagger-5 col-span-2 sm:col-span-1">
        <StatsCard
          title="Avg Size"
          value={`$${(stats.avgVolume / 1000).toFixed(1)}K`}
          change="Per trade"
          changeType="positive"
          icon={Target}
          iconColor="text-primary"
        />
      </div>
    </div>
  );
};
