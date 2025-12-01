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
    <Card className="p-6 card-cyber hover-glow border-animated">
      <h3 className="text-xl font-display font-bold mb-6 text-gradient flex items-center gap-3">
        <div className="h-1 w-12 bg-gradient-to-r from-accent to-warning" />
        MOMENTUM HEATMAP
        <div className="h-1 flex-1 bg-gradient-to-r from-warning/50 to-transparent" />
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, idx) => (
          <div
            key={category.name}
            className="group relative p-4 rounded-xl glass border border-border/30 hover:border-primary/50 transition-all hover:scale-105 cursor-pointer overflow-hidden"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative text-center space-y-3">
              <p className="text-xs sm:text-sm font-heading font-bold text-foreground uppercase tracking-wide">
                {category.name}
              </p>
              <div className="relative w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full ${category.color} transition-all duration-700 group-hover:brightness-125`}
                  style={{ width: `${category.momentum}%` }}
                />
              </div>
              <Badge variant="outline" className="bg-primary/10 border-primary/30 font-display font-bold text-primary">
                {category.momentum}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
