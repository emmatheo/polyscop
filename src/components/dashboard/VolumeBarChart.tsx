import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { market: "Politics", volume: 850000 },
  { market: "Sports", volume: 620000 },
  { market: "Crypto", volume: 540000 },
  { market: "Economy", volume: 380000 },
  { market: "Tech", volume: 290000 },
];

export const VolumeBarChart = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Volume by Market Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="market" 
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Volume ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
          <Bar 
            dataKey="volume" 
            fill="hsl(var(--primary))" 
            name="Trading Volume"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
