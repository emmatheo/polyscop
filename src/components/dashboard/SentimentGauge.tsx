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
    <Card className="p-4 sm:p-6 card-cyber hover-lift hover-glow border-animated">
      <h3 className="text-lg sm:text-xl font-display font-bold mb-4 sm:mb-6 text-gradient flex items-center gap-2">
        <div className="h-1 w-8 bg-gradient-to-r from-secondary to-accent" />
        MARKET SENTIMENT
      </h3>
      <div className="space-y-5">
        {categories.map((cat, idx) => (
          <div key={cat.name} className="space-y-2 group">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-heading font-semibold text-foreground text-sm sm:text-base group-hover:text-gradient transition-all">
                {cat.name}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default" className="bg-success/20 text-success border-success/30 text-xs sm:text-sm font-body font-semibold">
                  YES {cat.yesBias}%
                </Badge>
                <Badge variant="secondary" className="bg-destructive/20 text-destructive border-destructive/30 text-xs sm:text-sm font-body font-semibold">
                  NO {cat.noBias}%
                </Badge>
              </div>
            </div>
            <div className="relative w-full h-3 rounded-full overflow-hidden glass group-hover:scale-[1.02] transition-transform">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-success-glow transition-all duration-500 hover:brightness-110"
                style={{ width: `${cat.yesBias}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-r from-destructive-glow to-destructive transition-all duration-500 hover:brightness-110"
                style={{ width: `${cat.noBias}%` }}
              />
              {/* Center divider */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-background/50 -translate-x-1/2" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
