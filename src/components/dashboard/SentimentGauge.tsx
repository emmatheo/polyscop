import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Politics", yesBias: 68, noBias: 32 },
  { name: "Sports", yesBias: 54, noBias: 46 },
  { name: "Crypto", yesBias: 72, noBias: 28 },
  { name: "Economy", yesBias: 45, noBias: 55 },
  { name: "Technology", yesBias: 61, noBias: 39 },
];

export const SentimentGauge = () => {
  return (
    <Card className="p-4 sm:p-6 card-elevated border-primary/20 hover-lift">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-foreground">Market Sentiment by Category</h3>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-semibold text-foreground text-sm sm:text-base">{cat.name}</span>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default" className="bg-success text-xs sm:text-sm">YES {cat.yesBias}%</Badge>
                <Badge variant="secondary" className="text-xs sm:text-sm">NO {cat.noBias}%</Badge>
              </div>
            </div>
            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden shadow-sm">
              <div
                className="absolute left-0 top-0 h-full bg-success transition-all duration-500 hover:brightness-110"
                style={{ width: `${cat.yesBias}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-destructive transition-all duration-500 hover:brightness-110"
                style={{ width: `${cat.noBias}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
