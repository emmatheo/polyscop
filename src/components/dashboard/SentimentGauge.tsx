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
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Market Sentiment by Category</h3>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{cat.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-success">YES {cat.yesBias}%</Badge>
                <Badge variant="secondary">NO {cat.noBias}%</Badge>
              </div>
            </div>
            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-success transition-all duration-500"
                style={{ width: `${cat.yesBias}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-destructive transition-all duration-500"
                style={{ width: `${cat.noBias}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
