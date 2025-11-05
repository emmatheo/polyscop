import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTopTraders } from "@/hooks/usePolymarketData";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const TopTradersTable = () => {
  const { data: traders, isLoading, error } = useTopTraders("");

  if (isLoading) {
    return (
      <Card className="p-6 card-elevated border-primary/20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load top traders.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Top Traders Leaderboard</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Rank</TableHead>
              <TableHead className="text-muted-foreground">Wallet</TableHead>
              <TableHead className="text-muted-foreground">Win Rate</TableHead>
              <TableHead className="text-muted-foreground">Volume</TableHead>
              <TableHead className="text-muted-foreground">Avg Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {traders && traders.length > 0 ? (
              traders.slice(0, 10).map((trader, idx) => (
                <TableRow key={trader.wallet} className="border-border hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 border-primary/30">
                      #{idx + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {trader.wallet.slice(0, 8)}...{trader.wallet.slice(-6)}
                  </TableCell>
                  <TableCell>
                    <span className="text-success font-semibold">{trader.winRate}%</span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${trader.totalProfit.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-primary font-semibold">
                    ${trader.profitChange24h.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No traders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
