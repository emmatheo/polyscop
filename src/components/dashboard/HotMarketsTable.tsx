import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Loader2 } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";

export const HotMarketsTable = () => {
  const { marketStats, isConnected } = useRealtimePolymarket();

  if (!isConnected || marketStats.length === 0) {
    return (
      <Card className="p-6 card-elevated border-primary/20 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Hot Markets - Volume Spikes</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Market</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Trade Count</TableHead>
              <TableHead>Whale Count</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketStats.slice(0, 10).map((market, i) => (
              <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-semibold">{market.market}</TableCell>
                <TableCell className="text-warning font-bold">${market.volume.toLocaleString()}</TableCell>
                <TableCell className="text-foreground">{market.tradeCount} trades</TableCell>
                <TableCell>
                  <Badge variant="outline">{market.whaleCount} whales</Badge>
                </TableCell>
                <TableCell>
                  <TrendingUp className="h-5 w-5 text-success" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
