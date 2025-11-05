import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "Day 1", winRate: 45 },
  { date: "Day 5", winRate: 52 },
  { date: "Day 10", winRate: 58 },
  { date: "Day 15", winRate: 61 },
  { date: "Day 20", winRate: 55 },
  { date: "Day 25", winRate: 63 },
  { date: "Day 30", winRate: 67 },
];

export const WinRateLineChart = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Win Rate Over Time (30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="winRate" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 5 }}
            activeDot={{ r: 8 }}
            name="Win Rate %"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
