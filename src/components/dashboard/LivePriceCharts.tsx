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
      <Card className="p-4 sm:p-6 card-elevated border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Live Market Odds</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Real-time price movements for trending markets</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-xs text-muted-foreground">{isConnected ? 'Live' : 'Connecting...'}</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground">
          <Activity className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse" />
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
          <Card key={idx} className="p-4 sm:p-6 card-elevated border-primary/20 hover-lift">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 pr-2">{marketData.market}</h3>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

            <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="min-w-[400px]">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      width={35}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      formatter={(value: any) => [`${value.toFixed(2)}%`, 'Odds']}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
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
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
