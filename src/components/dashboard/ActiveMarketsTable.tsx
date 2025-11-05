import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const markets = [
  { name: "Will Trump win 2024?", volume: "$2.5M", whales: 45, oddsChange: 12.5, isPositive: true },
  { name: "Bitcoin above $100K in 2025?", volume: "$1.8M", whales: 38, oddsChange: -5.2, isPositive: false },
  { name: "Lakers to win NBA Finals?", volume: "$1.2M", whales: 29, oddsChange: 8.3, isPositive: true },
  { name: "Fed rate cut in Q1?", volume: "$980K", whales: 25, oddsChange: 15.7, isPositive: true },
  { name: "AI reaches AGI by 2026?", volume: "$750K", whales: 22, oddsChange: -3.1, isPositive: false },
];

export const ActiveMarketsTable = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Most Active Markets</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Market Question</TableHead>
              <TableHead className="text-muted-foreground">Volume</TableHead>
              <TableHead className="text-muted-foreground">Whale Count</TableHead>
              <TableHead className="text-muted-foreground">Odds Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markets.map((market, idx) => (
              <TableRow key={idx} className="border-border hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium max-w-md">{market.name}</TableCell>
                <TableCell className="font-semibold text-primary">{market.volume}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-success/10 border-success/30">
                    {market.whales} whales
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {market.isPositive ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-success font-semibold">+{market.oddsChange}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-destructive" />
                        <span className="text-destructive font-semibold">{market.oddsChange}%</span>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
