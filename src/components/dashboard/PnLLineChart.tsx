import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "Week 1", pnl: 12000 },
  { date: "Week 2", pnl: 18000 },
  { date: "Week 3", pnl: 15000 },
  { date: "Week 4", pnl: 24000 },
  { date: "Week 5", pnl: 32000 },
  { date: "Week 6", pnl: 28000 },
  { date: "Week 7", pnl: 35000 },
  { date: "Week 8", pnl: 42000 },
];

export const PnLLineChart = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Profit & Loss Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'P&L ($)', angle: -90, position: 'insideLeft' }}
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
            dataKey="pnl" 
            stroke="hsl(var(--success))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--success))", r: 5 }}
            activeDot={{ r: 8 }}
            name="Profit & Loss"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
