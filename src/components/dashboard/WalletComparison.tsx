import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { metric: "Win Rate", wallet1: 72, wallet2: 65, wallet3: 68 },
  { metric: "Volume", wallet1: 85, wallet2: 90, wallet3: 78 },
  { metric: "Profit", wallet1: 68, wallet2: 75, wallet3: 82 },
  { metric: "Accuracy", wallet1: 78, wallet2: 72, wallet3: 80 },
];

export const WalletComparison = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Top 3 Whale Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="metric" 
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
          <Bar dataKey="wallet1" fill="hsl(var(--primary))" name="Whale #1" radius={[8, 8, 0, 0]} />
          <Bar dataKey="wallet2" fill="hsl(var(--success))" name="Whale #2" radius={[8, 8, 0, 0]} />
          <Bar dataKey="wallet3" fill="hsl(var(--warning))" name="Whale #3" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
