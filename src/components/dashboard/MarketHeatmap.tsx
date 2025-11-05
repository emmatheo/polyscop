import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Politics", momentum: 85, color: "bg-primary" },
  { name: "Sports", momentum: 72, color: "bg-success" },
  { name: "Crypto", momentum: 68, color: "bg-warning" },
  { name: "Economy", momentum: 55, color: "bg-chart-4" },
  { name: "Technology", momentum: 48, color: "bg-chart-5" },
  { name: "Entertainment", momentum: 42, color: "bg-primary/70" },
];

export const MarketHeatmap = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Market Momentum Heatmap</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:scale-105 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)))`,
            }}
          >
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">{category.name}</p>
              <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full ${category.color} transition-all duration-500`}
                  style={{ width: `${category.momentum}%` }}
                />
              </div>
              <Badge variant="outline" className="bg-primary/10 border-primary/30">
                {category.momentum}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
