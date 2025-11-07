import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";

interface LivePriceChartsProps {
  selectedCategories?: string[];
  minTradeSize?: number;
}

export const LivePriceCharts = ({ selectedCategories = [], minTradeSize = 5000 }: LivePriceChartsProps) => {
  const { priceMovements, isConnected } = useRealtimePolymarket({
    categories: selectedCategories,
    minTradeSize,
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (priceMovements.length === 0) {
    return (
      <Card className="p-6 card-elevated border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Live Market Odds</h3>
            <p className="text-sm text-muted-foreground mt-1">Real-time price movements for trending markets</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-xs text-muted-foreground">{isConnected ? 'Live' : 'Connecting...'}</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          <Activity className="h-12 w-12 animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {priceMovements.map((marketData, idx) => {
        const chartData = marketData.history.map(point => ({
          time: formatTime(point.timestamp),
          price: point.price,
          timestamp: point.timestamp,
        }));

        const latestPrice = marketData.history[marketData.history.length - 1]?.price || 0;
        const oldestPrice = marketData.history[0]?.price || 0;
        const priceChange = latestPrice - oldestPrice;
        const priceChangePercent = oldestPrice > 0 ? ((priceChange / oldestPrice) * 100).toFixed(2) : '0.00';
        const isPositive = priceChange >= 0;

        return (
          <Card key={idx} className="p-6 card-elevated border-primary/20">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">{marketData.market}</h3>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    Current: {latestPrice.toFixed(1)}%
                  </Badge>
                  <Badge 
                    variant={isPositive ? "default" : "secondary"}
                    className={isPositive ? "bg-success/20 text-success border-success/30" : "bg-destructive/20 text-destructive border-destructive/30"}
                  >
                    <TrendingUp className={`h-3 w-3 mr-1 ${isPositive ? '' : 'rotate-180'}`} />
                    {isPositive ? '+' : ''}{priceChangePercent}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  formatter={(value: any) => [`${value.toFixed(2)}%`, 'Odds']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  name="Market Odds"
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        );
      })}
    </div>
  );
};
