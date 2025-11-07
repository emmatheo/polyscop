import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2 } from "lucide-react";
import { useWhaleActivity } from "@/hooks/usePolymarketData";

export const WhaleMovementsTable = () => {
  const { data: movements, isLoading } = useWhaleActivity("", "", 5000);

  if (isLoading) {
    return (
      <Card className="p-6 card-elevated border-primary/20 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="p-6 card-elevated border-primary/20">
      <h3 className="text-xl font-bold mb-6 text-foreground">Top Whale Movements</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements?.slice(0, 10).map((move) => (
              <TableRow key={move.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    {move.wallet.slice(0, 6)}...{move.wallet.slice(-4)}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{move.market}</TableCell>
                <TableCell className="text-warning font-bold">${move.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={move.side === "YES" ? "default" : "secondary"}>
                    {move.side}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{move.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
