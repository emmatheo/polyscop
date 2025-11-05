import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const markets = [
  { name: "Trump 2024 Win", volumeSpike: "+142%", oddsDelta: "+8.5%", whaleCount: 23, direction: "up" },
  { name: "Bitcoin >$100K 2025", volumeSpike: "+98%", oddsDelta: "-3.2%", whaleCount: 18, direction: "down" },
  { name: "Lakers NBA Finals", volumeSpike: "+76%", oddsDelta: "+12.1%", whaleCount: 15, direction: "up" },
  { name: "Fed Rate Cut March", volumeSpike: "+65%", oddsDelta: "+5.8%", whaleCount: 12, direction: "up" },
  { name: "ETH >$5K Q1 2025", volumeSpike: "+54%", oddsDelta: "-6.3%", whaleCount: 10, direction: "down" },
];

export const HotMarketsTable = () => {
  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Hot Markets - Volume Spikes</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Market</TableHead>
              <TableHead>Volume Spike</TableHead>
              <TableHead>Odds Change</TableHead>
              <TableHead>Whale Count</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markets.map((market, i) => (
              <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-semibold">{market.name}</TableCell>
                <TableCell className="text-warning font-bold">{market.volumeSpike}</TableCell>
                <TableCell className={market.direction === "up" ? "text-success" : "text-destructive"}>
                  {market.oddsDelta}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{market.whaleCount} whales</Badge>
                </TableCell>
                <TableCell>
                  {market.direction === "up" ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
