import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Loader2 } from "lucide-react";
import { useRealtimePolymarket } from "@/hooks/useRealtimePolymarket";

interface HotMarketsTableProps {
  selectedCategories?: string[];
  minTradeSize?: number;
}

export const HotMarketsTable = ({ selectedCategories = [], minTradeSize = 5000 }: HotMarketsTableProps) => {
  const { marketStats, isConnected } = useRealtimePolymarket({
    categories: selectedCategories,
    minTradeSize,
  });

  if (!isConnected || marketStats.length === 0) {
    return (
      <Card className="p-6 card-elevated border-primary/20 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 card-elevated border-primary/20 hover-lift">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-foreground">Hot Markets - Volume Spikes</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Market</TableHead>
                <TableHead className="text-xs sm:text-sm">Volume</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Trade Count</TableHead>
                <TableHead className="text-xs sm:text-sm hidden md:table-cell">Whale Count</TableHead>
                <TableHead className="text-xs sm:text-sm">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketStats.slice(0, 10).map((market, i) => (
                <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-semibold text-xs sm:text-sm max-w-[150px] sm:max-w-none truncate">
                    {market.market}
                  </TableCell>
                  <TableCell className="text-warning font-bold text-xs sm:text-sm whitespace-nowrap">
                    ${market.volume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-foreground text-xs sm:text-sm hidden sm:table-cell">
                    {market.tradeCount}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs">{market.whaleCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
