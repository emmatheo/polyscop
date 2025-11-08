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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="animate-fade-in">
        <StatsCard
          title="Total Trades"
          value={stats.totalTrades.toLocaleString()}
          change={isConnected ? "Live Data" : "Connecting..."}
          changeType="positive"
          icon={Activity}
          iconColor="text-primary"
        />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <StatsCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          change="YES position bias"
          changeType="positive"
          icon={Award}
          iconColor="text-success"
        />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <StatsCard
          title="Total Volume"
          value={`$${(stats.totalVolume / 1000000).toFixed(2)}M`}
          change="Whale trades tracked"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-warning"
        />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <StatsCard
          title="Active Markets"
          value={stats.activeMarkets.toLocaleString()}
          change="Real-time monitoring"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <StatsCard
          title="Avg Trade Size"
          value={`$${(stats.avgVolume / 1000).toFixed(1)}K`}
          change="Per whale trade"
          changeType="positive"
          icon={Target}
          iconColor="text-primary"
        />
      </div>
    </div>
  );
};
