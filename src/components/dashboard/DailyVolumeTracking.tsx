import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Activity } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";
import { useMemo } from "react";

interface DailyVolumeTrackingProps {
  selectedCategories?: string[];
  minTradeSize?: number;
  searchQuery?: string;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

export const DailyVolumeTracking = ({ 
  selectedCategories = [], 
  minTradeSize = 5000,
  searchQuery = "",
  dateRange,
}: DailyVolumeTrackingProps) => {
  const { whaleTrades, marketStats, isConnected } = useRealtimePolymarket({
    categories: selectedCategories,
    minTradeSize,
    searchQuery,
    dateRange,
  });

  const dailyData = useMemo(() => {
    const now = new Date();
    const hours = [];
    
    // Generate last 24 hours data
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      hours.push({
        time: hour.getHours() + ':00',
        volume: 0,
        trades: 0,
      });
    }

    // Aggregate trades by hour (mock distribution for now)
    whaleTrades.forEach(trade => {
      const randomHour = Math.floor(Math.random() * 24);
      hours[randomHour].volume += trade.amount;
      hours[randomHour].trades += 1;
    });

    return hours.slice(-12); // Show last 12 hours
  }, [whaleTrades]);

  const stats = useMemo(() => {
    const totalVolume = whaleTrades.reduce((sum, t) => sum + t.amount, 0);
    const totalTrades = whaleTrades.length;
    const avgTradeSize = totalTrades > 0 ? totalVolume / totalTrades : 0;
    
    return { totalVolume, totalTrades, avgTradeSize };
  }, [whaleTrades]);

  return (
    <Card className="p-6 card-elevated border-primary/20 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">24H Volume Tracking</h3>
        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-muted/30 rounded-lg border border-border animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-warning" />
            <p className="text-xs text-muted-foreground">Total Volume</p>
          </div>
          <p className="text-2xl font-bold text-foreground">${stats.totalVolume.toLocaleString()}</p>
        </div>
        
        <div className="p-4 bg-muted/30 rounded-lg border border-border animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Total Trades</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalTrades}</p>
        </div>
        
        <div className="p-4 bg-muted/30 rounded-lg border border-border animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <p className="text-xs text-muted-foreground">Avg Trade Size</p>
          </div>
          <p className="text-2xl font-bold text-foreground">${stats.avgTradeSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="h-[300px] animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
            />
            <Bar 
              dataKey="volume" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
